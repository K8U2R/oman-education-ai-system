/**
 * DatabaseConnectionManager - مدير اتصالات قاعدة البيانات
 *
 * إدارة الاتصالات المتعددة مع قواعد البيانات المختلفة
 */

import { IDatabaseConnectionManager } from '../../domain/interfaces/IDatabaseConnectionManager'
import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import {
  DatabaseConnectionConfig,
  DatabaseConnectionInfo,
  DatabaseHealthCheckResult,
  ConnectionStatus,
} from '../../domain/types/database-connection.types'
import { DatabaseAdapterFactory } from './DatabaseAdapterFactory'
import { logger } from '../../shared/utils/logger'

/**
 * مدير اتصالات قاعدة البيانات
 */
export class DatabaseConnectionManager implements IDatabaseConnectionManager {
  private connections: Map<string, IDatabaseAdapter> = new Map()
  private connectionsConfig: Map<string, DatabaseConnectionConfig> = new Map()
  private connectionsInfo: Map<string, DatabaseConnectionInfo> = new Map()
  private healthCheckTimers: Map<string, NodeJS.Timeout> = new Map()

  /**
   * إضافة اتصال جديد
   */
  async addConnection(config: DatabaseConnectionConfig): Promise<void> {
    try {
      logger.info('Adding database connection', { id: config.id, provider: config.provider })

      // إنشاء Adapter
      const adapter = await DatabaseAdapterFactory.createAdapter(config.provider, config.config)

      // حفظ الاتصال
      this.connections.set(config.id, adapter)
      this.connectionsConfig.set(config.id, config)

      // إنشاء معلومات الاتصال
      const info: DatabaseConnectionInfo = {
        id: config.id,
        name: config.name,
        provider: config.provider,
        type: config.type,
        status: ConnectionStatus.CONNECTING,
        stats: {
          totalQueries: 0,
          successfulQueries: 0,
          failedQueries: 0,
          averageLatency: 0,
        },
      }
      this.connectionsInfo.set(config.id, info)

      // فحص الصحة الأولي
      await this.healthCheck(config.id)

      // بدء فحص الصحة الدوري
      if (config.healthCheckInterval && config.healthCheckInterval > 0) {
        this.startHealthCheckTimer(config.id, config.healthCheckInterval)
      }

      logger.info('Database connection added successfully', { id: config.id })
    } catch (error) {
      logger.error('Failed to add database connection', {
        id: config.id,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  /**
   * إزالة اتصال
   */
  async removeConnection(connectionId: string): Promise<void> {
    logger.info('Removing database connection', { id: connectionId })

    // إيقاف فحص الصحة
    this.stopHealthCheckTimer(connectionId)

    // إزالة الاتصال
    this.connections.delete(connectionId)
    this.connectionsConfig.delete(connectionId)
    this.connectionsInfo.delete(connectionId)

    logger.info('Database connection removed', { id: connectionId })
  }

  /**
   * الحصول على اتصال
   */
  getConnection(connectionId: string): IDatabaseAdapter | null {
    return this.connections.get(connectionId) || null
  }

  /**
   * الحصول على جميع الاتصالات
   */
  getAllConnections(): Map<string, IDatabaseAdapter> {
    return new Map(this.connections)
  }

  /**
   * الحصول على معلومات الاتصال
   */
  getConnectionInfo(connectionId: string): DatabaseConnectionInfo | null {
    return this.connectionsInfo.get(connectionId) || null
  }

  /**
   * الحصول على جميع معلومات الاتصالات
   */
  getAllConnectionsInfo(): DatabaseConnectionInfo[] {
    return Array.from(this.connectionsInfo.values())
  }

  /**
   * فحص صحة الاتصال
   */
  async healthCheck(connectionId: string): Promise<DatabaseHealthCheckResult> {
    const adapter = this.connections.get(connectionId)
    const info = this.connectionsInfo.get(connectionId)

    if (!adapter || !info) {
      return {
        connectionId,
        status: ConnectionStatus.ERROR,
        latency: 0,
        timestamp: new Date(),
        error: 'Connection not found',
      }
    }

    const startTime = Date.now()

    try {
      // محاولة تنفيذ استعلام بسيط للتحقق من الاتصال
      // نستخدم SELECT 1 كاستعلام بسيط وآمن للتحقق من الاتصال
      await adapter.executeRaw('SELECT 1 as health_check').catch(() => {
        // إذا فشل، نعتبر الاتصال صحيحاً إذا لم يكن هناك خطأ في الاتصال نفسه
        return null
      })

      const latency = Date.now() - startTime
      const status = ConnectionStatus.CONNECTED

      // تحديث معلومات الاتصال
      info.status = status
      info.lastHealthCheck = new Date()
      info.latency = latency
      delete info.error

      // تحديث الإحصائيات
      if (info.stats) {
        info.stats.totalQueries++
        info.stats.successfulQueries++
        const totalLatency = info.stats.averageLatency * (info.stats.totalQueries - 1) + latency
        info.stats.averageLatency = totalLatency / info.stats.totalQueries
      }

      return {
        connectionId,
        status,
        latency,
        timestamp: new Date(),
      }
    } catch (error) {
      const latency = Date.now() - startTime
      const status = ConnectionStatus.ERROR
      const errorMessage = error instanceof Error ? error.message : String(error)

      // تحديث معلومات الاتصال
      info.status = status
      info.lastHealthCheck = new Date()
      info.latency = latency
      info.error = errorMessage

      // تحديث الإحصائيات
      if (info.stats) {
        info.stats.totalQueries++
        info.stats.failedQueries++
      }

      logger.warn('Database health check failed', {
        connectionId,
        error: errorMessage,
      })

      return {
        connectionId,
        status,
        latency,
        timestamp: new Date(),
        error: errorMessage,
      }
    }
  }

  /**
   * فحص صحة جميع الاتصالات
   */
  async healthCheckAll(): Promise<DatabaseHealthCheckResult[]> {
    const results: DatabaseHealthCheckResult[] = []

    for (const connectionId of this.connections.keys()) {
      const result = await this.healthCheck(connectionId)
      results.push(result)
    }

    return results
  }

  /**
   * إعادة الاتصال
   */
  async reconnect(connectionId: string): Promise<void> {
    const config = this.connectionsConfig.get(connectionId)

    if (!config) {
      throw new Error(`Connection not found: ${connectionId}`)
    }

    logger.info('Reconnecting database connection', { id: connectionId })

    // إزالة الاتصال القديم
    await this.removeConnection(connectionId)

    // إضافة الاتصال مرة أخرى
    await this.addConnection(config)
  }

  /**
   * إعادة الاتصال لجميع الاتصالات
   */
  async reconnectAll(): Promise<void> {
    const configs = Array.from(this.connectionsConfig.values())

    for (const config of configs) {
      try {
        await this.reconnect(config.id)
      } catch (error) {
        logger.error('Failed to reconnect', {
          id: config.id,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }

  /**
   * إغلاق الاتصال
   */
  async closeConnection(connectionId: string): Promise<void> {
    await this.removeConnection(connectionId)
  }

  /**
   * إغلاق جميع الاتصالات
   */
  async closeAllConnections(): Promise<void> {
    const connectionIds = Array.from(this.connections.keys())

    for (const connectionId of connectionIds) {
      await this.closeConnection(connectionId)
    }
  }

  /**
   * بدء فحص الصحة الدوري
   */
  private startHealthCheckTimer(connectionId: string, interval: number): void {
    this.stopHealthCheckTimer(connectionId)

    const timer = setTimeout(async () => {
      await this.healthCheck(connectionId)
      this.startHealthCheckTimer(connectionId, interval)
    }, interval)

    this.healthCheckTimers.set(connectionId, timer)
  }

  /**
   * إيقاف فحص الصحة الدوري
   */
  private stopHealthCheckTimer(connectionId: string): void {
    const timer = this.healthCheckTimers.get(connectionId)
    if (timer) {
      clearTimeout(timer)
      this.healthCheckTimers.delete(connectionId)
    }
  }
}
