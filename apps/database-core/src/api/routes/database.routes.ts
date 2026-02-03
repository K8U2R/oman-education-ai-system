import { Router } from 'express'
import { DatabaseCoreService } from '@/application/services/DatabaseCoreService'
import { DatabaseRequestSchema } from '@/api/contracts/DatabaseRequest'
import { DatabaseResponse, createSuccessResponse } from '@/api/contracts/DatabaseResponse'
import { asyncRouteHandlerManual } from '../../presentation/api/utils/route-handler.util'

/**
 * createDatabaseRoutes - إنشاء مسارات API لقاعدة البيانات
 */
export function createDatabaseRoutes(databaseService: DatabaseCoreService): Router {
  const router = Router()

  /**
   * POST /api/database/execute
   * تنفيذ عملية على قاعدة البيانات
   */
  router.post(
    '/execute',
    asyncRouteHandlerManual(async (req, res): Promise<void> => {
      // التحقق من البيانات
      const validatedData = DatabaseRequestSchema.parse(req.body)

      // تنفيذ العملية
      const result = await databaseService.executeOperation(validatedData)

      const response: DatabaseResponse = createSuccessResponse(result)

      // Ensure UTF-8 encoding in response
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.json(response)
    })
  )

  /**
   * GET /api/database/health
   * فحص صحة الخدمة
   */
  router.get('/health', (_req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.charset = 'utf-8'
    res.json({
      success: true,
      status: 'healthy',
      service: 'database-core',
      timestamp: new Date().toISOString(),
    })
  })

  return router
}
