/**
 * Rate Limit Store Factory
 *
 * Factory لإنشاء Rate Limit Store المناسب (Memory أو Redis)
 */

import { RateLimitStore } from "./RateLimitStore";
import { RedisRateLimitStore } from "./RedisRateLimitStore";
import { getCacheManager } from "../cache/CacheManager";
import { logger } from "@/shared/utils/logger";
import { getSettings } from "@/shared/configuration";

export interface IRateLimitStore {
  increment(key: string, windowMs: number): Promise<number> | number;
  getAttempts(key: string): Promise<number> | number;
  isLocked(key: string): Promise<boolean> | boolean;
  setLockout(key: string, durationMs: number): Promise<void> | void;
  reset(key: string): Promise<void> | void;
  getLockoutUntil(key: string): Promise<Date | undefined> | Date | undefined;
}

/**
 * Create Rate Limit Store based on configuration
 */
export function createRateLimitStore(): IRateLimitStore {
  const settings = getSettings();

  // Check if Redis is configured
  if (settings.redis.host && settings.redis.host !== "localhost") {
    try {
      const cacheManager = getCacheManager();
      // Try to get stats (async, but we'll handle it)
      cacheManager
        .getStats()
        .then((stats) => {
          if (stats.l2Enabled && stats.l2Health === "healthy") {
            logger.info("Redis is available for rate limiting");
          }
        })
        .catch(() => {
          // Ignore errors in async check
        });

      // Try Redis first
      const redisStore = new RedisRateLimitStore(cacheManager);
      logger.info("Using Redis for rate limiting", {
        host: settings.redis.host,
        port: settings.redis.port,
      });
      return redisStore;
    } catch (error) {
      logger.warn(
        "Failed to initialize Redis rate limit store, falling back to memory",
        {
          error,
        },
      );
    }
  }

  // Default to memory storage
  logger.info("Using in-memory rate limit store");
  return new RateLimitStore();
}
