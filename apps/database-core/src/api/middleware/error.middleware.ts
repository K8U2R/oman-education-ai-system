import { Request, Response, NextFunction } from 'express'
import { DatabaseResponse, createErrorResponse } from '../contracts/DatabaseResponse'

/**
 * Error Middleware - معالجة الأخطاء
 *
 * يضمن عرض رسائل الأخطاء بشكل صحيح مع دعم UTF-8 للغة العربية
 */
export function errorMiddleware(error: Error, req: Request, res: Response, _next: NextFunction) {
  // Log error with details
  console.error('❌ Database Core Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  })

  // Ensure UTF-8 encoding for error messages
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.charset = 'utf-8'

  // Determine status code based on error type
  let statusCode = 500
  let errorMessage = error.message || 'خطأ داخلي في الخادم'

  // Handle specific error types
  if (error.name === 'ValidationError' || error.name === 'ZodError') {
    statusCode = 400
    errorMessage = `خطأ في التحقق من البيانات: ${error.message}`
  } else if (error.name === 'NotFoundError') {
    statusCode = 404
    errorMessage = error.message || 'المورد غير موجود'
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401
    errorMessage = error.message || 'غير مصرح لك بالوصول'
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403
    errorMessage = error.message || 'غير مسموح لك بالوصول'
  }

  const response: DatabaseResponse = createErrorResponse(errorMessage)

  res.status(statusCode).json(response)
}
