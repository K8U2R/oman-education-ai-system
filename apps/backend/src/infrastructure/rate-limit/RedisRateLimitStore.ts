/**
 * Redis Rate Limit Store
 *
 * Production-ready rate limiting using Redis
 */

import { CacheManager } from "../cache/CacheManager";
import { type IRateLimitStore } from "./RateLimitStoreFactory";

interface AttemptRecord {
  count: number;
  resetAt: string; // ISO string for serialization
  lockoutUntil?: string; // ISO string for serialization
}

export class RedisRateLimitStore implements IRateLimitStore {
  private cacheManager: CacheManager;
  private keyPrefix = "rate-limit:";

  constructor(cacheManager: CacheManager) {
    this.cacheManager = cacheManager;
  }

  /**
   * Increment attempt count
   */
  async increment(key: string, windowMs: number): Promise<number> {
    const cacheKey = this.getKey(key);
    const record = await this.cacheManager.get<AttemptRecord>(cacheKey);

    const now = Date.now();
    const resetAt = new Date(now + windowMs).toISOString();

    let updatedRecord: AttemptRecord;

    if (!record || new Date(record.resetAt).getTime() < now) {
      // New window or expired
      updatedRecord = {
        count: 1,
        resetAt,
      };
    } else {
      // Existing window
      updatedRecord = {
        ...record,
        count: record.count + 1,
      };
    }

    // Store with TTL
    const ttl = Math.ceil(windowMs / 1000);
    await this.cacheManager.set(cacheKey, updatedRecord, ttl);

    return updatedRecord.count;
  }

  /**
   * Get attempt count
   */
  async getAttempts(key: string): Promise<number> {
    const cacheKey = this.getKey(key);
    const record = await this.cacheManager.get<AttemptRecord>(cacheKey);

    if (!record) {
      return 0;
    }

    // Check if expired
    if (new Date(record.resetAt).getTime() < Date.now()) {
      return 0;
    }

    return record.count;
  }

  /**
   * Set lockout
   */
  async setLockout(key: string, lockoutMs: number): Promise<void> {
    const cacheKey = this.getKey(key);
    const record = await this.cacheManager.get<AttemptRecord>(cacheKey);

    if (record) {
      const lockoutUntil = new Date(Date.now() + lockoutMs);
      record.lockoutUntil = lockoutUntil.toISOString();

      const ttl = Math.ceil(lockoutMs / 1000);
      await this.cacheManager.set(cacheKey, record, ttl);
    } else {
      // Create new record with lockout
      const lockoutUntil = new Date(Date.now() + lockoutMs);
      const newRecord: AttemptRecord = {
        count: 0,
        resetAt: new Date().toISOString(),
        lockoutUntil: lockoutUntil.toISOString(),
      };

      const ttl = Math.ceil(lockoutMs / 1000);
      await this.cacheManager.set(cacheKey, newRecord, ttl);
    }
  }

  /**
   * Check if locked out
   */
  async isLocked(key: string): Promise<boolean> {
    const cacheKey = this.getKey(key);
    const record = await this.cacheManager.get<AttemptRecord>(cacheKey);

    if (!record || !record.lockoutUntil) {
      return false;
    }

    return new Date(record.lockoutUntil).getTime() > Date.now();
  }

  /**
   * Reset attempts
   */
  async reset(key: string): Promise<void> {
    const cacheKey = this.getKey(key);
    await this.cacheManager.delete(cacheKey);
  }

  /**
   * Get lockout until date
   */
  async getLockoutUntil(key: string): Promise<Date | undefined> {
    const cacheKey = this.getKey(key);
    const record = await this.cacheManager.get<AttemptRecord>(cacheKey);

    if (!record || !record.lockoutUntil) {
      return undefined;
    }

    return new Date(record.lockoutUntil);
  }

  /**
   * Get Redis key
   */
  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }
}
