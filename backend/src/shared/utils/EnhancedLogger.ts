/**
 * Enhanced Logger - مسجل محسّن
 *
 * نظام logging محسّن مع:
 * - Structured Logging
 * - Log Levels
 * - Context Tracking
 * - Performance Logging
 * - Error Tracking
 */

import { logger } from "./logger";
import { ErrorHandler } from "../error/ErrorHandler";

export interface LogContext {
  userId?: string;
  requestId?: string;
  operation?: string;
  service?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface PerformanceLog {
  operation: string;
  duration: number;
  success: boolean;
  context: LogContext;
  timestamp: number;
}

export class EnhancedLogger {
  private requestId: string | null = null;
  private userId: string | null = null;

  /**
   * Set request context
   */
  setContext(requestId: string, userId?: string): void {
    this.requestId = requestId;
    this.userId = userId || null;
  }

  /**
   * Clear context
   */
  clearContext(): void {
    this.requestId = null;
    this.userId = null;
  }

  /**
   * Log info with context
   */
  info(message: string, context: LogContext = {}): void {
    logger.info(message, {
      ...this.getBaseContext(),
      ...context,
    });
  }

  /**
   * Log warning with context
   */
  warn(message: string, context: LogContext = {}): void {
    logger.warn(message, {
      ...this.getBaseContext(),
      ...context,
    });
  }

  /**
   * Log error with context
   */
  error(
    message: string,
    error: Error | unknown,
    context: LogContext = {},
  ): void {
    const errorInfo = ErrorHandler.handleError(error, {
      ...this.getBaseContext(),
      ...context,
    });

    logger.error(message, {
      ...this.getBaseContext(),
      ...context,
      error: errorInfo,
    });
  }

  /**
   * Log debug with context
   */
  debug(message: string, context: LogContext = {}): void {
    logger.debug(message, {
      ...this.getBaseContext(),
      ...context,
    });
  }

  /**
   * Log performance metrics
   */
  performance(
    operation: string,
    duration: number,
    success: boolean,
    context: LogContext = {},
  ): void {
    const perfLog: PerformanceLog = {
      operation,
      duration,
      success,
      context: {
        ...this.getBaseContext(),
        ...context,
      },
      timestamp: Date.now(),
    };

    logger.info("Performance metric", perfLog);

    // Log warning for slow operations
    if (duration > 2000) {
      logger.warn("Slow operation detected", perfLog);
    }
  }

  /**
   * Log operation start
   */
  operationStart(operation: string, context: LogContext = {}): void {
    logger.debug("Operation started", {
      ...this.getBaseContext(),
      ...context,
      operation,
      timestamp: Date.now(),
    });
  }

  /**
   * Log operation end
   */
  operationEnd(
    operation: string,
    duration: number,
    success: boolean,
    context: LogContext = {},
  ): void {
    this.performance(operation, duration, success, context);
  }

  /**
   * Log database query
   */
  databaseQuery(
    query: string,
    duration: number,
    success: boolean,
    context: LogContext = {},
  ): void {
    logger.debug("Database query", {
      ...this.getBaseContext(),
      ...context,
      query,
      duration,
      success,
    });

    // Log warning for slow queries
    if (duration > 1000) {
      logger.warn("Slow database query", {
        ...this.getBaseContext(),
        ...context,
        query,
        duration,
      });
    }
  }

  /**
   * Log API request
   */
  apiRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context: LogContext = {},
  ): void {
    const level =
      statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

    logger[level]("API request", {
      ...this.getBaseContext(),
      ...context,
      method,
      path,
      statusCode,
      duration,
    });
  }

  /**
   * Get base context
   */
  private getBaseContext(): LogContext {
    return {
      requestId: this.requestId || undefined,
      userId: this.userId || undefined,
    };
  }
}

// Global instance
export const enhancedLogger = new EnhancedLogger();
