/**
 * RedisCache - Redis Cache Implementation
 *
 * تنفيذ Redis Cache مع دعم:
 * - TTL (Time To Live)
 * - Compression
 * - Serialization
 * - Connection Pooling
 * - Error Handling & Fallback
 */

import Redis, { RedisOptions } from 'ioredis'
import { logger } from '../../shared/utils/logger'

/**
 * Redis Cache Configuration
 */
export interface RedisCacheConfig {
  host?: string
  port?: number
  password?: string
  db?: number
  keyPrefix?: string
  ttl?: number // Default TTL in milliseconds
  maxRetries?: number
  retryDelayOnFailover?: number
  enableReadyCheck?: boolean
  lazyConnect?: boolean
  connectionString?: string
}

/**
 * Redis Cache Entry
 */
interface RedisCacheEntry<T = unknown> {
  value: T
  expiresAt?: number
  createdAt: number
}

/**
 * Redis Cache Implementation
 */
export class RedisCache {
  private client: Redis | null = null
  private subscriber: Redis | null = null
  private readonly config: RedisCacheConfig & {
    host: string
    port: number
    db: number
    keyPrefix: string
    ttl: number
    maxRetries: number
    retryDelayOnFailover: number
    enableReadyCheck: boolean
    lazyConnect: boolean
  }
  private readonly keyPrefix: string
  private isConnected: boolean = false
  private connectionAttempts: number = 0

  constructor(config: RedisCacheConfig = {}) {
    this.config = {
      host: config.host || process.env.REDIS_HOST || 'localhost',
      port: config.port || parseInt(process.env.REDIS_PORT || '6379', 10),
      password: config.password || process.env.REDIS_PASSWORD || undefined,
      db: config.db || parseInt(process.env.REDIS_DB || '0', 10),
      keyPrefix: config.keyPrefix || 'db-core:',
      ttl: config.ttl || 5 * 60 * 1000, // 5 minutes default
      maxRetries: config.maxRetries || 3,
      retryDelayOnFailover: config.retryDelayOnFailover || 100,
      enableReadyCheck: config.enableReadyCheck ?? true,
      lazyConnect: config.lazyConnect ?? false,
      connectionString: config.connectionString || process.env.REDIS_URL || undefined,
    }

    this.keyPrefix = this.config.keyPrefix

    // إنشاء Redis Client
    this.initializeClient()
  }

  /**
   * تهيئة Redis Client
   */
  private initializeClient(): void {
    try {
      const redisOptions: RedisOptions = {
        host: this.config.host,
        port: this.config.port,
        password: this.config.password,
        db: this.config.db,
        keyPrefix: this.keyPrefix,
        maxRetriesPerRequest: this.config.maxRetries,
        retryStrategy: (times: number) => {
          if (times > this.config.maxRetries) {
            logger.error('Redis connection failed after max retries', { times })
            return null // Stop retrying
          }
          const delay = Math.min(times * 50, 2000)
          logger.warn('Retrying Redis connection', { times, delay })
          return delay
        },
        enableReadyCheck: this.config.enableReadyCheck,
        lazyConnect: this.config.lazyConnect,
      }

      // استخدام Connection String إذا كان متوفراً
      if (this.config.connectionString) {
        this.client = new Redis(this.config.connectionString, redisOptions)
      } else {
        this.client = new Redis(redisOptions)
      }

      // معالجة الأحداث
      this.setupEventHandlers()

      // الاتصال إذا لم يكن lazy
      if (!this.config.lazyConnect) {
        this.connect()
      }
    } catch (error) {
      logger.error('Failed to initialize Redis client', {
        error: error instanceof Error ? error.message : String(error),
      })
      this.client = null
    }
  }

  /**
   * إعداد معالجات الأحداث
   */
  private setupEventHandlers(): void {
    if (!this.client) return

    this.client.on('connect', () => {
      logger.info('Redis client connecting...')
    })

    this.client.on('ready', () => {
      this.isConnected = true
      this.connectionAttempts = 0
      logger.info('Redis client ready', {
        host: this.config.host,
        port: this.config.port,
      })
    })

    this.client.on('error', (error: Error) => {
      this.isConnected = false
      logger.error('Redis client error', {
        error: error.message,
      })
    })

    this.client.on('close', () => {
      this.isConnected = false
      logger.warn('Redis connection closed')
    })

    this.client.on('reconnecting', () => {
      this.connectionAttempts++
      logger.info('Redis reconnecting', {
        attempt: this.connectionAttempts,
      })
    })
  }

