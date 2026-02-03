/**
 * Metrics Service - خدمة المقاييس
 *
 * Application Service للمقاييس والأداء
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type {
  PerformanceMetrics,
  QueryStatistics,
  SlowQuery,
  EntityAnalysis,
  CacheStats,
  ApiResponse,
} from '../types'

class MetricsService {
  /**
   * الحصول على Performance Metrics
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const response = await apiClient.get<ApiResponse<{ performance: PerformanceMetrics }>>(
      DATABASE_CORE_ENDPOINTS.METRICS.PERFORMANCE
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get performance metrics')
    }

    return (response.data as { performance: PerformanceMetrics }).performance
  }

  /**
   * الحصول على Query Statistics
   */
  async getQueryStatistics(): Promise<QueryStatistics> {
    const response = await apiClient.get<ApiResponse<{ statistics: QueryStatistics }>>(
      DATABASE_CORE_ENDPOINTS.METRICS.QUERIES
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get query statistics')
    }

    return (response.data as { statistics: QueryStatistics }).statistics
  }

  /**
   * الحصول على Slow Queries
   */
  async getSlowQueries(limit = 10): Promise<SlowQuery[]> {
    const response = await apiClient.get<ApiResponse<{ slowQueries: SlowQuery[] }>>(
      DATABASE_CORE_ENDPOINTS.METRICS.QUERIES
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get slow queries')
    }

    const slowQueries = (response.data as { slowQueries: SlowQuery[] }).slowQueries
    return slowQueries.slice(0, limit)
  }

  /**
   * تحليل Entity معين
   */
  async getEntityAnalysis(entity: string): Promise<EntityAnalysis> {
    const response = await apiClient.get<ApiResponse<EntityAnalysis>>(
      DATABASE_CORE_ENDPOINTS.METRICS.QUERIES_BY_ENTITY(entity)
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get entity analysis')
    }

    return response.data
  }

  /**
   * الحصول على Cache Statistics
   */
  async getCacheStats(): Promise<CacheStats> {
    const response = await apiClient.get<ApiResponse<CacheStats>>(
      DATABASE_CORE_ENDPOINTS.METRICS.CACHE
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get cache stats')
    }

    return response.data
  }
}

export const metricsService = new MetricsService()
