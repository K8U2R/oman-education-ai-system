/**
 * Rate Limit Middleware - Middleware لتحديد معدل الطلبات
 *
 * Middleware لتحديد عدد الطلبات المسموح بها لكل IP أو User
 */

import { Request, Response, NextFunction } from 'express'
import { DatabaseResponse } from '../../../application/dto/DatabaseResponse.dto'
import { logger } from '../../../shared/utils/logger'

export interface RateLimitOptions {
  windowMs: number // نافذة الوقت بالمللي ثانية
  maxRequests: number // الحد الأقصى للطلبات
  message?: string // رسالة الخطأ
  skipSuccessfulRequests?: boolean // تخطي الطلبات الناجحة
  skipFailedRequests?: boolean // تخطي الطلبات الفاشلة
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

export class RateLimitMiddleware {
  private store: RateLimitStore = {}
  private readonly options: Required<RateLimitOptions>
  private cleanupTimer: NodeJS.Timeout | null = null

  constructor(options: RateLimitOptions) {
    this.options = {
      windowMs: options.windowMs,
      maxRequests: options.maxRequests,
      message: options.message || 'تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً.',
      skipSuccessfulRequests: options.skipSuccessfulRequests || false,
      skipFailedRequests: options.skipFailedRequests || false,
    }

    // تنظيف دوري للـ store (باستخدام setTimeout المتكرر)
    this.scheduleCleanup()
  }

  /**
   * جدولة تنظيف دوري
   */
  private scheduleCleanup(): void {
    this.cleanupTimer = setTimeout(() => {
      this.cleanExpired()
      this.scheduleCleanup() // إعادة الجدولة
    }, this.options.windowMs)
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
   * Middleware function
   */
  middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = this.getKey(req)
      const now = Date.now()

      // الحصول على السجل الحالي
      let record = this.store[key]

      // إنشاء سجل جديد إذا لم يكن موجوداً أو انتهت صلاحيته
      if (!record || now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + this.options.windowMs,
        }
        this.store[key] = record
      }

      // زيادة العداد
      record.count++

      // التحقق من تجاوز الحد
      if (record.count > this.options.maxRequests) {
        const remaining = Math.ceil((record.resetTime - now) / 1000)

        logger.warn('Rate limit exceeded', {
          key,
          count: record.count,
          maxRequests: this.options.maxRequests,
          remaining,
        })

        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('X-RateLimit-Limit', this.options.maxRequests.toString())
        res.setHeader('X-RateLimit-Remaining', '0')
        res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString())

        const response = DatabaseResponse.error(
          `${this.options.message} (الحد الأقصى: ${this.options.maxRequests} طلب في ${Math.ceil(this.options.windowMs / 1000)} ثانية)`
        )

        res.status(429).json(response.toJSON())
        return
      }

      // إضافة Headers
      res.setHeader('X-RateLimit-Limit', this.options.maxRequests.toString())
      res.setHeader('X-RateLimit-Remaining', (this.options.maxRequests - record.count).toString())
      res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString())

      // تتبع الاستجابة (سيتم التعامل معه في performance middleware)

      next()
    }
  }

  /**
   * الحصول على مفتاح Rate Limit (IP أو User ID)
   */
  private getKey(req: Request): string {
    // يمكن استخدام User ID إذا كان موجوداً
    // const userId = (req as any).user?.id
    // if (userId) {
    //   return `user:${userId}`
    // }

    // استخدام IP كافتراضي
    const ip = req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for'] || 'unknown'

    return `ip:${ip}`
  }

  /**
   * تنظيف السجلات المنتهية الصلاحية
   */
  private cleanExpired(): void {
    const now = Date.now()
    const keys = Object.keys(this.store)

    for (const key of keys) {
      if (now > this.store[key].resetTime) {
        delete this.store[key]
      }
    }
  }

  /**
   * مسح جميع السجلات
   */
  clear(): void {
    this.store = {}
    logger.info('Rate limit store cleared')
  }

  /**
   * الحصول على إحصائيات Rate Limit
   */
  getStats(): {
    totalKeys: number
    activeKeys: number
  } {
    const now = Date.now()
    const activeKeys = Object.values(this.store).filter(record => now <= record.resetTime).length

    return {
      totalKeys: Object.keys(this.store).length,
      activeKeys,
    }
  }
}

/**
 * إنشاء Rate Limit Middleware
 */
export function createRateLimitMiddleware(
  options: RateLimitOptions
): (req: Request, res: Response, next: NextFunction) => void {
  const rateLimit = new RateLimitMiddleware(options)
  return rateLimit.middleware()
}
