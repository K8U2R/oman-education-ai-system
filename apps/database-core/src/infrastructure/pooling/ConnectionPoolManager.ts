/**
 * ConnectionPoolManager - مدير Connection Pool
 *
 * إدارة وتحسين Connection Pools مع:
 * - Dynamic pool sizing
 * - Health monitoring
 * - Auto-reconnection
 * - Pool statistics
 */

import { Pool, PoolConfig } from 'pg'
import { logger } from '../../shared/utils/logger'

/**
 * Pool Statistics
 */
export interface PoolStatistics {
  totalConnections: number
  idleConnections: number
  activeConnections: number
  waitingRequests: number
  totalQueries: number
  successfulQueries: number
  failedQueries: number
  averageQueryTime: number
  poolSize: number
  minPoolSize: number
  maxPoolSize: number
}

/**
 * Pool Health Status
 */
export interface PoolHealthStatus {
  healthy: boolean
  lastHealthCheck: Date
  consecutiveFailures: number
  averageResponseTime: number
  errorRate: number
}

/**
 * Pool Configuration
 */
export interface EnhancedPoolConfig extends PoolConfig {
  minSize?: number // الحد الأدنى للاتصالات
  maxSize?: number // الحد الأقصى للاتصالات
  healthCheckInterval?: number // فحص الصحة كل X ms
  autoReconnect?: boolean // إعادة الاتصال التلقائي
  reconnectDelay?: number // تأخير إعادة الاتصال
  maxReconnectAttempts?: number // الحد الأقصى لمحاولات إعادة الاتصال
  poolGrowthFactor?: number // عامل نمو الـ Pool (0.1 = 10%)
  poolShrinkThreshold?: number // عتبة تقليص الـ Pool (0.2 = 20% idle)
}

/**
 * مدير Connection Pool
 */
export class ConnectionPoolManager {
  private pool: Pool
  private config: EnhancedPoolConfig & {
    minSize: number
    maxSize: number
    healthCheckInterval: number
    autoReconnect: boolean
    reconnectDelay: number
    maxReconnectAttempts: number
    poolGrowthFactor: number
    poolShrinkThreshold: number
  }
  private statistics: PoolStatistics
  private healthStatus: PoolHealthStatus
  private healthCheckTimer?: NodeJS.Timeout
  private reconnectAttempts: number = 0
  private queryTimes: number[] = [] // لتتبع متوسط وقت الاستعلام
  private readonly maxQueryTimeHistory = 100 // الاحتفاظ بآخر 100 استعلام

  constructor(config: EnhancedPoolConfig) {
    // إعدادات افتراضية
    this.config = {
      minSize: config.minSize || 2,
      maxSize: config.maxSize || config.max || 20,
      healthCheckInterval: config.healthCheckInterval || 30000, // 30 seconds
      autoReconnect: config.autoReconnect ?? true,
      reconnectDelay: config.reconnectDelay || 5000, // 5 seconds
      maxReconnectAttempts: config.maxReconnectAttempts || 5,
      poolGrowthFactor: config.poolGrowthFactor || 0.1, // 10%
      poolShrinkThreshold: config.poolShrinkThreshold || 0.2, // 20%
      ...config,
    }

    // إنشاء Pool
    this.pool = new Pool({
      ...this.config,
      max: this.config.maxSize,
    })

    // إحصائيات أولية
    this.statistics = {
      totalConnections: 0,
      idleConnections: 0,
      activeConnections: 0,
      waitingRequests: 0,
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      averageQueryTime: 0,
      poolSize: this.config.maxSize,
      minPoolSize: this.config.minSize,
      maxPoolSize: this.config.maxSize,
    }

    // حالة الصحة الأولية
    this.healthStatus = {
      healthy: true,
      lastHealthCheck: new Date(),
      consecutiveFailures: 0,
      averageResponseTime: 0,
      errorRate: 0,
    }

    // معالجة أحداث Pool
    this.setupPoolEventHandlers()

    // بدء فحص الصحة
    if (this.config.healthCheckInterval > 0) {
      this.startHealthCheck()
    }

    logger.info('ConnectionPoolManager initialized', {
      minSize: this.config.minSize,
      maxSize: this.config.maxSize,
      healthCheckInterval: this.config.healthCheckInterval,
    })
  }

