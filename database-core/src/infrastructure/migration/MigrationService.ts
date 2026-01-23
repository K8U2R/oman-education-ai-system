/**
 * MigrationService - خدمة هجرة البيانات
 *
 * أدوات هجرة البيانات مع:
 * - Schema Migrations
 * - Data Transformations
 * - Migration Versioning
 * - Rollback Support
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { logger } from '../../shared/utils/logger'

/**
 * Migration Definition
 */
export interface Migration {
  id: string
  version: string
  name: string
  up: (adapter: IDatabaseAdapter) => Promise<void>
  down: (adapter: IDatabaseAdapter) => Promise<void>
  timestamp: Date
}

/**
 * Migration Status
 */
export interface MigrationStatus {
  id: string
  version: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back'
  timestamp: Date
  duration?: number
  error?: string
}

/**
 * Migration Service
 */
export class MigrationService {
  private readonly adapter: IDatabaseAdapter
  private readonly migrations: Map<string, Migration> = new Map()
  private readonly migrationHistory: Map<string, MigrationStatus> = new Map()

  constructor(adapter: IDatabaseAdapter) {
    this.adapter = adapter
    this.initializeMigrationTable()
  }

  /**
   * تسجيل Migration جديد
   */
  registerMigration(migration: Migration): void {
    this.migrations.set(migration.id, migration)
    logger.info('Migration registered', {
      id: migration.id,
      version: migration.version,
      name: migration.name,
    })
  }

  /**
   * تنفيذ جميع Migrations المعلقة
   */
  async migrate(): Promise<MigrationStatus[]> {
    const pendingMigrations = await this.getPendingMigrations()
    const results: MigrationStatus[] = []

    logger.info('Starting migrations', { count: pendingMigrations.length })

    for (const migration of pendingMigrations) {
      try {
        const status = await this.runMigration(migration, 'up')
        results.push(status)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        logger.error('Migration failed', {
          id: migration.id,
          error: errorMessage,
        })

        const status: MigrationStatus = {
          id: migration.id,
          version: migration.version,
          name: migration.name,
          status: 'failed',
          timestamp: new Date(),
          error: errorMessage,
        }

        this.migrationHistory.set(migration.id, status)
        results.push(status)

        // إيقاف عند فشل Migration
        throw new Error(`Migration failed: ${migration.id} - ${errorMessage}`)
      }
    }

    logger.info('Migrations completed', {
      completed: results.filter(r => r.status === 'completed').length,
      failed: results.filter(r => r.status === 'failed').length,
    })

    return results
  }

  /**
   * Rollback آخر Migration
   */
  async rollback(count: number = 1): Promise<MigrationStatus[]> {
    const completedMigrations = await this.getCompletedMigrations()
    const migrationsToRollback = completedMigrations.slice(-count)
    const results: MigrationStatus[] = []

    logger.info('Starting rollback', { count: migrationsToRollback.length })

    for (const migration of migrationsToRollback) {
      try {
        const status = await this.runMigration(migration, 'down')
        results.push(status)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        logger.error('Rollback failed', {
          id: migration.id,
          error: errorMessage,
        })

        const status: MigrationStatus = {
          id: migration.id,
          version: migration.version,
          name: migration.name,
          status: 'failed',
          timestamp: new Date(),
          error: errorMessage,
        }

        this.migrationHistory.set(migration.id, status)
        results.push(status)

        throw new Error(`Rollback failed: ${migration.id} - ${errorMessage}`)
      }
    }

    logger.info('Rollback completed', {
      completed: results.filter(r => r.status === 'rolled_back').length,
      failed: results.filter(r => r.status === 'failed').length,
    })

    return results
  }

  /**
   * الحصول على حالة Migrations
   */
  async getMigrationStatus(): Promise<{
    total: number
    completed: number
    pending: number
    failed: number
    migrations: MigrationStatus[]
  }> {
    await this.loadMigrationHistory()

    const migrations = Array.from(this.migrationHistory.values())
    const completed = migrations.filter(m => m.status === 'completed').length
    const pending = migrations.filter(m => m.status === 'pending').length
    const failed = migrations.filter(m => m.status === 'failed').length

    return {
      total: this.migrations.size,
      completed,
      pending,
      failed,
      migrations: migrations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    }
  }

