/**
 * Prometheus Routes - مسارات Prometheus Metrics
 *
 * مسارات API لتصدير Prometheus Metrics
 */

import { Router, Request, Response } from 'express'
import { PrometheusMetrics } from '../../../infrastructure/monitoring/PrometheusMetrics'
import { asyncRouteHandler, asyncRouteHandlerManual } from '../utils/route-handler.util'

/**
 * إنشاء Routes لـ Prometheus Metrics
 */
export function createPrometheusRoutes(prometheusMetrics: PrometheusMetrics): Router {
  const router = Router()

  /**
   * GET /metrics
   * تصدير Prometheus Metrics
   */
  router.get(
    '/metrics',
    asyncRouteHandlerManual(async (_req: Request, res: Response): Promise<void> => {
      const metrics = await prometheusMetrics.getMetrics()
      res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
      res.send(metrics)
    })
  )

  /**
   * GET /metrics/json
   * الحصول على Metrics كـ JSON
   */
  router.get(
    '/metrics/json',
    asyncRouteHandler(async () => {
      const metrics = await prometheusMetrics.getMetricsAsJSON()
      return { data: metrics }
    })
  )

  /**
   * POST /metrics/reset
   * إعادة تعيين Metrics
   */
  router.post(
    '/metrics/reset',
    asyncRouteHandler(async () => {
      await prometheusMetrics.reset()
      return { message: 'Metrics reset successfully' }
    })
  )

  return router
}
