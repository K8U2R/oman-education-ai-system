/**
 * MemoryCache - تخزين مؤقت في الذاكرة
 *
 * تنفيذ بسيط للتخزين المؤقت في الذاكرة
 */

export interface CacheEntry<T = unknown> {
  key: string
  value: T
  expiresAt: number
  createdAt: number
}

export class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map()
  private defaultTTL: number = 5 * 60 * 1000 // 5 دقائق افتراضياً
  private cleanupTimer: NodeJS.Timeout | null = null

  constructor(defaultTTL?: number) {
    if (defaultTTL) {
      this.defaultTTL = defaultTTL
    }

    // تنظيف دوري للـ cache المنتهية (باستخدام setTimeout المتكرر بدلاً من setInterval)
    this.scheduleCleanup()
  }

  /**
   * جدولة تنظيف دوري
   */
  private scheduleCleanup(): void {
    this.cleanupTimer = setTimeout(() => {
      this.cleanExpired()
      this.scheduleCleanup() // إعادة الجدولة
    }, 60 * 1000) // كل دقيقة
  }

  /**
   * إيقاف التنظيف الدوري
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }

  /**
   * الحصول على قيمة من الـ cache
   */
  get<T = unknown>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // التحقق من انتهاء الصلاحية
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.value as T
  }

  /**
   * حفظ قيمة في الـ cache
   */
  set<T = unknown>(key: string, value: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.defaultTTL)

    this.cache.set(key, {
      key,
      value,
      expiresAt,
      createdAt: now,
    })
  }

  /**
   * حذف قيمة من الـ cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * مسح جميع القيم من الـ cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * مسح القيم المنتهية الصلاحية
   */
  cleanExpired(): number {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        cleaned++
      }
    }

    return cleaned
  }

  /**
   * الحصول على حجم الـ cache
   */
  size(): number {
    return this.cache.size
  }

  /**
   * التحقق من وجود مفتاح في الـ cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) {
      return false
    }

    // التحقق من انتهاء الصلاحية
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * الحصول على جميع المفاتيح
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * الحصول على إحصائيات الـ cache
   */
  getStats(): {
    size: number
    entries: number
    expired: number
  } {
    const now = Date.now()
    let expired = 0

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expired++
      }
    }

    return {
      size: this.cache.size,
      entries: this.cache.size - expired,
      expired,
    }
  }
}
