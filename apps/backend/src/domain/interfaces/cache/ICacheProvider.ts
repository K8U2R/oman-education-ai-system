/**
 * ICacheProvider Interface
 *
 * Contract for any Caching Mechanism (Redis, Memcached, In-Memory)
 * Complies with Law 01 (Dependency Inversion).
 */

export interface ICacheProvider {
  /**
   * Retrieve a value by key
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Store a value with optional TTL (Time To Live) in seconds
   */
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;

  /**
   * Delete a value by key
   */
  del(key: string): Promise<void>;

  /**
   * Check provider health
   */
  checkHealth(): Promise<boolean>;
}
