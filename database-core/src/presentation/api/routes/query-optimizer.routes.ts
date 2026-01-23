/**
 * Query Optimizer Routes - مسارات محسّن الاستعلامات المتقدم
 *
 * مسارات API للـ Advanced Query Optimization
 */

import { Router, Request } from 'express'
import { AdvancedQueryOptimizer } from '../../../application/services/AdvancedQueryOptimizer'
import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import { asyncRouteHandler } from '../utils/route-handler.util'

/**
 * إنشاء Routes لـ Advanced Query Optimizer
 */
export function createQueryOptimizerRoutes(adapter: IDatabaseAdapter): Router {
  const router = Router()
  const optimizer = new AdvancedQueryOptimizer(adapter)

  /**
   * POST /analyze
   * تحليل خطة تنفيذ استعلام
   */
  router.post(
    '/analyze',
    asyncRouteHandler(async (req: Request) => {
      const { query, entity } = req.body as { query?: string; entity?: string }
      if (!query) {
        throw new Error('Query is required')
      }
      return await optimizer.analyzeQueryPlan(query, entity || 'unknown')
    })
  )

  /**
   * GET /recommendations/:entity
   * الحصول على توصيات الفهارس لـ entity معين
   */
  router.get(
    '/recommendations/:entity',
    asyncRouteHandler(async (req: Request) => {
      const { entity } = req.params
      return await optimizer.generateIndexRecommendations(entity)
    })
  )

  /**
   * POST /suggest-rewrite
   * اقتراح إعادة كتابة استعلام
   */
  router.post(
    '/suggest-rewrite',
    asyncRouteHandler(async (req: Request) => {
      const { query } = req.body as { query?: string }
      if (!query) {
        throw new Error('Query is required')
      }
      return optimizer.suggestQueryRewrite(query)
    })
  )

  /**
   * POST /record
   * تسجيل استعلام للتحليل
   */
  router.post(
    '/record',
    asyncRouteHandler(async (req: Request) => {
      const { query, duration } = req.body as { query?: string; duration?: number }
      if (!query || duration === undefined) {
        throw new Error('Query and duration are required')
      }
      optimizer.recordQuery(query, duration)
      return { message: 'Query performance recorded' }
    })
  )

  /**
   * GET /performance/:entity?
   * تحليل أداء الاستعلامات
   */
  router.get(
    '/performance/:entity?',
    asyncRouteHandler(async (req: Request) => {
      const { entity } = req.params
      return optimizer.analyzeQueryPerformance(entity)
    })
  )

  return router
}
