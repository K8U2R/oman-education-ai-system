/**
 * Performance Monitoring Service - خدمة مراقبة الأداء
 *
 * خدمة لمراقبة أداء التطبيق
 */

import { analyticsService } from './analytics.service'

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
}

export interface ResourceTiming {
  name: string
  duration: number
  size: number
  type: string
}

class PerformanceService {
  private metrics: PerformanceMetric[] = []
  private resourceTimings: ResourceTiming[] = []

  /**
   * تهيئة مراقبة الأداء
   */
  init(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return
    }

    // Monitor page load performance
    this.measurePageLoad()

    // Monitor resource loading
    this.measureResources()

    // Monitor long tasks
    this.monitorLongTasks()

    // Monitor memory usage (if available)
    this.monitorMemory()
  }

  /**
   * قياس وقت تحميل الصفحة
   */
  measurePageLoad(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return
    }

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming

      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          load: navigation.loadEventEnd - navigation.loadEventStart,
          total: navigation.loadEventEnd - navigation.fetchStart,
        }

        Object.entries(metrics).forEach(([name, value]) => {
          this.recordMetric(name, value, 'ms')
        })
      }
    })
  }

  /**
   * قياس تحميل الموارد
   */
  measureResources(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return
    }

    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry instanceof PerformanceResourceTiming) {
          type PerformanceResourceTimingWithTransferSize = PerformanceResourceTiming & {
            transferSize?: number
          }
          const resource: ResourceTiming = {
            name: entry.name,
            duration: entry.duration,
            size: (entry as PerformanceResourceTimingWithTransferSize).transferSize || 0,
            type: entry.initiatorType,
          }

          this.resourceTimings.push(resource)

          // Track slow resources
          if (entry.duration > 1000) {
            analyticsService.trackPerformance('slow_resource', entry.duration, 'ms')
          }
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['resource'] })
    } catch (error) {
      console.warn('Performance Observer not supported:', error)
    }
  }

  /**
   * مراقبة المهام الطويلة
   */
  monitorLongTasks(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return
    }

    try {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.duration > 50) {
            // Long task detected (> 50ms)
            analyticsService.trackPerformance('long_task', entry.duration, 'ms')
            this.recordMetric('long_task', entry.duration, 'ms')
          }
        })
      })

      observer.observe({ entryTypes: ['longtask'] })
    } catch (error) {
      // Long task observer not supported in all browsers
      console.warn('Long task observer not supported:', error)
    }
  }

  /**
   * مراقبة استخدام الذاكرة
   */
  monitorMemory(): void {
    interface PerformanceWithMemory extends Performance {
      memory?: {
        usedJSHeapSize: number
        totalJSHeapSize: number
        jsHeapSizeLimit: number
      }
    }
    const performanceWithMemory = performance as PerformanceWithMemory
    if (typeof window === 'undefined' || !performanceWithMemory.memory) {
      return
    }

    const memory = performanceWithMemory.memory

    setInterval(() => {
      const used = memory.usedJSHeapSize / 1048576 // Convert to MB
      const total = memory.totalJSHeapSize / 1048576
      const limit = memory.jsHeapSizeLimit / 1048576

      this.recordMetric('memory_used', used, 'MB')
      this.recordMetric('memory_total', total, 'MB')
      this.recordMetric('memory_limit', limit, 'MB')

      // Alert if memory usage is high
      if (used / limit > 0.8) {
        analyticsService.trackPerformance('high_memory_usage', used, 'MB')
      }
    }, 30000) // Every 30 seconds
  }

  /**
   * تسجيل مقياس أداء
   */
  recordMetric(name: string, value: number, unit: string = 'ms'): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
    }

    this.metrics.push(metric)

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.shift()
    }

    // Send to analytics
    analyticsService.trackPerformance(name, value, unit)
  }

  /**
   * قياس وقت تنفيذ دالة
   */
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    const duration = end - start

    this.recordMetric(name, duration, 'ms')

    return result
  }

  /**
   * قياس وقت تنفيذ دالة async
   */
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    const duration = end - start

    this.recordMetric(name, duration, 'ms')

    return result
  }

  /**
   * الحصول على جميع المقاييس
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * الحصول على توقيتات الموارد
   */
  getResourceTimings(): ResourceTiming[] {
    return [...this.resourceTimings]
  }

  /**
   * الحصول على إحصائيات الأداء
   */
  getStats(): {
    averagePageLoad: number
    averageResourceLoad: number
    slowResources: ResourceTiming[]
    longTasks: PerformanceMetric[]
  } {
    const pageLoadMetrics = this.metrics.filter(m => m.name === 'total')
    const averagePageLoad =
      pageLoadMetrics.length > 0
        ? pageLoadMetrics.reduce((sum, m) => sum + m.value, 0) / pageLoadMetrics.length
        : 0

    const averageResourceLoad =
      this.resourceTimings.length > 0
        ? this.resourceTimings.reduce((sum, r) => sum + r.duration, 0) / this.resourceTimings.length
        : 0

    const slowResources = this.resourceTimings.filter(r => r.duration > 1000)
    const longTasks = this.metrics.filter(m => m.name === 'long_task')

    return {
      averagePageLoad,
      averageResourceLoad,
      slowResources,
      longTasks,
    }
  }

  /**
   * مسح البيانات
   */
  clear(): void {
    this.metrics = []
    this.resourceTimings = []
  }
}

export const performanceService = new PerformanceService()

// Auto initialize
if (typeof window !== 'undefined') {
  performanceService.init()
}
