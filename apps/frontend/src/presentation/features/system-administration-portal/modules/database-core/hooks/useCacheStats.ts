/**
 * useCacheStats Hook - Hook لإحصائيات Cache
 *
 * يستخدم useApi كـ Base Hook
 */

import { useState, useCallback } from 'react'
import { useApi } from './useApi'
import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { CacheStats, ApiResponse } from '../types'

export interface UseCacheStatsOptions {
  autoFetch?: boolean
  interval?: number
  onUpdate?: (data: CacheStats) => void
}

export interface UseCacheStatsReturn {
  stats: CacheStats | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  clearError: () => void
  clearCache: () => Promise<void>
  cleanExpired: () => Promise<number>
}

/**
 * Hook لإحصائيات Cache - يستخدم useApi
 *
 * @example
 * ```typescript
 * const { stats, loading, clearCache, cleanExpired } = useCacheStats({
 *   interval: 5000,
 * })
 * ```
 */
export function useCacheStats(options: UseCacheStatsOptions = {}): UseCacheStatsReturn {
  const { autoFetch = true, interval = 5000, onUpdate } = options
  const [actionLoading, setActionLoading] = useState(false)

  const { data, loading, error, refresh, clearError } = useApi<CacheStats>({
    endpoint: DATABASE_CORE_ENDPOINTS.CACHE.STATS,
    autoFetch,
    interval,
    transform: responseData => {
      const transformed = responseData as CacheStats
      onUpdate?.(transformed)
      return transformed
    },
  })

  const clearCache = useCallback(async () => {
    setActionLoading(true)
    try {
      await apiClient.post<ApiResponse>(DATABASE_CORE_ENDPOINTS.CACHE.CLEAR)
      await refresh()
    } catch (err) {
      console.error('Failed to clear cache:', err)
    } finally {
      setActionLoading(false)
    }
  }, [refresh])

  const cleanExpired = useCallback(async (): Promise<number> => {
    setActionLoading(true)
    try {
      const response = await apiClient.post<ApiResponse<{ cleanedCount: number }>>(
        DATABASE_CORE_ENDPOINTS.CACHE.CLEAN
      )
      await refresh()
      return response.data?.cleanedCount || 0
    } catch (err) {
      console.error('Failed to clean expired cache:', err)
      return 0
    } finally {
      setActionLoading(false)
    }
  }, [refresh])

  return {
    stats: data,
    loading: loading || actionLoading,
    error,
    refresh,
    clearError,
    clearCache,
    cleanExpired,
  }
}
