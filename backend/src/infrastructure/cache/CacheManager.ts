/**
 * Cache Manager - مدير التخزين المؤقت
 *
 * Multi-level caching system (L1: Memory, L2: Redis)
 */

import { ICacheAdapter } from "../adapters/cache/ICacheAdapter";
import { MemoryCacheAdapter } from "../adapters/cache/MemoryCacheAdapter";
import {
  RedisCacheAdapter,
  type RedisCacheConfig,
} from "../adapters/cache/RedisCacheAdapter";
import { logger } from "@/shared/utils/logger";
import { getSettings } from "@/shared/configuration";

export class CacheManager {
  private l1Cache: ICacheAdapter; // Fast, in-memory
  private l2Cache?: ICacheAdapter; // Distributed (Redis)

  constructor(l2Cache?: ICacheAdapter) {
    this.l1Cache = new MemoryCacheAdapter();

    if (l2Cache) {
      this.l2Cache = l2Cache;
    } else {
      // Try to initialize Redis if configured
      this.initializeRedis();
    }
  }

  /**
   * Initialize Redis cache if configured
   */
  private async initializeRedis(): Promise<void> {
    try {
      const settings = getSettings();
      const redisConfig: RedisCacheConfig = {
        host: settings.redis.host,
        port: settings.redis.port,
        password: settings.redis.password,
        db: settings.redis.db,
      };

      // Only initialize if Redis host is configured (not default)
      if (settings.redis.host && settings.redis.host !== "localhost") {
        const redisAdapter = new RedisCacheAdapter(redisConfig);
        await redisAdapter.connect(redisConfig);
        this.l2Cache = redisAdapter;
        logger.info("Redis cache initialized", {
          host: redisConfig.host,
          port: redisConfig.port,
        });
      } else {
        logger.debug("Redis not configured, using memory cache only");
      }
    } catch (error) {
      logger.warn("Failed to initialize Redis cache, using memory cache only", {
        error,
      });
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    // Check L1 first
    const l1Value = await this.l1Cache.get<T>(key);
    if (l1Value !== null) {
      logger.debug("Cache hit (L1)", { key });
      return l1Value;
    }

    // Check L2 if available
    if (this.l2Cache) {
      try {
        const l2Value = await this.l2Cache.get<T>(key);
        if (l2Value !== null) {
          // Populate L1
          await this.l1Cache.set(key, l2Value, 60); // 1 minute in L1
          logger.debug("Cache hit (L2)", { key });
          return l2Value;
        }
      } catch (error) {
        logger.warn("L2 cache read failed, falling back to L1", { error, key });
      }
    }

    logger.debug("Cache miss", { key });
    return null;
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const promises: Promise<void>[] = [
      this.l1Cache.set(key, value, Math.min(ttl || 3600, 60)), // Max 1 min in L1
    ];

    if (this.l2Cache) {
      promises.push(
        this.l2Cache.set(key, value, ttl).catch((error) => {
          logger.warn("L2 cache write failed", { error, key });
        }),
      );
    }

    await Promise.all(promises);
    logger.debug("Cache set", { key, ttl });
  }

  /**
   * Delete from cache
   */
  async delete(key: string): Promise<void> {
    const promises: Promise<void>[] = [this.l1Cache.delete(key)];

    if (this.l2Cache) {
      promises.push(
        this.l2Cache.delete(key).catch((error) => {
          logger.warn("L2 cache delete failed", { error, key });
        }),
      );
    }

    await Promise.all(promises);
    logger.debug("Cache deleted", { key });
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    await this.l1Cache.clear();
    if (this.l2Cache) {
      await this.l2Cache.clear().catch((error) => {
        logger.warn("L2 cache clear failed", { error });
      });
    }
    logger.info("Cache cleared");
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const l1Exists = await this.l1Cache.exists(key);
    if (l1Exists) return true;

    if (this.l2Cache) {
      try {
        return await this.l2Cache.exists(key);
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    l1Enabled: boolean;
    l2Enabled: boolean;
    l2Health?: "healthy" | "unhealthy" | "degraded";
  }> {
    const stats: {
      l1Enabled: boolean;
      l2Enabled: boolean;
      l2Health?: "healthy" | "unhealthy" | "degraded";
    } = {
      l1Enabled: true,
      l2Enabled: !!this.l2Cache,
    };

    if (this.l2Cache) {
      try {
        stats.l2Health = await this.l2Cache.healthCheck();
      } catch {
        stats.l2Health = "unhealthy";
      }
    }

    return stats;
  }
}

// Global instance
let cacheManagerInstance: CacheManager | null = null;

/**
 * Get Cache Manager instance (Singleton)
 */
export function getCacheManager(): CacheManager {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CacheManager();
  }
  return cacheManagerInstance;
}

/**
 * Reset Cache Manager (useful for testing)
 */
export function resetCacheManager(): void {
  if (cacheManagerInstance) {
    cacheManagerInstance.clear();
  }
  cacheManagerInstance = null;
}
