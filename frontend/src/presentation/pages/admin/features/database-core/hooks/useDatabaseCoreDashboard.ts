/**
 * useDatabaseCoreDashboard Hook - Hook لصفحة Database Core Dashboard
 *
 * Hook موحد يجمع:
 * - Authentication check
 * - Data fetching (Metrics, Connections, Cache)
 * - Loading state
 * - Error handling
 */

import { useDatabaseCorePage } from './useDatabaseCorePage'
import {
  useDatabaseMetrics,
  useConnectionStats,
  useCacheStats,
} from '@/application/features/database-core'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'

export interface UseDatabaseCoreDashboardReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  metrics: ReturnType<typeof useDatabaseMetrics>['data']
  connections: ReturnType<typeof useConnectionStats>['connections']
  poolStats: ReturnType<typeof useConnectionStats>['poolStats']
  cacheStats: ReturnType<typeof useCacheStats>['stats']
  refresh: () => void
}

export function useDatabaseCoreDashboard(): UseDatabaseCoreDashboardReturn {
  const { canAccess, loading: authLoading } = useDatabaseCorePage('database-core.view')

  const {
    data: metrics,
    loading: metricsLoading,
    error: metricsError,
    refresh: refreshMetrics,
  } = useDatabaseMetrics({
    interval: ADMIN_REFRESH_INTERVALS.DATABASE_CORE,
  })

  const {
    connections,
    poolStats,
    loading: connectionsLoading,
    error: connectionsError,
    refresh: refreshConnections,
  } = useConnectionStats({
    interval: ADMIN_REFRESH_INTERVALS.DATABASE_CORE,
  })

  const {
    stats: cacheStats,
    loading: cacheLoading,
    error: cacheError,
    refresh: refreshCache,
  } = useCacheStats({
    interval: ADMIN_REFRESH_INTERVALS.DATABASE_CORE,
  })

  const loading = authLoading || metricsLoading || connectionsLoading || cacheLoading
  const error = metricsError?.message || connectionsError?.message || cacheError?.message || null

  const refresh = () => {
    refreshMetrics()
    refreshConnections()
    refreshCache()
  }

  return {
    canAccess,
    loading,
    error,
    metrics,
    connections,
    poolStats,
    cacheStats,
    refresh,
  }
}
