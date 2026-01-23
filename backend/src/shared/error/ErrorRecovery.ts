/**
 * Error Recovery - استعادة من الأخطاء
 *
 * استراتيجيات استعادة من الأخطاء:
 * - Retry with exponential backoff
 * - Circuit breaker pattern
 * - Fallback mechanisms
 * - Error recovery strategies
 */

import { logger } from "../utils/logger";
import { ErrorHandler } from "./ErrorHandler";

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

export interface CircuitBreakerState {
  state: "closed" | "open" | "half-open";
  failures: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

export class ErrorRecovery {
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private readonly defaultRetryOptions: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryableErrors: [],
  };

  /**
   * Retry operation with exponential backoff
   */
  async retry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {},
    context?: { operation?: string; service?: string },
  ): Promise<T> {
    const opts = { ...this.defaultRetryOptions, ...options };
    let lastError: Error | unknown;

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Check if error is retryable
        if (!ErrorHandler.isRetryable(error)) {
          logger.warn("Error is not retryable", {
            error: error instanceof Error ? error.message : "Unknown error",
            context,
          });
          throw error;
        }

        // Check circuit breaker
        const circuitKey = context?.service || "default";
        if (!this.checkCircuitBreaker(circuitKey)) {
          logger.warn("Circuit breaker is open", { circuitKey, context });
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === opts.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
          opts.maxDelay,
        );

        logger.info("Retrying operation", {
          attempt: attempt + 1,
          maxRetries: opts.maxRetries,
          delay,
          context,
        });

        await this.sleep(delay);
      }
    }

    // Record failure in circuit breaker
    const circuitKey = context?.service || "default";
    this.recordFailure(circuitKey);

    throw lastError;
  }

  /**
   * Execute with fallback
   */
  async executeWithFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>,
    context?: { operation?: string; service?: string },
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      logger.warn("Primary operation failed, using fallback", {
        error: error instanceof Error ? error.message : "Unknown error",
        context,
      });

      try {
        return await fallback();
      } catch (fallbackError) {
        logger.error("Fallback operation also failed", {
          error:
            fallbackError instanceof Error
              ? fallbackError.message
              : "Unknown error",
          context,
        });
        throw fallbackError;
      }
    }
  }

  /**
   * Check circuit breaker state
   */
  private checkCircuitBreaker(key: string): boolean {
    const state = this.circuitBreakers.get(key) || {
      state: "closed" as const,
      failures: 0,
      lastFailureTime: 0,
      nextAttemptTime: 0,
    };

    // If closed, allow request
    if (state.state === "closed") {
      return true;
    }

    // If open, check if we should try again
    if (state.state === "open") {
      if (Date.now() >= state.nextAttemptTime) {
        state.state = "half-open";
        this.circuitBreakers.set(key, state);
        return true;
      }
      return false;
    }

    // If half-open, allow one request
    return true;
  }

  /**
   * Record failure in circuit breaker
   */
  private recordFailure(key: string): void {
    const state = this.circuitBreakers.get(key) || {
      state: "closed" as const,
      failures: 0,
      lastFailureTime: 0,
      nextAttemptTime: 0,
    };

    state.failures++;
    state.lastFailureTime = Date.now();

    // Open circuit after 5 failures
    if (state.failures >= 5) {
      state.state = "open";
      state.nextAttemptTime = Date.now() + 60000; // 1 minute
      logger.warn("Circuit breaker opened", { key, failures: state.failures });
    }

    this.circuitBreakers.set(key, state);
  }

  /**
   * Record success in circuit breaker
   */
  recordSuccess(key: string): void {
    const state = this.circuitBreakers.get(key);
    if (state) {
      state.failures = 0;
      state.state = "closed";
      this.circuitBreakers.set(key, state);
    }
  }

  /**
   * Get circuit breaker state
   */
  getCircuitBreakerState(key: string): CircuitBreakerState | null {
    return this.circuitBreakers.get(key) || null;
  }

  /**
   * Reset circuit breaker
   */
  resetCircuitBreaker(key: string): void {
    this.circuitBreakers.delete(key);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Global instance
export const errorRecovery = new ErrorRecovery();
