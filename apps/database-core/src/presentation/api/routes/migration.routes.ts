/**
 * Migration Routes - مسارات هجرة البيانات
 *
 * مسارات API للـ Data Migration
 */

import { Router, Request } from 'express'
import { MigrationService } from '../../../infrastructure/migration/MigrationService'
import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import type { Migration } from '../../../infrastructure/migration/MigrationService'
import { asyncRouteHandler } from '../utils/route-handler.util'

/**
 * إنشاء Routes لـ Migration Service
 */
export function createMigrationRoutes(adapter: IDatabaseAdapter): Router {
  const router = Router()
  const migrationService = new MigrationService(adapter)

  /**
   * POST /register
   * تسجيل Migration جديد
   */
  router.post(
    '/register',
    asyncRouteHandler(async (req: Request) => {
      const migrationData = req.body as Partial<Migration>

      if (!migrationData.id || !migrationData.version || !migrationData.name) {
        throw new Error('id, version, and name are required')
      }

      // Note: في الإنتاج، يجب تحويل up/down من strings إلى functions
      // هذا مثال مبسط - في الإنتاج يجب استخدام migration files
      migrationService.registerMigration({
        id: migrationData.id,
        version: migrationData.version,
        name: migrationData.name,
        up: migrationData.up || (async () => {}),
        down: migrationData.down || (async () => {}),
        timestamp: migrationData.timestamp || new Date(),
      })

      return {
        message: 'Migration registered successfully',
        migrationId: migrationData.id,
      }
    })
  )

  /**
   * POST /migrate
   * تنفيذ جميع Migrations المعلقة
   */
  router.post(
    '/migrate',
    asyncRouteHandler(async () => {
      const results = await migrationService.migrate()
      return {
        message: 'Migrations completed',
        ...results,
      }
    })
  )

  /**
   * POST /rollback
   * Rollback آخر Migration
   */
  router.post(
    '/rollback',
    asyncRouteHandler(async (req: Request) => {
      const { count } = req.body as { count?: number }
      const rollbackCount = count || 1

      const results = await migrationService.rollback(rollbackCount)

      return {
        message: 'Rollback completed',
        ...results,
      }
    })
  )

  /**
   * GET /status
   * الحصول على حالة Migrations
   */
  router.get(
    '/status',
    asyncRouteHandler(async () => {
      return await migrationService.getMigrationStatus()
    })
  )

  return router
}
