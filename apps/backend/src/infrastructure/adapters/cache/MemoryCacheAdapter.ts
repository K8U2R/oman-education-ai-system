/**
 * Memory Cache Adapter
 *
 * In-memory cache adapter (L1 cache)
 */

import { ICacheAdapter, CacheConfig } from "./ICacheAdapter";
import { BaseAdapter, type HealthStatus } from "../base/BaseAdapter";
import { logger } from "@/shared/utils/logger";

interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
}

export class MemoryCacheAdapter
  extends BaseAdapter<CacheConfig, void>
  implements ICacheAdapter
{
  private cache = new Map<string, CacheEntry<unknown>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.connected = true;
    this.startCleanupInterval();
  }

  /**
   * Connect (no-op for memory cache)
   */
  async connect(_config: CacheConfig): Promise<void> {
    this.connected = true;
    this.logConnectionStatus("connected");
  }

  /**
   * Disconnect
   */
  async disconnect(): Promise<void> {
    this.connected = false;
    this.cache.clear();
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.logConnectionStatus("disconnected");
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthStatus> {
    return this.connected ? "healthy" : "unhealthy";
  }

  /**
   * Get adapter name
   */
  getName(): string {
    return "MemoryCacheAdapter";
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      value,
    };

    if (ttl) {
      entry.expiresAt = Date.now() + ttl * 1000;
    }

    this.cache.set(key, entry);
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get all keys matching pattern
   */
  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));
    return Array.from(this.cache.keys()).filter((key) => regex.test(key));
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpired();
      },
      5 * 60 * 1000,
    );
  }

  /**
   * Cleanup expired entries
   */
  private cleanupExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`Cleaned up ${cleaned} expired cache entries`);
    }
  }
}
