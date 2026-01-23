/**
 * Error Handler - معالج الأخطاء
 *
 * معالجة شاملة للأخطاء:
 * - Error Classification
 * - Error Recovery
 * - Error Reporting
 * - Error Context
 */

import { logger } from "../utils/logger";

export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum ErrorCategory {
  VALIDATION = "validation",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  DATABASE = "database",
  NETWORK = "network",
  EXTERNAL_SERVICE = "external_service",
  INTERNAL = "internal",
  UNKNOWN = "unknown",
}

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  operation?: string;
  service?: string;
  metadata?: Record<string, unknown>;
  stack?: string;
}

export interface ErrorInfo {
  message: string;
  code: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context: ErrorContext;
  timestamp: number;
  recoverable: boolean;
  retryable: boolean;
}

export class ErrorHandler {
  /**
   * Handle error with full context
   */
  static handleError(
    error: Error | unknown,
    context: ErrorContext = {},
  ): ErrorInfo {
    const errorInfo = this.analyzeError(error, context);
    this.logError(errorInfo);
    this.reportError(errorInfo);
    return errorInfo;
  }

  /**
   * Analyze error and extract information
   */
  private static analyzeError(
    error: Error | unknown,
    context: ErrorContext,
  ): ErrorInfo {
    let message = "Unknown error occurred";
    let code = "UNKNOWN_ERROR";
    let severity = ErrorSeverity.MEDIUM;
    let category = ErrorCategory.UNKNOWN;
    let recoverable = false;
    let retryable = false;
    let stack: string | undefined;

    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
      code = error.name || "ERROR";

      // Classify error
      const classification = this.classifyError(error);
      severity = classification.severity;
      category = classification.category;
      recoverable = classification.recoverable;
      retryable =
        (error as { retryable?: boolean }).retryable ||
        (error as { isRetryable?: boolean }).isRetryable ||
        classification.retryable;
    }

    return {
      message,
      code,
      severity,
      category,
      context: {
        ...context,
        stack,
      },
      timestamp: Date.now(),
      recoverable,
      retryable,
    };
  }

  /**
   * Classify error
   */
  private static classifyError(error: Error): {
    severity: ErrorSeverity;
    category: ErrorCategory;
    recoverable: boolean;
    retryable: boolean;
  } {
    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();

    // Database errors
    if (
      errorName.includes("database") ||
      errorName.includes("query") ||
      errorName.includes("connection")
    ) {
      return {
        severity:
          errorMessage.includes("timeout") ||
          errorMessage.includes("connection")
            ? ErrorSeverity.HIGH
            : ErrorSeverity.MEDIUM,
        category: ErrorCategory.DATABASE,
        recoverable: !errorMessage.includes("syntax"),
        retryable:
          errorMessage.includes("timeout") ||
          errorMessage.includes("connection"),
      };
    }

    // Authentication errors
    if (
      errorName.includes("auth") ||
      errorName.includes("token") ||
      errorName.includes("unauthorized")
    ) {
      return {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.AUTHENTICATION,
        recoverable: true,
        retryable: false,
      };
    }

    // Authorization errors
    if (
      errorName.includes("permission") ||
      errorName.includes("forbidden") ||
      errorName.includes("access")
    ) {
      return {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.AUTHORIZATION,
        recoverable: false,
        retryable: false,
      };
    }

    // Validation errors
    if (errorName.includes("validation") || errorName.includes("invalid")) {
      return {
        severity: ErrorSeverity.LOW,
        category: ErrorCategory.VALIDATION,
        recoverable: true,
        retryable: false,
      };
    }

    // Network errors
    if (
      errorName.includes("network") ||
      errorName.includes("timeout") ||
      errorName.includes("econnrefused")
    ) {
      return {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.NETWORK,
        recoverable: true,
        retryable: true,
      };
    }

    // External service errors
    if (
      errorName.includes("external") ||
      errorName.includes("api") ||
      errorMessage.includes("service unavailable")
    ) {
      return {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.EXTERNAL_SERVICE,
        recoverable: true,
        retryable: true,
      };
    }

    // Default
    return {
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.UNKNOWN,
      recoverable: false,
      retryable: false,
    };
  }

  /**
   * Log error
   */
  private static logError(errorInfo: ErrorInfo): void {
    const logData = {
      message: errorInfo.message,
      code: errorInfo.code,
      severity: errorInfo.severity,
      category: errorInfo.category,
      context: errorInfo.context,
      recoverable: errorInfo.recoverable,
      retryable: errorInfo.retryable,
    };

    switch (errorInfo.severity) {
      case ErrorSeverity.CRITICAL:
        logger.error("Critical error", logData);
        break;
      case ErrorSeverity.HIGH:
        logger.error("High severity error", logData);
        break;
      case ErrorSeverity.MEDIUM:
        logger.warn("Medium severity error", logData);
        break;
      case ErrorSeverity.LOW:
        logger.info("Low severity error", logData);
        break;
    }
  }

  /**
   * Report error (to external service if needed)
   */
  private static reportError(errorInfo: ErrorInfo): void {
    // Only report high severity errors
    if (
      errorInfo.severity === ErrorSeverity.CRITICAL ||
      errorInfo.severity === ErrorSeverity.HIGH
    ) {
      // In production, send to error tracking service (e.g., Sentry)
      logger.error("Error reported", {
        code: errorInfo.code,
        severity: errorInfo.severity,
        category: errorInfo.category,
      });
    }
  }

  /**
   * Create user-friendly error message
   */
  static getUserFriendlyMessage(errorInfo: ErrorInfo): string {
    const messages: Record<ErrorCategory, string> = {
      [ErrorCategory.VALIDATION]: "البيانات المدخلة غير صحيحة",
      [ErrorCategory.AUTHENTICATION]: "فشل التحقق من الهوية",
      [ErrorCategory.AUTHORIZATION]: "ليس لديك صلاحية للوصول",
      [ErrorCategory.DATABASE]: "حدث خطأ في قاعدة البيانات",
      [ErrorCategory.NETWORK]: "حدث خطأ في الاتصال",
      [ErrorCategory.EXTERNAL_SERVICE]: "الخدمة الخارجية غير متاحة حالياً",
      [ErrorCategory.INTERNAL]: "حدث خطأ داخلي",
      [ErrorCategory.UNKNOWN]: "حدث خطأ غير معروف",
    };

    return messages[errorInfo.category] || messages[ErrorCategory.UNKNOWN];
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error: Error | unknown): boolean {
    const errorInfo = this.analyzeError(error, {});
    return errorInfo.retryable;
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverable(error: Error | unknown): boolean {
    const errorInfo = this.analyzeError(error, {});
    return errorInfo.recoverable;
  }
}
