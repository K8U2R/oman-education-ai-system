/**
 * MongoDBAdapter - محول MongoDB
 *
 * تنفيذ واجهة IDatabaseAdapter باستخدام MongoDB
 * Note: MongoDB هو NoSQL database، لذا بعض العمليات تختلف عن SQL databases
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { logger } from '../../shared/utils/logger'
import { MongoClient, Db, Collection } from 'mongodb'

/**
 * محول MongoDB
 */
export class MongoDBAdapter implements IDatabaseAdapter {
  private client: MongoClient
  private db: Db
  private readonly connectionString: string
  private readonly databaseName: string
  private readonly useEnhancedPooling: boolean

  constructor(config: {
    connectionString?: string
    host?: string
    port?: number
    database: string
    username?: string
    password?: string
    useEnhancedPooling?: boolean
    poolSize?: number
    timeout?: number
  }) {
    this.databaseName = config.database
    this.useEnhancedPooling = config.useEnhancedPooling ?? true

    // بناء Connection String
    if (config.connectionString) {
      this.connectionString = config.connectionString
    } else {
      const host = config.host || 'localhost'
      const port = config.port || 27017
      const auth =
        config.username && config.password ? `${config.username}:${config.password}@` : ''

      this.connectionString = `mongodb://${auth}${host}:${port}/${config.database}`
    }

    // إنشاء MongoDB Client
    this.client = new MongoClient(this.connectionString, {
      maxPoolSize: config.poolSize || 20,
      serverSelectionTimeoutMS: config.timeout || 5000,
      connectTimeoutMS: config.timeout || 5000,
    })

    // تهيئة Database (الاتصال سيحدث عند أول استخدام)
    this.db = this.client.db(this.databaseName)

    logger.info('MongoDB adapter initialized', {
      database: this.databaseName,
      useEnhancedPooling: this.useEnhancedPooling,
    })
  }

