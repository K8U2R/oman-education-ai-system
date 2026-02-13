/**
 * Enhanced Cache Service - خدمة التخزين المؤقت المحسّنة
 *
 * خدمة محسّنة للتعامل مع التخزين المؤقت
 * تدعم:
 * - Memory caching
 * - IndexedDB caching
 * - Cache invalidation
 * - Cache size limits
 */

import { indexedDBService } from '@/infrastructure/services/storage/indexeddb.service'

export interface EnhancedCacheOptions {
  ttl?: number // Time to live in milliseconds
  keyPrefix?: string
  useIndexedDB?: boolean // Use IndexedDB for persistence
  maxSize?: number // Maximum cache size (number of entries)
}

export interface EnhancedCacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl?: number
  version?: number
}

class EnhancedCacheService {
  private memoryCache: Map<string, EnhancedCacheEntry> = new Map()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes
  private keyPrefix = 'cache_'
  private defaultMaxSize = 1000 // Maximum 1000 entries

  /**
   * Get data from cache
   */
  async get<T = unknown>(key: string, options?: { useIndexedDB?: boolean }): Promise<T | null> {
    const fullKey = this.getFullKey(key)

    // T043.2: Enforce IndexedDB for AI and Recommendations
    const isSensitiveData = key.startsWith('ai_') || key.startsWith('rec_') || key.includes('recommendations')
    const useIndexedDB = isSensitiveData ? true : (options?.useIndexedDB ?? false)

    // Check memory cache first
    const memoryEntry = this.memoryCache.get(fullKey)
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      return memoryEntry.data as T
    }

    // Remove expired entry
    if (memoryEntry) {
      this.memoryCache.delete(fullKey)
    }

    // Check IndexedDB if enabled
    if (useIndexedDB) {
      try {
        await indexedDBService.init()
        const indexedDBEntry = await indexedDBService.get<EnhancedCacheEntry<T>>(
          'api-cache',
          fullKey
        )

        if (indexedDBEntry) {
          // Check if expired
          if (!this.isExpired(indexedDBEntry)) {
            // Restore to memory cache
            this.memoryCache.set(fullKey, indexedDBEntry)
            return indexedDBEntry.data
          } else {
            // Delete expired entry
            await indexedDBService.delete('api-cache', fullKey)
          }
        }
      } catch (error) {
        // Use logging service instead of console.error
        import('@/infrastructure/services').then(({ loggingService }) => {
          loggingService.error('Enhanced Cache: Failed to get from IndexedDB', error as Error)
        })
      }
    }

