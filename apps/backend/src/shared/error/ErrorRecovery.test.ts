/**
 * Error Recovery Tests - اختبارات Error Recovery
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ErrorRecovery } from "./ErrorRecovery";

describe("ErrorRecovery", () => {
  let errorRecovery: ErrorRecovery;

  beforeEach(() => {
    errorRecovery = new ErrorRecovery();
  });

  describe("retry", () => {
    it("should retry operation on failure", async () => {
      // Arrange
      let attempts = 0;
      const operation = vi.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 2) {
          const error = new Error("Network timeout");
          error.name = "NetworkError";
          throw error;
        }
        return Promise.resolve({ data: "success" });
      });

      // Act
      const result = await errorRecovery.retry(
        operation,
        {
          maxRetries: 3,
          initialDelay: 10, // Short delay for testing
        },
        { operation: "test" },
      );

      // Assert
      expect(operation).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ data: "success" });
    });

    it("should throw error after max retries", async () => {
      // Arrange
      const error = new Error("Persistent error");
      (error as Error & { isRetryable?: boolean }).isRetryable = true;
      const operation = vi.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(
        errorRecovery.retry(
          operation,
          {
            maxRetries: 2,
            initialDelay: 10,
          },
          { operation: "test" },
        ),
      ).rejects.toThrow("Persistent error");

      expect(operation).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe("executeWithFallback", () => {
    it("should execute primary operation successfully", async () => {
      // Arrange
      const primary = vi.fn().mockResolvedValue({ data: "primary" });
      const fallback = vi.fn().mockResolvedValue({ data: "fallback" });

      // Act
      const result = await errorRecovery.executeWithFallback(
        primary,
        fallback,
        {
          operation: "test",
        },
      );

      // Assert
      expect(primary).toHaveBeenCalled();
      expect(fallback).not.toHaveBeenCalled();
      expect(result).toEqual({ data: "primary" });
    });

    it("should execute fallback on primary failure", async () => {
      // Arrange
      const primary = vi.fn().mockRejectedValue(new Error("Primary failed"));
      const fallback = vi.fn().mockResolvedValue({ data: "fallback" });

      // Act
      const result = await errorRecovery.executeWithFallback(
        primary,
        fallback,
        {
          operation: "test",
        },
      );

      // Assert
      expect(primary).toHaveBeenCalled();
      expect(fallback).toHaveBeenCalled();
      expect(result).toEqual({ data: "fallback" });
    });

    it("should throw error if both primary and fallback fail", async () => {
      // Arrange
      const primary = vi.fn().mockRejectedValue(new Error("Primary failed"));
      const fallback = vi.fn().mockRejectedValue(new Error("Fallback failed"));

      // Act & Assert
      await expect(
        errorRecovery.executeWithFallback(primary, fallback, {
          operation: "test",
        }),
      ).rejects.toThrow("Fallback failed");
    });
  });

  describe("circuit breaker", () => {
    it("should check circuit breaker state", () => {
      // Arrange
      const key = "test-service";

      // Act
      const isOpen = (
        errorRecovery as unknown as {
          checkCircuitBreaker: (key: string) => boolean;
        }
      ).checkCircuitBreaker(key);

      // Assert
      expect(typeof isOpen).toBe("boolean");
    });

    it("should record failure", () => {
      // Arrange
      const key = "test-service";

      // Act
      (
        errorRecovery as unknown as { recordFailure: (key: string) => void }
      ).recordFailure(key);

      // Assert
      const state = errorRecovery.getCircuitBreakerState(key);
      expect(state).toBeDefined();
      expect(state?.failures).toBeGreaterThan(0);
    });

    it("should record success", () => {
      // Arrange
      const key = "test-service";
      (
        errorRecovery as unknown as { recordFailure: (key: string) => void }
      ).recordFailure(key);

      // Act
      errorRecovery.recordSuccess(key);

      // Assert
      const state = errorRecovery.getCircuitBreakerState(key);
      expect(state?.failures).toBe(0);
    });

    it("should reset circuit breaker", () => {
      // Arrange
      const key = "test-service";
      (
        errorRecovery as unknown as { recordFailure: (key: string) => void }
      ).recordFailure(key);

      // Act
      errorRecovery.resetCircuitBreaker(key);

      // Assert
      const state = errorRecovery.getCircuitBreakerState(key);
      expect(state).toBeNull();
    });
  });
});
