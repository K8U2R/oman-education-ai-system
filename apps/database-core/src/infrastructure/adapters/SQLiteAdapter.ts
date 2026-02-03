/**
 * SQLiteAdapter - محول SQLite
 *
 * تنفيذ واجهة IDatabaseAdapter باستخدام SQLite
 * Note: SQLite هو file-based database
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import {
  ITransactionAdapter,
  type TransactionInfo,
  type TransactionOptions,
  type SavepointInfo,
} from '../../domain/interfaces/ITransactionAdapter'
import { logger } from '../../shared/utils/logger'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import type { SQLiteDatabaseClient, DatabaseClient } from '../../domain/types/database-client.types'
import {
  buildSelectQuery,
  escapeIdentifier as escapeIdentifierUtil,
} from './utils/query-builder.util'

// Dynamic import لتجنب مشاكل التبعيات (better-sqlite3 يحتاج Visual Studio Build Tools)
// Type definition for better-sqlite3 Database
interface BetterSQLite3Database {
  new (path: string, options?: { readonly?: boolean; timeout?: number }): SQLiteDatabaseClient
}

let Database: BetterSQLite3Database | null = null

// تحميل better-sqlite3 بشكل متزامن (للتوافق مع الكود الحالي والاختبارات)
// استخدام require للسماح للـ mocks بالعمل في الاختبارات
// Note: في بيئة الاختبار، سيتم استخدام mock من vitest
try {
  // Dynamic require للسماح للـ mocks بالعمل
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const sqlite3Module = require('better-sqlite3')
  Database = sqlite3Module.default || sqlite3Module
} catch (error) {
  logger.warn(
    'better-sqlite3 not available at load time. SQLiteAdapter will not work without installing better-sqlite3 and Visual Studio Build Tools.'
  )
}

/**
 * معلومات المعاملة الداخلية
 */
interface InternalTransactionInfo {
  startedAt: Date
  isolationLevel?: string
  timeout?: number
  readOnly?: boolean
  savepoints: Map<string, SavepointInfo>
}

/**
 * محول SQLite
 */
export class SQLiteAdapter implements IDatabaseAdapter, ITransactionAdapter {
  private db: SQLiteDatabaseClient
  private transactions: Map<string, InternalTransactionInfo> = new Map()
  private readonly databasePath: string
  private readonly readOnly: boolean

  constructor(config: {
    database: string // Path to database file
    readOnly?: boolean
    timeout?: number
  }) {
    // محاولة تحميل Database إذا لم يكن محملاً
    if (!Database) {
      // محاولة تحميل متزامن أولاً (للاختبارات)
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        Database = require('better-sqlite3')
      } catch {
        // إذا فشل، سيتم استخدام dynamic import لاحقاً
      }
    }

    if (!Database) {
      throw new Error(
        'better-sqlite3 is not installed. Please install it with: npm install better-sqlite3\n' +
          'Note: better-sqlite3 requires Visual Studio Build Tools with "Desktop development with C++" workload on Windows.'
      )
    }

    this.databasePath = config.database
    this.readOnly = config.readOnly ?? false

