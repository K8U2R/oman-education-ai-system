/**
 * Cache Types - أنواع التخزين المؤقت
 *
 * أنواع موحدة لنظام التخزين المؤقت (Caching)
 */

import type { Metadata } from "./common.types";

/**
 * Cache Key - مفتاح التخزين المؤقت
 */
export type CacheKey = string;

/**
 * Cache TTL - وقت انتهاء التخزين المؤقت (Time To Live)
 */
export type CacheTTL = number; // seconds

/**
 * Cache Strategy - استراتيجية التخزين المؤقت
 */
export type CacheStrategy =
  | "cache-aside"
  | "write-through"
  | "write-behind"
  | "refresh-ahead"
  | "read-through";

/**
 * Cache Entry - إدخال التخزين المؤقت
 *
 * بنية موحدة لإدخالات التخزين المؤقت
 */
export interface CacheEntry<T = unknown> {
  key: CacheKey;
  value: T;
  ttl: CacheTTL;
  createdAt: string;
  expiresAt: string;
  hits: number;
  lastAccessedAt: string;
  tags?: string[];
  metadata?: Metadata;
}

/**
 * Cache Options - خيارات التخزين المؤقت
 */
export interface CacheOptions {
  ttl?: CacheTTL;
  tags?: string[];
  metadata?: Metadata;
  strategy?: CacheStrategy;
  compress?: boolean;
  serialize?: boolean;
}

/**
 * Cache Statistics - إحصائيات التخزين المؤقت
 */
export interface CacheStatistics {
  totalKeys: number;
  totalSize: number; // bytes
  hits: number;
  misses: number;
  hitRate: number; // percentage
  evictions: number;
  memoryUsage: number; // bytes
  averageAccessTime: number; // milliseconds
}

/**
 * Cache Provider - مزود التخزين المؤقت
 */
export type CacheProvider =
  | "memory"
  | "redis"
  | "memcached"
  | "file"
  | "database";

/**
 * Cache Configuration - إعدادات التخزين المؤقت
 */
export interface CacheConfiguration {
  provider: CacheProvider;
  defaultTTL: CacheTTL;
  maxSize?: number; // bytes
  maxKeys?: number;
  evictionPolicy?: "lru" | "lfu" | "fifo" | "random";
  connectionString?: string;
  password?: string;
  database?: number;
  cluster?: {
    nodes: string[];
    options?: Record<string, unknown>;
  };
}

/**
 * Cache Invalidation Pattern - نمط إبطال التخزين المؤقت
 */
export type CacheInvalidationPattern =
  | CacheKey
  | CacheKey[]
  | {
      pattern: string; // glob pattern
      tags?: string[];
    };

/**
 * Cache Operation - عملية التخزين المؤقت
 */
export type CacheOperation =
  | "get"
  | "set"
  | "delete"
  | "exists"
  | "clear"
  | "invalidate";

/**
 * Cache Batch Operation - عملية تخزين مؤقت مجمعة
 */
export interface CacheBatchOperation {
  operation: "get" | "set" | "delete";
  keys: CacheKey[];
  values?: unknown[];
  options?: CacheOptions;
}

/**
 * Cache Lock - قفل التخزين المؤقت
 *
 * للتحكم في الوصول المتزامن
 */
export interface CacheLock {
  key: CacheKey;
  acquiredAt: string;
  expiresAt: string;
  owner: string;
  timeout: number; // milliseconds
}

/**
 * Cache Interface - واجهة التخزين المؤقت
 *
 * واجهة موحدة لعمليات التخزين المؤقت
 */
export interface ICache {
  get<T = unknown>(key: CacheKey): Promise<T | null>;
  set<T = unknown>(
    key: CacheKey,
    value: T,
    options?: CacheOptions,
  ): Promise<boolean>;
  delete(key: CacheKey): Promise<boolean>;
  exists(key: CacheKey): Promise<boolean>;
  clear(): Promise<boolean>;
  invalidate(pattern: CacheInvalidationPattern): Promise<number>;
  getMany<T = unknown>(keys: CacheKey[]): Promise<Map<CacheKey, T | null>>;
  setMany(
    entries: Map<CacheKey, unknown>,
    options?: CacheOptions,
  ): Promise<boolean>;
  getStatistics(): Promise<CacheStatistics>;
  acquireLock(key: CacheKey, timeout?: number): Promise<CacheLock | null>;
  releaseLock(lock: CacheLock): Promise<boolean>;
}

/**
 * Cache Decorator Options - خيارات ديكوراتور التخزين المؤقت
 */
export interface CacheDecoratorOptions extends CacheOptions {
  keyGenerator?: (...args: unknown[]) => CacheKey;
  condition?: (...args: unknown[]) => boolean;
  invalidateOn?: {
    method?: string;
    pattern?: CacheInvalidationPattern;
  };
}
