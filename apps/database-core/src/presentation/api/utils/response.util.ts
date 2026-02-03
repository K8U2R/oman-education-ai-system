/**
 * Response Utilities - أدوات الاستجابة
 *
 * Utilities لتبسيط إرسال الاستجابات في Routes
 */

import { Response } from 'express'

/**
 * إعدادات الاستجابة الافتراضية
 */
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
}

/**
 * إرسال استجابة نجاح
 */
export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): Response {
  res.setHeader('Content-Type', DEFAULT_HEADERS['Content-Type'])
  return res.status(statusCode).json({
    success: true,
    data,
  })
}

/**
 * إرسال استجابة خطأ
 */
export function sendError(
  res: Response,
  error: Error | string,
  statusCode: number = 500
): Response {
  const errorMessage = error instanceof Error ? error.message : error
  res.setHeader('Content-Type', DEFAULT_HEADERS['Content-Type'])
  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
  })
}

/**
 * إرسال استجابة خطأ مع timestamp
 */
export function sendErrorWithTimestamp(
  res: Response,
  error: Error | string,
  statusCode: number = 500
): Response {
  const errorMessage = error instanceof Error ? error.message : error
  res.setHeader('Content-Type', DEFAULT_HEADERS['Content-Type'])
  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    timestamp: new Date().toISOString(),
  })
}

/**
 * إرسال استجابة نجاح مع timestamp
 */
export function sendSuccessWithTimestamp<T>(
  res: Response,
  data: T,
  statusCode: number = 200
): Response {
  res.setHeader('Content-Type', DEFAULT_HEADERS['Content-Type'])
  return res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Wrapper لـ async route handlers مع معالجة الأخطاء
 */
export function asyncHandler<T>(handler: (req: unknown, res: Response) => Promise<T>) {
  return async (req: unknown, res: Response): Promise<Response | void> => {
    try {
      const result = await handler(req, res)
      if (result !== undefined && !res.headersSent) {
        return sendSuccess(res, result)
      }
    } catch (error) {
      if (!res.headersSent) {
        return sendError(res, error instanceof Error ? error : String(error))
      }
    }
  }
}
