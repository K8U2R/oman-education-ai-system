/**
 * Enhanced Base Service Tests - اختبارات Enhanced Base Service
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { EnhancedBaseService } from "./EnhancedBaseService";
import { BatchOperation } from "@/infrastructure/performance/PerformanceOptimizer";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import { ErrorHandler } from "@/shared/error/ErrorHandler";
import { errorRecovery } from "@/shared/error/ErrorRecovery";
import { enhancedLogger } from "@/shared/utils/EnhancedLogger";

// Mock dependencies
vi.mock("@/shared/error/ErrorHandler");
vi.mock("@/shared/error/ErrorRecovery");
vi.mock("@/shared/utils/EnhancedLogger");

class TestService extends EnhancedBaseService {
  protected getServiceName(): string {
    return "TestService";
  }

  // Expose protected methods for testing
  public testExecuteWithEnhancements<T>(
    operation: () => Promise<T>,
    options: Record<string, unknown> = {},
    context: Record<string, unknown> = {},
  ): Promise<T> {
    return this.executeWithEnhancements(operation, options, context);
  }

  public testExecuteBatch<T = unknown>(
    operations: Record<string, unknown>[],
    context: Record<string, unknown> = {},
  ): Promise<T[]> {
    return this.executeBatch(
      operations as unknown as BatchOperation[],
      context,
    );
  }

  public testOptimizeQuery(
    entity: string,
    conditions: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) {
    return this.optimizeQuery(entity, conditions, options);
  }

  public testWarmCache(entities: string[]): Promise<void> {
    return this.warmCache(entities);
  }

  public testGetPerformanceMetrics() {
    return this.getPerformanceMetrics();
  }

  public testGetConnectionPoolStats() {
    return this.getConnectionPoolStats();
  }
}

describe("EnhancedBaseService", () => {
  let service: TestService;
  let databaseAdapter: DatabaseCoreAdapter;

  beforeEach(() => {
    databaseAdapter = new DatabaseCoreAdapter();
    service = new TestService(databaseAdapter);
    vi.clearAllMocks();
  });

  describe("executeWithEnhancements", () => {
    it("should execute operation successfully", async () => {
      // Arrange
      const operation = vi.fn().mockResolvedValue({ data: "test" });
      const context = { userId: "user-123", operation: "testOperation" };

      // Act
      const result = await service.testExecuteWithEnhancements(
        operation,
        {},
        context,
      );

      // Assert
      expect(operation).toHaveBeenCalled();
      expect(result).toEqual({ data: "test" });
      expect(enhancedLogger.operationStart).toHaveBeenCalled();
      expect(enhancedLogger.operationEnd).toHaveBeenCalled();
    });

    it("should handle errors with ErrorHandler", async () => {
      // Arrange
      const error = new Error("Test error");
      const operation = vi.fn().mockRejectedValue(error);
      const context = { userId: "user-123", operation: "testOperation" };

      // Mock ErrorHandler
      vi.mocked(ErrorHandler.handleError).mockReturnValue({
        message: "Test error",
        code: "TEST_ERROR",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        severity: "medium" as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: "internal" as any,
        context: {},
        timestamp: Date.now(),
        recoverable: false,
        retryable: false,
      });

      // Act & Assert
      await expect(
        service.testExecuteWithEnhancements(operation, {}, context),
      ).rejects.toThrow("Test error");

      expect(ErrorHandler.handleError).toHaveBeenCalled();
      expect(enhancedLogger.error).toHaveBeenCalled();
    });

    it("should warm cache if specified", async () => {
      // Arrange
      const operation = vi.fn().mockResolvedValue({ data: "test" });
      const warmCacheSpy = vi
        .spyOn(service["performanceOptimizer"], "warmCache")
        .mockResolvedValue(undefined);

      // Act
      await service.testExecuteWithEnhancements(
        operation,
        { cacheWarming: ["entities"] },
        { operation: "test" },
      );

      // Assert
      expect(warmCacheSpy).toHaveBeenCalledWith(["entities"]);
    });

    it("should retry on failure if retryable", async () => {
      // Arrange
      const error = new Error("Test error");
      const operation = vi.fn().mockRejectedValue(error);
      const context = { operation: "testOperation" };

      // Mock retry
      vi.mocked(errorRecovery.retry).mockResolvedValue({ data: "retried" });
      vi.mocked(ErrorHandler.isRetryable).mockReturnValue(true);

      // Act
      const result = await service.testExecuteWithEnhancements(
        operation,
        { retryable: true },
        context,
      );

      // Assert
      expect(errorRecovery.retry).toHaveBeenCalled();
      expect(result).toEqual({ data: "retried" });
    });
  });

  describe("executeBatch", () => {
    it("should execute batch operations successfully", async () => {
      // Arrange
      const operations = [
        {
          operation: "FIND" as const,
          entity: "users",
          conditions: { role: "student" },
        },
        {
          operation: "FIND" as const,
          entity: "lessons",
          conditions: { status: "published" },
        },
      ];
      const context = { operation: "batchOperations" };

      // Mock database adapter
      vi.spyOn(databaseAdapter, "find").mockResolvedValue([
        { id: "1" },
        { id: "2" },
      ]);

      // Act
      const results = await service.testExecuteBatch(operations, context);

      // Assert
      expect(results).toBeDefined();
      expect(enhancedLogger.operationStart).toHaveBeenCalled();
      expect(enhancedLogger.operationEnd).toHaveBeenCalled();
    });
  });

  describe("optimizeQuery", () => {
    it("should return optimization recommendations", () => {
      // Arrange
      const entity = "users";
      const conditions = { role: "student" };
      const options = { limit: 20 };

      // Act
      const result = service.testOptimizeQuery(entity, conditions, options);

      // Assert
      expect(result).toHaveProperty("optimized");
      expect(result).toHaveProperty("suggestions");
      expect(result).toHaveProperty("estimatedImprovement");
    });
  });

  describe("warmCache", () => {
    it("should warm cache for entities", async () => {
      // Arrange
      const entities = ["users", "lessons"];
      const warmCacheSpy = vi
        .spyOn(service["performanceOptimizer"], "warmCache")
        .mockResolvedValue();

      // Act
      await service.testWarmCache(entities);

      // Assert
      expect(warmCacheSpy).toHaveBeenCalledWith(entities);
    });
  });

  describe("getPerformanceMetrics", () => {
    it("should return performance metrics", () => {
      // Act
      const metrics = service.testGetPerformanceMetrics();

      // Assert
      expect(metrics).toHaveProperty("queryCount");
      expect(metrics).toHaveProperty("averageQueryTime");
      expect(metrics).toHaveProperty("cacheHitRate");
      expect(metrics).toHaveProperty("connectionPoolUsage");
    });
  });

  describe("getConnectionPoolStats", () => {
    it("should return connection pool statistics", () => {
      // Act
      const stats = service.testGetConnectionPoolStats();

      // Assert
      expect(stats).toHaveProperty("maxSockets");
      expect(stats).toHaveProperty("freeSockets");
      expect(stats).toHaveProperty("usedSockets");
      expect(stats).toHaveProperty("usagePercentage");
    });
  });
});
