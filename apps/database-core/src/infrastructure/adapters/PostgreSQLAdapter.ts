/**
 * PostgreSQLAdapter - محول PostgreSQL
 *
 * تنفيذ واجهة IDatabaseAdapter باستخدام PostgreSQL
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import {
  ITransactionAdapter,
  type TransactionInfo,
  type TransactionOptions,
  type SavepointInfo,
} from '../../domain/interfaces/ITransactionAdapter'
import { logger } from '../../shared/utils/logger'
import { Pool, QueryResult, PoolClient } from 'pg'
import { ConnectionPoolManager } from '../pooling/ConnectionPoolManager'
import {
  buildSelectQuery,
  escapeIdentifier as escapeIdentifierUtil,
} from './utils/query-builder.util'

/**
 * محول PostgreSQL
 */
/**
 * معلومات المعاملة الداخلية
 */
interface InternalTransactionInfo {
  client: PoolClient
  startedAt: Date
  isolationLevel?: string
  timeout?: number
  readOnly?: boolean
  savepoints: Map<string, SavepointInfo>
}

export class PostgreSQLAdapter implements IDatabaseAdapter, ITransactionAdapter {
  private pool: Pool
  private poolManager?: ConnectionPoolManager
  private transactions: Map<string, InternalTransactionInfo> = new Map()
  private readonly host: string
  private readonly port: number
  private readonly database: string
  private readonly username: string
  private readonly password: string
  private readonly useEnhancedPooling: boolean