  /**
   * الحصول على Migrations المعلقة
   */
  private async getPendingMigrations(): Promise<Migration[]> {
    await this.loadMigrationHistory()

    const completedIds = new Set(
      Array.from(this.migrationHistory.values())
        .filter(m => m.status === 'completed')
        .map(m => m.id)
    )

    return Array.from(this.migrations.values())
      .filter(m => !completedIds.has(m.id))
      .sort((a, b) => a.version.localeCompare(b.version))
  }

  /**
   * الحصول على Migrations المكتملة
   */
  private async getCompletedMigrations(): Promise<Migration[]> {
    await this.loadMigrationHistory()

    const completedIds = Array.from(this.migrationHistory.values())
      .filter(m => m.status === 'completed')
      .map(m => m.id)

    return Array.from(this.migrations.values())
      .filter(m => completedIds.includes(m.id))
      .sort((a, b) => b.version.localeCompare(a.version))
  }

  /**
   * تنفيذ Migration
   */
  private async runMigration(
    migration: Migration,
    direction: 'up' | 'down'
  ): Promise<MigrationStatus> {
    const startTime = Date.now()

    const status: MigrationStatus = {
      id: migration.id,
      version: migration.version,
      name: migration.name,
      status: 'running',
      timestamp: new Date(),
    }

    this.migrationHistory.set(migration.id, status)

    try {
      logger.info(`Running migration: ${direction}`, {
        id: migration.id,
        version: migration.version,
        name: migration.name,
      })

      if (direction === 'up') {
        await migration.up(this.adapter)
        status.status = 'completed'
      } else {
        await migration.down(this.adapter)
        status.status = 'rolled_back'
      }

      const duration = Date.now() - startTime
      status.duration = duration

      this.migrationHistory.set(migration.id, status)
      await this.saveMigrationStatus(status)

      logger.info(`Migration ${direction} completed`, {
        id: migration.id,
        duration,
      })

      return status
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      status.status = 'failed'
      status.error = errorMessage
      status.duration = Date.now() - startTime

      this.migrationHistory.set(migration.id, status)
      await this.saveMigrationStatus(status)

      throw error
    }
  }

  // Helper Methods

  private async initializeMigrationTable(): Promise<void> {
    try {
      // محاولة إنشاء جدول migrations إذا لم يكن موجوداً
      // ملاحظة: Supabase لا يدعم executeRaw مباشرة، لذلك نستخدم insert مع ignore errors
      // أو نستخدم RPC function إذا كان متاحاً

      // محاولة استخدام executeRaw أولاً (يعمل مع PostgreSQL و MySQL)
      try {
        await this.adapter.executeRaw(
          `CREATE TABLE IF NOT EXISTS migrations (
            id VARCHAR(255) PRIMARY KEY,
            version VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            status VARCHAR(50) NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            duration INTEGER,
            error TEXT
          )`,
          {}
        )
      } catch (rawError) {
        // إذا فشل executeRaw (مثل Supabase)، نحاول إنشاء الجدول عبر insert
        // نتحقق أولاً من وجود الجدول
        try {
          await this.adapter.findOne('migrations', { id: '__schema_check__' })
        } catch {
          // الجدول غير موجود، لكن لا يمكننا إنشاؤه عبر Supabase مباشرة
          // يجب إنشاء الجدول يدوياً في Supabase Dashboard أو عبر migration SQL
          logger.warn(
            'Migration table does not exist and cannot be created automatically. Please create it manually in Supabase.',
            {
              error: rawError instanceof Error ? rawError.message : String(rawError),
            }
          )
        }
      }
    } catch (error) {
      logger.warn('Failed to initialize migration table', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  private async loadMigrationHistory(): Promise<void> {
    try {
      const migrations = await this.adapter.find<MigrationStatus>('migrations', {})

      for (const migration of migrations) {
        this.migrationHistory.set(migration.id, {
          ...migration,
          timestamp: new Date(migration.timestamp),
        })
      }
    } catch (error) {
      logger.warn('Failed to load migration history', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  private async saveMigrationStatus(status: MigrationStatus): Promise<void> {
    try {
      const existing = await this.adapter.findOne('migrations', { id: status.id })

      if (existing) {
        await this.adapter.update(
          'migrations',
          { id: status.id },
          {
            status: status.status,
            timestamp: status.timestamp,
            duration: status.duration,
            error: status.error,
          }
        )
      } else {
        await this.adapter.insert('migrations', {
          id: status.id,
          version: status.version,
          name: status.name,
          status: status.status,
          timestamp: status.timestamp,
          duration: status.duration,
          error: status.error,
        })
      }
    } catch (error) {
      logger.warn('Failed to save migration status', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
}
