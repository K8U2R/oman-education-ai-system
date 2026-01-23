/**
 * usePerformancePage Hook - Hook لصفحة Performance
 */

import { useDatabaseCorePage } from './useDatabaseCorePage'
import { useDatabaseMetrics } from '@/application/features/database-core'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'

export interface UsePerformancePageReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  metrics: ReturnType<typeof useDatabaseMetrics>['data']
  refresh: () => Promise<void>
}

export function usePerformancePage(): UsePerformancePageReturn {
  const { canAccess, loading: authLoading } = useDatabaseCorePage('database-core.metrics.view')
  const {
    data: metrics,
    loading: metricsLoading,
    error: metricsError,
    refresh,
  } = useDatabaseMetrics({
    interval: ADMIN_REFRESH_INTERVALS.DATABASE_CORE,
  })

  return {
    canAccess,
    loading: authLoading || metricsLoading,
    error: metricsError?.message || null,
    metrics,
    refresh,
  }
}
