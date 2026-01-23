/**
 * EnhancedCacheManager - مدير Cache محسّن
 *
 * دعم Multi-level Caching:
 * - L1: Memory Cache (سريع)
 * - L2: Redis Cache (موزع)
 */

import { MemoryCache } from './MemoryCache'
import { RedisCache, RedisCacheConfig } from './RedisCache'
import { logger } from '../../shared/utils/logger'

export interface EnhancedCacheOptions {
  ttl?: number // Time to live بالمللي ثانية
  maxSize?: number // الحد الأقصى لحجم الـ Memory Cache
  useRedis?: boolean // استخدام Redis كـ L2 Cache
  redisConfig?: RedisCacheConfig // إعدادات Redis
}

/**
 * مدير Cache محسّن مع دعم Multi-level Caching
 */
export class EnhancedCacheManager {
  private l1Cache: MemoryCache // Memory Cache (L1)
  private l2Cache: RedisCache | null = null // Redis Cache (L2)
  private maxSize: number
  private hitCount: number = 0
  private missCount: number = 0
  private l1HitCount: number = 0
  private l2HitCount: number = 0

  constructor(options: EnhancedCacheOptions = {}) {
    this.l1Cache = new MemoryCache(options.ttl)
    this.maxSize = options.maxSize || 1000

    // تهيئة Redis إذا كان مفعّل
    if (options.useRedis) {
      try {
        this.l2Cache = new RedisCache(options.redisConfig)
        logger.info('Enhanced Cache Manager initialized with Redis L2 cache')
      } catch (error) {
        logger.warn('Failed to initialize Redis cache, using memory cache only', {
          error: error instanceof Error ? error.message : String(error),
        })
        this.l2Cache = null
      }
    }
  }

  /**
   * الحصول على قيمة من Cache (L1 أولاً، ثم L2)
   */
  async get<T = unknown>(key: string): Promise<T | null> {
    // محاولة L1 Cache أولاً
    const l1Value = this.l1Cache.get<T>(key)
    if (l1Value !== null) {
      this.hitCount++
      this.l1HitCount++
      logger.debug('L1 cache hit', { key })
      return l1Value
    }

    // محاولة L2 Cache (Redis)
    if (this.l2Cache) {
      try {
        const l2Value = await this.l2Cache.get<T>(key)
        if (l2Value !== null) {
          this.hitCount++
          this.l2HitCount++
          // إضافة إلى L1 Cache للوصول السريع في المستقبل
          this.l1Cache.set(key, l2Value)
          logger.debug('L2 cache hit', { key })
          return l2Value
        }
      } catch (error) {
        logger.warn('L2 cache error, falling back to L1', {
          key,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    this.missCount++
    logger.debug('Cache miss', { key })
    return null
  }

  /**
   * حفظ قيمة في Cache (L1 و L2)
   */
  async set<T = unknown>(key: string, value: T, ttl?: number): Promise<void> {
    // حفظ في L1 Cache
    if (this.l1Cache.size() >= this.maxSize) {
      this.evictOldestL1()
    }
    this.l1Cache.set(key, value, ttl)

    // حفظ في L2 Cache (Redis) إذا كان متوفراً
    if (this.l2Cache) {
      try {
        await this.l2Cache.set(key, value, ttl)
        logger.debug('Cache set in L1 and L2', { key })
      } catch (error) {
        logger.warn('Failed to set L2 cache, value saved in L1 only', {
          key,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    } else {
      logger.debug('Cache set in L1', { key })
    }
  }

  /**
   * حذف قيمة من Cache (L1 و L2)
   */
  async delete(key: string): Promise<boolean> {
    let deleted = false

    // حذف من L1
    if (this.l1Cache.delete(key)) {
      deleted = true
    }

    // حذف من L2
    if (this.l2Cache) {
      try {
        const l2Deleted = await this.l2Cache.delete(key)
        deleted = deleted || l2Deleted
      } catch (error) {
        logger.warn('Failed to delete from L2 cache', {
          key,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    if (deleted) {
      logger.debug('Cache delete', { key })
    }

    return deleted
  }

  /**
   * حذف عدة مفاتيح
   */
  async deleteMany(keys: string[]): Promise<number> {
    let deletedCount = 0

    // حذف من L1
    for (const key of keys) {
      if (this.l1Cache.delete(key)) {
        deletedCount++
      }
    }

    // حذف من L2
    if (this.l2Cache && keys.length > 0) {
      try {
        const l2Deleted = await this.l2Cache.deleteMany(keys)
        deletedCount = Math.max(deletedCount, l2Deleted)
      } catch (error) {
        logger.warn('Failed to delete many from L2 cache', {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return deletedCount
  }

  /**
   * مسح جميع القيم من Cache
   */
  async clear(): Promise<void> {
    // مسح L1
    this.l1Cache.clear()

    // مسح L2
    if (this.l2Cache) {
      try {
        await this.l2Cache.clear()
      } catch (error) {
        logger.warn('Failed to clear L2 cache', {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    this.hitCount = 0
    this.missCount = 0
    this.l1HitCount = 0
    this.l2HitCount = 0
    logger.info('Cache cleared')
  }

  /**
   * حذف أقدم قيمة من L1 Cache
   */
  private evictOldestL1(): void {
    const keys = this.l1Cache.keys()
    if (keys.length > 0) {
      this.l1Cache.delete(keys[0])
      logger.debug('L1 cache evicted oldest', { key: keys[0] })
    }
  }

  /**
   * إنشاء مفتاح cache من المعاملات
   */
  generateKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|')

    return `${prefix}:${sortedParams}`
  }

  /**
   * الحصول على إحصائيات Cache
   */
  async getStats(): Promise<{
    l1: {
      size: number
      entries: number
      expired: number
    }
    l2?: {
      connected: boolean
      keys: number
      memory?: string
    }
    hitCount: number
    missCount: number
    l1HitCount: number
    l2HitCount: number
    hitRate: number
  }> {
    const l1Stats = this.l1Cache.getStats()
    const totalRequests = this.hitCount + this.missCount
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0

    const stats: any = {
      l1: l1Stats,
      hitCount: this.hitCount,
      missCount: this.missCount,
      l1HitCount: this.l1HitCount,
      l2HitCount: this.l2HitCount,
      hitRate: Math.round(hitRate * 100) / 100,
    }

    // إضافة إحصائيات L2 إذا كان متوفراً
    if (this.l2Cache) {
      try {
        const l2Stats = await this.l2Cache.getStats()
        stats.l2 = l2Stats
      } catch (error) {
        logger.warn('Failed to get L2 cache stats', {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return stats
  }

  /**
   * مسح القيم المنتهية الصلاحية
   */
  cleanExpired(): number {
    return this.l1Cache.cleanExpired()
  }

  /**
   * Warmup Cache - تحميل بيانات شائعة في Cache
   */
  async warmup(keys: string[], fetcher: (key: string) => Promise<unknown>): Promise<void> {
    logger.info('Warming up cache', { keyCount: keys.length })

    for (const key of keys) {
      try {
        const value = await fetcher(key)
        if (value !== null) {
          await this.set(key, value)
        }
      } catch (error) {
        logger.warn('Failed to warmup cache key', {
          key,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    logger.info('Cache warmup completed', { keyCount: keys.length })
  }

  /**
   * إغلاق الاتصالات
   */
  async close(): Promise<void> {
    if (this.l2Cache) {
      await this.l2Cache.close()
    }
    this.l1Cache.stopCleanup()
    logger.info('Enhanced Cache Manager closed')
  }
}
