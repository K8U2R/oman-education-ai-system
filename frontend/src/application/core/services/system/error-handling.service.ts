/**
 * Error Handling Service - خدمة معالجة الأخطاء
 *
 * خدمة مركزية لمعالجة الأخطاء في التطبيق
 */

import {
  AppError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError,
  TimeoutError,
  UnknownError,
  isAppError,
  isNetworkError,
} from '@/domain/exceptions'
import { loggingService } from '@/infrastructure/services/logging.service'

export interface ErrorInfo {
  message: string
  code?: string
  statusCode?: number
  details?: unknown
  timestamp: string
}

export class ErrorHandlingService {
  /**
   * معالجة الخطأ وتحويله إلى ErrorInfo
   */
  handleError(error: unknown): ErrorInfo {
    const timestamp = new Date().toISOString()

    // AppError (Custom Error)
    if (isAppError(error)) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.context,
        timestamp: error.timestamp,
      }
    }

    // Axios Error
    if (this.isAxiosError(error)) {
      const statusCode = error.response?.status
      const message = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع'

      // تحويل Axios Error إلى AppError حسب status code
      if (statusCode === 401) {
        return this.handleError(new AuthenticationError(message))
      }
      if (statusCode === 403) {
        return this.handleError(new AuthorizationError(message))
      }
      if (statusCode === 404) {
        return this.handleError(new NotFoundError(message))
      }
      if (statusCode === 408) {
        return this.handleError(new TimeoutError(message))
      }
      if (statusCode && statusCode >= 500) {
        return this.handleError(new ServerError(message))
      }
      if (statusCode === 400) {
        return this.handleError(new ValidationError(message, error.response?.data?.errors))
      }

      return {
        message,
        code: error.code || 'API_ERROR',
        statusCode,
        details: error.response?.data,
        timestamp,
      }
    }

    // Network Error (no response)
    if (this.isNetworkError(error)) {
      return this.handleError(new NetworkError(error.message))
    }

    // Standard Error
    if (error instanceof Error) {
      return {
        message: error.message,
        code: error.name,
        timestamp,
      }
    }

    // Unknown Error
    return {
      message: 'حدث خطأ غير متوقع',
      code: 'UNKNOWN_ERROR',
      details: error,
      timestamp,
    }
  }

  /**
   * تسجيل الخطأ
   */
  logError(error: unknown, context?: string): void {
    const errorInfo = this.handleError(error)

    // استخدام LoggingService بدلاً من console.error
    loggingService.error(
      `Error${context ? ` in ${context}` : ''}`,
      isAppError(error) ? error : new Error(errorInfo.message),
      {
        code: errorInfo.code,
        statusCode: errorInfo.statusCode,
        timestamp: errorInfo.timestamp,
        details: errorInfo.details,
      }
    )
  }

  /**
   * الحصول على رسالة خطأ مناسبة للمستخدم
   */
  getUserFriendlyMessage(error: unknown): string {
    const errorInfo = this.handleError(error)

    // رسائل مخصصة حسب نوع الخطأ
    if (errorInfo.statusCode === 401) {
      return 'غير مصرح لك بالوصول. يرجى تسجيل الدخول.'
    }

    if (errorInfo.statusCode === 403) {
      return 'ليس لديك صلاحية للوصول إلى هذا المورد.'
    }

    if (errorInfo.statusCode === 404) {
      return 'المورد المطلوب غير موجود.'
    }

    if (errorInfo.statusCode === 500) {
      return 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.'
    }

    if (errorInfo.statusCode && errorInfo.statusCode >= 400) {
      return errorInfo.message || 'حدث خطأ أثناء معالجة الطلب.'
    }

    return errorInfo.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
  }

  /**
   * التحقق من أن الخطأ هو Axios Error
   */
  private isAxiosError(error: unknown): error is {
    response?: {
      status?: number
      data?: { message?: string; errors?: Record<string, string[]> }
    }
    message: string
    code?: string
  } {
    return typeof error === 'object' && error !== null && 'response' in error && 'message' in error
  }

  /**
   * التحقق من أن الخطأ هو Network Error
   */
  private isNetworkError(error: unknown): error is {
    request?: unknown
    message: string
    code?: string
  } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'request' in error &&
      'message' in error &&
      !('response' in error)
    )
  }

  /**
   * تحويل Error إلى AppError
   */
  toAppError(error: unknown): AppError {
    if (isAppError(error)) {
      return error
    }

    const errorInfo = this.handleError(error)

    if (errorInfo.statusCode === 401) {
      return new AuthenticationError(errorInfo.message)
    }
    if (errorInfo.statusCode === 403) {
      return new AuthorizationError(errorInfo.message)
    }
    if (errorInfo.statusCode === 404) {
      return new NotFoundError(errorInfo.message)
    }
    if (errorInfo.statusCode === 408) {
      return new TimeoutError(errorInfo.message)
    }
    if (errorInfo.statusCode && errorInfo.statusCode >= 500) {
      return new ServerError(errorInfo.message)
    }
    if (errorInfo.statusCode === 400) {
      return new ValidationError(
        errorInfo.message,
        errorInfo.details as Record<string, string[]> | undefined
      )
    }

    if (isNetworkError(error)) {
      return new NetworkError(errorInfo.message)
    }

    return new UnknownError(errorInfo.message, errorInfo.statusCode)
  }
}

export const errorHandlingService = new ErrorHandlingService()
