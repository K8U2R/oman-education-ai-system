/**
 * Cache Utilities
 * أدوات التخزين المؤقت
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class CacheManager {
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  /**
   * حفظ بيانات في Cache
   */
  set<T>(key: string, data: T, duration: number = CACHE_DURATION): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + duration,
    });
  }

  /**
   * الحصول على بيانات من Cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * التحقق من وجود بيانات في Cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * حذف بيانات من Cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * مسح جميع بيانات Cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * تنظيف Cache من البيانات المنتهية
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * الحصول على حجم Cache
   */
  size(): number {
    return this.cache.size;
  }
}

export const cacheManager = new CacheManager();

// تنظيف تلقائي كل 10 دقائق
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanup();
  }, 10 * 60 * 1000);
}

