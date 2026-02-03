/**
 * MySQLAdapter - محول MySQL
 *
 * تنفيذ واجهة IDatabaseAdapter باستخدام MySQL
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import {
  ITransactionAdapter,
  type TransactionInfo,
  type TransactionOptions,
  type SavepointInfo,
} from '../../domain/interfaces/ITransactionAdapter'
import { logger } from '../../shared/utils/logger'
import { createPool, Pool, PoolConnection, PoolOptions } from 'mysql2/promise'
import { ConnectionPoolManager } from '../pooling/ConnectionPoolManager'
import {
  buildSelectQuery,
  escapeIdentifier as escapeIdentifierUtil,
} from './utils/query-builder.util'

/**
 * معلومات المعاملة الداخلية
 */
interface InternalTransactionInfo {
  connection: PoolConnection
  startedAt: Date
  isolationLevel?: string
  timeout?: number
  readOnly?: boolean
  savepoints: Map<string, SavepointInfo>
}

/**
 * محول MySQL
 */
export class MySQLAdapter implements IDatabaseAdapter, ITransactionAdapter {
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
    this.port = config.port || 3306
    this.database = config.database
    this.username = config.username
    this.password = config.password
    this.useEnhancedPooling = config.useEnhancedPooling ?? true

    // إنشاء Connection Pool
    const poolConfig: PoolOptions = {
      host: this.host,
      port: this.port,
      database: this.database,
      user: this.username,
      password: this.password,
      connectionLimit: config.maxPoolSize || config.poolSize || 20,
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    }

    this.pool = createPool(poolConfig)

    // استخدام Enhanced Pooling إذا كان مفعّل
    if (this.useEnhancedPooling) {
      // Note: ConnectionPoolManager مصمم لـ PostgreSQL، لكن يمكن استخدامه مع MySQL
      // قد يحتاج إلى تعديلات طفيفة
      this.poolManager = new ConnectionPoolManager({
        host: this.host,
        port: this.port,
        database: this.database,
        user: this.username,
        password: this.password,
        minSize: config.minPoolSize || 2,
        maxSize: config.maxPoolSize || config.poolSize || 20,
        healthCheckInterval: config.healthCheckInterval || 30000,
        autoReconnect: config.autoReconnect ?? true,
      } as any) // Cast لأن ConnectionPoolManager مصمم لـ pg Pool
    }

