/**
 * Performance Optimizer - محسّن الأداء
 *
 * خدمة شاملة لتحسين أداء التطبيق:
 * - Query Batching
 * - Batch Operations
 * - Connection Pool Monitoring
 * - Cache Warming
 * - Performance Metrics
 */

import { logger } from "@/shared/utils/logger";
import { queryOptimizerService } from "../database/query-optimizer.service";
import { DatabaseCoreAdapter } from "../adapters/db/DatabaseCoreAdapter";

export interface BatchOperation {
  operation: "FIND" | "INSERT" | "UPDATE" | "DELETE";
  entity: string;
  conditions?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface BatchResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  operation: string;
}

export interface PerformanceMetrics {
  queryCount: number;
  averageQueryTime: number;
  cacheHitRate: number;
  connectionPoolUsage: number;
  slowQueries: number;
  batchOperationsCount: number;
  timestamp: number;
}

export class PerformanceOptimizer {
  private readonly databaseAdapter: DatabaseCoreAdapter;
  private batchQueue: BatchOperation[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly batchDelay = 50; // 50ms batch delay
  private readonly maxBatchSize = 100;
  private batchOperationsCount = 0;

  constructor(databaseAdapter: DatabaseCoreAdapter) {
    this.databaseAdapter = databaseAdapter;
  }

  /**
   * Execute batch operations
   */
  async executeBatch<T = unknown>(
    operations: BatchOperation[],
  ): Promise<BatchResult<T>[]> {
    if (operations.length === 0) {
      return [];
    }

    if (operations.length > this.maxBatchSize) {
      // Split into chunks
      const chunks: BatchOperation[][] = [];
      for (let i = 0; i < operations.length; i += this.maxBatchSize) {
        chunks.push(operations.slice(i, i + this.maxBatchSize));
      }

      const results: BatchResult<T>[] = [];
      for (const chunk of chunks) {
        const chunkResults = await this.executeBatchChunk<T>(chunk);
        results.push(...chunkResults);
      }
      return results;
    }

    return this.executeBatchChunk<T>(operations);
  }

  /**
   * Execute a chunk of batch operations
   */
  private async executeBatchChunk<T = unknown>(
    operations: BatchOperation[],
  ): Promise<BatchResult<T>[]> {
    this.batchOperationsCount++;
    const startTime = Date.now();

    try {
      // Group operations by type for optimization
      const grouped = this.groupOperations(operations);
      const results: BatchResult<T>[] = [];

      // Execute grouped operations
      for (const [operationType, ops] of Object.entries(grouped)) {
        if (operationType === "FIND") {
          // For FIND operations, execute in parallel
          const findResults = await Promise.all(
            ops.map((op) => this.executeOperation<T>(op)),
          );
          results.push(...findResults);
        } else {
          // For write operations, execute sequentially to maintain order
          for (const op of ops) {
            const result = await this.executeOperation<T>(op);
            results.push(result);
          }
        }
      }

      const duration = Date.now() - startTime;
      logger.debug("Batch operations completed", {
        count: operations.length,
        duration,
        averageTime: duration / operations.length,
      });

      return results;
    } catch (error) {
      logger.error("Batch operations failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        count: operations.length,
      });
      throw error;
    }
  }