  /**
   * الاتصال بـ Redis
   */
  async connect(): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not initialized')
    }

    if (this.isConnected) {
      return
    }

    try {
      await this.client.connect()
      this.isConnected = true
    } catch (error) {
      logger.error('Failed to connect to Redis', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  /**
   * التحقق من الاتصال
   */
  async ensureConnection(): Promise<boolean> {
    if (!this.client) {
      return false
    }

    if (this.isConnected) {
      return true
    }

    try {
      await this.connect()
      return true
    } catch {
      return false
    }
  }

  /**
   * الحصول على قيمة من Cache
   */
  async get<T = unknown>(key: string): Promise<T | null> {
    if (!(await this.ensureConnection())) {
      logger.warn('Redis not connected, returning null', { key })
      return null
    }

    try {
      const fullKey = this.getFullKey(key)
      const value = await this.client!.get(fullKey)

      if (!value) {
        return null
      }

      // Deserialize
      const entry: RedisCacheEntry<T> = JSON.parse(value)

      // التحقق من انتهاء الصلاحية
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        await this.delete(key)
        return null
      }

      return entry.value
    } catch (error) {
      logger.error('Redis get error', {
        key,
        error: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  }

  /**
   * حفظ قيمة في Cache
   */
  async set<T = unknown>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (!(await this.ensureConnection())) {
      logger.warn('Redis not connected, cannot set cache', { key })
      return false
    }

    try {
      const fullKey = this.getFullKey(key)
      const entry: RedisCacheEntry<T> = {
        value,
        createdAt: Date.now(),
        expiresAt: ttl
          ? Date.now() + ttl
          : this.config.ttl
            ? Date.now() + this.config.ttl
            : undefined,
      }

      const serialized = JSON.stringify(entry)
      // استخدام TTL الممرر أو TTL الافتراضي (إذا كان > 0)
      const actualTTL =
        ttl !== undefined
          ? ttl
          : this.config.ttl && this.config.ttl > 0
            ? this.config.ttl
            : undefined

      if (actualTTL && actualTTL > 0) {
        // تحويل من milliseconds إلى seconds
        await this.client!.setex(fullKey, Math.floor(actualTTL / 1000), serialized)
      } else {
        await this.client!.set(fullKey, serialized)
      }

      return true
    } catch (error) {
      logger.error('Redis set error', {
        key,
        error: error instanceof Error ? error.message : String(error),
      })
      return false
    }
  }

  /**
   * حذف قيمة من Cache
   */
  async delete(key: string): Promise<boolean> {
    if (!(await this.ensureConnection())) {
      return false
    }

    try {
      const fullKey = this.getFullKey(key)
      const result = await this.client!.del(fullKey)
      return result > 0
    } catch (error) {
      logger.error('Redis delete error', {
        key,
        error: error instanceof Error ? error.message : String(error),
      })
      return false
    }
  }

  /**
   * حذف عدة مفاتيح
   */
  async deleteMany(keys: string[]): Promise<number> {
    if (!(await this.ensureConnection()) || keys.length === 0) {
      return 0
    }

    try {
      const fullKeys = keys.map(key => this.getFullKey(key))
      const result = await this.client!.del(...fullKeys)
      return result
    } catch (error) {
      logger.error('Redis deleteMany error', {
        error: error instanceof Error ? error.message : String(error),
      })
      return 0
    }
  }

  /**
   * مسح جميع المفاتيح التي تطابق pattern
   */
  async clear(pattern: string = '*'): Promise<number> {
    if (!(await this.ensureConnection())) {
      return 0
    }

    try {
      const fullPattern = this.getFullKey(pattern)
      const keys = await this.client!.keys(fullPattern)

      if (keys.length === 0) {
        return 0
      }

      const result = await this.client!.del(...keys)
      return result
    } catch (error) {
      logger.error('Redis clear error', {
        pattern,
        error: error instanceof Error ? error.message : String(error),
      })
      return 0
    }
  }

  /**
   * التحقق من وجود مفتاح
   */
  async exists(key: string): Promise<boolean> {
    if (!(await this.ensureConnection())) {
      return false
    }

    try {
      const fullKey = this.getFullKey(key)
      const result = await this.client!.exists(fullKey)
      return result === 1
    } catch (error) {
      logger.error('Redis exists error', {
        key,
        error: error instanceof Error ? error.message : String(error),
      })
      return false
    }
  }

  /**
   * تمديد TTL لمفتاح
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    if (!(await this.ensureConnection())) {
      return false
    }

    try {
      const fullKey = this.getFullKey(key)
      // تحويل من milliseconds إلى seconds
      const result = await this.client!.expire(fullKey, Math.floor(ttl / 1000))
      return result === 1
    } catch (error) {
      logger.error('Redis expire error', {
        key,
        error: error instanceof Error ? error.message : String(error),
      })
      return false
    }
  }

  /**
   * الحصول على TTL المتبقي لمفتاح
   */
  async getTTL(key: string): Promise<number> {
    if (!(await this.ensureConnection())) {
      return -1
    }

    try {
      const fullKey = this.getFullKey(key)
      const ttl = await this.client!.ttl(fullKey)
      // تحويل من seconds إلى milliseconds
      return ttl > 0 ? ttl * 1000 : ttl
    } catch (error) {
      logger.error('Redis getTTL error', {
        key,
        error: error instanceof Error ? error.message : String(error),
      })
      return -1
    }
  }

  /**
   * الحصول على جميع المفاتيح التي تطابق pattern
   */
  async keys(pattern: string = '*'): Promise<string[]> {
    if (!(await this.ensureConnection())) {
      return []
    }

    try {
      const fullPattern = this.getFullKey(pattern)
      const keys = await this.client!.keys(fullPattern)
      // إزالة prefix من المفاتيح
      return keys.map(key => key.replace(this.keyPrefix, ''))
    } catch (error) {
      logger.error('Redis keys error', {
        pattern,
        error: error instanceof Error ? error.message : String(error),
      })
      return []
    }
  }

  /**
   * الحصول على حجم Cache (عدد المفاتيح)
   */
  async size(): Promise<number> {
    if (!(await this.ensureConnection())) {
      return 0
    }

    try {
      const keys = await this.keys('*')
      return keys.length
    } catch (error) {
      logger.error('Redis size error', {
        error: error instanceof Error ? error.message : String(error),
      })
      return 0
    }
  }

  /**
   * الحصول على إحصائيات Redis
   */
  async getStats(): Promise<{
    connected: boolean
    keys: number
    memory?: string
    info?: Record<string, string>
  }> {
    if (!(await this.ensureConnection())) {
      return {
        connected: false,
        keys: 0,
      }
    }

    try {
      const keys = await this.keys('*')
      const info = await this.client!.info('memory')
      const memoryMatch = info.match(/used_memory_human:(.+)/)

      return {
        connected: this.isConnected,
        keys: keys.length,
        memory: memoryMatch ? memoryMatch[1].trim() : undefined,
        info: this.parseInfo(info),
      }
    } catch (error) {
      logger.error('Redis getStats error', {
        error: error instanceof Error ? error.message : String(error),
      })
      return {
        connected: this.isConnected,
        keys: 0,
      }
    }
  }

  /**
   * Parse Redis INFO output
   */
  private parseInfo(info: string): Record<string, string> {
    const result: Record<string, string> = {}
    const lines = info.split('\r\n')

    for (const line of lines) {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':')
        if (key && value) {
          result[key] = value
        }
      }
    }

    return result
  }

  /**
   * الحصول على المفتاح الكامل مع prefix
   */
  private getFullKey(key: string): string {
    return `${this.keyPrefix}${key}`
  }

  /**
   * إغلاق الاتصال
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.quit()
      this.isConnected = false
      logger.info('Redis connection closed')
    }

    if (this.subscriber) {
      await this.subscriber.quit()
    }
  }

  /**
   * الحصول على Redis Client
   */
  getClient(): Redis | null {
    return this.client
  }

  /**
   * التحقق من حالة الاتصال
   */
  isReady(): boolean {
    return this.isConnected && this.client !== null
  }
}
