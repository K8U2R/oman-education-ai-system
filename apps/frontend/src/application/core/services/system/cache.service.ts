/**
 * Cache Service - خدمة التخزين المؤقت
 *
 * خدمة لإدارة التخزين المؤقت للبيانات
 */

import { storageAdapter } from '@/infrastructure/services/storage'

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  keyPrefix?: string
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl?: number
}

class CacheService {
  private memoryCache: Map<string, CacheEntry<unknown>> = new Map()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes
  private keyPrefix = 'cache_'

  /**
   * الحصول على بيانات من Cache
   */
  get<T>(key: string, useStorage: boolean = false): T | null {
    const fullKey = this.getFullKey(key)

    // Check memory cache first
    const memoryEntry = this.memoryCache.get(fullKey)
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      return memoryEntry.data as T
    }

    // Remove expired entry
    if (memoryEntry) {
      this.memoryCache.delete(fullKey)
    }

    // Check storage cache if enabled
    if (useStorage) {
      try {
        const stored = storageAdapter.get(fullKey)
        if (stored) {
          const entry: CacheEntry<T> = JSON.parse(stored)
          if (!this.isExpired(entry)) {
            // Restore to memory cache
            this.memoryCache.set(fullKey, entry)
            return entry.data
          } else {
            // Remove expired entry
            storageAdapter.remove(fullKey)
          }
        }
      } catch (error) {
        console.error('Failed to get from cache storage:', error)
      }
    }

    return null
  }

  /**
   * حفظ بيانات في Cache
   */
  set<T>(key: string, data: T, options?: CacheOptions): void {
    const fullKey = this.getFullKey(key, options?.keyPrefix)
    const ttl = options?.ttl ?? this.defaultTTL

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    }

    // Store in memory
    this.memoryCache.set(fullKey, entry)

    // Store in storage if needed (for persistence)
    // Note: Only store small data to avoid localStorage limits
    if (this.shouldStoreInStorage(data)) {
      try {
        storageAdapter.set(fullKey, JSON.stringify(entry))
      } catch (error) {
        console.error('Failed to store in cache storage:', error)
      }
    }
  }

  /**
   * حذف بيانات من Cache
   */
  delete(key: string, useStorage: boolean = false): void {
    const fullKey = this.getFullKey(key)

    // Remove from memory
    this.memoryCache.delete(fullKey)

    // Remove from storage
    if (useStorage) {
      try {
        storageAdapter.remove(fullKey)
      } catch (error) {
        console.error('Failed to delete from cache storage:', error)
      }
    }
  }

  /**
   * مسح جميع البيانات من Cache
   */
  clear(useStorage: boolean = false): void {
    // Clear memory cache
    this.memoryCache.clear()

    // Clear storage cache
    if (useStorage) {
      try {
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith(this.keyPrefix)) {
            storageAdapter.remove(key)
          }
        })
      } catch (error) {
        console.error('Failed to clear cache storage:', error)
      }
    }
  }

  /**
   * التحقق من وجود بيانات في Cache
   */
  has(key: string): boolean {
    const fullKey = this.getFullKey(key)
    const entry = this.memoryCache.get(fullKey)
    return entry !== undefined && !this.isExpired(entry)
  }

  /**
   * الحصول على جميع المفاتيح
   */
  keys(): string[] {
    return Array.from(this.memoryCache.keys()).map(key => key.replace(this.keyPrefix, ''))
  }

  /**
   * تنظيف Cache المنتهي الصلاحية
   */
  cleanup(): void {
    const keysToDelete: string[] = []

    this.memoryCache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => {
      this.memoryCache.delete(key)
    })
  }

  /**
   * الحصول على حجم Cache
   */
  size(): number {
    return this.memoryCache.size
  }

  /**
   * Helper: Get full key with prefix
   */
  private getFullKey(key: string, prefix?: string): string {
    return `${prefix ?? this.keyPrefix}${key}`
  }

  /**
   * Helper: Check if entry is expired
   */
  private isExpired(entry: CacheEntry<unknown>): boolean {
    if (!entry.ttl) return false
    return Date.now() - entry.timestamp > entry.ttl
  }

  /**
   * Helper: Check if data should be stored in storage
   */
  private shouldStoreInStorage(data: unknown): boolean {
    // Only store small data (less than 1MB when stringified)
    try {
      const size = JSON.stringify(data).length
      return size < 1024 * 1024 // 1MB
    } catch {
      return false
    }
  }
}

export const cacheService = new CacheService()

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(
    () => {
      cacheService.cleanup()
    },
    5 * 60 * 1000
  )
}
