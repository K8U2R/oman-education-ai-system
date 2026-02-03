/**
 * DatabaseRouter - موجه قاعدة البيانات
 *
 * توجيه الطلبات للقاعدة المناسبة حسب الاستراتيجية
 */

import { IDatabaseRouter } from '../../domain/interfaces/IDatabaseRouter'
import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { IDatabaseConnectionManager } from '../../domain/interfaces/IDatabaseConnectionManager'
import {
  DatabaseRoutingConfig,
  RoutingStrategy,
} from '../../domain/types/database-connection.types'
import { logger } from '../../shared/utils/logger'

/**
 * موجه قاعدة البيانات
 */
export class DatabaseRouter implements IDatabaseRouter {
  private routingConfig: DatabaseRoutingConfig
  private connectionManager: IDatabaseConnectionManager
  private roundRobinIndex: number = 0

  constructor(connectionManager: IDatabaseConnectionManager, routingConfig: DatabaseRoutingConfig) {
    this.connectionManager = connectionManager
    this.routingConfig = routingConfig
  }

  /**
   * الحصول على Adapter المناسب لـ entity معين
   */
  getAdapterForEntity(entity: string): IDatabaseAdapter {
    // التحقق من entity mapping
    if (this.routingConfig.entityMapping?.[entity]) {
      const connectionId = this.routingConfig.entityMapping[entity]
      const adapter = this.connectionManager.getConnection(connectionId)

      if (adapter) {
        logger.debug('Using entity-specific adapter', { entity, connectionId })
        return adapter
      }
    }

    // استخدام الاستراتيجية العامة
    return this.getAdapterByStrategy()
  }

  /**
   * الحصول على Adapter الأساسي
   */
  getPrimaryAdapter(): IDatabaseAdapter {
    const adapter = this.connectionManager.getConnection(this.routingConfig.primaryConnectionId)

    if (!adapter) {
      throw new Error(`Primary connection not found: ${this.routingConfig.primaryConnectionId}`)
    }

    return adapter
  }

  /**
   * الحصول على Adapter احتياطي (fallback)
   */
  getFallbackAdapter(): IDatabaseAdapter | null {
    if (!this.routingConfig.fallbackConnectionIds?.length) {
      return null
    }

    // محاولة استخدام أول fallback متاح
    for (const connectionId of this.routingConfig.fallbackConnectionIds) {
      const adapter = this.connectionManager.getConnection(connectionId)
      const info = this.connectionManager.getConnectionInfo(connectionId)

      if (adapter && info?.status === 'connected') {
        logger.debug('Using fallback adapter', { connectionId })
        return adapter
      }
    }

    return null
  }

  /**
   * تحديث إعدادات التوجيه
   */
  updateRoutingConfig(config: DatabaseRoutingConfig): void {
    logger.info('Updating routing config', { strategy: config.strategy })
    this.routingConfig = config
    this.roundRobinIndex = 0
  }

  /**
   * الحصول على إعدادات التوجيه الحالية
   */
  getRoutingConfig(): DatabaseRoutingConfig {
    return { ...this.routingConfig }
  }

  /**
   * الحصول على Adapter حسب الاستراتيجية
   */
  private getAdapterByStrategy(): IDatabaseAdapter {
    switch (this.routingConfig.strategy) {
      case RoutingStrategy.PRIMARY:
        return this.getPrimaryAdapter()

      case RoutingStrategy.FALLBACK: {
        // محاولة استخدام الأساسي أولاً
        try {
          const primary = this.getPrimaryAdapter()
          const info = this.connectionManager.getConnectionInfo(
            this.routingConfig.primaryConnectionId
          )

          if (info?.status === 'connected') {
            return primary
          }
        } catch {
          // الأساسي غير متاح، استخدام fallback
        }

        // استخدام fallback
        const fallback = this.getFallbackAdapter()
        if (fallback) {
          return fallback
        }

        // إذا لم يكن هناك fallback، استخدام الأساسي حتى لو كان غير متصل
        return this.getPrimaryAdapter()
      }

      case RoutingStrategy.LOAD_BALANCE: {
        // توزيع الأحمال حسب عدد الاستعلامات
        const connections = this.getAvailableConnections()
        if (connections.length === 0) {
          return this.getPrimaryAdapter()
        }

        // اختيار الاتصال بأقل عدد استعلامات
        let minQueries = Infinity
        let selectedAdapter = connections[0].adapter

        for (const { adapter, info } of connections) {
          const queries = info.stats?.totalQueries || 0
          if (queries < minQueries) {
            minQueries = queries
            selectedAdapter = adapter
          }
        }

        return selectedAdapter
      }

      case RoutingStrategy.ROUND_ROBIN: {
        const connections = this.getAvailableConnections()
        if (connections.length === 0) {
          return this.getPrimaryAdapter()
        }

        const selected = connections[this.roundRobinIndex % connections.length]
        this.roundRobinIndex++

        return selected.adapter
      }

      default:
        return this.getPrimaryAdapter()
    }
  }

  /**
   * الحصول على الاتصالات المتاحة
   */
  private getAvailableConnections(): Array<{
    connectionId: string
    adapter: IDatabaseAdapter
    info: import('../../domain/types/database-connection.types').DatabaseConnectionInfo
  }> {
    const connections: Array<{
      connectionId: string
      adapter: IDatabaseAdapter
      info: import('../../domain/types/database-connection.types').DatabaseConnectionInfo
    }> = []

    // إضافة الاتصال الأساسي
    const primaryAdapter = this.connectionManager.getConnection(
      this.routingConfig.primaryConnectionId
    )
    const primaryInfo = this.connectionManager.getConnectionInfo(
      this.routingConfig.primaryConnectionId
    )

    if (primaryAdapter && primaryInfo) {
      connections.push({
        connectionId: this.routingConfig.primaryConnectionId,
        adapter: primaryAdapter,
        info: primaryInfo,
      })
    }

    // إضافة الاتصالات الاحتياطية
    if (this.routingConfig.fallbackConnectionIds) {
      for (const connectionId of this.routingConfig.fallbackConnectionIds) {
        const adapter = this.connectionManager.getConnection(connectionId)
        const info = this.connectionManager.getConnectionInfo(connectionId)

        if (adapter && info && info.status === 'connected') {
          connections.push({ connectionId, adapter, info })
        }
      }
    }

    return connections
  }
}
