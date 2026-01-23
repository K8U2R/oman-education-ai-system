/**
 * Validation Middleware - Middleware للتحقق من البيانات
 *
 * Middleware للتحقق من صحة البيانات باستخدام Zod
 */

import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { DatabaseResponse } from '../../../application/dto/DatabaseResponse.dto'

/**
 * إنشاء Validation Middleware
 */
export function validationMiddleware(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // التحقق من البيانات
      const validatedData = schema.parse(req.body)

      // استبدال req.body بالبيانات المتحقق منها
      req.body = validatedData

      next()
    } catch (error: unknown) {
      // معالجة أخطاء Zod
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'ZodError' &&
        'errors' in error &&
        Array.isArray(error.errors)
      ) {
        const zodError = error as { errors: Array<{ message: string }> }
        const errorMessages = zodError.errors.map(e => e.message).join(', ')
        const response = DatabaseResponse.error(`خطأ في التحقق من البيانات: ${errorMessages}`)

        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.status(400).json(response.toJSON())
        return
      }

      // خطأ غير معروف
      const response = DatabaseResponse.error('خطأ في التحقق من البيانات')
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.status(400).json(response.toJSON())
    }
  }
}