    // إنشاء المجلد إذا لم يكن موجوداً
    const dbDir = dirname(this.databasePath)
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true })
    }

    // إنشاء/فتح قاعدة البيانات
    this.db = new Database(this.databasePath, {
      readonly: this.readOnly,
      timeout: config.timeout || 5000,
    })

    // تفعيل Foreign Keys
    this.db.pragma('foreign_keys = ON')

    logger.info('SQLite adapter initialized', {
      database: this.databasePath,
      readOnly: this.readOnly,
    })
  }

  /**
   * البحث عن سجلات
   */
  async find<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
    options?: {
      limit?: number
      offset?: number
      orderBy?: { column: string; direction: 'asc' | 'desc' }
    }
  ): Promise<T[]> {
    try {
      // استخدام Query Builder Utility
      const { query, params } = buildSelectQuery(
        entity,
        conditions,
        options,
        () => '?' // SQLite uses ? placeholders
      )

      const stmt = this.db.prepare(query)
      const rows = stmt.all(...params)

      return rows as T[]
    } catch (error) {
      logger.error('SQLite find error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `SQLite query error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * البحث عن سجل واحد
   */
  async findOne<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>
  ): Promise<T | null> {
    const results = await this.find<T>(entity, conditions, { limit: 1 })
    return results[0] || null
  }

  /**
   * إدراج سجل جديد
   */
  async insert<T = unknown>(entity: string, data: Record<string, unknown>): Promise<T> {
    try {
      const columns = Object.keys(data)
      const values = Object.values(data)
      const placeholders = columns.map(() => '?').join(', ')

      const query = `
        INSERT INTO ${this.escapeIdentifier(entity)} (${columns.map(c => this.escapeIdentifier(c)).join(', ')})
        VALUES (${placeholders})
      `

      const stmt = this.db.prepare(query)
      const result = stmt.run(...values)

      // الحصول على السجل المُدرج
      const inserted = await this.findOne<T>(entity, { id: result.lastInsertRowid } as Record<
        string,
        unknown
      >)

      return inserted || (data as T)
    } catch (error) {
      logger.error('SQLite insert error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `SQLite insert error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * إدراج عدة سجلات
   */
  async insertMany<T = unknown>(entity: string, data: Record<string, unknown>[]): Promise<T[]> {
    if (data.length === 0) {
      return []
    }

    try {
      const columns = Object.keys(data[0])
      const placeholders = columns.map(() => '?').join(', ')
      const values: unknown[] = []

      for (const row of data) {
        values.push(...Object.values(row))
      }

      const valuesPlaceholders = data.map(() => `(${placeholders})`).join(', ')

      const query = `
        INSERT INTO ${this.escapeIdentifier(entity)} (${columns.map(c => this.escapeIdentifier(c)).join(', ')})
        VALUES ${valuesPlaceholders}
      `

      const stmt = this.db.prepare(query)
      stmt.run(...values)

      // الحصول على السجلات المُدرجة
      const lastId = this.db.prepare('SELECT last_insert_rowid() as id').get() as
        | { id?: number }
        | undefined
      const insertedIds = Array.from(
        { length: data.length },
        (_, i) => (lastId?.id || 0) - data.length + i + 1
      )
      const results: T[] = []

      for (const id of insertedIds) {
        const inserted = await this.findOne<T>(entity, { id } as Record<string, unknown>)
        if (inserted) {
          results.push(inserted)
        }
      }

      return results.length > 0 ? results : (data as T[])
    } catch (error) {
      logger.error('SQLite insertMany error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `SQLite insertMany error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * تحديث سجلات
   */
  async update<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<T> {
    try {
      const updateColumns = Object.keys(data)
      const updateValues = Object.values(data)
      const updatePlaceholders = updateColumns
        .map(col => `${this.escapeIdentifier(col)} = ?`)
        .join(', ')

      const whereConditions: string[] = []
      const params: unknown[] = [...updateValues]

      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          whereConditions.push(`${this.escapeIdentifier(key)} = ?`)
          params.push(value)
        }
      }

      if (whereConditions.length === 0) {
        throw new Error('Update conditions are required')
      }

      const query = `
        UPDATE ${this.escapeIdentifier(entity)}
        SET ${updatePlaceholders}
        WHERE ${whereConditions.join(' AND ')}
      `

      const stmt = this.db.prepare(query)
      stmt.run(...params)

      // الحصول على السجل المحدث
      const updated = await this.findOne<T>(entity, conditions)

      if (!updated) {
        throw new Error('No records updated')
      }

      return updated
    } catch (error) {
      logger.error('SQLite update error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `SQLite update error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * عد السجلات المطابقة لشروط معينة
   */
  async count(entity: string, conditions: Record<string, unknown> = {}): Promise<number> {
    try {
      let query = `SELECT COUNT(*) as count FROM ${this.escapeIdentifier(entity)}`
      const params: unknown[] = []

      const whereConditions: string[] = []
      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          whereConditions.push(`${this.escapeIdentifier(key)} = ?`)
          params.push(value)
        }
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`
      }

      const stmt = this.db.prepare(query)
      const result = stmt.get(...params) as { count: number }

      return result.count || 0
    } catch (error) {
      logger.error('SQLite count error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `SQLite count error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * حذف سجلات
   */
  async delete(
    entity: string,
    conditions: Record<string, unknown>,
    soft: boolean = true
  ): Promise<boolean> {
    try {
      if (soft) {
        // Soft delete - تحديث deleted_at
        await this.update(entity, conditions, { deleted_at: new Date().toISOString() })
        return true
      }

      // Hard delete
      const whereConditions: string[] = []
      const params: unknown[] = []

      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          whereConditions.push(`${this.escapeIdentifier(key)} = ?`)
          params.push(value)
        }
      }

      if (whereConditions.length === 0) {
        throw new Error('Delete conditions are required')
      }

      const query = `
        DELETE FROM ${this.escapeIdentifier(entity)}
        WHERE ${whereConditions.join(' AND ')}
      `

      const stmt = this.db.prepare(query)
      const result = stmt.run(...params)

      return result.changes > 0
    } catch (error) {
      logger.error('SQLite delete error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `SQLite delete error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * تنفيذ استعلام خام
   */
  async executeRaw<T = unknown>(query: string, params?: Record<string, unknown>): Promise<T> {
    try {
      // تحويل named parameters إلى positional parameters
      const positionalParams: unknown[] = []
      let processedQuery = query

      if (params) {
        for (const [key, value] of Object.entries(params)) {
          const placeholder = `:${key}`
          if (processedQuery.includes(placeholder)) {
            processedQuery = processedQuery.replace(new RegExp(`:${key}`, 'g'), '?')
            positionalParams.push(value)
          }
        }
      }

      const stmt = this.db.prepare(processedQuery)
      const rows = stmt.all(...positionalParams)

      return rows as T
    } catch (error) {
      logger.error('SQLite executeRaw error', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `SQLite executeRaw error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * فحص صحة الاتصال
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = this.db.prepare('SELECT 1').get()
      return result !== null
    } catch {
      return false
    }
  }

  /**
   * إغلاق قاعدة البيانات
   */
  async close(): Promise<void> {
    // إغلاق جميع المعاملات المفتوحة
    for (const [transactionId] of this.transactions.entries()) {
      try {
        await this.rollbackTransaction(transactionId)
        logger.warn('Transaction rolled back on close', { transactionId })
      } catch (error) {
        logger.error('Error rolling back transaction on close', {
          transactionId,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
    this.transactions.clear()

    this.db.close()
    logger.info('SQLite database closed')
  }

  // ITransactionAdapter Implementation

  /**
   * التحقق من دعم المعاملات
   */
  supportsTransactions(): boolean {
    return true // SQLite يدعم Transactions
  }

  /**
   * بدء معاملة جديدة
   */
  async beginTransaction(options?: TransactionOptions): Promise<string> {
    const transactionId = `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`

    try {
      // SQLite يدعم BEGIN TRANSACTION
      this.db.exec('BEGIN TRANSACTION')

      // حفظ معلومات المعاملة
      this.transactions.set(transactionId, {
        startedAt: new Date(),
        isolationLevel: options?.isolationLevel,
        timeout: options?.timeout,
        readOnly: options?.readOnly,
        savepoints: new Map(),
      })

      logger.info('Transaction started', {
        transactionId,
        isolationLevel: options?.isolationLevel,
      })

      return transactionId
    } catch (error) {
      logger.error('Failed to start transaction', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `Failed to start transaction: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * تأكيد المعاملة
   */
  async commitTransaction(transactionId: string): Promise<void> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    try {
      this.db.exec('COMMIT')
      this.transactions.delete(transactionId)

      logger.info('Transaction committed', {
        transactionId,
        duration: Date.now() - transaction.startedAt.getTime(),
      })
    } catch (error) {
      this.transactions.delete(transactionId)
      logger.error('Failed to commit transaction', {
        transactionId,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `Failed to commit transaction: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * إلغاء المعاملة
   */
  async rollbackTransaction(transactionId: string): Promise<void> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    try {
      this.db.exec('ROLLBACK')
      this.transactions.delete(transactionId)

      logger.info('Transaction rolled back', {
        transactionId,
        duration: Date.now() - transaction.startedAt.getTime(),
      })
    } catch (error) {
      this.transactions.delete(transactionId)
      logger.error('Failed to rollback transaction', {
        transactionId,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `Failed to rollback transaction: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * الحصول على معلومات المعاملة
   */
  async getTransactionInfo(transactionId: string): Promise<TransactionInfo | null> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      return null
    }

    return {
      id: transactionId,
      status: 'pending',
      startedAt: transaction.startedAt,
      isolationLevel: transaction.isolationLevel,
      timeout: transaction.timeout,
      readOnly: transaction.readOnly,
    }
  }

  /**
   * تنفيذ عملية داخل معاملة
   */
  async executeInTransaction<T>(
    transactionId: string,
    operation: (client: DatabaseClient) => Promise<T>
  ): Promise<T> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    return await operation(this.db)
  }

  /**
   * دعم Nested Transactions (Savepoints)
   */
  supportsNestedTransactions(): boolean {
    return true // SQLite يدعم Savepoints
  }

  /**
   * إنشاء Savepoint
   */
  async createSavepoint(transactionId: string, name: string): Promise<string> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    const savepointName = `sp_${name}_${Date.now()}`

    try {
      this.db.exec(`SAVEPOINT ${savepointName}`)

      transaction.savepoints.set(savepointName, {
        id: savepointName,
        transactionId,
        name,
        createdAt: new Date(),
      })

      logger.debug('Savepoint created', { transactionId, savepointName })
      return savepointName
    } catch (error) {
      logger.error('Failed to create savepoint', {
        transactionId,
        savepointName,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `Failed to create savepoint: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Rollback إلى Savepoint
   */
  async rollbackToSavepoint(transactionId: string, savepointName: string): Promise<void> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    if (!transaction.savepoints.has(savepointName)) {
      throw new Error(`Savepoint not found: ${savepointName}`)
    }

    try {
      this.db.exec(`ROLLBACK TO SAVEPOINT ${savepointName}`)
      logger.debug('Rolled back to savepoint', { transactionId, savepointName })
    } catch (error) {
      logger.error('Failed to rollback to savepoint', {
        transactionId,
        savepointName,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `Failed to rollback to savepoint: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * إطلاق Savepoint
   */
  async releaseSavepoint(transactionId: string, savepointName: string): Promise<void> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    if (!transaction.savepoints.has(savepointName)) {
      throw new Error(`Savepoint not found: ${savepointName}`)
    }

    try {
      this.db.exec(`RELEASE SAVEPOINT ${savepointName}`)
      transaction.savepoints.delete(savepointName)
      logger.debug('Savepoint released', { transactionId, savepointName })
    } catch (error) {
      logger.error('Failed to release savepoint', {
        transactionId,
        savepointName,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `Failed to release savepoint: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Escape identifier للـ SQL injection protection
   * Note: يستخدم escapeIdentifier من query-builder.util
   */
  private escapeIdentifier(identifier: string): string {
    return escapeIdentifierUtil(identifier, '"')
  }
}
