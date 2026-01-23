/**
 * CacheKeyRegistry - سجل مفاتيح التخزين المؤقت
 *
 * نظام لتتبع وإدارة مفاتيح التخزين المؤقت بشكل منظم
 */

import { logger } from '../../shared/utils/logger'

/**
 * معلومات مفتاح Cache
 */
export interface CacheKeyInfo {
  key: string
  entity: string
  operation: string
  conditions?: Record<string, unknown>
  createdAt: number
  lastAccessed: number
  accessCount: number
}

/**
 * سجل مفاتيح التخزين المؤقت
 */
export class CacheKeyRegistry {
  private registry: Map<string, CacheKeyInfo> = new Map()
  private entityKeys: Map<string, Set<string>> = new Map() // entity -> Set of keys

  /**
   * تسجيل مفتاح جديد
   */
  register(
    key: string,
    entity: string,
    operation: string,
    conditions?: Record<string, unknown>
  ): void {
    const info: CacheKeyInfo = {
      key,
      entity,
      operation,
      conditions,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
    }

    this.registry.set(key, info)

    // إضافة إلى entityKeys
    if (!this.entityKeys.has(entity)) {
      this.entityKeys.set(entity, new Set())
    }
    this.entityKeys.get(entity)!.add(key)

    logger.debug('Cache key registered', { key, entity, operation })
  }

  /**
   * تحديث آخر وصول
   */
  updateAccess(key: string): void {
    const info = this.registry.get(key)
    if (info) {
      info.lastAccessed = Date.now()
      info.accessCount++
    }
  }

  /**
   * الحصول على جميع المفاتيح لـ entity معين
   */
  getKeysForEntity(entity: string): string[] {
    const keys = this.entityKeys.get(entity)
    return keys ? Array.from(keys) : []
  }

  /**
   * الحصول على جميع المفاتيح لـ operation معين
   */
  getKeysForOperation(operation: string): string[] {
    const keys: string[] = []
    for (const [key, info] of this.registry.entries()) {
      if (info.operation === operation) {
        keys.push(key)
      }
    }
    return keys
  }

  /**
   * الحصول على جميع المفاتيح لـ entity و operation
   */
  getKeysForEntityAndOperation(entity: string, operation: string): string[] {
    const keys: string[] = []
    for (const [key, info] of this.registry.entries()) {
      if (info.entity === entity && info.operation === operation) {
        keys.push(key)
      }
    }
    return keys
  }

  /**
   * إلغاء تسجيل مفتاح
   */
  unregister(key: string): boolean {
    const info = this.registry.get(key)
    if (info) {
      // إزالة من entityKeys
      const entityKeys = this.entityKeys.get(info.entity)
      if (entityKeys) {
        entityKeys.delete(key)
        if (entityKeys.size === 0) {
          this.entityKeys.delete(info.entity)
        }
      }

      this.registry.delete(key)
      logger.debug('Cache key unregistered', { key, entity: info.entity })
      return true
    }
    return false
  }

  /**
   * إلغاء تسجيل جميع المفاتيح لـ entity معين
   */
  unregisterEntity(entity: string): string[] {
    const keys = this.getKeysForEntity(entity)
    for (const key of keys) {
      this.unregister(key)
    }
    logger.debug('All cache keys unregistered for entity', { entity, count: keys.length })
    return keys
  }

  /**
   * إلغاء تسجيل جميع المفاتيح لـ operation معين
   */
  unregisterOperation(operation: string): string[] {
    const keys = this.getKeysForOperation(operation)
    for (const key of keys) {
      this.unregister(key)
    }
    logger.debug('All cache keys unregistered for operation', {
      operation,
      count: keys.length,
    })
    return keys
  }

  /**
   * الحصول على معلومات مفتاح
   */
  getKeyInfo(key: string): CacheKeyInfo | undefined {
    return this.registry.get(key)
  }

  /**
   * الحصول على إحصائيات
   */
  getStats(): {
    totalKeys: number
    entities: number
    operations: Set<string>
    entityStats: Array<{ entity: string; keyCount: number }>
  } {
    const operations = new Set<string>()
    const entityStatsMap = new Map<string, number>()

    for (const info of this.registry.values()) {
      operations.add(info.operation)
      entityStatsMap.set(info.entity, (entityStatsMap.get(info.entity) || 0) + 1)
    }

    const entityStats = Array.from(entityStatsMap.entries()).map(([entity, keyCount]) => ({
      entity,
      keyCount,
    }))

    return {
      totalKeys: this.registry.size,
      entities: entityStatsMap.size,
      operations,
      entityStats,
    }
  }

  /**
   * تنظيف المفاتيح القديمة (أكثر من maxAge)
   */
  cleanOldKeys(maxAge: number): number {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, info] of this.registry.entries()) {
      if (now - info.lastAccessed > maxAge) {
        keysToDelete.push(key)
      }
    }

    for (const key of keysToDelete) {
      this.unregister(key)
    }

    logger.debug('Old cache keys cleaned', { count: keysToDelete.length, maxAge })
    return keysToDelete.length
  }

  /**
   * مسح جميع المفاتيح
   */
  clear(): void {
    const count = this.registry.size
    this.registry.clear()
    this.entityKeys.clear()
    logger.info('Cache key registry cleared', { count })
  }

  /**
   * الحصول على جميع المفاتيح
   */
  getAllKeys(): string[] {
    return Array.from(this.registry.keys())
  }
}
