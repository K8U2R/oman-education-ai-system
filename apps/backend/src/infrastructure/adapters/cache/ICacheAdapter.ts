/**
 * Cache Adapter Interface
 *
 * Interface لجميع Cache Adapters
 */

import { IAdapter } from "../base/BaseAdapter";

export interface ICacheAdapter extends IAdapter<CacheConfig, void> {
  /**
   * Get value from cache
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Delete value from cache
   */
  delete(key: string): Promise<void>;

  /**
   * Clear all cache
   */
  clear(): Promise<void>;

  /**
   * Check if key exists
   */
  exists(key: string): Promise<boolean>;

  /**
   * Get all keys matching pattern
   */
  keys(pattern: string): Promise<string[]>;
}

export interface CacheConfig {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  [key: string]: unknown;
}
