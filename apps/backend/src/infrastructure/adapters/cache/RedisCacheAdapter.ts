/**
 * Redis Cache Adapter
 *
 * Redis cache adapter (L2 cache - distributed)
 */

import { createClient, RedisClientType } from "redis";
import { ICacheAdapter, CacheConfig } from "./ICacheAdapter";
import { BaseAdapter, type HealthStatus } from "../base/BaseAdapter";
import { logger } from "@/shared/utils/logger";

export interface RedisCacheConfig extends CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export class RedisCacheAdapter
  extends BaseAdapter<RedisCacheConfig, void>
  implements ICacheAdapter
{
  private client: RedisClientType | null = null;

  constructor(config?: RedisCacheConfig) {
    super();
    if (config) {
      this.config = config;
    }
  }

  /**
   * Connect to Redis
   */
  async connect(config: RedisCacheConfig): Promise<void> {
    this.config = config;

    this.client = createClient({
      socket: {
        host: config.host,
        port: config.port,
      },
      password: config.password,
      database: config.db || 0,
    });

    this.client.on("error", (err: Error) => {
      // Only log error if not already disconnected (to avoid spam)
      if (this.connected !== false) {
        logger.error("Redis error", { error: err });
      }
      this.connected = false;
    });

    this.client.on("connect", () => {
      logger.info("Redis connected", { host: config.host, port: config.port });
      this.connected = true;
    });

    this.client.on("disconnect", () => {
      logger.warn("Redis disconnected");
      this.connected = false;
    });

    await this.client.connect();
    this.logConnectionStatus("connected");
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.connected = false;
      this.logConnectionStatus("disconnected");
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthStatus> {
    if (!this.client || !this.isConnected()) {
      return "unhealthy";
    }

    const start = Date.now();
    try {
      await this.client.ping();
      const latency = Date.now() - start;

      if (latency > 1000) {
        return "degraded";
      }

      return "healthy";
    } catch {
      return "unhealthy";
    }
  }

  /**
   * Get adapter name
   */
  getName(): string {
    return "RedisCacheAdapter";
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.client) throw new Error("Redis not connected");

    const value = await this.client.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");

    const serialized =
      typeof value === "string" ? value : JSON.stringify(value);

    if (ttl) {
      await this.client.setEx(key, ttl, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");
    await this.client.del(key);
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");
    await this.client.flushDb();
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client) throw new Error("Redis not connected");
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * Get all keys matching pattern
   */
  async keys(pattern: string): Promise<string[]> {
    if (!this.client) throw new Error("Redis not connected");
    return await this.client.keys(pattern);
  }
}
