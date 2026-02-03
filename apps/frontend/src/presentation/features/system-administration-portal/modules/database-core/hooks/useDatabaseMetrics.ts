/**
 * useDatabaseMetrics Hook - Hook للمقاييس
 *
 * يستخدم useApi كـ Base Hook لتجنب تكرار الكود
 */

import { useApi } from './useApi'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { MetricsResponse, PerformanceMetrics } from '../types'

export interface UseDatabaseMetricsOptions {
  autoFetch?: boolean
  interval?: number
  onUpdate?: (data: MetricsResponse) => void
}

export interface UseDatabaseMetricsReturn {
  data: MetricsResponse | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  clearError: () => void
  performance: PerformanceMetrics | null
}

/**
 * Hook للمقاييس - يستخدم useApi
 *
 * @example
 * ```typescript
 * const { data, loading, performance, refresh } = useDatabaseMetrics({
 *   interval: 5000, // Auto-refresh every 5 seconds
 * })
 * ```
 */
export function useDatabaseMetrics(
  options: UseDatabaseMetricsOptions = {}
): UseDatabaseMetricsReturn {
  const { autoFetch = true, interval = 5000, onUpdate } = options

  const { data, loading, error, refresh, clearError } = useApi<MetricsResponse>({
    endpoint: DATABASE_CORE_ENDPOINTS.METRICS.HEALTH,
    autoFetch,
    interval,
    transform: responseData => {
      const transformed = responseData as MetricsResponse
      onUpdate?.(transformed)
      return transformed
    },
  })

  return {
    data,
    loading,
    error,
    refresh,
    clearError,
    performance: data?.performance || null,
  }
}
