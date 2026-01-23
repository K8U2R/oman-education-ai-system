/**
 * Rate Limit Store - مخزن Rate Limiting
 *
 * In-memory store لتتبع محاولات تسجيل الدخول
 * يمكن استبداله بـ Redis لاحقاً للإنتاج
 */

interface AttemptRecord {
  count: number;
  resetAt: Date;
  lockoutUntil?: Date;
}

export class RateLimitStore {
  private attempts: Map<string, AttemptRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired records every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * زيادة عدد المحاولات
   *
   * @param key - مفتاح التتبع (مثل: login:ip:email)
   * @param windowMs - نافذة الوقت بالميلي ثانية
   * @returns عدد المحاولات الحالي
   */
  increment(key: string, windowMs: number): number {
    const record = this.attempts.get(key) || {
      count: 0,
      resetAt: new Date(Date.now() + windowMs),
    };

    // Reset if window expired
    if (new Date() > record.resetAt) {
      record.count = 0;
      record.resetAt = new Date(Date.now() + windowMs);
      record.lockoutUntil = undefined;
    }

    record.count++;
    this.attempts.set(key, record);

    return record.count;
  }

  /**
   * الحصول على عدد المحاولات
   *
   * @param key - مفتاح التتبع
   * @returns عدد المحاولات (0 إذا انتهت النافذة)
   */
  getAttempts(key: string): number {
    const record = this.attempts.get(key);
    if (!record || new Date() > record.resetAt) {
      return 0;
    }
    return record.count;
  }

  /**
   * التحقق من حالة الحظر
   *
   * @param key - مفتاح التتبع
   * @returns true إذا كان محظوراً
   */
  isLocked(key: string): boolean {
    const record = this.attempts.get(key);
    if (!record || !record.lockoutUntil) {
      return false;
    }
    return new Date() < record.lockoutUntil;
  }

  /**
   * تعيين حالة الحظر
   *
   * @param key - مفتاح التتبع
   * @param durationMs - مدة الحظر بالميلي ثانية
   */
  setLockout(key: string, durationMs: number): void {
    const record = this.attempts.get(key) || {
      count: 0,
      resetAt: new Date(),
    };
    record.lockoutUntil = new Date(Date.now() + durationMs);
    this.attempts.set(key, record);
  }

  /**
   * إعادة تعيين المحاولات
   *
   * @param key - مفتاح التتبع
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * الحصول على وقت انتهاء الحظر
   *
   * @param key - مفتاح التتبع
   * @returns Date أو undefined
   */
  getLockoutUntil(key: string): Date | undefined {
    const record = this.attempts.get(key);
    return record?.lockoutUntil;
  }

  /**
   * تنظيف السجلات المنتهية
   *
   * @private
   */
  private cleanup(): void {
    const now = new Date();
    let cleaned = 0;

    for (const [key, record] of this.attempts.entries()) {
      const isExpired = now > record.resetAt;
      const isLockoutExpired = record.lockoutUntil && now > record.lockoutUntil;

      if (isExpired && isLockoutExpired) {
        this.attempts.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      // Log cleanup if needed
    }
  }

  /**
   * إيقاف التنظيف التلقائي (للاستخدام في الاختبارات)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}
