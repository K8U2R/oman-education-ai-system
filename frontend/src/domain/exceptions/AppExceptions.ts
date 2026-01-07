/**
 * Application Exceptions - استثناءات التطبيق
 *
 * Custom Error Classes لمعالجة الأخطاء في Frontend
 */

/**
 * Base Application Error
 */
export abstract class AppError extends Error {
  abstract readonly code: string
  abstract readonly statusCode?: number
  readonly timestamp: string
  readonly context?: Record<string, unknown>

  constructor(message: string, context?: Record<string, unknown>) {
    super(message)
    this.name = this.constructor.name
    this.timestamp = new Date().toISOString()
    this.context = context
    Object.setPrototypeOf(this, AppError.prototype)
  }

  /**
   * تحويل الخطأ إلى JSON
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      context: this.context,
    }
  }
}

/**
 * API Error - خطأ من API
 */
export class ApiError extends AppError {
  readonly code = 'API_ERROR'
  readonly statusCode?: number
  readonly response?: unknown

  constructor(
    message: string,
    statusCode?: number,
    response?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, context)
    this.statusCode = statusCode
    this.response = response
  }
}

/**
 * Network Error - خطأ في الشبكة
 */
export class NetworkError extends AppError {
  readonly code = 'NETWORK_ERROR'
  readonly statusCode = 0

  constructor(
    message: string = 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.',
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

/**
 * Validation Error - خطأ في التحقق
 */
export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR'
  readonly statusCode = 400
  readonly fields?: Record<string, string[]>

  constructor(
    message: string = 'بيانات غير صحيحة',
    fields?: Record<string, string[]>,
    context?: Record<string, unknown>
  ) {
    super(message, context)
    this.fields = fields
  }
}

/**
 * Authentication Error - خطأ في المصادقة
 */
export class AuthenticationError extends AppError {
  readonly code = 'AUTHENTICATION_ERROR'
  readonly statusCode = 401

  constructor(
    message: string = 'غير مصرح لك بالوصول. يرجى تسجيل الدخول.',
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

/**
 * Authorization Error - خطأ في التخويل
 */
export class AuthorizationError extends AppError {
  readonly code = 'AUTHORIZATION_ERROR'
  readonly statusCode = 403

  constructor(
    message: string = 'ليس لديك صلاحية للوصول إلى هذا المورد.',
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

/**
 * NotFound Error - مورد غير موجود
 */
export class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND'
  readonly statusCode = 404

  constructor(message: string = 'المورد المطلوب غير موجود.', context?: Record<string, unknown>) {
    super(message, context)
  }
}

/**
 * Server Error - خطأ في الخادم
 */
export class ServerError extends AppError {
  readonly code = 'SERVER_ERROR'
  readonly statusCode = 500

  constructor(
    message: string = 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

/**
 * Timeout Error - انتهى الوقت المحدد
 */
export class TimeoutError extends AppError {
  readonly code = 'TIMEOUT_ERROR'
  readonly statusCode = 408

  constructor(
    message: string = 'انتهى الوقت المحدد للطلب. يرجى المحاولة مرة أخرى.',
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

/**
 * Unknown Error - خطأ غير معروف
 */
export class UnknownError extends AppError {
  readonly code = 'UNKNOWN_ERROR'
  readonly statusCode?: number

  constructor(
    message: string = 'حدث خطأ غير متوقع.',
    statusCode?: number,
    context?: Record<string, unknown>
  ) {
    super(message, context)
    this.statusCode = statusCode
  }
}

/**
 * Type Guard للتحقق من نوع الخطأ
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Type Guard للتحقق من نوع ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Type Guard للتحقق من نوع NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError
}

/**
 * Type Guard للتحقق من نوع ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}
