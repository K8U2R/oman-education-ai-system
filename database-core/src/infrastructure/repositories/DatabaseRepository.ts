/**
 * DatabaseRepository - مستودع قاعدة البيانات
 *
 * مستودع يوفر واجهة عالية المستوى للوصول إلى قاعدة البيانات
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { QueryOptions } from '../../domain/value-objects/QueryOptions'
import { QueryResult } from '../../domain/entities/QueryResult'
import { CacheManager } from '../cache/CacheManager'
import { CacheKeyRegistry } from '../cache/CacheKeyRegistry'
import { logger } from '../../shared/utils/logger'

export class DatabaseRepository {
  private readonly cacheRegistry: CacheKeyRegistry

  constructor(
    private readonly adapter: IDatabaseAdapter,
    private readonly cache?: CacheManager
  ) {
    this.cacheRegistry = new CacheKeyRegistry()
  }

  /**
   * البحث عن سجلات
   */
  async find<T = unknown>(
    entity: string,
    conditions: Record<string, unknown> = {},
    options?: QueryOptions
  ): Promise<QueryResult<T[]>> {
    const startTime = Date.now()

    // محاولة الحصول من الـ cache
    if (this.cache) {
      const cacheKey = this.cache.generateKey(`find:${entity}`, {
        conditions,
        options: options?.toJSON(),
      })

      // تسجيل المفتاح في Registry
      this.cacheRegistry.register(cacheKey, entity, 'find', conditions)

      const cached = this.cache.get<T[]>(cacheKey)

      if (cached !== null) {
        this.cacheRegistry.updateAccess(cacheKey)
        logger.debug('Cache hit for find', { entity, cacheKey })
        return new QueryResult<T[]>({
          data: cached,
          count: cached.length,
          metadata: {
            executionTime: Date.now() - startTime,
            cached: true,
          },
        })
      }
    }

    // تنفيذ الاستعلام
    const results = await this.adapter.find<T>(entity, conditions, options?.toJSON())

    const executionTime = Date.now() - startTime

    // حفظ في الـ cache
    if (this.cache && results.length > 0) {
      const cacheKey = this.cache.generateKey(`find:${entity}`, {
        conditions,
        options: options?.toJSON(),
      })
      this.cache.set(cacheKey, results, 5 * 60 * 1000) // 5 دقائق
      // المفتاح مسجل بالفعل في Registry
    }

    return new QueryResult<T[]>({
      data: results,
      count: results.length,
      metadata: {
        executionTime,
        cached: false,
      },
    })
  }

  /**
   * البحث عن سجل واحد
   */
  async findOne<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>
  ): Promise<QueryResult<T | null>> {
    const startTime = Date.now()

    // محاولة الحصول من الـ cache
    if (this.cache) {
      const cacheKey = this.cache.generateKey(`findOne:${entity}`, {
        conditions,
      })

      // تسجيل المفتاح في Registry
      this.cacheRegistry.register(cacheKey, entity, 'findOne', conditions)

      const cached = this.cache.get<T>(cacheKey)

      if (cached !== null) {
        this.cacheRegistry.updateAccess(cacheKey)
        logger.debug('Cache hit for findOne', { entity, cacheKey })
        return new QueryResult<T | null>({
          data: cached,
          metadata: {
            executionTime: Date.now() - startTime,
            cached: true,
          },
        })
      }
    }

    // تنفيذ الاستعلام
    const result = await this.adapter.findOne<T>(entity, conditions)
    const executionTime = Date.now() - startTime

    // حفظ في الـ cache
    if (this.cache && result !== null) {
      const cacheKey = this.cache.generateKey(`findOne:${entity}`, {
        conditions,
      })
      this.cache.set(cacheKey, result, 5 * 60 * 1000) // 5 دقائق
      // المفتاح مسجل بالفعل في Registry
    }

    return new QueryResult<T | null>({
      data: result,
      metadata: {
        executionTime,
        cached: false,
      },
    })
  }

  /**
   * إدراج سجل
   */
  async insert<T = unknown>(
    entity: string,
    data: Record<string, unknown>
  ): Promise<QueryResult<T>> {
    const startTime = Date.now()

    // تنفيذ الإدراج
    const result = await this.adapter.insert<T>(entity, data)
    const executionTime = Date.now() - startTime

    // مسح الـ cache للـ entity
    if (this.cache) {
      this.invalidateCache(entity)
    }

    return new QueryResult<T>({
      data: result,
      metadata: {
        executionTime,
      },
    })
  }

  /**
   * تحديث سجل
   */
  async update<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<QueryResult<T>> {
    const startTime = Date.now()

    // تنفيذ التحديث
    const result = await this.adapter.update<T>(entity, conditions, data)
    const executionTime = Date.now() - startTime

    // مسح الـ cache للـ entity
    if (this.cache) {
      this.invalidateCache(entity)
    }

    return new QueryResult<T>({
      data: result,
      metadata: {
        executionTime,
      },
    })
  }

  /**
   * حذف سجل
   */
  async delete(
    entity: string,
    conditions: Record<string, unknown>,
    soft?: boolean
  ): Promise<QueryResult<boolean>> {
    const startTime = Date.now()

    // تنفيذ الحذف
    const result = await this.adapter.delete(entity, conditions, soft)
    const executionTime = Date.now() - startTime

    // مسح الـ cache للـ entity
    if (this.cache) {
      this.invalidateCache(entity)
    }

    return new QueryResult<boolean>({
      data: result,
      metadata: {
        executionTime,
      },
    })
  }

  /**
   * مسح الـ cache لـ entity معين
   */
  private invalidateCache(entity: string): void {
    if (!this.cache) {
      return
    }

    // استخدام CacheKeyRegistry للحصول على جميع المفاتيح المتعلقة بالـ entity
    const keysToDelete = this.cacheRegistry.getKeysForEntity(entity)

    for (const key of keysToDelete) {
      this.cache.delete(key)
      this.cacheRegistry.unregister(key)
    }

    logger.debug('Cache invalidated for entity', {
      entity,
      invalidatedKeys: keysToDelete.length,
    })
  }

  /**
   * الحصول على إحصائيات Cache Registry
   */
  getCacheRegistryStats() {
    return this.cacheRegistry.getStats()
  }

  /**
   * تنظيف المفاتيح القديمة من Registry
   */
  cleanOldCacheKeys(maxAge: number): number {
    return this.cacheRegistry.cleanOldKeys(maxAge)
  }
}
