/**
 * Error Handler Utility - أداة معالجة الأخطاء
 *
 * Utility لمعالجة الأخطاء بشكل موحد في Routes
 */

import { Response } from 'express'
import { ZodError } from 'zod'
import { sendError } from './response.util'

/**
 * معالجة خطأ Zod
 */
export function handleZodError(error: ZodError): string {
  const errorMessages = error.errors.map(e => e.message).join(', ')
  return `خطأ في التحقق من البيانات: ${errorMessages}`
}

/**
 * معالجة خطأ عام
 */
export function handleGenericError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'خطأ غير معروف'
}

/**
 * معالجة الأخطاء في Route Handler
 */
export function handleRouteError(
  res: Response,
  error: unknown,
  defaultMessage: string = 'حدث خطأ أثناء معالجة الطلب'
): Response {
  // معالجة أخطاء Zod
  if (error instanceof ZodError) {
    return sendError(res, handleZodError(error), 400)
  }

  // معالجة الأخطاء الأخرى
  const errorMessage = handleGenericError(error) || defaultMessage
  return sendError(res, errorMessage, 500)
}
