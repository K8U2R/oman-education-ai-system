/**
 * useConnectionStats Hook - Hook لإحصائيات الاتصالات
 *
 * يستخدم useApi كـ Base Hook
 */

import { useApi } from './useApi'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { ConnectionStatsResponse, Connection, PoolStats } from '../types'

export interface UseConnectionStatsOptions {
  autoFetch?: boolean
  interval?: number
  onUpdate?: (data: ConnectionStatsResponse) => void
}

export interface UseConnectionStatsReturn {
  data: ConnectionStatsResponse | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  clearError: () => void
  connections: Connection[]
  poolStats: PoolStats | null
}

/**
 * Hook لإحصائيات الاتصالات - يستخدم useApi
 *
 * @example
 * ```typescript
 * const { connections, poolStats, loading, refresh } = useConnectionStats({
 *   interval: 3000,
 * })
 * ```
 */
export function useConnectionStats(
  options: UseConnectionStatsOptions = {}
): UseConnectionStatsReturn {
  const { autoFetch = true, interval = 3000, onUpdate } = options

  const { data, loading, error, refresh, clearError } = useApi<ConnectionStatsResponse>({
    endpoint: DATABASE_CORE_ENDPOINTS.POOL.STATS,
    autoFetch,
    interval,
    transform: responseData => {
      const transformed = responseData as ConnectionStatsResponse
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
    connections: data?.connections || [],
    poolStats: data?.poolStats || null,
  }
}
