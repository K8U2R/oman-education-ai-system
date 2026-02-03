/**
 * Performance Service - خدمة الأداء
 *
 * خدمة لتتبع Web Vitals و Performance Metrics في Frontend
 */

// Performance tracking using native Performance API

export interface WebVitals {
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  fcp?: number // First Contentful Paint
  inp?: number // Interaction to Next Paint
}

export interface PerformanceMetrics {
  memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
  timing?: {
    domContentLoaded: number
    loadComplete: number
    firstPaint: number
    firstContentfulPaint: number
  }
  navigation?: {
    type: string
    redirectCount: number
  }
}

class PerformanceService {
  private webVitals: WebVitals = {}
  private metrics: PerformanceMetrics = {}

  /**
   * Initialize performance tracking
   */
  init(): void {
    if (typeof window === 'undefined') return

    // Track Web Vitals
    this.trackWebVitals()

    // Track Performance Metrics
    this.trackPerformanceMetrics()

    // Track page load performance
    if (document.readyState === 'complete') {
      this.trackPageLoad()
    } else {
      window.addEventListener('load', () => this.trackPageLoad())
    }
  }

  /**
   * Track Web Vitals using web-vitals library (if available)
   * Or use native Performance API
   */
  private trackWebVitals(): void {
    if (typeof window === 'undefined' || !window.performance) return

    try {
      // Track LCP (Largest Contentful Paint)
      new PerformanceObserver(list => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number
          loadTime?: number
        }
        if (lastEntry) {
          this.webVitals.lcp = lastEntry.renderTime || lastEntry.loadTime || 0
          this.reportWebVital('LCP', this.webVitals.lcp)
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // Track FID (First Input Delay)
      new PerformanceObserver(list => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          const fidEntry = entry as PerformanceEventTiming
          if (fidEntry.processingStart && fidEntry.startTime) {
            this.webVitals.fid = fidEntry.processingStart - fidEntry.startTime
            this.reportWebVital('FID', this.webVitals.fid)
          }
        })
      }).observe({ entryTypes: ['first-input'] })

      // Track CLS (Cumulative Layout Shift)
      let clsValue = 0
      new PerformanceObserver(list => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          const layoutShift = entry as LayoutShift
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value
            this.webVitals.cls = clsValue
          }
        })
        this.reportWebVital('CLS', clsValue)
      }).observe({ entryTypes: ['layout-shift'] })

      // Track TTFB (Time to First Byte)
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming
      if (navigation && navigation.responseStart && navigation.requestStart) {
        this.webVitals.ttfb = navigation.responseStart - navigation.requestStart
        this.reportWebVital('TTFB', this.webVitals.ttfb)
      }

      // Track FCP (First Contentful Paint)
      new PerformanceObserver(list => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            this.webVitals.fcp = entry.startTime
            this.reportWebVital('FCP', this.webVitals.fcp)
          }
        })
      }).observe({ entryTypes: ['paint'] })
    } catch (error) {
      console.warn('Web Vitals tracking not supported', error)
    }
  }

  /**
   * Track Performance Metrics
   */
  private trackPerformanceMetrics(): void {
    if (typeof window === 'undefined' || !window.performance) return

    try {
      // Memory usage (Chrome only)
      if ('memory' in performance) {
        // TypeScript doesn't have built-in type for performance.memory
        interface PerformanceMemory {
          usedJSHeapSize: number
          totalJSHeapSize: number
          jsHeapSizeLimit: number
        }
        const memory = (performance as Performance & { memory?: PerformanceMemory }).memory
        if (!memory) return
        this.metrics.memory = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        }
      }

      // Navigation timing
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming
      if (navigation && navigation.domContentLoadedEventEnd && navigation.loadEventEnd) {
        const startTime = navigation.fetchStart || 0
        this.metrics.timing = {
          domContentLoaded: navigation.domContentLoadedEventEnd - startTime,
          loadComplete: navigation.loadEventEnd - startTime,
          firstPaint: 0,
          firstContentfulPaint: 0,
        }

        // Get paint timing
        const paintEntries = performance.getEntriesByType('paint')
        paintEntries.forEach(entry => {
          if (entry.name === 'first-paint') {
            this.metrics.timing!.firstPaint = entry.startTime
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.timing!.firstContentfulPaint = entry.startTime
          }
        })

        this.metrics.navigation = {
          type: navigation.type.toString(),
          redirectCount: navigation.redirectCount,
        }
      }
    } catch (error) {
      console.warn('Performance metrics tracking failed', error)
    }
  }

  /**
   * Track page load performance
   */
  private trackPageLoad(): void {
    if (typeof window === 'undefined' || !window.performance) return

    try {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming
      if (navigation && navigation.loadEventEnd) {
        // const startTime = navigation.fetchStart || 0
        // const loadTime = navigation.loadEventEnd - startTime
        // Report to backend (optional)
        // monitoringService.reportPageLoad({
        //   loadTime,
        //   url: window.location.href,
        //   ...this.metrics,
        // })
      }
    } catch (error) {
      console.warn('Page load tracking failed', error)
    }
  }

  /**
   * Report Web Vital to backend (optional)
   */
  private reportWebVital(_name: string, _value: number): void {
    // You can send this to backend for aggregation
    // monitoringService.reportWebVital(name, value)
  }

  /**
   * Get current Web Vitals
   */
  getWebVitals(): WebVitals {
    return { ...this.webVitals }
  }

  /**
   * Get current Performance Metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get all performance data
   */
  getAllPerformanceData(): {
    webVitals: WebVitals
    metrics: PerformanceMetrics
  } {
    return {
      webVitals: this.getWebVitals(),
      metrics: this.getPerformanceMetrics(),
    }
  }
}

// Type definitions for Performance API
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number
  startTime: number
}

interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

export const performanceService = new PerformanceService()

// Auto-initialize when module loads (in browser)
if (typeof window !== 'undefined') {
  performanceService.init()
}
