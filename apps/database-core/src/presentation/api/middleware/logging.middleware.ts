/**
 * Logging Middleware - Middleware لتسجيل الطلبات
 *
 * Middleware لتسجيل جميع الطلبات الواردة
 */

import { Request, Response, NextFunction } from 'express'
import { logger } from '../../../shared/utils/logger'

/**
 * Logging Middleware
 */
export function loggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now()

  // استخدام originalUrl للحصول على المسار الكامل
  const endpoint = req.originalUrl || req.url || req.path

  // تسجيل الطلب الوارد
  logger.info('Incoming request', {
    method: req.method,
    path: endpoint,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })

  // تسجيل الاستجابة عند الانتهاء
  res.on('finish', () => {
    const duration = Date.now() - startTime
    logger.info('Request completed', {
      method: req.method,
      path: endpoint,
      statusCode: res.statusCode,
      duration,
    })
  })

  next()
}
