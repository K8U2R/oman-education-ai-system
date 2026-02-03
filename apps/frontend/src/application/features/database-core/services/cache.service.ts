/**
 * Cache Service - خدمة Cache
 *
 * Application Service للـ Cache Management
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { CacheStats, ApiResponse } from '../types'

class CacheService {
  /**
   * الحصول على Cache Statistics
   */
  async getCacheStats(): Promise<CacheStats> {
    const response = await apiClient.get<ApiResponse<CacheStats>>(
      DATABASE_CORE_ENDPOINTS.CACHE.STATS
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get cache stats')
    }

    return response.data
  }

  /**
   * الحصول على Cache Registry Statistics
   */
  async getRegistryStats(): Promise<{
    totalKeys: number
    entities: string[]
    operations: string[]
    entityStats: Record<string, number>
  }> {
    const response = await apiClient.get<ApiResponse>(DATABASE_CORE_ENDPOINTS.CACHE.REGISTRY_STATS)

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get registry stats')
    }

    return response.data as {
      totalKeys: number
      entities: string[]
      operations: string[]
      entityStats: Record<string, number>
    }
  }

  /**
   * مسح جميع Cache
   */
  async clearCache(): Promise<void> {
    const response = await apiClient.post<ApiResponse>(DATABASE_CORE_ENDPOINTS.CACHE.CLEAR)

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to clear cache')
    }
  }

  /**
   * تنظيف Cache من القيم المنتهية الصلاحية
   */
  async cleanExpired(): Promise<number> {
    const response = await apiClient.post<ApiResponse<{ cleanedCount: number }>>(
      DATABASE_CORE_ENDPOINTS.CACHE.CLEAN
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to clean expired cache')
    }

    return response.data.cleanedCount
  }
}

export const cacheService = new CacheService()
