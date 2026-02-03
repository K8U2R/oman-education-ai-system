/**
 * RoutePreloader - محمّل المسارات المسبق
 *
 * نظام خفيف وفعّال لتحميل المسارات (الـ lazy-loaded components) مسبقاً
 * لتحسين تجربة المستخدم وتقليل زمن الانتظار عند التنقل.
 *
 * الميزات المدعومة:
 * - تحميل عند الـ hover
 * - تحميل عند دخول الرابط في نطاق الشاشة (IntersectionObserver)
 * - تحميل المسارات الحرجة (مثل الروابط في شريط التنقل)
 * - تحميل في وقت الخمول (requestIdleCallback)
 * - تجنب التحميل المكرر
 */

import { RouteConfig } from '../types'

class RoutePreloader {
  /** مجموعة المسارات التي تم تحميلها مسبقاً لتجنب التكرار */
  private preloadedRoutes: Set<string> = new Set<string>()

  constructor() {
    // يمكن إضافة تهيئة أولية هنا إذا لزم الأمر
  }

  /**
   * تحميل مسار معين (lazy-loaded component)
   */
  private async preloadRoute(route: RouteConfig): Promise<void> {
    if (!route.lazy || this.preloadedRoutes.has(route.path)) {
      return
    }

    try {
      await route.lazy()
      this.preloadedRoutes.add(route.path)
      // Use logging service in production
      if (import.meta.env.PROD) {
        import('@/infrastructure/services').then(({ loggingService }) => {
          loggingService.debug(`تم تحميل المسار مسبقاً: ${route.path}`)
        })
      }
      // Route preloaded
    } catch (error) {
      // Use logging service instead of console.error
      import('@/infrastructure/services').then(({ loggingService }) => {
        loggingService.error(`فشل تحميل المسار مسبقاً ${route.path}`, error as Error)
      })
    }
  }

  /**
   * تحميل المسار عند تمرير المؤشر فوق الرابط (hover)
   *
   * يُستخدم مع <Link> أو أي عنصر قابل للنقر
   */
  public preloadOnHover(element: HTMLElement, route: RouteConfig): void {
    if (!element || !route) return

    const handleMouseEnter = () => {
      this.preloadRoute(route)
      element.removeEventListener('mouseenter', handleMouseEnter)
    }

    element.addEventListener('mouseenter', handleMouseEnter, { once: true })
  }

  /**
   * تحميل المسار عندما يدخل الرابط نطاق الشاشة
   *
   * مفيد للروابط في الأسفل أو القوائم الطويلة
   */
  public preloadOnViewport(
    element: HTMLElement,
    route: RouteConfig,
    rootMargin: string = '100px'
  ): void {
    if (!element || !route) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.preloadRoute(route)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin }
    )

    observer.observe(element)
  }

  /**
   * تحميل المسارات الحرجة (مثل الروابط الرئيسية في شريط التنقل)
   */
  public async preloadCriticalRoutes(routes: RouteConfig[]): Promise<void> {
    const criticalRoutes = routes.filter(
      route => route.metadata?.preload === true || route.metadata?.showInNav === true
    )

    if (criticalRoutes.length === 0) return

    await Promise.all(criticalRoutes.map(route => this.preloadRoute(route)))
  }

  /**
   * تحميل مسار في وقت الخمول (عندما يكون المتصفح غير مشغول)
   *
   * يُستخدم لتحميل المسارات غير الحرجة دون التأثير على الأداء
   */
  public preloadOnIdle(route: RouteConfig, options?: { timeout?: number }): void {
    if (!route) return

    const callback = () => this.preloadRoute(route)

    interface WindowWithIdleCallback {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
    }
    const windowWithIdleCallback = window as Window & WindowWithIdleCallback
    if ('requestIdleCallback' in window && windowWithIdleCallback.requestIdleCallback) {
      windowWithIdleCallback.requestIdleCallback(callback, options)
    } else {
      // Fallback: تأخير بسيط
      setTimeout(callback, 3000)
    }
  }

  /**
   * التحقق مما إذا كان المسار قد تم تحميله مسبقاً
   */
  public isPreloaded(path: string): boolean {
    return this.preloadedRoutes.has(path)
  }

  /**
   * مسح جميع المسارات المحمّلة مسبقاً
   *
   * مفيد عند تسجيل الخروج أو إعادة تحميل التطبيق
   */
  public clear(): void {
    this.preloadedRoutes.clear()
  }
}

/**
 * مثيل واحد (Singleton) يُستخدم في جميع أنحاء التطبيق
 */
export const routePreloader = new RoutePreloader()
