/**
 * Service Wrapper - غلاف الخدمات
 *
 * Utility functions لتسهيل استخدام Enhanced Base Service features
 */

import {
  type ServiceContext,
  type ExecuteOptions,
} from "./EnhancedBaseService";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import { PerformanceOptimizer } from "@/infrastructure/performance/PerformanceOptimizer";
import { ErrorHandler } from "@/shared/error/ErrorHandler";
import { errorRecovery } from "@/shared/error/ErrorRecovery";
import { enhancedLogger } from "@/shared/utils/EnhancedLogger";

/**
 * Execute operation with automatic enhancements
 */
export async function executeWithEnhancements<T>(
  operation: () => Promise<T>,
  context: ServiceContext = {},
  options: ExecuteOptions = {},
): Promise<T> {
  const startTime = Date.now();
  const operationName = context.operation || "unknown";

  try {
    enhancedLogger.operationStart(operationName, context);

    // Warm cache if specified
    if (options.cacheWarming && options.cacheWarming.length > 0) {
      const adapter = new DatabaseCoreAdapter();
      const optimizer = new PerformanceOptimizer(adapter);
      await optimizer.warmCache(options.cacheWarming);
    }

    // Execute with retry if retryable
    let result: T;
    if (options.retryable && ErrorHandler.isRetryable(new Error())) {
      result = await errorRecovery.retry(
        operation,
        options.retryOptions || {},
        {
          operation: operationName,
          service: context.operation || "Service",
        },
      );
    } else {
      result = await operation();
    }

    const duration = Date.now() - startTime;
    enhancedLogger.operationEnd(operationName, duration, true, context);

    if (options.performanceTracking !== false) {
      enhancedLogger.performance(operationName, duration, true, context);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorInfo = ErrorHandler.handleError(error, context);
    enhancedLogger.error(`Operation failed: ${operationName}`, error, {
      ...context,
      duration,
    });
    enhancedLogger.operationEnd(operationName, duration, false, context);

    if (errorInfo.severity === "critical" || errorInfo.severity === "high") {
      throw new Error(ErrorHandler.getUserFriendlyMessage(errorInfo));
    }

    throw error;
  }
}

/**
 * Execute batch operations
 */
export async function executeBatch<T = unknown>(
  operations: Array<{
    operation: "FIND" | "INSERT" | "UPDATE" | "DELETE";
    entity: string;
    conditions?: Record<string, unknown>;
    payload?: Record<string, unknown>;
  }>,
  context: ServiceContext = {},
): Promise<T[]> {
  const adapter = new DatabaseCoreAdapter();
  const optimizer = new PerformanceOptimizer(adapter);

  try {
    enhancedLogger.operationStart("batchOperations", {
      ...context,
      metadata: {
        ...context.metadata,
        operationCount: operations.length,
      },
    });

    const results = await optimizer.executeBatch<T>(operations);

    enhancedLogger.operationEnd("batchOperations", 0, true, {
      ...context,
      metadata: {
        ...context.metadata,
        operationCount: operations.length,
        successCount: results.filter((r) => r.success).length,
      },
    });

    return results.map((r) => r.data as T).filter(Boolean) as T[];
  } catch (error) {
    enhancedLogger.error("Batch operations failed", error, context);
    throw error;
  }
}

/**
 * Optimize query
 */
export function optimizeQuery(
  entity: string,
  conditions: Record<string, unknown>,
  options?: { limit?: number; offset?: number; orderBy?: unknown },
) {
  const adapter = new DatabaseCoreAdapter();
  const optimizer = new PerformanceOptimizer(adapter);
  return optimizer.optimizeQuery(entity, conditions, options);
}

/**
 * Warm cache
 */
export async function warmCache(entities: string[]): Promise<void> {
  const adapter = new DatabaseCoreAdapter();
  const optimizer = new PerformanceOptimizer(adapter);
  await optimizer.warmCache(entities);
}

/**
 * Prefetch data
 */
export async function prefetchData(
  entity: string,
  conditions: Record<string, unknown>,
  options?: { limit?: number; offset?: number },
): Promise<void> {
  const adapter = new DatabaseCoreAdapter();
  const optimizer = new PerformanceOptimizer(adapter);
  await optimizer.prefetchData(entity, conditions, options);
}
