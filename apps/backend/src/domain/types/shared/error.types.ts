/**
 * Error Types - أنواع الأخطاء
 *
 * أنواع موحدة لمعالجة الأخطاء في النظام
 */

import type { APIError, APIErrorCode } from "./api.types";

/**
 * Domain Error - خطأ المجال
 *
 * خطأ في طبقة المجال (Domain Layer)
 */
export interface DomainError {
  name: string;
  message: string;
  code: string;
  cause?: unknown;
  stack?: string;
}

/**
 * Application Error - خطأ التطبيق
 *
 * خطأ في طبقة التطبيق (Application Layer)
 */
export interface ApplicationError extends DomainError {
  statusCode: number;
  isOperational: boolean;
  context?: Record<string, unknown>;
}

/**
 * Infrastructure Error - خطأ البنية التحتية
 *
 * خطأ في طبقة البنية التحتية (Infrastructure Layer)
 */
export interface InfrastructureError extends DomainError {
  service: string;
  retryable: boolean;
}

/**
 * Validation Error Details - تفاصيل خطأ التحقق
 *
 * تفاصيل خطأ التحقق من البيانات
 */
export interface ValidationErrorDetails {
  field: string;
  value: unknown;
  constraint: string;
  message: string;
}

/**
 * Error Context - سياق الخطأ
 *
 * معلومات إضافية عن الخطأ
 */
export interface ErrorContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  timestamp: string;
  [key: string]: unknown;
}

/**
 * Error Response - استجابة الخطأ
 *
 * بنية موحدة لاستجابات الأخطاء
 */
export interface ErrorResponse {
  error: APIError;
  context?: ErrorContext;
  stack?: string; // في بيئة التطوير فقط
}

/**
 * Error Handler Options - خيارات معالج الأخطاء
 *
 * خيارات لمعالجة الأخطاء
 */
export interface ErrorHandlerOptions {
  includeStack?: boolean;
  includeContext?: boolean;
  logError?: boolean;
  notifyAdmin?: boolean;
}

/**
 * Error Categories - فئات الأخطاء
 *
 * فئات الأخطاء المختلفة في النظام
 */
export type ErrorCategory =
  | "authentication"
  | "authorization"
  | "validation"
  | "not_found"
  | "conflict"
  | "rate_limit"
  | "database"
  | "external_service"
  | "internal"
  | "unknown";

/**
 * Error Severity - خطورة الخطأ
 *
 * مستويات خطورة الأخطاء
 */
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/**
 * Error Log Entry - سجل خطأ
 *
 * بنية موحدة لتسجيل الأخطاء
 */
export interface ErrorLogEntry {
  id: string;
  error: DomainError;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context: ErrorContext;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

/**
 * Error Statistics - إحصائيات الأخطاء
 *
 * إحصائيات عن الأخطاء في النظام
 */
export interface ErrorStatistics {
  total_errors: number;
  by_category: Record<ErrorCategory, number>;
  by_severity: Record<ErrorSeverity, number>;
  by_code: Record<APIErrorCode, number>;
  recent_errors: ErrorLogEntry[];
  error_rate: number; // errors per hour
}

/**
 * Error Recovery Strategy - استراتيجية استعادة الخطأ
 *
 * استراتيجيات لاستعادة الأخطاء
 */
export type ErrorRecoveryStrategy =
  | "retry"
  | "fallback"
  | "circuit_breaker"
  | "graceful_degradation"
  | "fail_fast";

/**
 * Error Recovery Options - خيارات استعادة الخطأ
 *
 * خيارات لاستعادة الأخطاء
 */
export interface ErrorRecoveryOptions {
  strategy: ErrorRecoveryStrategy;
  maxRetries?: number;
  retryDelay?: number;
  fallbackValue?: unknown;
  timeout?: number;
}

/**
 * Error Handler - معالج الأخطاء
 *
 * واجهة لمعالجة الأخطاء
 */
export interface ErrorHandler {
  handle(error: unknown, context?: ErrorContext): ErrorResponse;
  log(error: ErrorLogEntry): Promise<void>;
  notify(error: ErrorLogEntry, options?: ErrorHandlerOptions): Promise<void>;
}

/**
 * Error Handler Helper - مساعد معالج الأخطاء
 *
 * Utility functions لمعالجة الأخطاء
 */
export const ErrorHandlerHelper = {
  /**
   * تحويل Error إلى APIError
   */
  toAPIError(
    error: unknown,
    defaultCode: APIErrorCode = "INTERNAL_SERVER_ERROR",
  ): APIError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: (error as { code?: APIErrorCode }).code || defaultCode,
        details: error.cause,
      };
    }

    if (typeof error === "object" && error !== null) {
      const err = error as Record<string, unknown>;
      return {
        message: String(err.message || "خطأ غير معروف"),
        code: (err.code as APIErrorCode) || defaultCode,
        details: err.details,
      };
    }

    return {
      message: String(error || "خطأ غير معروف"),
      code: defaultCode,
    };
  },

  /**
   * إنشاء ErrorContext
   */
  createContext(additional?: Record<string, unknown>): ErrorContext {
    return {
      timestamp: new Date().toISOString(),
      ...additional,
    };
  },

  /**
   * تحديد ErrorCategory من APIErrorCode
   */
  getCategoryFromCode(code: APIErrorCode): ErrorCategory {
    const categoryMap: Record<APIErrorCode, ErrorCategory> = {
      UNAUTHORIZED: "authentication",
      FORBIDDEN: "authorization",
      VALIDATION_ERROR: "validation",
      NOT_FOUND: "not_found",
      CONFLICT: "conflict",
      RATE_LIMIT_EXCEEDED: "rate_limit",
      DATABASE_ERROR: "database",
      EXTERNAL_SERVICE_ERROR: "external_service",
      INTERNAL_SERVER_ERROR: "internal",
      BAD_REQUEST: "validation",
      AUTH_ERROR: "authentication",
      STORAGE_ERROR: "external_service",
      AUTHENTICATION_FAILED: "authentication",
      INVALID_TOKEN: "authentication",
    };

    return categoryMap[code] || "unknown";
  },

  /**
   * تحديد ErrorSeverity من ErrorCategory
   */
  getSeverityFromCategory(category: ErrorCategory): ErrorSeverity {
    const severityMap: Record<ErrorCategory, ErrorSeverity> = {
      authentication: "medium",
      authorization: "medium",
      validation: "low",
      not_found: "low",
      conflict: "medium",
      rate_limit: "medium",
      database: "high",
      external_service: "high",
      internal: "critical",
      unknown: "high",
    };

    return severityMap[category];
  },
} as const;
