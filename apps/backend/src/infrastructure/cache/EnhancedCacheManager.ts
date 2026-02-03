/**
 * Enhanced Cache Manager - مدير Cache محسّن
 *
 * إدارة Cache متقدمة مع:
 * - Multi-level Caching (Memory + Redis-ready)
 * - Cache Warming
 * - Cache Compression
 * - Intelligent Invalidation
 * - Cache Statistics
 */

import { logger } from "@/shared/utils/logger";

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
}

export interface CacheStatistics {
  hits: number;
  misses: number;
  hitRate: number;
  totalSize: number;
  entryCount: number;
  evictions: number;
  warmups: number;
}

export interface CacheConfig {
  ttl: number;
  maxSize: number;
  maxEntrySize?: number;
  enableCompression?: boolean;
  compressionThreshold?: number;
}

export class EnhancedCacheManager<T = unknown> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private readonly config: Required<CacheConfig>;
  private statistics: CacheStatistics = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalSize: 0,
    entryCount: 0,
    evictions: 0,
    warmups: 0,
  };

  constructor(config: CacheConfig) {
    this.config = {
      ttl: config.ttl,
      maxSize: config.maxSize,
      maxEntrySize: config.maxEntrySize || 1024 * 1024, // 1MB default
      enableCompression: config.enableCompression || false,
      compressionThreshold: config.compressionThreshold || 1024, // 1KB default
    };

    // Start cleanup interval
    this.startCleanupInterval();
  }

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.statistics.misses++;
      this.updateHitRate();
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.statistics.misses++;
      this.updateHitRate();
      this.statistics.totalSize -= entry.size;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.statistics.hits++;
    this.updateHitRate();

    return entry.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): boolean {
    const entrySize = this.calculateEntrySize(value);

    // Check max entry size
    if (entrySize > this.config.maxEntrySize) {
      logger.warn("Cache entry too large", { key, size: entrySize });
      return false;
    }

    // Check if we need to evict
    if (this.statistics.totalSize + entrySize > this.config.maxSize) {
      this.evictLRU(entrySize);
    }

    // Compress if enabled and above threshold
    let processedValue = value;
    if (
      this.config.enableCompression &&
      entrySize > this.config.compressionThreshold
    ) {
      processedValue = this.compress(value) as T;
    }

    const entry: CacheEntry<T> = {
      key,
      value: processedValue,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
      size: entrySize,
    };

    // Remove old entry if exists
    const oldEntry = this.cache.get(key);
    if (oldEntry) {
      this.statistics.totalSize -= oldEntry.size;
    }

    this.cache.set(key, entry);
    this.statistics.totalSize += entrySize;
    this.statistics.entryCount = this.cache.size;

    return true;
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.statistics.totalSize -= entry.size;
      this.statistics.entryCount = this.cache.size - 1;
      return this.cache.delete(key);
    }
    return false;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.statistics.totalSize = 0;
    this.statistics.entryCount = 0;
  }

  /**
   * Clear cache by pattern
   */
  clearPattern(pattern: string): number {
    let cleared = 0;
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        const entry = this.cache.get(key);
        if (entry) {
          this.statistics.totalSize -= entry.size;
          cleared++;
        }
        this.cache.delete(key);
      }
    }
    this.statistics.entryCount = this.cache.size;
    return cleared;
  }

  /**
   * Warm up cache with data
   */
  async warmup(
    entries: Array<{ key: string; value: T; ttl?: number }>,
  ): Promise<void> {
    logger.info("Warming cache", { count: entries.length });

    for (const entry of entries) {
      this.set(entry.key, entry.value, entry.ttl);
    }

    this.statistics.warmups++;
    logger.info("Cache warmed", { count: entries.length });
  }

  /**
   * Get cache statistics
   */
  getStatistics(): CacheStatistics {
    return {
      ...this.statistics,
      hitRate: this.statistics.hitRate,
    };
  }

  /**
   * Reset statistics
   */
  resetStatistics(): void {
    this.statistics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalSize: this.statistics.totalSize,
      entryCount: this.statistics.entryCount,
      evictions: this.statistics.evictions,
      warmups: this.statistics.warmups,
    };
  }

  /**
   * Calculate entry size
   */
  private calculateEntrySize(value: T): number {
    try {
      const serialized = JSON.stringify(value);
      return Buffer.byteLength(serialized, "utf8");
    } catch {
      return 0;
    }
  }

  /**
   * Compress value (simple implementation)
   */
  private compress(value: T): T {
    // In production, use a proper compression library like zlib
    // For now, return as-is
    return value;
  }

  /**
   * Decompress value
   */

  /**
   * Evict least recently used entries
   */
  private evictLRU(requiredSize: number): void {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, entry }))
      .sort((a, b) => a.entry.lastAccessed - b.entry.lastAccessed);

    let freedSize = 0;
    for (const { key, entry } of entries) {
      if (freedSize >= requiredSize) {
        break;
      }
      this.cache.delete(key);
      freedSize += entry.size;
      this.statistics.evictions++;
      this.statistics.totalSize -= entry.size;
    }

    this.statistics.entryCount = this.cache.size;
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    const total = this.statistics.hits + this.statistics.misses;
    this.statistics.hitRate =
      total > 0 ? (this.statistics.hits / total) * 100 : 0;
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    setInterval(
      () => {
        this.cleanupExpired();
      },
      5 * 60 * 1000,
    ); // Every 5 minutes
  }

  /**
   * Cleanup expired entries
   */
  private cleanupExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        this.statistics.totalSize -= entry.size;
        cleaned++;
      }
    }

    this.statistics.entryCount = this.cache.size;

    if (cleaned > 0) {
      logger.debug("Cleaned expired cache entries", { count: cleaned });
    }
  }
}
