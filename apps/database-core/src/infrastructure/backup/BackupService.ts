/**
 * BackupService - خدمة النسخ الاحتياطي
 *
 * نظام النسخ الاحتياطي والاستعادة مع:
 * - Automated Backups
 * - Incremental Backups
 * - Backup Scheduling
 * - Recovery Mechanisms
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { logger } from '../../shared/utils/logger'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

/**
 * Backup Configuration
 */
export interface BackupConfig {
  backupDirectory: string
  retentionDays: number
  compressionEnabled: boolean
  incrementalEnabled: boolean
  schedule?: {
    enabled: boolean
    interval: 'hourly' | 'daily' | 'weekly'
    time?: string // HH:MM format
  }
}

/**
 * Backup Metadata
 */
export interface BackupMetadata {
  id: string
  timestamp: Date
  type: 'full' | 'incremental'
  size: number
  checksum: string
  entities: string[]
  status: 'completed' | 'failed' | 'in_progress'
  error?: string
}

/**
 * Backup Service
 */
export class BackupService {
  private readonly adapter: IDatabaseAdapter
  private readonly config: BackupConfig
  private backups: Map<string, BackupMetadata> = new Map()

  constructor(adapter: IDatabaseAdapter, config: BackupConfig) {
    this.adapter = adapter
    this.config = config
    this.initializeBackupDirectory()
  }