  /**
   * Execute a single operation
   */
  private async executeOperation<T = unknown>(
    operation: BatchOperation,
  ): Promise<BatchResult<T>> {
    try {
      let data: T | T[] | null = null;

      switch (operation.operation) {
        case "INSERT":
          data = await this.databaseAdapter.insert<T>(
            operation.entity,
            operation.payload || {},
          );
          break;
        case "UPDATE":
          data = await this.databaseAdapter.update<T>(
            operation.entity,
            operation.conditions || {},
            operation.payload || {},
          );
          break;
        case "DELETE":
          await this.databaseAdapter.delete(
            operation.entity,
            operation.conditions || {},
          );
          break;
        case "FIND":
          data = await this.databaseAdapter.find<T>(
            operation.entity,
            operation.conditions || {},
          );
          break;
        default:
          throw new Error(`Unsupported operation: ${operation.operation}`);
      }

      return {
        success: true,
        data: data as T,
        operation: `${operation.operation}:${operation.entity}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        operation: `${operation.operation}:${operation.entity}`,
      };
    }
  }

  /**
   * Group operations by type
   */
  private groupOperations(
    operations: BatchOperation[],
  ): Record<string, BatchOperation[]> {
    const grouped: Record<string, BatchOperation[]> = {};

    for (const op of operations) {
      if (!grouped[op.operation]) {
        grouped[op.operation] = [];
      }
      grouped[op.operation].push(op);
    }

    return grouped;
  }

  /**
   * Queue operation for batch processing
   */
  queueOperation(operation: BatchOperation): void {
    this.batchQueue.push(operation);

    // Start batch timer if not already started
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.flushBatch();
      }, this.batchDelay);
    }

    // Flush if queue is full
    if (this.batchQueue.length >= this.maxBatchSize) {
      this.flushBatch();
    }
  }

  /**
   * Flush queued operations
   */
  private async flushBatch(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.batchQueue.length === 0) {
      return;
    }

    const operations = [...this.batchQueue];
    this.batchQueue = [];

    try {
      await this.executeBatch(operations);
    } catch (error) {
      logger.error("Failed to flush batch", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Warm up cache for frequently accessed data
   */
  async warmCache(entities: string[]): Promise<void> {
    logger.info("Warming cache", { entities });

    const warmPromises = entities.map(async (entity) => {
      try {
        // Fetch first page of each entity
        await this.databaseAdapter.find(entity, {}, { limit: 20, offset: 0 });
        logger.debug("Cache warmed", { entity });
      } catch (error) {
        logger.warn("Failed to warm cache for entity", {
          entity,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    });

    await Promise.all(warmPromises);
    logger.info("Cache warming completed", { entities });
  }

  /**
   * Prefetch data for better performance
   */
  async prefetchData(
    entity: string,
    conditions: Record<string, unknown>,
    options?: { limit?: number; offset?: number },
  ): Promise<void> {
    try {
      await this.databaseAdapter.find(entity, conditions, options);
      logger.debug("Data prefetched", { entity, conditions });
    } catch (error) {
      logger.warn("Failed to prefetch data", {
        entity,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get connection pool statistics
   */
  getConnectionPoolStats(): {
    maxSockets: number;
    freeSockets: number;
    usedSockets: number;
    usagePercentage: number;
  } {
    // Access HTTP agent from database adapter
    interface AgentLike {
      maxSockets?: number;
      freeSockets?: Record<string, unknown>;
      sockets?: Record<string, unknown>;
    }

    const httpAgent = (
      this.databaseAdapter as unknown as { httpAgent?: AgentLike }
    ).httpAgent;
    const httpsAgent = (
      this.databaseAdapter as unknown as { httpsAgent?: AgentLike }
    ).httpsAgent;

    if (!httpAgent && !httpsAgent) {
      return {
        maxSockets: 0,
        freeSockets: 0,
        usedSockets: 0,
        usagePercentage: 0,
      };
    }

    const agent = (httpAgent || httpsAgent) as AgentLike;
    const maxSockets = agent.maxSockets || 50;
    const freeSockets = agent.freeSockets
      ? Object.keys(agent.freeSockets).length
      : 0;
    const usedSockets = agent.sockets ? Object.keys(agent.sockets).length : 0;
    const usagePercentage =
      maxSockets > 0 ? (usedSockets / maxSockets) * 100 : 0;

    return {
      maxSockets,
      freeSockets,
      usedSockets,
      usagePercentage,
    };
  }

  /**
   * Get comprehensive performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const queryStats = queryOptimizerService.getQueryStatistics();
    const cacheStats = queryOptimizerService.getCacheStatistics();
    const poolStats = this.getConnectionPoolStats();

    return {
      queryCount: queryStats.totalQueries,
      averageQueryTime: queryStats.averageDuration,
      cacheHitRate: cacheStats.hitRate,
      connectionPoolUsage: poolStats.usagePercentage,
      slowQueries: queryStats.slowQueries,
      batchOperationsCount: this.batchOperationsCount,
      timestamp: Date.now(),
    };
  }

  /**
   * Optimize query by analyzing and suggesting improvements
   */
  optimizeQuery(
    entity: string,
    _conditions: Record<string, unknown>,
    options?: { limit?: number; offset?: number; orderBy?: unknown },
  ): {
    optimized: boolean;
    suggestions: string[];
    estimatedImprovement: number;
  } {
    const suggestions: string[] = [];
    let estimatedImprovement = 0;

    // Check for missing indexes
    const indexRecs =
      queryOptimizerService.getIndexRecommendationsForTable(entity);
    if (indexRecs.length > 0) {
      suggestions.push(
        `Consider adding indexes: ${indexRecs.map((r) => r.columns.join(", ")).join("; ")}`,
      );
      estimatedImprovement += 20;
    }

    // Check for slow queries
    const slowQueries = queryOptimizerService.getSlowQueries(1000);
    const entitySlowQueries = slowQueries.filter((q) => q.table === entity);
    if (entitySlowQueries.length > 0) {
      suggestions.push(
        `Found ${entitySlowQueries.length} slow queries for this entity`,
      );
      estimatedImprovement += 15;
    }

    // Check cache hit rate
    const cacheStats = queryOptimizerService.getCacheStatistics();
    if (cacheStats.hitRate < 50) {
      suggestions.push(
        "Low cache hit rate - consider increasing cache TTL or warming cache",
      );
      estimatedImprovement += 10;
    }

    // Check for pagination optimization
    if (options && options.limit && options.limit > 100) {
      suggestions.push(
        "Large limit detected - consider using cursor-based pagination",
      );
      estimatedImprovement += 5;
    }

    return {
      optimized: suggestions.length === 0,
      suggestions,
      estimatedImprovement: Math.min(estimatedImprovement, 100),
    };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    this.flushBatch();
  }
}
