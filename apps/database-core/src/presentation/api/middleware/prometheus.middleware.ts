/**
 * Prometheus Middleware - Middleware لـ Prometheus Metrics
 *
 * تسجيل Metrics تلقائياً لجميع HTTP Requests
 */

import { Request, Response, NextFunction } from 'express'
import { PrometheusMetrics } from '../../../infrastructure/monitoring/PrometheusMetrics'

/**
 * Middleware لتسجيل Prometheus Metrics
 */
export function prometheusMiddleware(prometheusMetrics: PrometheusMetrics) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now()

    // تسجيل عند انتهاء الاستجابة
    res.on('finish', () => {
      const duration = Date.now() - startTime
      const method = req.method
      const route = req.route?.path || req.path || 'unknown'
      const statusCode = res.statusCode

      prometheusMetrics.recordHttpRequest(method, route, statusCode, duration)
    })

    next()
  }
}
