/**
 * Pool Statistics Routes
 *
 * Routes لمراقبة Connection Pool Statistics
 */

import { Router } from 'express'
import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import { asyncRouteHandler } from '../utils/route-handler.util'

/**
 * إنشاء Routes لـ Pool Statistics
 */
export function createPoolStatsRoutes(adapter: IDatabaseAdapter): Router {
  const router = Router()

  /**
   * GET /api/pool/stats
   * الحصول على إحصائيات Pool
   */
  router.get(
    '/stats',
    asyncRouteHandler(async () => {
      // التحقق من دعم Pool Statistics
      if (
        'getPoolStatistics' in adapter &&
        typeof (adapter as { getPoolStatistics?: () => unknown }).getPoolStatistics === 'function'
      ) {
        return (adapter as { getPoolStatistics: () => unknown }).getPoolStatistics()
      } else {
        throw new Error('Pool statistics not supported by this adapter')
      }
    })
  )

  /**
   * GET /api/pool/health
   * الحصول على حالة صحة Pool
   */
  router.get(
    '/health',
    asyncRouteHandler(async () => {
      // التحقق من دعم Pool Health
      if (
        'getPoolHealthStatus' in adapter &&
        typeof (adapter as { getPoolHealthStatus?: () => unknown }).getPoolHealthStatus ===
          'function'
      ) {
        return (adapter as { getPoolHealthStatus: () => unknown }).getPoolHealthStatus()
      } else {
        // Fallback - إذا لم يكن لدينا ConnectionPoolManager
        return {
          healthy: true,
          lastHealthCheck: new Date(),
          consecutiveFailures: 0,
          averageResponseTime: 0,
          errorRate: 0,
        }
      }
    })
  )

  return router
}
