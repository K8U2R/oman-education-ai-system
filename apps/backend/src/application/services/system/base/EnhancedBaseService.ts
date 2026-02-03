/**
 * Enhanced Base Service - الخدمة الأساسية المحسّنة
 *
 * Base class محسّن لجميع Application Services مع:
 * - Performance Optimization
 * - Enhanced Error Handling
 * - Enhanced Logging
 * - Query Optimization
 */

import { BaseService } from "./BaseService";
import { PerformanceOptimizer } from "@/infrastructure/performance/PerformanceOptimizer";
import { ErrorHandler, ErrorSeverity } from "@/shared/error/ErrorHandler";
import { errorRecovery } from "@/shared/error/ErrorRecovery";
import { enhancedLogger } from "@/shared/utils/EnhancedLogger";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import type { BatchOperation } from "@/infrastructure/performance/PerformanceOptimizer";

export interface ServiceContext {
  userId?: string;
  requestId?: string;
  operation?: string;
  metadata?: Record<string, unknown>;
}

export interface ExecuteOptions {
  retryable?: boolean;
  retryOptions?: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
  };
  useBatch?: boolean;
  cacheWarming?: string[];
  performanceTracking?: boolean;
}

/**
 * Enhanced Base Service Class
 *
 * يوفر وظائف محسّنة لجميع Services:
 * - Performance optimization
 * - Enhanced error handling
 * - Enhanced logging
 * - Query optimization
 */
export abstract class EnhancedBaseService extends BaseService {
  protected readonly performanceOptimizer: PerformanceOptimizer;
  protected readonly databaseAdapter: DatabaseCoreAdapter;

  constructor(databaseAdapter: DatabaseCoreAdapter) {
    super();
    this.databaseAdapter = databaseAdapter;
    this.performanceOptimizer = new PerformanceOptimizer(databaseAdapter);
  }

