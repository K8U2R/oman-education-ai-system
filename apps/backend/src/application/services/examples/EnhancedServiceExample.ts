/**
 * Enhanced Service Example - مثال على استخدام Enhanced Base Service
 *
 * مثال عملي على كيفية استخدام EnhancedBaseService في خدمة جديدة
 */

import {
  EnhancedBaseService,
  type ServiceContext,
} from "../system/base/EnhancedBaseService.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import type { BatchOperation } from "@/infrastructure/performance/PerformanceOptimizer";
import { enhancedLogger } from "@/shared/utils/EnhancedLogger";

/**
 * Example Service using Enhanced Base Service
 */
export class ExampleEnhancedService extends EnhancedBaseService {
  constructor(databaseAdapter: DatabaseCoreAdapter) {
    super(databaseAdapter);
  }

  /**
   * Get service name
   */
  protected getServiceName(): string {
    return "ExampleEnhancedService";
  }

  /**
   * Example: Get items with enhancements
   */
  async getItems(
    userId: string,
    context: ServiceContext = {},
  ): Promise<unknown[]> {
    return this.executeWithEnhancements(
      async () => {
        // Warm cache for related entities
        await this.warmCache(["items", "categories"]);

        // Optimize query
        const optimization = this.optimizeQuery("items", { user_id: userId });
        if (!optimization.optimized && optimization.suggestions.length > 0) {
          enhancedLogger.warn("Query optimization suggestions", {
            metadata: {
              suggestions: optimization.suggestions,
              service: this.getServiceName(),
            },
          });
        }

        // Execute query
        const items = await this.databaseAdapter.find("items", {
          user_id: userId,
        });

        return items;
      },
      {
        cacheWarming: ["items", "categories"],
        performanceTracking: true,
      },
      {
        ...context,
        userId,
        operation: "getItems",
      },
    );
  }

  /**
   * Example: Create item with error handling
   */
  async createItem(
    data: Record<string, unknown>,
    userId: string,
    context: ServiceContext = {},
  ): Promise<unknown> {
    return this.executeWithEnhancements(
      async () => {
        const result = await this.databaseAdapter.insert("items", {
          ...data,
          user_id: userId,
          created_at: new Date().toISOString(),
        });

        return result;
      },
      {
        retryable: true,
        retryOptions: {
          maxRetries: 3,
          initialDelay: 1000,
        },
        performanceTracking: true,
      },
      {
        ...context,
        userId,
        operation: "createItem",
        metadata: {
          ...context.metadata,
          itemType: data.type,
        },
      },
    );
  }

  /**
   * Example: Batch operations
   */
  async batchCreateItems(
    items: Array<Record<string, unknown>>,
    userId: string,
    context: ServiceContext = {},
  ): Promise<unknown[]> {
    const operations: BatchOperation[] = items.map((item) => ({
      operation: "INSERT",
      entity: "items",
      payload: {
        ...item,
        user_id: userId,
        created_at: new Date().toISOString(),
      },
    }));

    return this.executeBatch(operations, {
      ...context,
      userId,
      operation: "batchCreateItems",
    });
  }

  /**
   * Example: Get items with fallback
   */
  async getItemsWithFallback(
    userId: string,
    context: ServiceContext = {},
  ): Promise<unknown[]> {
    return this.executeWithEnhancements(
      async () => {
        // Try to get from cache first
        const cached = await this.databaseAdapter.find("items", {
          user_id: userId,
        });
        if (cached && cached.length > 0) {
          return cached;
        }

        // If not in cache, fetch from database
        return await this.databaseAdapter.find("items", { user_id: userId });
      },
      {
        cacheWarming: ["items"],
        performanceTracking: true,
      },
      {
        ...context,
        userId,
        operation: "getItemsWithFallback",
      },
    );
  }

  /**
   * Example: Complex operation with multiple steps
   */
  async complexOperation(
    userId: string,
    context: ServiceContext = {},
  ): Promise<unknown> {
    return this.executeWithEnhancements(
      async () => {
        // Step 1: Prefetch related data
        await this.prefetchData("users", { id: userId });
        await this.prefetchData("items", { user_id: userId }, { limit: 10 });

        // Step 2: Get user
        const user = await this.databaseAdapter.findOne("users", {
          id: userId,
        });
        if (!user) {
          throw new Error("User not found");
        }

        // Step 3: Get items
        const items = await this.databaseAdapter.find("items", {
          user_id: userId,
        });

        // Step 4: Process and return
        return {
          user,
          items,
          count: items.length,
        };
      },
      {
        cacheWarming: ["users", "items"],
        performanceTracking: true,
      },
      {
        ...context,
        userId,
        operation: "complexOperation",
      },
    );
  }
}
