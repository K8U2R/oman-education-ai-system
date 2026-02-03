/**
 * Enhanced Performance Middleware - Middleware محسّن للأداء
 *
 * يجمع بين Performance Monitoring و Prometheus Metrics
 */

import { Request, Response, NextFunction } from 'express'
import { PerformanceMonitorService } from '../../../application/services/PerformanceMonitorService'
import { PrometheusMetrics } from '../../../infrastructure/monitoring/PrometheusMetrics'

/**
 * Enhanced Performance Middleware
 */
export function enhancedPerformanceMiddleware(
  performanceMonitor: PerformanceMonitorService,
  prometheusMetrics: PrometheusMetrics
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now()

    // تسجيل عند انتهاء الاستجابة
    res.on('finish', () => {
      const duration = Date.now() - startTime
      const method = req.method
      const route = req.route?.path || req.path || 'unknown'
      const statusCode = res.statusCode

      // تسجيل في Performance Monitor
      performanceMonitor.recordMetric({
        endpoint: route,
        method,
        duration,
        statusCode,
        timestamp: Date.now(),
        memoryUsage: process.memoryUsage(),
        error: statusCode >= 400 ? `HTTP ${statusCode}` : undefined,
      })

      // تسجيل في Prometheus
      prometheusMetrics.recordHttpRequest(method, route, statusCode, duration)
    })

    next()
  }
}
