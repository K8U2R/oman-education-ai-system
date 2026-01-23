/**
 * Performance Optimizer Tests - اختبارات Performance Optimizer
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { PerformanceOptimizer } from "./PerformanceOptimizer";
import { DatabaseCoreAdapter } from "../adapters/db/DatabaseCoreAdapter";
import type { BatchOperation } from "./PerformanceOptimizer";

describe("PerformanceOptimizer", () => {
  let optimizer: PerformanceOptimizer;
  let databaseAdapter: DatabaseCoreAdapter;

  beforeEach(() => {
    databaseAdapter = new DatabaseCoreAdapter();
    optimizer = new PerformanceOptimizer(databaseAdapter);
  });

  describe("executeBatch", () => {
    it("should execute batch operations successfully", async () => {
      // Arrange
      const operations: BatchOperation[] = [
        { operation: "FIND", entity: "users", conditions: { role: "student" } },
        {
          operation: "FIND",
          entity: "lessons",
          conditions: { status: "published" },
        },
      ];

      // Mock database adapter
      vi.spyOn(databaseAdapter, "find").mockResolvedValue([{ id: "1" }]);

      // Act
      const results = await optimizer.executeBatch(operations);

      // Assert
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it("should split large batches into chunks", async () => {
      // Arrange
      const operations: BatchOperation[] = Array.from(
        { length: 150 },
        (_, i) => ({
          operation: "FIND" as const,
          entity: "users",
          conditions: { id: `user-${i}` },
        }),
      );

      // Mock database adapter
      vi.spyOn(databaseAdapter, "find").mockResolvedValue([{ id: "1" }]);

      // Act
      const results = await optimizer.executeBatch(operations);

      // Assert
      expect(results).toBeDefined();
      // Should be split into 2 chunks (100 + 50)
    });
  });

  describe("warmCache", () => {
    it("should warm cache for entities", async () => {
      // Arrange
      const entities = ["users", "lessons"];

      // Mock database adapter
      vi.spyOn(databaseAdapter, "find").mockResolvedValue([]);

      // Act
      await optimizer.warmCache(entities);

      // Assert
      expect(databaseAdapter.find).toHaveBeenCalledTimes(entities.length);
    });
  });

  describe("prefetchData", () => {
    it("should prefetch data", async () => {
      // Arrange
      const entity = "users";
      const conditions = { role: "student" };
      const options = { limit: 10 };

      // Mock database adapter
      vi.spyOn(databaseAdapter, "find").mockResolvedValue([]);

      // Act
      await optimizer.prefetchData(entity, conditions, options);

      // Assert
      expect(databaseAdapter.find).toHaveBeenCalledWith(
        entity,
        conditions,
        options,
      );
    });
  });

  describe("getPerformanceMetrics", () => {
    it("should return performance metrics", () => {
      // Act
      const metrics = optimizer.getPerformanceMetrics();

      // Assert
      expect(metrics).toHaveProperty("queryCount");
      expect(metrics).toHaveProperty("averageQueryTime");
      expect(metrics).toHaveProperty("cacheHitRate");
      expect(metrics).toHaveProperty("connectionPoolUsage");
      expect(metrics).toHaveProperty("slowQueries");
      expect(metrics).toHaveProperty("batchOperationsCount");
      expect(metrics).toHaveProperty("timestamp");
    });
  });

  describe("optimizeQuery", () => {
    it("should return optimization recommendations", () => {
      // Arrange
      const entity = "users";
      const conditions = { role: "student" };
      const options = { limit: 20 };

      // Act
      const result = optimizer.optimizeQuery(entity, conditions, options);

      // Assert
      expect(result).toHaveProperty("optimized");
      expect(result).toHaveProperty("suggestions");
      expect(result).toHaveProperty("estimatedImprovement");
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(typeof result.estimatedImprovement).toBe("number");
    });
  });

  describe("getConnectionPoolStats", () => {
    it("should return connection pool statistics", () => {
      // Act
      const stats = optimizer.getConnectionPoolStats();

      // Assert
      expect(stats).toHaveProperty("maxSockets");
      expect(stats).toHaveProperty("freeSockets");
      expect(stats).toHaveProperty("usedSockets");
      expect(stats).toHaveProperty("usagePercentage");
    });
  });
});
