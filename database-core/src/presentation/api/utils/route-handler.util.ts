/**
 * Route Handler Utility - أداة معالجة Routes
 *
 * Utility لتبسيط معالجة Routes و إزالة التكرار
 */

import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { sendError, sendSuccess } from './response.util'

/**
 * نوع لـ Route Handler
 */
export type RouteHandler<T = unknown> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T> | T

/**
 * Wrapper لـ async route handlers مع معالجة الأخطاء
 * يحل مشكلة @typescript-eslint/no-misused-promises
 */
export function asyncRouteHandler<T = unknown>(handler: RouteHandler<T>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await handler(req, res, next)
      if (result !== undefined && !res.headersSent) {
        sendSuccess(res, result)
      }
    } catch (error: unknown) {
      if (!res.headersSent) {
        // معالجة أخطاء Zod
        if (error instanceof ZodError) {
          const errorMessages = error.errors.map(e => e.message).join(', ')
          sendError(res, `خطأ في التحقق من البيانات: ${errorMessages}`, 400)
          return
        }

        // معالجة الأخطاء الأخرى
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف'
        sendError(res, errorMessage, 500)
      }
    }
  }
}

/**
 * Wrapper لـ async route handlers بدون إرسال استجابة تلقائية
 * للاستخدام عندما تريد التحكم الكامل في الاستجابة
 */
export function asyncRouteHandlerManual(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next)
    } catch (error: unknown) {
      if (!res.headersSent) {
        // معالجة أخطاء Zod
        if (error instanceof ZodError) {
          const errorMessages = error.errors.map(e => e.message).join(', ')
          sendError(res, `خطأ في التحقق من البيانات: ${errorMessages}`, 400)
          return
        }

        // معالجة الأخطاء الأخرى
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف'
        sendError(res, errorMessage, 500)
      }
    }
  }
}