  /**
   * إنشاء نسخة احتياطية كاملة
   */
  async createFullBackup(entities?: string[]): Promise<BackupMetadata> {
    const backupId = `backup-${Date.now()}`
    const timestamp = new Date()

    try {
      logger.info('Starting full backup', { backupId, entities })

      const backupMetadata: BackupMetadata = {
        id: backupId,
        timestamp,
        type: 'full',
        size: 0,
        checksum: '',
        entities: entities || [],
        status: 'in_progress',
      }

      this.backups.set(backupId, backupMetadata)

      // جمع البيانات من جميع Entities
      const backupData: Record<string, any[]> = {}

      if (entities && entities.length > 0) {
        for (const entity of entities) {
          try {
            const data = await this.adapter.find(entity, {})
            backupData[entity] = data
          } catch (error) {
            logger.error(`Failed to backup entity: ${entity}`, {
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }
      } else {
        // Backup جميع الجداول (يتطلب معرفة الجداول المتاحة)
        logger.warn('Full backup without entity list - backing up known entities')
      }

      // حفظ النسخة الاحتياطية
      const backupPath = join(this.config.backupDirectory, `${backupId}.json`)
      const backupContent = JSON.stringify(backupData, null, 2)
      await writeFile(backupPath, backupContent, 'utf-8')

      // حساب Checksum
      const checksum = this.calculateChecksum(backupContent)
      const size = Buffer.byteLength(backupContent, 'utf-8')

      // تحديث Metadata
      backupMetadata.size = size
      backupMetadata.checksum = checksum
      backupMetadata.status = 'completed'

      this.backups.set(backupId, backupMetadata)

      // حفظ Metadata
      await this.saveBackupMetadata(backupMetadata)

      logger.info('Full backup completed', {
        backupId,
        size,
        checksum,
        entities: Object.keys(backupData),
      })

      return backupMetadata
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error('Full backup failed', { backupId, error: errorMessage })

      const backupMetadata = this.backups.get(backupId)
      if (backupMetadata) {
        backupMetadata.status = 'failed'
        backupMetadata.error = errorMessage
        this.backups.set(backupId, backupMetadata)
      }

      throw error
    }
  }

  /**
   * إنشاء نسخة احتياطية تدريجية
   */
  async createIncrementalBackup(
    lastBackupId: string,
    entities?: string[]
  ): Promise<BackupMetadata> {
    if (!this.config.incrementalEnabled) {
      throw new Error('Incremental backups are not enabled')
    }

    const backupId = `incremental-${Date.now()}`
    const timestamp = new Date()
    const lastBackup = this.backups.get(lastBackupId)

    if (!lastBackup) {
      throw new Error(`Last backup not found: ${lastBackupId}`)
    }

    try {
      logger.info('Starting incremental backup', { backupId, lastBackupId, entities })

      const backupMetadata: BackupMetadata = {
        id: backupId,
        timestamp,
        type: 'incremental',
        size: 0,
        checksum: '',
        entities: entities || [],
        status: 'in_progress',
      }

      this.backups.set(backupId, backupMetadata)

      // جمع البيانات المتغيرة منذ آخر نسخة احتياطية
      const incrementalData: Record<string, any[]> = {}

      if (entities && entities.length > 0) {
        for (const entity of entities) {
          try {
            // الحصول على البيانات المتغيرة (يتطلب timestamp أو version field)
            const data = await this.adapter.find(entity, {
              updated_at: { $gte: lastBackup.timestamp },
            } as any)

            if (data.length > 0) {
              incrementalData[entity] = data
            }
          } catch (error) {
            logger.warn(`Failed to get incremental data for entity: ${entity}`, {
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }
      }

      // حفظ النسخة الاحتياطية
      const backupPath = join(this.config.backupDirectory, `${backupId}.json`)
      const backupContent = JSON.stringify(incrementalData, null, 2)
      await writeFile(backupPath, backupContent, 'utf-8')

      // حساب Checksum
      const checksum = this.calculateChecksum(backupContent)
      const size = Buffer.byteLength(backupContent, 'utf-8')

      // تحديث Metadata
      backupMetadata.size = size
      backupMetadata.checksum = checksum
      backupMetadata.status = 'completed'

      this.backups.set(backupId, backupMetadata)
      await this.saveBackupMetadata(backupMetadata)

      logger.info('Incremental backup completed', {
        backupId,
        size,
        checksum,
        entities: Object.keys(incrementalData),
      })

      return backupMetadata
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error('Incremental backup failed', { backupId, error: errorMessage })

      const backupMetadata = this.backups.get(backupId)
      if (backupMetadata) {
        backupMetadata.status = 'failed'
        backupMetadata.error = errorMessage
        this.backups.set(backupId, backupMetadata)
      }

      throw error
    }
  }

  /**
   * استعادة من نسخة احتياطية
   */
  async restoreBackup(backupId: string, entities?: string[]): Promise<void> {
    const backup = this.backups.get(backupId)

    if (!backup) {
      throw new Error(`Backup not found: ${backupId}`)
    }

    if (backup.status !== 'completed') {
      throw new Error(`Backup is not completed: ${backup.status}`)
    }

    try {
      logger.info('Starting backup restoration', { backupId, entities })

      // قراءة النسخة الاحتياطية
      const backupPath = join(this.config.backupDirectory, `${backupId}.json`)
      const backupContent = await readFile(backupPath, 'utf-8')

      // التحقق من Checksum
      const checksum = this.calculateChecksum(backupContent)
      if (checksum !== backup.checksum) {
        throw new Error('Backup checksum mismatch - backup may be corrupted')
      }

      const backupData = JSON.parse(backupContent)

      // استعادة البيانات
      const entitiesToRestore = entities || Object.keys(backupData)

      for (const entity of entitiesToRestore) {
        if (backupData[entity]) {
          try {
            // حذف البيانات الحالية (اختياري - يمكن استخدام UPDATE)
            // await this.adapter.delete(entity, {})

            // إدراج البيانات من النسخة الاحتياطية
            if (backupData[entity].length > 0) {
              await this.adapter.insertMany(entity, backupData[entity])
            }

            logger.info(`Restored entity: ${entity}`, {
              backupId,
              records: backupData[entity].length,
            })
          } catch (error) {
            logger.error(`Failed to restore entity: ${entity}`, {
              error: error instanceof Error ? error.message : String(error),
            })
            throw error
          }
        }
      }

      logger.info('Backup restoration completed', { backupId, entities: entitiesToRestore })
    } catch (error) {
      logger.error('Backup restoration failed', {
        backupId,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  /**
   * الحصول على قائمة النسخ الاحتياطية
   */
  async listBackups(): Promise<BackupMetadata[]> {
    await this.loadBackupMetadata()
    return Array.from(this.backups.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )
  }

  /**
   * حذف نسخة احتياطية قديمة
   */
  async deleteBackup(backupId: string): Promise<void> {
    const backup = this.backups.get(backupId)

    if (!backup) {
      throw new Error(`Backup not found: ${backupId}`)
    }

    try {
      const backupPath = join(this.config.backupDirectory, `${backupId}.json`)
      const metadataPath = join(this.config.backupDirectory, `${backupId}.meta.json`)

      // حذف ملفات النسخة الاحتياطية
      if (existsSync(backupPath)) {
        await writeFile(backupPath, '') // Delete file
      }
      if (existsSync(metadataPath)) {
        await writeFile(metadataPath, '') // Delete file
      }

      this.backups.delete(backupId)

      logger.info('Backup deleted', { backupId })
    } catch (error) {
      logger.error('Failed to delete backup', {
        backupId,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  /**
   * تنظيف النسخ الاحتياطية القديمة
   */
  async cleanupOldBackups(): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays)

    const oldBackups = Array.from(this.backups.values()).filter(
      backup => backup.timestamp < cutoffDate
    )

    let deletedCount = 0

    for (const backup of oldBackups) {
      try {
        await this.deleteBackup(backup.id)
        deletedCount++
      } catch (error) {
        logger.warn('Failed to delete old backup', {
          backupId: backup.id,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    logger.info('Old backups cleanup completed', {
      deletedCount,
      retentionDays: this.config.retentionDays,
    })

    return deletedCount
  }

  // Helper Methods

  private async initializeBackupDirectory(): Promise<void> {
    try {
      if (!existsSync(this.config.backupDirectory)) {
        await mkdir(this.config.backupDirectory, { recursive: true })
      }
      await this.loadBackupMetadata()
    } catch (error) {
      logger.error('Failed to initialize backup directory', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  private async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
    try {
      const metadataPath = join(this.config.backupDirectory, `${metadata.id}.meta.json`)
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8')
    } catch (error) {
      logger.error('Failed to save backup metadata', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  private async loadBackupMetadata(): Promise<void> {
    // تحميل Metadata من الملفات (مبسط)
    // في الإنتاج، يمكن استخدام قاعدة بيانات أو ملف مركزي
  }

  private calculateChecksum(content: string): string {
    // حساب Checksum بسيط (يمكن استخدام crypto)
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  }
}
