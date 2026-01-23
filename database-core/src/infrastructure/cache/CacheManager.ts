/**
 * CacheManager - مدير التخزين المؤقت
 *
 * مدير موحد للتخزين المؤقت مع دعم استراتيجيات متعددة
 */

import { MemoryCache } from './MemoryCache'
import { logger } from '../../shared/utils/logger'

export interface CacheOptions {
  ttl?: number // Time to live بالمللي ثانية
  maxSize?: number // الحد الأقصى لحجم الـ cache
}

export class CacheManager {
  private cache: MemoryCache
  private maxSize: number
  private hitCount: number = 0
  private missCount: number = 0

  constructor(options: CacheOptions = {}) {
    this.cache = new MemoryCache(options.ttl)
    this.maxSize = options.maxSize || 1000
  }

  /**
   * الحصول على قيمة من الـ cache
   */
  get<T = unknown>(key: string): T | null {
    const value = this.cache.get<T>(key)

    if (value !== null) {
      this.hitCount++
      logger.debug('Cache hit', { key })
      return value
    }

    this.missCount++
    logger.debug('Cache miss', { key })
    return null
  }

  /**
   * حفظ قيمة في الـ cache
   */
  set<T = unknown>(key: string, value: T, ttl?: number): void {
    // التحقق من الحد الأقصى
    if (this.cache.size() >= this.maxSize) {
      // حذف أقدم قيمة (LRU بسيط)
      this.evictOldest()
    }

    this.cache.set(key, value, ttl)
    logger.debug('Cache set', { key })
  }

  /**
   * حذف قيمة من الـ cache
   */
  delete(key: string): boolean {
    const result = this.cache.delete(key)
    if (result) {
      logger.debug('Cache delete', { key })
    }
    return result
  }

  /**
   * مسح جميع القيم من الـ cache
   */
  clear(): void {
    this.cache.clear()
    this.hitCount = 0
    this.missCount = 0
    logger.info('Cache cleared')
  }

  /**
   * حذف أقدم قيمة (LRU بسيط)
   */
  private evictOldest(): void {
    const keys = this.cache.keys()
    if (keys.length > 0) {
      // حذف أول مفتاح (بسيط، يمكن تحسينه)
      this.cache.delete(keys[0])
      logger.debug('Cache evicted oldest', { key: keys[0] })
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
   * الحصول على إحصائيات الـ cache
   */
  getStats(): {
    size: number
    entries: number
    expired: number
    hitCount: number
    missCount: number
    hitRate: number
  } {
    const cacheStats = this.cache.getStats()
    const totalRequests = this.hitCount + this.missCount
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0

    return {
      ...cacheStats,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: Math.round(hitRate * 100) / 100,
    }
  }

  /**
   * مسح القيم المنتهية الصلاحية
   */
  cleanExpired(): number {
    return this.cache.cleanExpired()
  }
}
