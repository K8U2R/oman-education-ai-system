import { Router } from 'express'
import { DatabaseCoreService } from '../../../application/services/DatabaseCoreService'
import { DatabaseHandler, HealthHandler } from '../handlers'
import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import { validationMiddleware } from '../middleware/validation.middleware'
import { DatabaseRequestSchema } from '../contracts/DatabaseRequest'
import { asyncRouteHandlerManual } from '../utils/route-handler.util'

/**
 * createDatabaseRoutes - إنشاء مسارات API لقاعدة البيانات
 */
export function createDatabaseRoutes(
  databaseService: DatabaseCoreService,
  databaseAdapter: IDatabaseAdapter
): Router {
  const router = Router()
  const databaseHandler = new DatabaseHandler(databaseService)
  const healthHandler = new HealthHandler(databaseAdapter)

  /**
   * POST /api/database/execute
   * تنفيذ عملية على قاعدة البيانات
   */
  router.post(
    '/execute',
    validationMiddleware(DatabaseRequestSchema),
    asyncRouteHandlerManual(async (req, res) => {
      await databaseHandler.executeOperation(req, res)
    })
  )

  /**
   * GET /api/database/health
   * فحص صحة الخدمة
   */
  router.get(
    '/health',
    asyncRouteHandlerManual(async (req, res) => {
      await healthHandler.checkHealth(req, res)
    })
  )

  return router
}
