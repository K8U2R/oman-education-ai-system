/**
 * Performance Middleware - Middleware لمراقبة الأداء
 *
 * Middleware لتسجيل أداء الطلبات
 */

import { Request, Response, NextFunction } from 'express'
import { PerformanceMonitorService } from '../../../application/services/PerformanceMonitorService'

export function performanceMiddleware(performanceMonitor: PerformanceMonitorService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now()
    const startMemory = process.memoryUsage()

    // تتبع الاستجابة
    res.on('finish', () => {
      const duration = Date.now() - startTime
      const endMemory = process.memoryUsage()

      // استخدام originalUrl للحصول على المسار الكامل
      const endpoint = req.originalUrl || req.url || req.path

      performanceMonitor.recordMetric({
        endpoint,
        method: req.method,
        duration,
        statusCode: res.statusCode,
        timestamp: Date.now(),
        memoryUsage: {
          rss: endMemory.rss - startMemory.rss,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal,
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          external: endMemory.external - startMemory.external,
          arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers,
        },
        error: res.statusCode >= 500 ? 'Server error' : undefined,
      })
    })

    next()
  }
}
