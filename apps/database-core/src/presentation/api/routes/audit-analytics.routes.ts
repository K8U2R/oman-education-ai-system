/**
 * Audit Analytics Routes - مسارات تحليلات Audit Logs
 *
 * مسارات API للـ Audit Analytics
 */

import { Router, Request } from 'express'
import { AuditAnalytics } from '../../../infrastructure/audit/AuditAnalytics'
import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import { asyncRouteHandler } from '../utils/route-handler.util'

/**
 * إنشاء Routes لـ Audit Analytics
 */
export function createAuditAnalyticsRoutes(adapter: IDatabaseAdapter): Router {
  const router = Router()
  const analytics = new AuditAnalytics(adapter)

  /**
   * GET /analytics/statistics
   * الحصول على إحصائيات Audit Logs
   */
  router.get(
    '/statistics',
    asyncRouteHandler(async (req: Request) => {
      const timeWindow = req.query.timeWindow
        ? parseInt(req.query.timeWindow as string, 10)
        : undefined

      return await analytics.getStatistics(timeWindow)
    })
  )

  /**
   * GET /analytics/trends
   * الحصول على Trends
   */
  router.get(
    '/trends',
    asyncRouteHandler(async (req: Request) => {
      const period = (req.query.period as 'hour' | 'day' | 'week' | 'month') || 'day'
      return await analytics.getTrends(period)
    })
  )

  /**
   * GET /analytics/alerts
   * الحصول على Alerts
   */
  router.get(
    '/alerts',
    asyncRouteHandler(async (req: Request) => {
      const timeWindow = req.query.timeWindow
        ? parseInt(req.query.timeWindow as string, 10)
        : undefined

      return await analytics.getAlerts(timeWindow)
    })
  )

  /**
   * POST /analytics/report
   * إنشاء Report
   */
  router.post(
    '/report',
    asyncRouteHandler(async (req: Request) => {
      const { startDate, endDate } = req.body as { startDate?: string; endDate?: string }

      if (!startDate || !endDate) {
        throw new Error('startDate and endDate are required')
      }

      return await analytics.generateReport(new Date(startDate), new Date(endDate))
    })
  )

  return router
}
