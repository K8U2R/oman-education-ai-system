/**
 * Performance Monitor - نظام مراقبة الأداء
 * يراقب مقاييس الأداء ويجمع البيانات لإرسالها للخادم
 */

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface WebVitals {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private reportInterval: number = 60000; // كل دقيقة
  private reportTimer?: NodeJS.Timeout;
  private webVitals: Partial<WebVitals> = {};

  constructor() {
    this.startMonitoring();
  }

  /**
   * بدء مراقبة الأداء
   */
  private startMonitoring(): void {
    // مراقبة مقاييس ويب الأساسية
    if ('PerformanceObserver' in window) {
      this.setupPerformanceObservers();
    }

    // مراقبة تحميل الصفحة
    if (document.readyState === 'complete') {
      this.collectPageLoadMetrics();
    } else {
      window.addEventListener('load', () => {
        this.collectPageLoadMetrics();
      });
    }

    // إرسال تقارير دورية
    this.reportTimer = setInterval(() => this.sendReport(), this.reportInterval);

    // إرسال تقرير عند إغلاق الصفحة
    window.addEventListener('beforeunload', () => {
      this.sendReport(true); // إرسال فوري
    });
  }

  /**
   * إعداد مراقبي الأداء
   */
  private setupPerformanceObservers(): void {
    // مراقبة First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.webVitals.fcp = entry.startTime;
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP observer not supported:', e);
    }

    // مراقبة Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.webVitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported:', e);
    }

    // مراقبة First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any;
          this.webVitals.fid = fidEntry.processingStart - fidEntry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported:', e);
    }

    // مراقبة Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        this.webVitals.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported:', e);
    }
  }

  /**
   * جمع مقاييس تحميل الصفحة
   */
  private collectPageLoadMetrics(): void {
    if (!window.performance || !window.performance.timing) return;

    const timing = window.performance.timing;
    const navigation = (window.performance as any).navigation;

    // Time to First Byte
    this.webVitals.ttfb = timing.responseStart - timing.navigationStart;

    // إضافة مقاييس إضافية
    this.addMetric('page-load', {
      name: 'full-page-load',
      duration: timing.loadEventEnd - timing.navigationStart,
      timestamp: Date.now(),
      metadata: {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        domInteractive: timing.domInteractive - timing.navigationStart,
        redirectCount: navigation?.redirectCount || 0,
        type: navigation?.type || 'unknown',
      },
    });
  }

  /**
   * تتبع تحميل مكون
   */
  trackComponentRender(componentName: string, duration: number): void {
    this.addMetric('component-render', {
      name: componentName,
      duration,
      timestamp: Date.now(),
    });

    // تنبيه إذا كان التحميل بطيئاً
    if (duration > 100) {
      console.warn(`⚠️ مكون ${componentName} بطيء: ${duration}ms`);
    }
  }

  /**
   * تتبع طلب API
   */
  trackAPIRequest(
    endpoint: string,
    duration: number,
    success: boolean,
    statusCode?: number
  ): void {
    this.addMetric('api-requests', {
      name: endpoint,
      duration,
      timestamp: Date.now(),
      metadata: {
        success,
        statusCode,
      },
    });

    // تنبيه إذا كان الطلب بطيئاً
    if (duration > 3000) {
      console.warn(`⚠️ طلب API بطيء: ${endpoint} - ${duration}ms`);
    }
  }

  /**
   * تتبع حدث مخصص
   */
  trackCustomEvent(
    eventName: string,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    this.addMetric('custom-events', {
      name: eventName,
      duration,
      timestamp: Date.now(),
      metadata,
    });
  }

  /**
   * إضافة مقياس
   */
  private addMetric(category: string, metric: PerformanceMetric): void {
    if (!this.metrics.has(category)) {
      this.metrics.set(category, []);
    }
    this.metrics.get(category)!.push(metric);
  }

  /**
   * جمع مقاييس Web Vitals
   */
  private collectWebVitals(): Partial<WebVitals> {
    return { ...this.webVitals };
  }

  /**
   * إرسال تقرير الأداء
   */
  private async sendReport(immediate: boolean = false): Promise<void> {
    if (this.metrics.size === 0 && Object.keys(this.webVitals).length === 0) {
      return;
    }

    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connection: this.getConnectionInfo(),
      metrics: Array.from(this.metrics.entries()).map(([category, metrics]) => ({
        category,
        count: metrics.length,
        average: this.calculateAverage(metrics),
        metrics: metrics.slice(-10), // آخر 10 مقاييس فقط
      })),
      webVitals: this.collectWebVitals(),
    };

    try {
      // بناء URL صحيح باستخدام VITE_API_URL
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const analyticsUrl = `${apiBaseUrl}/analytics/performance`;
      
      // إرسال لخدمة المراقبة
      const response = await fetch(analyticsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
        keepalive: immediate, // إرسال حتى عند إغلاق الصفحة
      });

      if (response.ok) {
        // مسح المقاييس بعد الإرسال الناجح
        this.metrics.clear();
      }
    } catch (error) {
      // حفظ محلياً إذا فشل الإرسال
      console.warn('فشل إرسال تقرير الأداء:', error);
      this.saveLocally(report);
    }
  }

  /**
   * حفظ محلياً
   */
  private saveLocally(report: any): void {
    try {
      const stored = localStorage.getItem('performance_reports') || '[]';
      const reports = JSON.parse(stored);
      reports.push(report);
      
      // الاحتفاظ بآخر 10 تقارير فقط
      const trimmed = reports.slice(-10);
      localStorage.setItem('performance_reports', JSON.stringify(trimmed));
    } catch (error) {
      console.error('فشل حفظ تقرير الأداء محلياً:', error);
    }
  }

  /**
   * حساب المتوسط
   */
  private calculateAverage(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m.duration, 0);
    return Math.round(sum / metrics.length);
  }

  /**
   * الحصول على معلومات الاتصال
   */
  private getConnectionInfo(): any {
    const connection = (navigator as any).connection ||
                       (navigator as any).mozConnection ||
                       (navigator as any).webkitConnection;

    if (!connection) return null;

    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }

  /**
   * إيقاف المراقبة
   */
  stop(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
    }
  }

  /**
   * الحصول على مقاييس Web Vitals الحالية
   */
  getWebVitals(): Partial<WebVitals> {
    return this.collectWebVitals();
  }
}

// إنشاء instance واحد (Singleton)
export const performanceMonitor = new PerformanceMonitor();

// تصدير للاستخدام في المكونات
export default performanceMonitor;

