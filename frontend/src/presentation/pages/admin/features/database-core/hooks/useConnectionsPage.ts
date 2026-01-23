/**
 * useConnectionsPage Hook - Hook لصفحة Connections
 */

import { useDatabaseCorePage } from './useDatabaseCorePage'
import { useConnectionStats } from '@/application/features/database-core'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'

export interface UseConnectionsPageReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  connections: ReturnType<typeof useConnectionStats>['connections']
  poolStats: ReturnType<typeof useConnectionStats>['poolStats']
  refresh: () => Promise<void>
}

export function useConnectionsPage(): UseConnectionsPageReturn {
  const { canAccess, loading: authLoading } = useDatabaseCorePage(
    'database-core.connections.manage'
  )
  const {
    connections,
    poolStats,
    loading: connectionsLoading,
    error: connectionsError,
    refresh,
  } = useConnectionStats({
    interval: ADMIN_REFRESH_INTERVALS.DATABASE_CORE,
  })

  return {
    canAccess,
    loading: authLoading || connectionsLoading,
    error: connectionsError?.message || null,
    connections,
    poolStats,
    refresh,
  }
}
