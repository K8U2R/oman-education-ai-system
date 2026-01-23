/**
 * PrometheusMetrics - Prometheus Metrics Exporter
 *
 * تكامل Prometheus للـ Monitoring مع:
 * - Custom Metrics
 * - Histograms
 * - Counters
 * - Gauges
 * - Summary
 */

import { Registry, Counter, Histogram, Gauge, Summary, collectDefaultMetrics } from 'prom-client'
import { logger } from '../../shared/utils/logger'

/**
 * Prometheus Metrics Configuration
 */
export interface PrometheusMetricsConfig {
  prefix?: string
  collectDefaultMetrics?: boolean
  defaultMetricsInterval?: number
}

/**
 * Prometheus Metrics Exporter
 */
export class PrometheusMetrics {
  private registry: Registry
  private readonly prefix: string

  // Custom Metrics
  private readonly httpRequestDuration: Histogram<string>
  private readonly httpRequestTotal: Counter<string>
  private readonly httpRequestErrors: Counter<string>
  private readonly databaseQueryDuration: Histogram<string>
  private readonly databaseQueryTotal: Counter<string>
  private readonly databaseQueryErrors: Counter<string>
  private readonly cacheHits: Counter<string>
  private readonly cacheMisses: Counter<string>
  private readonly activeConnections: Gauge<string>
  private readonly transactionDuration: Summary<string>
  private readonly transactionTotal: Counter<string>
  private readonly transactionErrors: Counter<string>

  constructor(config: PrometheusMetricsConfig = {}) {
    this.prefix = config.prefix || 'db_core_'
    this.registry = new Registry()

    // Register default metrics if enabled
    if (config.collectDefaultMetrics !== false) {
      collectDefaultMetrics({
        register: this.registry,
        prefix: this.prefix,
      })
    }

    // Initialize custom metrics
    this.httpRequestDuration = new Histogram({
      name: `${this.prefix}http_request_duration_seconds`,
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
      registers: [this.registry],
    })

    this.httpRequestTotal = new Counter({
      name: `${this.prefix}http_requests_total`,
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    })

    this.httpRequestErrors = new Counter({
      name: `${this.prefix}http_request_errors_total`,
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'error_type'],
      registers: [this.registry],
    })

    this.databaseQueryDuration = new Histogram({
      name: `${this.prefix}database_query_duration_seconds`,
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'entity', 'adapter'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    })

    this.databaseQueryTotal = new Counter({
      name: `${this.prefix}database_queries_total`,
      help: 'Total number of database queries',
      labelNames: ['operation', 'entity', 'adapter'],
      registers: [this.registry],
    })

    this.databaseQueryErrors = new Counter({
      name: `${this.prefix}database_query_errors_total`,
      help: 'Total number of database query errors',
      labelNames: ['operation', 'entity', 'adapter', 'error_type'],
      registers: [this.registry],
    })

    this.cacheHits = new Counter({
      name: `${this.prefix}cache_hits_total`,
      help: 'Total number of cache hits',
      labelNames: ['cache_level'],
      registers: [this.registry],
    })

    this.cacheMisses = new Counter({
      name: `${this.prefix}cache_misses_total`,
      help: 'Total number of cache misses',
      labelNames: ['cache_level'],
      registers: [this.registry],
    })

    this.activeConnections = new Gauge({
      name: `${this.prefix}active_connections`,
      help: 'Number of active database connections',
      labelNames: ['adapter', 'type'],
      registers: [this.registry],
    })

    this.transactionDuration = new Summary({
      name: `${this.prefix}transaction_duration_seconds`,
      help: 'Duration of database transactions in seconds',
      labelNames: ['adapter', 'status'],
      percentiles: [0.5, 0.9, 0.95, 0.99],
      registers: [this.registry],
    })

    this.transactionTotal = new Counter({
      name: `${this.prefix}transactions_total`,
      help: 'Total number of database transactions',
      labelNames: ['adapter', 'status'],
      registers: [this.registry],
    })

    this.transactionErrors = new Counter({
      name: `${this.prefix}transaction_errors_total`,
      help: 'Total number of transaction errors',
      labelNames: ['adapter', 'error_type'],
      registers: [this.registry],
    })

    logger.info('Prometheus metrics initialized', {
      prefix: this.prefix,
      defaultMetrics: config.collectDefaultMetrics !== false,
    })
  }

  /**
   * تسجيل مدة استجابة HTTP
   */
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number): void {
    const durationSeconds = duration / 1000

    this.httpRequestDuration.observe(
      { method, route, status_code: statusCode.toString() },
      durationSeconds
    )

    this.httpRequestTotal.inc({ method, route, status_code: statusCode.toString() })

    if (statusCode >= 400) {
      this.httpRequestErrors.inc({
        method,
        route,
        error_type: statusCode >= 500 ? 'server_error' : 'client_error',
      })
    }
  }

  /**
   * تسجيل مدة استعلام قاعدة البيانات
   */
  recordDatabaseQuery(
    operation: string,
    entity: string,
    adapter: string,
    duration: number,
    success: boolean = true
  ): void {
    const durationSeconds = duration / 1000

    this.databaseQueryDuration.observe({ operation, entity, adapter }, durationSeconds)

    this.databaseQueryTotal.inc({ operation, entity, adapter })

    if (!success) {
      this.databaseQueryErrors.inc({
        operation,
        entity,
        adapter,
        error_type: 'query_error',
      })
    }
  }

  /**
   * تسجيل Cache Hit
   */
  recordCacheHit(level: 'l1' | 'l2' = 'l1'): void {
    this.cacheHits.inc({ cache_level: level })
  }

  /**
   * تسجيل Cache Miss
   */
  recordCacheMiss(level: 'l1' | 'l2' = 'l1'): void {
    this.cacheMisses.inc({ cache_level: level })
  }

  /**
   * تحديث عدد الاتصالات النشطة
   */
  setActiveConnections(adapter: string, type: string, count: number): void {
    this.activeConnections.set({ adapter, type }, count)
  }

  /**
   * تسجيل مدة معاملة قاعدة البيانات
   */
  recordTransaction(
    adapter: string,
    status: 'committed' | 'rolled_back' | 'error',
    duration: number,
    errorType?: string
  ): void {
    const durationSeconds = duration / 1000

    this.transactionDuration.observe({ adapter, status }, durationSeconds)
    this.transactionTotal.inc({ adapter, status })

    if (status === 'error' && errorType) {
      this.transactionErrors.inc({ adapter, error_type: errorType })
    }
  }

  /**
   * الحصول على Metrics كـ Prometheus format
   */
  async getMetrics(): Promise<string> {
    return await this.registry.metrics()
  }

  /**
   * الحصول على Metrics Registry
   */
  getRegistry(): Registry {
    return this.registry
  }

  /**
   * إعادة تعيين Metrics
   */
  async reset(): Promise<void> {
    await this.registry.clear()
    logger.info('Prometheus metrics reset')
  }

  /**
   * الحصول على Metrics كـ JSON
   */
  async getMetricsAsJSON(): Promise<any> {
    return await this.registry.getMetricsAsJSON()
  }
}
