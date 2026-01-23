/**
 * Database Core Service - الخدمة الرئيسية
 *
 * Application Service لـ database-core
 * يستخدم Domain Layer للأنواع
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { HealthStatus, MetricsResponse, ApiResponse } from '../types'

class DatabaseCoreService {
  /**
   * الحصول على Health Status
   */
  async getHealthStatus(): Promise<HealthStatus> {
    const response = await apiClient.get<ApiResponse<HealthStatus>>(DATABASE_CORE_ENDPOINTS.HEALTH)

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get health status')
    }

    return response.data
  }

  /**
   * الحصول على Metrics
   */
  async getMetrics(): Promise<MetricsResponse> {
    const response = await apiClient.get<ApiResponse<MetricsResponse>>(
      DATABASE_CORE_ENDPOINTS.METRICS.HEALTH
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get metrics')
    }

    return response.data
  }

  /**
   * الحصول على Performance Stats
   */
  async getPerformanceStats(): Promise<MetricsResponse['performance']> {
    const response = await apiClient.get<ApiResponse<MetricsResponse>>(
      DATABASE_CORE_ENDPOINTS.METRICS.PERFORMANCE
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get performance stats')
    }

    return response.data.performance
  }
}

export const databaseCoreService = new DatabaseCoreService()
