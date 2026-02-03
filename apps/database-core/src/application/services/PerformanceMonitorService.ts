/**
 * PerformanceMonitorService - خدمة مراقبة الأداء
 *
 * خدمة لمراقبة أداء النظام من خلال:
 * - تتبع استجابة API
 * - مراقبة استخدام الذاكرة
 * - تتبع الأخطاء
 * - إحصائيات الأداء
 */

import { logger } from '../../shared/utils/logger'

export interface PerformanceMetrics {
  endpoint: string
  method: string
  duration: number
  statusCode: number
  timestamp: number
  memoryUsage?: NodeJS.MemoryUsage
  error?: string
}

export interface PerformanceStats {
  totalRequests: number
  averageResponseTime: number
  p50: number
  p95: number
  p99: number
  errorRate: number
  requestsPerSecond: number
}

export class PerformanceMonitorService {
  private metrics: PerformanceMetrics[] = []
  private readonly maxMetrics: number = 10000
  private readonly startTime: number = Date.now()

  /**
   * تسجيل مقياس أداء جديد
   */
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric)

    // تنظيف القديم إذا تجاوز الحد
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // تحذير للاستجابات البطيئة
    if (metric.duration > 2000) {
      logger.warn('Slow API response detected', {
        endpoint: metric.endpoint,
        method: metric.method,
        duration: metric.duration,
        statusCode: metric.statusCode,
      })
    }

    // تحذير للأخطاء
    if (metric.statusCode >= 500) {
      logger.error('API error detected', {
        endpoint: metric.endpoint,
        method: metric.method,
        statusCode: metric.statusCode,
        error: metric.error,
      })
    }
  }

  /**
   * الحصول على إحصائيات الأداء
   */
  getStats(timeWindow?: number): PerformanceStats {
    let relevantMetrics = this.metrics

    if (timeWindow) {
      const cutoff = Date.now() - timeWindow
      relevantMetrics = this.metrics.filter(m => m.timestamp >= cutoff)
    }

    if (relevantMetrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        errorRate: 0,
        requestsPerSecond: 0,
      }
    }

    const durations = relevantMetrics.map(m => m.duration).sort((a, b) => a - b)
    const averageResponseTime = durations.reduce((sum, d) => sum + d, 0) / durations.length
    const errors = relevantMetrics.filter(m => m.statusCode >= 400).length
    const errorRate = errors / relevantMetrics.length

    // حساب Percentiles
    const p50 = durations[Math.floor(durations.length * 0.5)]
    const p95 = durations[Math.floor(durations.length * 0.95)]
    const p99 = durations[Math.floor(durations.length * 0.99)]

    // حساب Requests Per Second
    const timeSpan = timeWindow || Date.now() - this.startTime
    const requestsPerSecond = (relevantMetrics.length / timeSpan) * 1000

    return {
      totalRequests: relevantMetrics.length,
      averageResponseTime: Math.round(averageResponseTime),
      p50: Math.round(p50),
      p95: Math.round(p95),
      p99: Math.round(p99),
      errorRate: Math.round(errorRate * 100) / 100,
      requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
    }
  }

  /**
   * الحصول على إحصائيات لـ endpoint معين
   */
  getEndpointStats(endpoint: string): PerformanceStats {
    const endpointMetrics = this.metrics.filter(m => m.endpoint === endpoint)
    const durations = endpointMetrics.map(m => m.duration).sort((a, b) => a - b)

    if (durations.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        errorRate: 0,
        requestsPerSecond: 0,
      }
    }

    const averageResponseTime = durations.reduce((sum, d) => sum + d, 0) / durations.length
    const errors = endpointMetrics.filter(m => m.statusCode >= 400).length
    const errorRate = errors / endpointMetrics.length

    const p50 = durations[Math.floor(durations.length * 0.5)]
    const p95 = durations[Math.floor(durations.length * 0.95)]
    const p99 = durations[Math.floor(durations.length * 0.99)]

    return {
      totalRequests: endpointMetrics.length,
      averageResponseTime: Math.round(averageResponseTime),
      p50: Math.round(p50),
      p95: Math.round(p95),
      p99: Math.round(p99),
      errorRate: Math.round(errorRate * 100) / 100,
      requestsPerSecond: 0, // Not calculated per endpoint
    }
  }

  /**
   * الحصول على استخدام الذاكرة
   */
  getMemoryUsage(): NodeJS.MemoryUsage {
    return process.memoryUsage()
  }

  /**
   * الحصول على وقت التشغيل
   */
  getUptime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000) // seconds
  }

  /**
   * مسح الإحصائيات
   */
  clearMetrics(): void {
    this.metrics = []
    logger.info('Performance metrics cleared')
  }

  /**
   * الحصول على الأخطاء الأخيرة
   */
  getRecentErrors(limit: number = 10): PerformanceMetrics[] {
    return this.metrics
      .filter(m => m.statusCode >= 500)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }
}
