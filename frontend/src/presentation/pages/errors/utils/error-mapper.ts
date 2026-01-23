/**
 * Error Mapper - محول الأخطاء
 *
 * Utilities لتحويل الأخطاء من أشكال مختلفة إلى شكل موحد
 */

import type { ErrorType, APIErrorInfo, ErrorDetails } from '../core/types'
import { ERROR_CODES, ERROR_STATUS_CODES } from './error-constants'

/**
 * تحويل HTTP status code إلى نوع خطأ
 */
export function mapStatusCodeToErrorType(statusCode: number): ErrorType {
  if (statusCode === 401) return 'unauthorized'
  if (statusCode === 403) return 'forbidden'
  if (statusCode === 404) return 'not-found'
  if (statusCode >= 500) return 'server-error'
  if (statusCode === 503) return 'maintenance'
  return 'server-error'
}

/**
 * تحويل نوع خطأ إلى HTTP status code
 */
export function mapErrorTypeToStatusCode(type: ErrorType): number {
  return ERROR_STATUS_CODES[type]
}

/**
 * تحويل API Error إلى نوع خطأ
 */
export function mapAPIErrorToErrorType(apiError: APIErrorInfo): ErrorType {
  if (apiError.status) {
    return mapStatusCodeToErrorType(apiError.status)
  }

  if (apiError.code) {
    const codeMap: Record<string, ErrorType> = {
      [ERROR_CODES.UNAUTHORIZED]: 'unauthorized',
      [ERROR_CODES.FORBIDDEN]: 'forbidden',
      [ERROR_CODES.NOT_FOUND]: 'not-found',
      [ERROR_CODES.SERVER_ERROR]: 'server-error',
      [ERROR_CODES.NETWORK_ERROR]: 'network-error',
      [ERROR_CODES.MAINTENANCE]: 'maintenance',
    }
    return codeMap[apiError.code] || 'server-error'
  }

  return 'server-error'
}

/**
 * تحويل Error object إلى APIErrorInfo
 */
export function mapErrorToAPIError(error: Error | unknown): APIErrorInfo {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: error.name,
      status: 500,
    }
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>
    return {
      message: String(errorObj.message || 'حدث خطأ غير متوقع'),
      code: String(errorObj.code || 'UNKNOWN_ERROR'),
      status: Number(errorObj.status || 500),
      details: errorObj.details as Record<string, unknown> | undefined,
    }
  }

  return {
    message: 'حدث خطأ غير متوقع',
    code: 'UNKNOWN_ERROR',
    status: 500,
  }
}

/**
 * تحويل ErrorDetails إلى APIErrorInfo
 */
export function mapErrorDetailsToAPIError(details: ErrorDetails): APIErrorInfo {
  return {
    message: details.routeTitle
      ? `ليس لديك  للوصول إلى: ${details.routeTitle}`
      : 'ليس لديك  للوصول',
    code:
      details.requiredRole || details.requiredRoles
        ? ERROR_CODES.FORBIDDEN
        : ERROR_CODES.UNAUTHORIZED,
    status: details.requiredRole || details.requiredRoles ? 403 : 401,
    details: details as Record<string, unknown>,
  }
}