    return null
  }

  /**
   * Set data in cache
   */
  async set<T = unknown>(key: string, data: T, options?: EnhancedCacheOptions): Promise<void> {
    const fullKey = this.getFullKey(key, options?.keyPrefix)
    const ttl = options?.ttl ?? this.defaultTTL
    const maxSize = options?.maxSize ?? this.defaultMaxSize

    // T043.2: Enforce IndexedDB for AI and Recommendations
    const isSensitiveData = key.startsWith('ai_') || key.startsWith('rec_') || key.includes('recommendations')
    const useIndexedDB = isSensitiveData ? true : (options?.useIndexedDB ?? false)

    // Check cache size limit
    if (this.memoryCache.size >= maxSize) {
      this.evictOldest()
    }

    const entry: EnhancedCacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      version: 1,
    }

    // Store in memory
    this.memoryCache.set(fullKey, entry)

    // Store in IndexedDB if enabled
    if (useIndexedDB) {
      try {
        await indexedDBService.init()
        await indexedDBService.set('api-cache', fullKey, entry, { ttl })
      } catch (error) {
        // Use logging service instead of console.error
        import('@/infrastructure/services').then(({ loggingService }) => {
          loggingService.error('Enhanced Cache: Failed to set in IndexedDB', error as Error)
        })
      }
    }
  }

  /**
   * Delete data from cache
   */
  async delete(key: string, options?: { useIndexedDB?: boolean }): Promise<void> {
    const fullKey = this.getFullKey(key)
    const useIndexedDB = options?.useIndexedDB ?? false

    // Remove from memory
    this.memoryCache.delete(fullKey)

    // Remove from IndexedDB if enabled
    if (useIndexedDB) {
      try {
        await indexedDBService.init()
        await indexedDBService.delete('api-cache', fullKey)
      } catch (error) {
        // Use logging service instead of console.error
        import('@/infrastructure/services').then(({ loggingService }) => {
          loggingService.error('Enhanced Cache: Failed to delete from IndexedDB', error as Error)
        })
      }
    }
  }

  /**
   * Clear all cache
   */
  async clear(options?: { useIndexedDB?: boolean }): Promise<void> {
    const useIndexedDB = options?.useIndexedDB ?? false

    // Clear memory cache
    this.memoryCache.clear()

    // Clear IndexedDB if enabled
    if (useIndexedDB) {
      try {
        await indexedDBService.init()
        await indexedDBService.clear('api-cache')
      } catch (error) {
        // Use logging service instead of console.error
        import('@/infrastructure/services').then(({ loggingService }) => {
          loggingService.error('Enhanced Cache: Failed to clear IndexedDB', error as Error)
        })
      }
    }
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const fullKey = this.getFullKey(key)
    const entry = this.memoryCache.get(fullKey)
    return entry !== undefined && !this.isExpired(entry)
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.memoryCache.keys()).map(key => key.replace(this.keyPrefix, ''))
  }

  /**
   * Clean expired entries
   */
  async cleanup(options?: { useIndexedDB?: boolean }): Promise<number> {
    const useIndexedDB = options?.useIndexedDB ?? false
    let cleanedCount = 0

    // Clean memory cache
    const keysToDelete: string[] = []
    this.memoryCache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => {
      this.memoryCache.delete(key)
      cleanedCount++
    })

    // Clean IndexedDB if enabled
    if (useIndexedDB) {
      try {
        await indexedDBService.init()
        const indexedDBCleaned = await indexedDBService.cleanExpired('api-cache')
        cleanedCount += indexedDBCleaned
      } catch (error) {
        // Use logging service instead of console.error
        import('@/infrastructure/services').then(({ loggingService }) => {
          loggingService.error('Enhanced Cache: Failed to clean IndexedDB', error as Error)
        })
      }
    }

    return cleanedCount
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.memoryCache.size
  }

  /**
   * Get cache statistics
   */
  async getStats(options?: { useIndexedDB?: boolean }): Promise<{
    memorySize: number
    indexedDBSize?: number
    memoryEntries: number
  }> {
    const useIndexedDB = options?.useIndexedDB ?? false
    const stats: {
      memorySize: number
      indexedDBSize?: number
      memoryEntries: number
    } = {
      memorySize: this.memoryCache.size,
      memoryEntries: this.memoryCache.size,
    }

    if (useIndexedDB) {
      try {
        stats.indexedDBSize = await indexedDBService.getCacheSize('api-cache')
      } catch (error) {
        // Use logging service instead of console.error
        import('@/infrastructure/services').then(({ loggingService }) => {
          loggingService.error('Enhanced Cache: Failed to get IndexedDB stats', error as Error)
        })
      }
    }

    return stats
  }

  /**
   * Evict oldest entries when cache is full
   */
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTimestamp = Infinity

    this.memoryCache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp
        oldestKey = key
      }
    })

    if (oldestKey) {
      this.memoryCache.delete(oldestKey)
    }
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
  private isExpired(entry: EnhancedCacheEntry): boolean {
    if (!entry.ttl) return false
    return Date.now() - entry.timestamp > entry.ttl
  }
}

export const enhancedCacheService = new EnhancedCacheService()

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(
    () => {
      enhancedCacheService.cleanup({ useIndexedDB: true }).catch(error => {
        import('@/infrastructure/services').then(({ loggingService }) => {
          loggingService.error('Enhanced Cache: Auto cleanup failed', error as Error)
        })
      })
    },
    5 * 60 * 1000
  )
}