  /**
   * إعداد معالجات أحداث Pool
   */
  private setupPoolEventHandlers(): void {
    // خطأ في الاتصال
    this.pool.on('error', (err: Error) => {
      logger.error('Pool connection error', { error: err.message })
      this.healthStatus.consecutiveFailures++
      this.statistics.failedQueries++

      // محاولة إعادة الاتصال التلقائي
      if (this.config.autoReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
        this.scheduleReconnect()
      }
    })

    // اتصال جديد
    this.pool.on('connect', () => {
      logger.debug('New pool connection established')
      this.reconnectAttempts = 0
      this.healthStatus.consecutiveFailures = 0
    })

    // إزالة اتصال
    this.pool.on('remove', () => {
      logger.debug('Pool connection removed')
    })
  }

  /**
   * الحصول على Pool
   */
  getPool(): Pool {
    return this.pool
  }

  /**
   * الحصول على اتصال من Pool
   */
  async getConnection(): Promise<any> {
    const startTime = Date.now()

    try {
      const client = await this.pool.connect()
      const queryTime = Date.now() - startTime

      // تحديث الإحصائيات
      this.updateStatistics(true, queryTime)

      return client
    } catch (error) {
      const queryTime = Date.now() - startTime
      this.updateStatistics(false, queryTime)

      logger.error('Failed to get connection from pool', {
        error: error instanceof Error ? error.message : String(error),
      })

      throw error
    }
  }

  /**
   * تنفيذ استعلام
   */
  async query<T = any>(text: string, params?: any[]): Promise<T> {
    const startTime = Date.now()
    const client = await this.getConnection()

    try {
      const result = await client.query(text, params)
      client.release()

      const queryTime = Date.now() - startTime
      this.updateStatistics(true, queryTime)

      return result.rows as T
    } catch (error) {
      client.release()
      const queryTime = Date.now() - startTime
      this.updateStatistics(false, queryTime)

      throw error
    }
  }

  /**
   * تحديث الإحصائيات
   */
  private updateStatistics(success: boolean, queryTime: number): void {
    this.statistics.totalQueries++

    if (success) {
      this.statistics.successfulQueries++
    } else {
      this.statistics.failedQueries++
    }

    // تحديث متوسط وقت الاستعلام
    this.queryTimes.push(queryTime)
    if (this.queryTimes.length > this.maxQueryTimeHistory) {
      this.queryTimes.shift()
    }

    const sum = this.queryTimes.reduce((a, b) => a + b, 0)
    this.statistics.averageQueryTime = sum / this.queryTimes.length

    // تحديث حالة Pool
    this.updatePoolStatus()
  }

  /**
   * تحديث حالة Pool
   */
  private updatePoolStatus(): void {
    this.statistics.totalConnections = this.pool.totalCount
    this.statistics.idleConnections = this.pool.idleCount
    this.statistics.activeConnections = this.pool.waitingCount
    this.statistics.waitingRequests = this.pool.waitingCount
  }

  /**
   * بدء فحص الصحة
   */
  private startHealthCheck(): void {
    this.healthCheckTimer = setInterval(async () => {
      await this.performHealthCheck()
    }, this.config.healthCheckInterval)
  }

