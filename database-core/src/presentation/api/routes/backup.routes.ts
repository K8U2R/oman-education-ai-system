/**
 * Backup Routes - مسارات النسخ الاحتياطي
 *
 * مسارات API للـ Backup & Recovery
 */

import { Router, Request } from 'express'
import { BackupService } from '../../../infrastructure/backup/BackupService'
import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import { asyncRouteHandler } from '../utils/route-handler.util'

/**
 * إنشاء Routes لـ Backup Service
 */
export function createBackupRoutes(adapter: IDatabaseAdapter): Router {
  const router = Router()

  // Initialize Backup Service
  const backupService = new BackupService(adapter, {
    backupDirectory: process.env.BACKUP_DIRECTORY || './backups',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
    compressionEnabled: process.env.BACKUP_COMPRESSION !== 'false',
    incrementalEnabled: process.env.BACKUP_INCREMENTAL !== 'false',
    schedule: {
      enabled: process.env.BACKUP_SCHEDULE_ENABLED === 'true',
      interval: (process.env.BACKUP_SCHEDULE_INTERVAL as 'hourly' | 'daily' | 'weekly') || 'daily',
      time: process.env.BACKUP_SCHEDULE_TIME,
    },
  })

  /**
   * POST /create
   * إنشاء نسخة احتياطية كاملة
   */
  router.post(
    '/create',
    asyncRouteHandler(async (req: Request) => {
      const { entities } = req.body as { entities?: string[] }
      return await backupService.createFullBackup(entities)
    })
  )

  /**
   * POST /create-incremental
   * إنشاء نسخة احتياطية تدريجية
   */
  router.post(
    '/create-incremental',
    asyncRouteHandler(async (req: Request) => {
      const { lastBackupId, entities } = req.body as { lastBackupId?: string; entities?: string[] }
      if (!lastBackupId) {
        throw new Error('lastBackupId is required')
      }
      return await backupService.createIncrementalBackup(lastBackupId, entities)
    })
  )

  /**
   * POST /restore/:backupId
   * استعادة من نسخة احتياطية
   */
  router.post(
    '/restore/:backupId',
    asyncRouteHandler(async (req: Request) => {
      const { backupId } = req.params
      const { entities } = req.body as { entities?: string[] }
      await backupService.restoreBackup(backupId, entities)
      return {
        message: 'Backup restored successfully',
        backupId,
      }
    })
  )

  /**
   * GET /list
   * الحصول على قائمة النسخ الاحتياطية
   */
  router.get(
    '/list',
    asyncRouteHandler(async () => {
      return await backupService.listBackups()
    })
  )

  /**
   * DELETE /:backupId
   * حذف نسخة احتياطية
   */
  router.delete(
    '/:backupId',
    asyncRouteHandler(async (req: Request) => {
      const { backupId } = req.params
      await backupService.deleteBackup(backupId)
      return {
        message: 'Backup deleted successfully',
        backupId,
      }
    })
  )

  /**
   * POST /cleanup
   * تنظيف النسخ الاحتياطية القديمة
   */
  router.post(
    '/cleanup',
    asyncRouteHandler(async () => {
      const deletedCount = await backupService.cleanupOldBackups()
      return {
        message: 'Old backups cleaned up successfully',
        deletedCount,
      }
    })
  )

  return router
}
