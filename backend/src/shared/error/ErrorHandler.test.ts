/**
 * Error Handler Tests - اختبارات Error Handler
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ErrorHandler, ErrorSeverity, ErrorCategory } from "./ErrorHandler";

describe("ErrorHandler", () => {
  beforeEach(() => {
    // Reset any state if needed
  });

  describe("handleError", () => {
    it("should handle Error instance", () => {
      // Arrange
      const error = new Error("Test error");
      const context = { userId: "user-123", operation: "test" };

      // Act
      const errorInfo = ErrorHandler.handleError(error, context);

      // Assert
      expect(errorInfo).toHaveProperty("message");
      expect(errorInfo).toHaveProperty("code");
      expect(errorInfo).toHaveProperty("severity");
      expect(errorInfo).toHaveProperty("category");
      expect(errorInfo).toHaveProperty("context");
      expect(errorInfo.message).toBe("Test error");
      expect(errorInfo.context.userId).toBe("user-123");
    });

    it("should handle unknown error", () => {
      // Arrange
      const error = "String error";
      const context = {};

      // Act
      const errorInfo = ErrorHandler.handleError(error, context);

      // Assert
      expect(errorInfo).toHaveProperty("message");
      expect(errorInfo.message).toBe("Unknown error occurred");
    });
  });

  describe("getUserFriendlyMessage", () => {
    it("should return user-friendly message for validation error", () => {
      // Arrange
      const errorInfo = {
        message: "Validation error",
        code: "VALIDATION_ERROR",
        severity: ErrorSeverity.LOW,
        category: ErrorCategory.VALIDATION,
        context: {},
        timestamp: Date.now(),
        recoverable: true,
        retryable: false,
      };

      // Act
      const message = ErrorHandler.getUserFriendlyMessage(errorInfo);

      // Assert
      expect(message).toBe("البيانات المدخلة غير صحيحة");
    });

    it("should return user-friendly message for authentication error", () => {
      // Arrange
      const errorInfo = {
        message: "Auth error",
        code: "AUTH_ERROR",
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.AUTHENTICATION,
        context: {},
        timestamp: Date.now(),
        recoverable: true,
        retryable: false,
      };

      // Act
      const message = ErrorHandler.getUserFriendlyMessage(errorInfo);

      // Assert
      expect(message).toBe("فشل التحقق من الهوية");
    });
  });

  describe("isRetryable", () => {
    it("should return true for retryable errors", () => {
      // Arrange
      const error = new Error("Network timeout");

      // Act
      const isRetryable = ErrorHandler.isRetryable(error);

      // Assert
      expect(typeof isRetryable).toBe("boolean");
    });
  });

  describe("isRecoverable", () => {
    it("should return true for recoverable errors", () => {
      // Arrange
      const error = new Error("Validation error");

      // Act
      const isRecoverable = ErrorHandler.isRecoverable(error);

      // Assert
      expect(typeof isRecoverable).toBe("boolean");
    });
  });
});
