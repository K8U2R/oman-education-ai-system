/**
 * useDeveloper Hook - Hook للمطور
 *
 * @description Custom Hook لإدارة لوحة تحكم المطور
 */

import { useEffect, useCallback } from 'react'
import { useDeveloperStore } from '../store'
import type { DeveloperStats, APIEndpointInfo, ServiceInfo, PerformanceMetric } from '../types'

interface UseDeveloperOptions {
  autoFetch?: boolean
  refreshInterval?: number
}

interface UseDeveloperReturn {
  // Stats
  stats: DeveloperStats | null
  endpoints: APIEndpointInfo[]
  services: ServiceInfo[]
  performance: PerformanceMetric[]

  // State
  isLoading: boolean
  error: string | null

  // Actions
  fetchStats: () => Promise<void>
  fetchEndpoints: () => Promise<void>
  fetchServices: () => Promise<void>
  fetchPerformance: () => Promise<void>
  fetchAll: () => Promise<void>
  refresh: () => Promise<void>
}

/**
 * Hook لإدارة لوحة تحكم المطور
 */
export const useDeveloper = (options: UseDeveloperOptions = {}): UseDeveloperReturn => {
  const { autoFetch = true, refreshInterval } = options

  const {
    stats,
    endpoints,
    services,
    performance,
    isLoading,
    error,
    fetchStats: storeFetchStats,
    fetchEndpoints: storeFetchEndpoints,
    fetchServices: storeFetchServices,
    fetchPerformance: storeFetchPerformance,
  } = useDeveloperStore()

  /**
   * جلب جميع البيانات
   */
  const fetchAll = useCallback(async () => {
    await Promise.all([
      storeFetchStats(),
      storeFetchEndpoints(),
      storeFetchServices(),
      storeFetchPerformance(),
    ])
  }, [storeFetchStats, storeFetchEndpoints, storeFetchServices, storeFetchPerformance])

  /**
   * تحديث جميع البيانات
   */
  const refresh = useCallback(async () => {
    await fetchAll()
  }, [fetchAll])

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchAll()
    }
  }, [autoFetch, fetchAll])

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        refresh()
      }, refreshInterval)

      return () => {
        clearInterval(interval)
      }
    }
    return undefined
  }, [refreshInterval, refresh])

  return {
    stats,
    endpoints,
    services,
    performance,
    isLoading,
    error,
    fetchStats: storeFetchStats,
    fetchEndpoints: storeFetchEndpoints,
    fetchServices: storeFetchServices,
    fetchPerformance: storeFetchPerformance,
    fetchAll,
    refresh,
  }
}
