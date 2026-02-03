/**
 * Connections Service - خدمة الاتصالات
 *
 * Application Service للاتصالات و Connection Pools
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type {
  Connection,
  ConnectionStatsResponse,
  PoolStats,
  PoolHealthStatus,
  ApiResponse,
} from '../types'

class ConnectionsService {
  /**
   * الحصول على جميع الاتصالات
   */
  async getConnections(): Promise<Connection[]> {
    const response = await apiClient.get<ApiResponse<ConnectionStatsResponse>>(
      DATABASE_CORE_ENDPOINTS.POOL.STATS
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get connections')
    }

    return response.data.connections
  }

  /**
   * الحصول على Pool Statistics
   */
  async getPoolStats(): Promise<PoolStats> {
    const response = await apiClient.get<ApiResponse<ConnectionStatsResponse>>(
      DATABASE_CORE_ENDPOINTS.POOL.STATS
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get pool stats')
    }

    return response.data.poolStats
  }

  /**
   * الحصول على Pool Health Status
   */
  async getPoolHealthStatus(): Promise<PoolHealthStatus> {
    const response = await apiClient.get<ApiResponse<PoolHealthStatus>>(
      DATABASE_CORE_ENDPOINTS.POOL.HEALTH
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get pool health status')
    }

    return response.data
  }
}

export const connectionsService = new ConnectionsService()
