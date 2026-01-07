/**
 * Analytics Service - خدمة التحليلات
 *
 * خدمة لتتبع الأحداث والتحليلات
 */

export interface AnalyticsEvent {
  name: string
  category: string
  action: string
  label?: string
  value?: number
  properties?: Record<string, unknown>
  timestamp: number
}

export interface PageView {
  path: string
  title: string
  timestamp: number
  duration?: number
}

class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private pageViews: PageView[] = []
  private sessionStartTime: number = Date.now()
  private currentPageStartTime: number = Date.now()

  /**
   * تتبع حدث
   */
  trackEvent(
    name: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, unknown>
  ): void {
    const event: AnalyticsEvent = {
      name,
      category,
      action,
      label,
      value,
      properties,
      timestamp: Date.now(),
    }

    this.events.push(event)

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events.shift()
    }

    // Send to analytics service (e.g., Google Analytics, Mixpanel)
    this.sendToAnalytics(event)
  }

  /**
   * تتبع عرض صفحة
   */
  trackPageView(path: string, title: string): void {
    const now = Date.now()
    const duration = now - this.currentPageStartTime

    // Track previous page view duration
    if (this.pageViews.length > 0) {
      const lastPageView = this.pageViews[this.pageViews.length - 1]
      if (lastPageView) {
        lastPageView.duration = duration
      }
    }

    const pageView: PageView = {
      path,
      title,
      timestamp: now,
    }

    this.pageViews.push(pageView)
    this.currentPageStartTime = now

    // Keep only last 100 page views
    if (this.pageViews.length > 100) {
      this.pageViews.shift()
    }

    // Send to analytics service
    this.sendPageViewToAnalytics(pageView)
  }

  /**
   * تتبع خطأ
   */
  trackError(error: Error, context?: Record<string, unknown>): void {
    this.trackEvent('error', 'Error', 'Error Occurred', error.message, undefined, {
      error: error.message,
      stack: error.stack,
      ...context,
    })
  }

  /**
   * تتبع أداء
   */
  trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.trackEvent('performance', 'Performance', metric, unit, value)
  }

  /**
   * الحصول على جميع الأحداث
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  /**
   * الحصول على جميع عرض الصفحات
   */
  getPageViews(): PageView[] {
    return [...this.pageViews]
  }

  /**
   * الحصول على إحصائيات الجلسة
   */
  getSessionStats(): {
    duration: number
    pageViews: number
    events: number
  } {
    return {
      duration: Date.now() - this.sessionStartTime,
      pageViews: this.pageViews.length,
      events: this.events.length,
    }
  }

  /**
   * إرسال حدث إلى خدمة التحليلات الخارجية
   */
  private sendToAnalytics(event: AnalyticsEvent): void {
    // Google Analytics 4
    interface WindowWithGtag extends Window {
      gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void
    }
    const windowWithGtag = window as WindowWithGtag
    if (typeof window !== 'undefined' && windowWithGtag.gtag) {
      const gtag = windowWithGtag.gtag
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.properties,
      })
    }

    // Custom analytics endpoint
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(error => {
        console.error('Failed to send analytics event:', error)
      })
    }
  }

  /**
   * إرسال عرض صفحة إلى خدمة التحليلات الخارجية
   */
  private sendPageViewToAnalytics(pageView: PageView): void {
    // Google Analytics 4
    interface WindowWithGtag extends Window {
      gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void
    }
    const windowWithGtag = window as WindowWithGtag
    if (typeof window !== 'undefined' && windowWithGtag.gtag) {
      const gtag = windowWithGtag.gtag
      const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || ''
      gtag('config', measurementId, {
        page_path: pageView.path,
        page_title: pageView.title,
      })
    }

    // Custom analytics endpoint
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(`${import.meta.env.VITE_ANALYTICS_ENDPOINT}/pageview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageView),
      }).catch(error => {
        console.error('Failed to send page view:', error)
      })
    }
  }

  /**
   * تصدير البيانات
   */
  exportData(): {
    events: AnalyticsEvent[]
    pageViews: PageView[]
    sessionStats: {
      duration: number
      pageViews: number
      events: number
    }
  } {
    return {
      events: this.getEvents(),
      pageViews: this.getPageViews(),
      sessionStats: this.getSessionStats(),
    }
  }

  /**
   * مسح البيانات
   */
  clear(): void {
    this.events = []
    this.pageViews = []
    this.sessionStartTime = Date.now()
    this.currentPageStartTime = Date.now()
  }
}

export const analyticsService = new AnalyticsService()