  /**
   * التأكد من الاتصال
   */
  private async ensureConnection(): Promise<void> {
    try {
      await this.client.connect()
    } catch (error) {
      // إذا كان متصل بالفعل، تجاهل الخطأ
      const mongoError = error as { code?: string }
      if (mongoError.code !== 'MongoServerError') {
        logger.error('Failed to connect to MongoDB', {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }

  /**
   * البحث عن سجلات (Documents)
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
    await this.ensureConnection()
    try {
      const collection = this.db.collection(entity)

      // بناء Query
      const query: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          query[key] = value
        }
      }

      // بناء Find Options
      const findOptions: {
        limit?: number
        skip?: number
        sort?: [string, 1 | -1][]
      } = {}

      if (options?.limit) {
        findOptions.limit = options.limit
      }

      if (options?.offset) {
        findOptions.skip = options.offset
      }

      if (options?.orderBy) {
        findOptions.sort = [[options.orderBy.column, options.orderBy.direction === 'asc' ? 1 : -1]]
      }

      const cursor = collection.find(query, findOptions)
      const results = await cursor.toArray()

      return results as T[]
    } catch (error) {
      logger.error('MongoDB find error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MongoDB query error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * البحث عن سجل واحد (Document)
   */
  async findOne<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>
  ): Promise<T | null> {
    await this.ensureConnection()
    try {
      const collection = this.db.collection(entity)

      // بناء Query
      const query: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          query[key] = value
        }
      }

      const result = await collection.findOne(query)

      return (result as T) || null
    } catch (error) {
      logger.error('MongoDB findOne error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MongoDB findOne error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * إدراج سجل جديد (Document)
   */
  async insert<T = unknown>(entity: string, data: Record<string, unknown>): Promise<T> {
    await this.ensureConnection()
    try {
      const collection = this.db.collection(entity)

      // إضافة timestamps
      const document = {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await collection.insertOne(document)

      // الحصول على السجل المُدرج
      const inserted = await collection.findOne({ _id: result.insertedId })

      return inserted as T
    } catch (error) {
      logger.error('MongoDB insert error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MongoDB insert error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * إدراج عدة سجلات (Documents)
   */
  async insertMany<T = unknown>(entity: string, data: Record<string, unknown>[]): Promise<T[]> {
    if (data.length === 0) {
      return []
    }

    await this.ensureConnection()
    try {
      const collection = this.db.collection(entity)

      // إضافة timestamps
      const documents = data.map(doc => ({
        ...doc,
        created_at: new Date(),
        updated_at: new Date(),
      }))

      const result = await collection.insertMany(documents)

      // الحصول على السجلات المُدرجة
      const insertedIds = Object.values(result.insertedIds)
      const inserted = await collection.find({ _id: { $in: insertedIds } }).toArray()

      return inserted as T[]
    } catch (error) {
      logger.error('MongoDB insertMany error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MongoDB insertMany error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * تحديث سجلات (Documents)
   */
  async update<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<T> {
    await this.ensureConnection()
    try {
      const collection = this.db.collection(entity)

      // بناء Query
      const query: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          query[key] = value
        }
      }

      if (Object.keys(query).length === 0) {
        throw new Error('Update conditions are required')
      }

      // إضافة updated_at
      const updateData = {
        ...data,
        updated_at: new Date(),
      }

      const result = await collection.findOneAndUpdate(
        query,
        { $set: updateData },
        { returnDocument: 'after' }
      )

      if (!result || !result.value) {
        throw new Error('No records updated')
      }

      // Type assertion safe here because we checked result.value is not null above
      const updatedValue = result.value as T
      return updatedValue
    } catch (error) {
      logger.error('MongoDB update error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MongoDB update error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * عد السجلات المطابقة لشروط معينة
   */
  async count(entity: string, conditions: Record<string, unknown> = {}): Promise<number> {
    await this.ensureConnection()
    try {
      const collection = this.db.collection(entity)

      // بناء Query
      const query: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          query[key] = value
        }
      }

      const count = await collection.countDocuments(query)
      return count
    } catch (error) {
      logger.error('MongoDB count error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MongoDB count error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * حذف سجلات (Documents)
   */
  async delete(
    entity: string,
    conditions: Record<string, unknown>,
    soft: boolean = true
  ): Promise<boolean> {
    await this.ensureConnection()
    try {
      const collection = this.db.collection(entity)

      // بناء Query
      const query: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          query[key] = value
        }
      }

      if (Object.keys(query).length === 0) {
        throw new Error('Delete conditions are required')
      }

      if (soft) {
        // Soft delete - تحديث deleted_at
        await collection.updateOne(query, {
          $set: { deleted_at: new Date() },
        })
        return true
      }

      // Hard delete
      const result = await collection.deleteOne(query)
      return result.deletedCount > 0
    } catch (error) {
      logger.error('MongoDB delete error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MongoDB delete error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * تنفيذ استعلام خام (Aggregation Pipeline)
   */
  async executeRaw<T = unknown>(
    query: string | Array<Record<string, unknown>>,
    params?: Record<string, unknown>
  ): Promise<T> {
    await this.ensureConnection()
    try {
      // إذا كان query هو string، نحاول تحويله إلى aggregation pipeline
      // أو استخدامه كـ collection name مع params كـ query
      if (typeof query === 'string') {
        // في MongoDB، يمكن استخدام collection name مع query object
        if (params) {
          const collection = this.db.collection(query)
          const results = await collection.find(params).toArray()
          return results as T
        } else {
          throw new Error('MongoDB raw query requires params when query is a string')
        }
      }

      // إذا كان query هو array (aggregation pipeline)
      if (Array.isArray(query)) {
        // نحتاج collection name من params
        if (!params || !params.collection) {
          throw new Error('MongoDB aggregation requires collection name in params')
        }

        const collection = this.db.collection(params.collection as string)
        const cursor = collection.aggregate(query)
        const results = await cursor.toArray()

        return results as T
      }

      throw new Error('Invalid MongoDB query format')
    } catch (error) {
      logger.error('MongoDB executeRaw error', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MongoDB executeRaw error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * فحص صحة الاتصال
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.db.admin().ping()
      return true
    } catch {
      return false
    }
  }

  /**
   * الحصول على MongoDB Client
   */
  getClient(): MongoClient {
    return this.client
  }

  /**
   * الحصول على Database
   */
  getDatabase(): Db {
    return this.db
  }

  /**
   * الحصول على Collection
   */
  getCollection(name: string): Collection {
    return this.db.collection(name)
  }

  /**
   * Aggregation Pipeline
   */
  async aggregate<T = unknown>(
    entity: string,
    pipeline: Array<Record<string, unknown>>
  ): Promise<T[]> {
    await this.ensureConnection()
    try {
      const collection = this.db.collection(entity)
      const cursor = collection.aggregate(pipeline)
      const results = await cursor.toArray()
      return results as T[]
    } catch (error) {
      logger.error('MongoDB aggregate error', {
        entity,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `MongoDB aggregate error: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * إغلاق الاتصال
   */
  async close(): Promise<void> {
    await this.client.close()
    logger.info('MongoDB connection closed')
  }
}
