/**
 * Error Formatter - منسق الأخطاء
 *
 * Utilities لتنسيق رسائل الأخطاء
 */

import type { APIErrorInfo, ErrorDetails } from '../core/types'
import { getErrorMessage } from './error-constants'

/**
 * تنسيق رسالة الخطأ
 */
export function formatErrorMessage(apiError: APIErrorInfo | null, defaultMessage: string): string {
  if (apiError?.message) {
    return apiError.message
  }

  if (apiError?.code) {
    return getErrorMessage(apiError.code)
  }

  return defaultMessage
}

/**
 * تنسيق رسالة الخطأ الثانوية
 */
export function formatSecondaryMessage(
  apiError: APIErrorInfo | null,
  errorDetails: ErrorDetails | null,
  defaultMessage?: string
): string | undefined {
  if (errorDetails) {
    if (!errorDetails.isActive) {
      return 'حسابك غير نشط. يرجى التواصل مع المسؤول.'
    }
    if (!errorDetails.isVerified) {
      return 'حسابك غير موثق. يرجى التحقق من بريدك الإلكتروني.'
    }
    if (errorDetails.requiredRole) {
      return `يتطلب هذا المسار دور: ${errorDetails.requiredRole}`
    }
    if (errorDetails.requiredRoles && errorDetails.requiredRoles.length > 0) {
      return `يتطلب هذا المسار أحد الأدوار: ${errorDetails.requiredRoles.join(', ')}`
    }
    if (errorDetails.requiredPermissions && errorDetails.requiredPermissions.length > 0) {
      return `يتطلب هذا المسار : ${errorDetails.requiredPermissions.join(', ')}`
    }
  }

  if (apiError?.details) {
    const details = apiError.details as Record<string, unknown>
    if (details.message && typeof details.message === 'string') {
      return details.message
    }
  }

  return defaultMessage
}

/**
 * تنسيق تفاصيل الخطأ للعرض
 */
export function formatErrorDetailsForDisplay(
  apiError: APIErrorInfo | null,
  errorDetails: ErrorDetails | null
): Record<string, unknown> {
  const formatted: Record<string, unknown> = {}

  if (apiError) {
    formatted['API Error'] = {
      message: apiError.message,
      code: apiError.code,
      status: apiError.status,
    }
  }

  if (errorDetails) {
    formatted['Error Details'] = {
      userRole: errorDetails.userRole,
      requiredRole: errorDetails.requiredRole,
      requiredRoles: errorDetails.requiredRoles,
      requiredPermissions: errorDetails.requiredPermissions,
      isActive: errorDetails.isActive,
      isVerified: errorDetails.isVerified,
      routeTitle: errorDetails.routeTitle,
      path: errorDetails.path,
    }
  }

  return formatted
}
