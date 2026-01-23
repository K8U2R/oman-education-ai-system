/**
 * Cache Statistics Routes
 *
 * Routes لعرض إحصائيات Cache
 */

import { Router, Request, Response } from 'express'
import { CacheManager } from '../../../infrastructure/cache/CacheManager'
import { DatabaseRepository } from '../../../infrastructure/repositories/DatabaseRepository'
import { sendSuccessWithTimestamp, sendErrorWithTimestamp } from '../utils/response.util'

/**
 * إنشاء Routes لإحصائيات Cache
 */
export function createCacheStatsRoutes(
  cacheManager: CacheManager,
  databaseRepository?: DatabaseRepository
): Router {
  const router = Router()

  /**
   * GET /api/cache/stats
   * الحصول على إحصائيات Cache العامة
   */
  router.get('/stats', (_req: Request, res: Response) => {
    try {
      const stats = cacheManager.getStats()

      return sendSuccessWithTimestamp(res, {
        size: stats.size,
        entries: stats.entries,
        expired: stats.expired,
        hitCount: stats.hitCount,
        missCount: stats.missCount,
        hitRate: stats.hitRate,
        hitRatePercentage: `${(stats.hitRate * 100).toFixed(2)}%`,
      })
    } catch (error) {
      return sendErrorWithTimestamp(res, error instanceof Error ? error : String(error))
    }
  })

  /**
   * GET /api/cache/registry/stats
   * الحصول على إحصائيات Cache Registry (إذا كان DatabaseRepository متاحاً)
   */
  router.get('/registry/stats', (_req: Request, res: Response) => {
    try {
      if (!databaseRepository) {
        return sendErrorWithTimestamp(res, 'Cache Registry not available', 404)
      }

      const registryStats = databaseRepository.getCacheRegistryStats()

      return sendSuccessWithTimestamp(res, {
        totalKeys: registryStats.totalKeys,
        entities: registryStats.entities,
        operations: Array.from(registryStats.operations),
        entityStats: registryStats.entityStats,
      })
    } catch (error) {
      return sendErrorWithTimestamp(res, error instanceof Error ? error : String(error))
    }
  })

  /**
   * POST /api/cache/clear
   * مسح جميع Cache
   */
  router.post('/clear', (_req: Request, res: Response) => {
    try {
      cacheManager.clear()

      return sendSuccessWithTimestamp(res, {
        message: 'Cache cleared successfully',
      })
    } catch (error) {
      return sendErrorWithTimestamp(res, error instanceof Error ? error : String(error))
    }
  })

  /**
   * POST /api/cache/clean
   * تنظيف Cache من القيم المنتهية الصلاحية
   */
  router.post('/clean', (_req: Request, res: Response) => {
    try {
      const cleanedCount = cacheManager.cleanExpired()

      return sendSuccessWithTimestamp(res, {
        cleanedCount,
        message: `Cleaned ${cleanedCount} expired cache entries`,
      })
    } catch (error) {
      return sendErrorWithTimestamp(res, error instanceof Error ? error : String(error))
    }
  })

  return router
}