  /**
   * Execute operation with enhanced features
   */
  protected async executeWithEnhancements<T>(
    operation: () => Promise<T>,
    options: ExecuteOptions = {},
    context: ServiceContext = {},
  ): Promise<T> {
    const startTime = Date.now();
    const operationName = context.operation || "unknown";

    try {
      // Log operation start
      enhancedLogger.operationStart(operationName, {
        userId: context.userId,
        requestId: context.requestId,
        service: this.getServiceName(),
        metadata: context.metadata,
      });

      // Warm cache if specified
      if (options.cacheWarming && options.cacheWarming.length > 0) {
        await this.performanceOptimizer.warmCache(options.cacheWarming);
      }

      // Execute with retry if retryable
      let result: T;
      if (options.retryable && ErrorHandler.isRetryable(new Error())) {
        result = await errorRecovery.retry(
          operation,
          options.retryOptions || {},
          {
            operation: operationName,
            service: this.getServiceName(),
          },
        );
      } else {
        result = await operation();
      }

      const duration = Date.now() - startTime;

      // Log operation end
      enhancedLogger.operationEnd(operationName, duration, true, {
        userId: context.userId,
        requestId: context.requestId,
        service: this.getServiceName(),
        metadata: context.metadata,
      });

      // Track performance if enabled
      if (options.performanceTracking !== false) {
        enhancedLogger.performance(operationName, duration, true, {
          userId: context.userId,
          requestId: context.requestId,
          service: this.getServiceName(),
        });
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Handle error with ErrorHandler
      const errorInfo = ErrorHandler.handleError(error, {
        userId: context.userId,
        requestId: context.requestId,
        operation: operationName,
        service: this.getServiceName(),
        metadata: context.metadata,
      });

      // Log error with Enhanced Logger
      enhancedLogger.error(`Operation failed: ${operationName}`, error, {
        userId: context.userId,
        requestId: context.requestId,
        operation: operationName,
        service: this.getServiceName(),
        duration,
        metadata: context.metadata,
      });

      // Log operation end with failure
      enhancedLogger.operationEnd(operationName, duration, false, {
        userId: context.userId,
        requestId: context.requestId,
        service: this.getServiceName(),
        metadata: context.metadata,
      });

      // Re-throw with user-friendly message if needed
      if (
        errorInfo.severity === ErrorSeverity.CRITICAL ||
        errorInfo.severity === ErrorSeverity.HIGH
      ) {
        throw new Error(ErrorHandler.getUserFriendlyMessage(errorInfo));
      }

      throw error;
    }
  }

  /**
   * Execute batch operations
   */
  protected async executeBatch<T = unknown>(
    operations: BatchOperation[],
    context: ServiceContext = {},
  ): Promise<T[]> {
    try {
      enhancedLogger.operationStart("batchOperations", {
        userId: context.userId,
        requestId: context.requestId,
        service: this.getServiceName(),
        metadata: {
          ...context.metadata,
          operationCount: operations.length,
        },
      });

      const results =
        await this.performanceOptimizer.executeBatch<T>(operations);

      enhancedLogger.operationEnd("batchOperations", 0, true, {
        userId: context.userId,
        requestId: context.requestId,
        service: this.getServiceName(),
        metadata: {
          ...context.metadata,
          operationCount: operations.length,
          successCount: results.filter((r) => r.success).length,
        },
      });

      return results.map((r) => r.data as T).filter(Boolean) as T[];
    } catch (error) {
      enhancedLogger.error("Batch operations failed", error, {
        userId: context.userId,
        requestId: context.requestId,
        service: this.getServiceName(),
        metadata: context.metadata,
      });
      throw error;
    }
  }

  /**
   * Optimize query
   */
  protected optimizeQuery(
    entity: string,
    conditions: Record<string, unknown>,
    options?: { limit?: number; offset?: number; orderBy?: unknown },
  ) {
    return this.performanceOptimizer.optimizeQuery(entity, conditions, options);
  }

  /**
   * Warm cache for entities
   */
  protected async warmCache(entities: string[]): Promise<void> {
    await this.performanceOptimizer.warmCache(entities);
  }

  /**
   * Prefetch data
   */
  protected async prefetchData(
    entity: string,
    conditions: Record<string, unknown>,
    options?: { limit?: number; offset?: number },
  ): Promise<void> {
    await this.performanceOptimizer.prefetchData(entity, conditions, options);
  }

  /**
   * Get performance metrics
   */
  protected getPerformanceMetrics() {
    return this.performanceOptimizer.getPerformanceMetrics();
  }

  /**
   * Get connection pool stats
   */
  protected getConnectionPoolStats() {
    return this.performanceOptimizer.getConnectionPoolStats();
  }

  /**
   * Enhanced log operation
   */
  protected enhancedLogOperation(
    operation: string,
    context: ServiceContext = {},
  ): void {
    enhancedLogger.info(`Service operation: ${operation}`, {
      userId: context.userId,
      requestId: context.requestId,
      operation,
      service: this.getServiceName(),
      metadata: context.metadata,
    });
  }

  /**
   * Enhanced log error
   */
  protected enhancedLogError(
    operation: string,
    error: unknown,
    context: ServiceContext = {},
  ): void {
    enhancedLogger.error(`Service operation failed: ${operation}`, error, {
      userId: context.userId,
      requestId: context.requestId,
      operation,
      service: this.getServiceName(),
      metadata: context.metadata,
    });
  }

  /**
   * Handle service error with recovery
   */
  protected async handleServiceErrorWithRecovery<T>(
    error: unknown,
    operation: string,
    context: ServiceContext = {},
    fallback?: () => Promise<T>,
  ): Promise<T> {
    this.enhancedLogError(operation, error, context);

    // Try fallback if provided
    if (fallback && ErrorHandler.isRecoverable(error)) {
      try {
        enhancedLogger.info("Attempting fallback operation", {
          operation,
          service: this.getServiceName(),
        });
        return await fallback();
      } catch (fallbackError) {
        enhancedLogger.error("Fallback operation also failed", fallbackError, {
          operation,
          service: this.getServiceName(),
        });
      }
    }

    // Re-throw if no fallback or fallback failed
    throw error;
  }
}