    logger.info('MySQL adapter initialized', {
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
    const connection = await this.pool.getConnection()

    try {
      // استخدام Query Builder Utility
      const { query, params } = buildSelectQuery(
        entity,
        conditions,
        options,
        () => '?' // MySQL uses ? placeholders
      )

      const [rows] = await connection.execute(query, params)
      return rows as T[]
    } catch (error) {
      logger.error('MySQL find error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MySQL query error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      connection.release()
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
    const connection = await this.pool.getConnection()

    try {
      const columns = Object.keys(data)
      const values = Object.values(data)
      const placeholders = columns.map(() => '?').join(', ')

      const query = `
        INSERT INTO ${this.escapeIdentifier(entity)} (${columns.map(c => this.escapeIdentifier(c)).join(', ')})
        VALUES (${placeholders})
      `

      const [result] = (await connection.execute(query, values)) as any

      // الحصول على السجل المُدرج
      const insertedId = result.insertId
      const inserted = await this.findOne<T>(entity, { id: insertedId } as any)

      return inserted || (data as T)
    } catch (error) {
      logger.error('MySQL insert error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MySQL insert error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      connection.release()
    }
  }

  /**
   * إدراج عدة سجلات
   */
  async insertMany<T = unknown>(entity: string, data: Record<string, unknown>[]): Promise<T[]> {
    if (data.length === 0) {
      return []
    }

    const connection = await this.pool.getConnection()

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

      await connection.execute(query, values)

      // الحصول على السجلات المُدرجة (باستخدام LAST_INSERT_ID)
      const [result] = (await connection.execute('SELECT LAST_INSERT_ID() as firstId')) as any
      const firstId = result[0]?.firstId

      if (firstId) {
        const insertedIds = Array.from({ length: data.length }, (_, i) => firstId + i)
        const results: T[] = []

        for (const id of insertedIds) {
          const inserted = await this.findOne<T>(entity, { id } as any)
          if (inserted) {
            results.push(inserted)
          }
        }

        return results
      }

      return data as T[]
    } catch (error) {
      logger.error('MySQL insertMany error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MySQL insertMany error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      connection.release()
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
    const connection = await this.pool.getConnection()

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

      await connection.execute(query, params)

      // الحصول على السجل المحدث
      const updated = await this.findOne<T>(entity, conditions)

      if (!updated) {
        throw new Error('No records updated')
      }

      return updated
    } catch (error) {
      logger.error('MySQL update error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MySQL update error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      connection.release()
    }
  }

  /**
   * عد السجلات المطابقة لشروط معينة
   */
  async count(entity: string, conditions: Record<string, unknown> = {}): Promise<number> {
    const connection = await this.pool.getConnection()

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

      const [rows] = (await connection.execute(query, params)) as any
      const count = parseInt(rows[0]?.count || '0', 10)
      return count
    } catch (error) {
      logger.error('MySQL count error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MySQL count error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      connection.release()
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
    const connection = await this.pool.getConnection()

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

      await connection.execute(query, params)
      return true
    } catch (error) {
      logger.error('MySQL delete error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MySQL delete error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      connection.release()
    }
  }

  /**
   * تنفيذ استعلام خام
   */
  async executeRaw<T = unknown>(query: string, params?: Record<string, unknown>): Promise<T> {
    const connection = await this.pool.getConnection()

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

      const [rows] = await connection.execute(processedQuery, positionalParams)
      return rows as T
    } catch (error) {
      logger.error('MySQL executeRaw error', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MySQL executeRaw error: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      connection.release()
    }
  }

  /**
   * فحص صحة الاتصال
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (this.poolManager) {
        const healthStatus = this.poolManager.getHealthStatus()
        return healthStatus.healthy
      }

      const connection = await this.pool.getConnection()
      try {
        await connection.execute('SELECT 1')
        return true
      } finally {
        connection.release()
      }
    } catch {
      return false
    }
  }

  /**
   * الحصول على إحصائيات Pool
   */
  getPoolStatistics() {
    if (this.poolManager) {
      return this.poolManager.getStatistics()
    }

    return {
      totalConnections: (this.pool as any).pool?._allConnections?.length || 0,
      idleConnections: (this.pool as any).pool?._freeConnections?.length || 0,
      activeConnections:
        (this.pool as any).pool?._allConnections?.length -
        ((this.pool as any).pool?._freeConnections?.length || 0),
      waitingRequests: 0,
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      averageQueryTime: 0,
      poolSize: (this.pool as any).config?.connectionLimit || 20,
      minPoolSize: 0,
      maxPoolSize: (this.pool as any).config?.connectionLimit || 20,
    }
  }

  /**
   * الحصول على حالة صحة Pool
   */
  getPoolHealthStatus() {
    if (this.poolManager) {
      return this.poolManager.getHealthStatus()
    }

    return {
      healthy: true,
      lastHealthCheck: new Date(),
      consecutiveFailures: 0,
      averageResponseTime: 0,
      errorRate: 0,
    }
  }

  /**
   * إغلاق Connection Pool
   */
  async close(): Promise<void> {
    // إغلاق جميع المعاملات المفتوحة
    for (const [transactionId, transaction] of this.transactions.entries()) {
      try {
        await transaction.connection.rollback()
        transaction.connection.release()
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
    logger.info('MySQL pool closed')
  }

  // ITransactionAdapter Implementation

  /**
   * التحقق من دعم المعاملات
   */
  supportsTransactions(): boolean {
    return true // MySQL يدعم Transactions
  }

  /**
   * بدء معاملة جديدة مع دعم Isolation Levels و Timeout
   */
  async beginTransaction(options?: TransactionOptions): Promise<string> {
    const connection = await this.pool.getConnection()
    const transactionId = `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`

    try {
      // بناء BEGIN statement مع Isolation Level
      let beginQuery = 'START TRANSACTION'

      if (options?.isolationLevel) {
        const isolationLevelMap: Record<string, string> = {
          READ_UNCOMMITTED: 'READ UNCOMMITTED',
          READ_COMMITTED: 'READ COMMITTED',
          REPEATABLE_READ: 'REPEATABLE READ',
          SERIALIZABLE: 'SERIALIZABLE',
        }
        beginQuery += ` ISOLATION LEVEL ${isolationLevelMap[options.isolationLevel] || 'REPEATABLE READ'}`
      }

      if (options?.readOnly) {
        beginQuery += ' READ ONLY'
      }

      await connection.execute(beginQuery)

      // تعيين Timeout إذا كان محدداً
      if (options?.timeout) {
        await connection.execute(
          `SET SESSION innodb_lock_wait_timeout = ${Math.floor(options.timeout / 1000)}`
        )
      }

      // حفظ معلومات المعاملة
      this.transactions.set(transactionId, {
        connection,
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
      connection.release()
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

    const { connection } = transaction

    try {
      await connection.commit()
      this.transactions.delete(transactionId)
      connection.release()
      logger.info('Transaction committed', {
        transactionId,
        duration: Date.now() - transaction.startedAt.getTime(),
      })
    } catch (error) {
      connection.release()
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

    const { connection } = transaction

    try {
      await connection.rollback()
      this.transactions.delete(transactionId)
      connection.release()
      logger.info('Transaction rolled back', {
        transactionId,
        duration: Date.now() - transaction.startedAt.getTime(),
      })
    } catch (error) {
      connection.release()
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
      const [rows] = (await transaction.connection.execute(
        'SELECT @@transaction_isolation as isolation_level, @@innodb_lock_wait_timeout as timeout'
      )) as any

      return {
        id: transactionId,
        status: 'pending',
        startedAt: transaction.startedAt,
        isolationLevel: transaction.isolationLevel || rows[0]?.isolation_level,
        timeout: transaction.timeout || (rows[0]?.timeout ? rows[0].timeout * 1000 : undefined),
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
    operation: (client: PoolConnection) => Promise<T>
  ): Promise<T> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    return await operation(transaction.connection)
  }

  /**
   * دعم Nested Transactions (Savepoints)
   */
  supportsNestedTransactions(): boolean {
    return true // MySQL يدعم Savepoints
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
      await transaction.connection.execute(`SAVEPOINT ${savepointName}`)

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
      await transaction.connection.execute(`ROLLBACK TO SAVEPOINT ${savepointName}`)
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
      await transaction.connection.execute(`RELEASE SAVEPOINT ${savepointName}`)
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
    return escapeIdentifierUtil(identifier, '`')
  }
}