  constructor(config: {
    host: string
    port?: number
    database: string
    username: string
    password: string
    poolSize?: number
    timeout?: number
    useEnhancedPooling?: boolean
    minPoolSize?: number
    maxPoolSize?: number
    healthCheckInterval?: number
    autoReconnect?: boolean
  }) {
    this.host = config.host
    this.port = config.port || 5432
    this.database = config.database
    this.username = config.username
    this.password = config.password
    this.useEnhancedPooling = config.useEnhancedPooling ?? true

    // إنشاء Connection Pool
    const poolConfig = {
      host: this.host,
      port: this.port,
      database: this.database,
      user: this.username,
      password: this.password,
      max: config.maxPoolSize || config.poolSize || 20,
      min: config.minPoolSize || 2,
      idleTimeoutMillis: config.timeout || 30000,
      connectionTimeoutMillis: config.timeout || 30000,
    }

    this.pool = new Pool(poolConfig)

    // استخدام Enhanced Pooling إذا كان مفعّل
    if (this.useEnhancedPooling) {
      this.poolManager = new ConnectionPoolManager({
        ...poolConfig,
        minSize: config.minPoolSize || 2,
        maxSize: config.maxPoolSize || config.poolSize || 20,
        healthCheckInterval: config.healthCheckInterval || 30000,
        autoReconnect: config.autoReconnect ?? true,
      })
    }

    // معالجة أخطاء الاتصال
    this.pool.on('error', (err: Error) => {
      logger.error('PostgreSQL pool error', { error: err.message })
    })

    logger.info('PostgreSQL adapter initialized', {
      host: this.host,
      port: this.port,
      database: this.database,
      useEnhancedPooling: this.useEnhancedPooling,
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
    let client: PoolClient | undefined

    try {
      client = await this.pool.connect()

      // استخدام Query Builder Utility
      const { query, params } = buildSelectQuery(
        entity,
        conditions,
        options,
        (index: number) => `$${index}` // PostgreSQL uses $1, $2, etc.
      )

      const result: QueryResult = await client.query(query, params)
      return result.rows as T[]
    } catch (error) {
      logger.error('PostgreSQL find error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `PostgreSQL query error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      if (client) {
        client.release()
      }
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
    let client: PoolClient | undefined

    try {
      client = await this.pool.connect()

      const columns = Object.keys(data)
      const values = Object.values(data)
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')

      const query = `
        INSERT INTO ${this.escapeIdentifier(entity)} (${columns.map(c => this.escapeIdentifier(c)).join(', ')})
        VALUES (${placeholders})
        RETURNING *
      `

      const result: QueryResult = await client.query(query, values)
      return result.rows[0] as T
    } catch (error) {
      logger.error('PostgreSQL insert error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `PostgreSQL insert error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  /**
   * إدراج عدة سجلات
   */
  async insertMany<T = unknown>(entity: string, data: Record<string, unknown>[]): Promise<T[]> {
    if (data.length === 0) {
      return []
    }

    let client: PoolClient | undefined

    try {
      client = await this.pool.connect()

      const columns = Object.keys(data[0])
      const values: unknown[] = []
      const placeholders: string[] = []

      for (let i = 0; i < data.length; i++) {
        const rowValues = columns.map((_, colIndex) => {
          const paramIndex = i * columns.length + colIndex + 1
          return `$${paramIndex}`
        })
        placeholders.push(`(${rowValues.join(', ')})`)
        values.push(...columns.map(col => data[i][col]))
      }

      const query = `
        INSERT INTO ${this.escapeIdentifier(entity)} (${columns.map(c => this.escapeIdentifier(c)).join(', ')})
        VALUES ${placeholders.join(', ')}
        RETURNING *
      `

      const result: QueryResult = await client.query(query, values)
      return result.rows as T[]
    } catch (error) {
      logger.error('PostgreSQL insertMany error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `PostgreSQL insertMany error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      if (client) {
        client.release()
      }
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
    let client: PoolClient | undefined

    try {
      client = await this.pool.connect()

      const updateColumns = Object.keys(data)
      const updateValues = Object.values(data)
      const updatePlaceholders = updateColumns
        .map((_, index) => `${this.escapeIdentifier(updateColumns[index])} = $${index + 1}`)
        .join(', ')

      const whereConditions: string[] = []
      let paramIndex = updateValues.length + 1

      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          whereConditions.push(`${this.escapeIdentifier(key)} = $${paramIndex}`)
          updateValues.push(value)
          paramIndex++
        }
      }

      if (whereConditions.length === 0) {
        throw new Error('Update conditions are required')
      }

      const query = `
        UPDATE ${this.escapeIdentifier(entity)}
        SET ${updatePlaceholders}
        WHERE ${whereConditions.join(' AND ')}
        RETURNING *
      `

      const result: QueryResult = await client.query(query, updateValues)

      if (result.rows.length === 0) {
        throw new Error('No records updated')
      }

      return result.rows[0] as T
    } catch (error) {
      logger.error('PostgreSQL update error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `PostgreSQL update error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  /**
   * عد السجلات المطابقة لشروط معينة
   */
  async count(entity: string, conditions: Record<string, unknown> = {}): Promise<number> {
    let client: PoolClient | undefined

    try {
      client = await this.pool.connect()

      const whereConditions: string[] = []
      const params: unknown[] = []
      let paramIndex = 1

      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          whereConditions.push(`${this.escapeIdentifier(key)} = $${paramIndex}`)
          params.push(value)
          paramIndex++
        }
      }

      let query = `SELECT COUNT(*) as count FROM ${this.escapeIdentifier(entity)}`
      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`
      }

      const result: QueryResult = await client.query(query, params)
      const count = parseInt(result.rows[0]?.count || '0', 10)
      return count
    } catch (error) {
      logger.error('PostgreSQL count error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `PostgreSQL count error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      if (client) {
        client.release()
      }
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
    let client: PoolClient | undefined

    try {
      if (soft) {
        // Soft delete - تحديث deleted_at
        await this.update(entity, conditions, { deleted_at: new Date().toISOString() })
        return true
      }

      client = await this.pool.connect()

      // Hard delete
      const whereConditions: string[] = []
      const params: unknown[] = []
      let paramIndex = 1

      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          whereConditions.push(`${this.escapeIdentifier(key)} = $${paramIndex}`)
          params.push(value)
          paramIndex++
        }
      }

      if (whereConditions.length === 0) {
        throw new Error('Delete conditions are required')
      }

      const query = `
        DELETE FROM ${this.escapeIdentifier(entity)}
        WHERE ${whereConditions.join(' AND ')}
      `

      await client.query(query, params)
      return true
    } catch (error) {
      logger.error('PostgreSQL delete error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `PostgreSQL delete error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  /**
   * تنفيذ استعلام خام
   */
  async executeRaw<T = unknown>(query: string, params?: Record<string, unknown>): Promise<T> {
    let client: PoolClient | undefined

    try {
      client = await this.pool.connect()

      // تحويل named parameters إلى positional parameters
      const positionalParams: unknown[] = []
      let processedQuery = query

      if (params) {
        let paramIndex = 1
        for (const [key, value] of Object.entries(params)) {
          const placeholder = `:${key}`
          if (processedQuery.includes(placeholder)) {
            processedQuery = processedQuery.replace(new RegExp(`:${key}`, 'g'), `$${paramIndex}`)
            positionalParams.push(value)
            paramIndex++
          }
        }
      }

      const result: QueryResult = await client.query(processedQuery, positionalParams)
      return result.rows as T
    } catch (error) {
      logger.error('PostgreSQL executeRaw error', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `PostgreSQL executeRaw error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  /**
   * فحص صحة الاتصال
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.pool.query('SELECT 1')
      return result.rows.length > 0
    } catch {
      return false
    }
  }

  /**
   * إغلاق Connection Pool
   */
  async close(): Promise<void> {
    // إغلاق جميع المعاملات المفتوحة
    for (const [transactionId, transaction] of this.transactions.entries()) {
      try {
        await transaction.client.query('ROLLBACK')
        transaction.client.release()
        logger.warn('Transaction rolled back on pool close', { transactionId })
      } catch (error) {
        logger.error('Error rolling back transaction on pool close', {
          transactionId,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
    this.transactions.clear()

    // إغلاق Pool Manager إذا كان موجوداً
    if (this.poolManager) {
      await this.poolManager.close()
    }

    await this.pool.end()
    logger.info('PostgreSQL pool closed')
  }

  // ITransactionAdapter Implementation

  /**
   * التحقق من دعم المعاملات
   */
  supportsTransactions(): boolean {
    return true // PostgreSQL يدعم Transactions
  }

  /**
   * بدء معاملة جديدة مع دعم Isolation Levels و Timeout
   */
  async beginTransaction(options?: TransactionOptions): Promise<string> {
    let client: PoolClient | undefined
    const transactionId = `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`

    try {
      client = await this.pool.connect()

      // بناء BEGIN statement مع Isolation Level
      let beginQuery = 'BEGIN'

      if (options?.isolationLevel) {
        const isolationLevelMap: Record<string, string> = {
          READ_UNCOMMITTED: 'READ UNCOMMITTED',
          READ_COMMITTED: 'READ COMMITTED',
          REPEATABLE_READ: 'REPEATABLE READ',
          SERIALIZABLE: 'SERIALIZABLE',
        }
        beginQuery += ` ISOLATION LEVEL ${isolationLevelMap[options.isolationLevel] || 'READ COMMITTED'}`
      }

      if (options?.readOnly) {
        beginQuery += ' READ ONLY'
      }

      await client.query(beginQuery)

      // تعيين Timeout إذا كان محدداً
      if (options?.timeout) {
        await client.query(`SET LOCAL statement_timeout = ${options.timeout}`)
      }

      // حفظ معلومات المعاملة
      this.transactions.set(transactionId, {
        client,
        startedAt: new Date(),
        isolationLevel: options?.isolationLevel,
        timeout: options?.timeout,
        readOnly: options?.readOnly,
        savepoints: new Map(),
      })

      logger.info('Transaction started', {
        transactionId,
        isolationLevel: options?.isolationLevel,
        timeout: options?.timeout,
        readOnly: options?.readOnly,
      })

      return transactionId
    } catch (error) {
      if (client) {
        client.release()
      }
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

    const { client } = transaction

    try {
      await client.query('COMMIT')
      this.transactions.delete(transactionId)
      client.release()
      logger.info('Transaction committed', {
        transactionId,
        duration: Date.now() - transaction.startedAt.getTime(),
      })
    } catch (error) {
      client.release()
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

    const { client } = transaction

    try {
      await client.query('ROLLBACK')
      this.transactions.delete(transactionId)
      client.release()
      logger.info('Transaction rolled back', {
        transactionId,
        duration: Date.now() - transaction.startedAt.getTime(),
      })
    } catch (error) {
      client.release()
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

    // التحقق من حالة المعاملة من قاعدة البيانات
    try {
      const result = await transaction.client.query(
        "SELECT txid_current(), pg_is_in_recovery(), current_setting('transaction_isolation')"
      )

      return {
        id: transactionId,
        status: 'pending',
        startedAt: transaction.startedAt,
        isolationLevel: transaction.isolationLevel || result.rows[0]?.current_setting,
        timeout: transaction.timeout,
        readOnly: transaction.readOnly,
      }
    } catch (error) {
      // في حالة الفشل، نرجع معلومات أساسية
      return {
        id: transactionId,
        status: 'pending',
        startedAt: transaction.startedAt,
        isolationLevel: transaction.isolationLevel,
        timeout: transaction.timeout,
        readOnly: transaction.readOnly,
      }
    }
  }

  /**
   * تنفيذ عملية داخل معاملة
   */
  async executeInTransaction<T>(
    transactionId: string,
    operation: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    return await operation(transaction.client)
  }

  /**
   * دعم Nested Transactions (Savepoints)
   */
  supportsNestedTransactions(): boolean {
    return true // PostgreSQL يدعم Savepoints
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
      await transaction.client.query(`SAVEPOINT ${savepointName}`)

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
      await transaction.client.query(`ROLLBACK TO SAVEPOINT ${savepointName}`)
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
      await transaction.client.query(`RELEASE SAVEPOINT ${savepointName}`)
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