  /**
   * إيقاف فحص الصحة
   */
  private stopHealthCheck(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
      this.healthCheckTimer = undefined
    }
  }

  /**
   * تنفيذ فحص الصحة
   */
  private async performHealthCheck(): Promise<void> {
    const startTime = Date.now()

    try {
      await this.pool.query('SELECT 1')
      const responseTime = Date.now() - startTime

      this.healthStatus.healthy = true
      this.healthStatus.consecutiveFailures = 0
      this.healthStatus.averageResponseTime = responseTime
      this.healthStatus.lastHealthCheck = new Date()

      // تحديث متوسط وقت الاستجابة
      const currentAvg = this.healthStatus.averageResponseTime
      this.healthStatus.averageResponseTime = (currentAvg + responseTime) / 2

      logger.debug('Pool health check passed', { responseTime })
    } catch (error) {
      this.healthStatus.healthy = false
      this.healthStatus.consecutiveFailures++
      this.healthStatus.lastHealthCheck = new Date()

      logger.warn('Pool health check failed', {
        consecutiveFailures: this.healthStatus.consecutiveFailures,
        error: error instanceof Error ? error.message : String(error),
      })

      // محاولة إعادة الاتصال
      if (this.config.autoReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
        this.scheduleReconnect()
      }
    }

    // تحديث معدل الخطأ
    if (this.statistics.totalQueries > 0) {
      this.healthStatus.errorRate = this.statistics.failedQueries / this.statistics.totalQueries
    }
  }

  /**
   * جدولة إعادة الاتصال
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++

    logger.info('Scheduling pool reconnection', {
      attempt: this.reconnectAttempts,
      maxAttempts: this.config.maxReconnectAttempts,
      delay: this.config.reconnectDelay,
    })

    setTimeout(async () => {
      try {
        // محاولة إعادة الاتصال
        await this.pool.query('SELECT 1')
        logger.info('Pool reconnected successfully', {
          attempt: this.reconnectAttempts,
        })
        this.reconnectAttempts = 0
      } catch (error) {
        logger.error('Pool reconnection failed', {
          attempt: this.reconnectAttempts,
          error: error instanceof Error ? error.message : String(error),
        })

        // محاولة مرة أخرى إذا لم نتجاوز الحد الأقصى
        if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
          this.scheduleReconnect()
        } else {
          logger.error('Max reconnection attempts reached', {
            maxAttempts: this.config.maxReconnectAttempts,
          })
        }
      }
    }, this.config.reconnectDelay)
  }

  /**
   * Dynamic Pool Sizing - زيادة حجم Pool
   */
  async growPool(): Promise<void> {
    const currentSize = this.pool.totalCount
    const maxSize = this.config.maxSize

    if (currentSize >= maxSize) {
      logger.debug('Pool already at max size', { currentSize, maxSize })
      return
    }

    const growth = Math.ceil(maxSize * this.config.poolGrowthFactor)
    const newSize = Math.min(currentSize + growth, maxSize)

    logger.info('Growing pool', {
      currentSize,
      newSize,
      growth,
    })

    // Note: pg Pool لا يدعم تغيير الحجم ديناميكياً
    // يمكن إضافة اتصالات جديدة يدوياً أو إعادة إنشاء Pool
    // هذا يتطلب إعادة تصميم أو استخدام pool manager آخر
  }

  /**
   * Dynamic Pool Sizing - تقليص حجم Pool
   */
  async shrinkPool(): Promise<void> {
    const currentSize = this.pool.totalCount
    const minSize = this.config.minSize
    const idleCount = this.pool.idleCount
    const idleRatio = idleCount / currentSize

    if (currentSize <= minSize) {
      logger.debug('Pool already at min size', { currentSize, minSize })
      return
    }

    if (idleRatio < this.config.poolShrinkThreshold) {
      logger.debug('Pool idle ratio too low to shrink', {
        idleRatio,
        threshold: this.config.poolShrinkThreshold,
      })
      return
    }

    const shrink = Math.ceil(currentSize * this.config.poolGrowthFactor)
    const newSize = Math.max(currentSize - shrink, minSize)

    logger.info('Shrinking pool', {
      currentSize,
      newSize,
      shrink,
      idleCount,
    })

    // Note: pg Pool لا يدعم تقليص الحجم ديناميكياً
    // يمكن إزالة اتصالات idle يدوياً
  }

  /**
   * الحصول على إحصائيات Pool
   */
  getStatistics(): PoolStatistics {
    this.updatePoolStatus()
    return { ...this.statistics }
  }

  /**
   * الحصول على حالة الصحة
   */
  getHealthStatus(): PoolHealthStatus {
    return { ...this.healthStatus }
  }

  /**
   * إغلاق Pool
   */
  async close(): Promise<void> {
    this.stopHealthCheck()

    await this.pool.end()
    logger.info('ConnectionPoolManager closed')
  }

  /**
   * إعادة تعيين الإحصائيات
   */
  resetStatistics(): void {
    this.statistics = {
      totalConnections: 0,
      idleConnections: 0,
      activeConnections: 0,
      waitingRequests: 0,
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      averageQueryTime: 0,
      poolSize: this.config.maxSize,
      minPoolSize: this.config.minSize,
      maxPoolSize: this.config.maxSize,
    }

    this.queryTimes = []
    logger.debug('Pool statistics reset')
  }
}
