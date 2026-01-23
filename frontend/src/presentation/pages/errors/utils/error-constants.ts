/**
 * Error Constants - ثوابت الأخطاء
 *
 * ثوابت مركزية لأنواع الأخطاء ورسائلها
 */

import type { ErrorType } from '../core/types'

/**
 * رموز الأخطاء
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  MAINTENANCE: 'MAINTENANCE',
} as const

/**
 * رسائل الأخطاء الافتراضية
 */
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.UNAUTHORIZED]: 'غير مصرح بالوصول',
  [ERROR_CODES.FORBIDDEN]: 'غير مصرح بالوصول',
  [ERROR_CODES.NOT_FOUND]: 'الصفحة غير موجودة',
  [ERROR_CODES.SERVER_ERROR]: 'خطأ في الخادم',
  [ERROR_CODES.NETWORK_ERROR]: 'مشكلة في الاتصال',
  [ERROR_CODES.VALIDATION_ERROR]: 'خطأ في التحقق من البيانات',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'تم تجاوز الحد المسموح',
  [ERROR_CODES.MAINTENANCE]: 'الصيانة قيد التنفيذ',
}

/**
 * رموز الحالة HTTP المقابلة لأنواع الأخطاء
 */
export const ERROR_STATUS_CODES: Record<ErrorType, number> = {
  unauthorized: 401,
  forbidden: 403,
  'not-found': 404,
  'server-error': 500,
  'network-error': 0,
  maintenance: 503,
}

/**
 * التحقق من نوع الخطأ
 */
export function isErrorType(type: string): type is ErrorType {
  return [
    'unauthorized',
    'forbidden',
    'not-found',
    'server-error',
    'network-error',
    'maintenance',
  ].includes(type)
}

/**
 * الحصول على رمز الخطأ من نوع الخطأ
 */
export function getErrorCode(type: ErrorType): string {
  const codeMap: Record<ErrorType, string> = {
    unauthorized: ERROR_CODES.UNAUTHORIZED,
    forbidden: ERROR_CODES.FORBIDDEN,
    'not-found': ERROR_CODES.NOT_FOUND,
    'server-error': ERROR_CODES.SERVER_ERROR,
    'network-error': ERROR_CODES.NETWORK_ERROR,
    maintenance: ERROR_CODES.MAINTENANCE,
  }
  return codeMap[type]
}

/**
 * الحصول على رسالة الخطأ من رمز الخطأ
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || 'حدث خطأ غير متوقع'
}
