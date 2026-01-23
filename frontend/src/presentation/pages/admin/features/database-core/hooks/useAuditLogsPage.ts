/**
 * useAuditLogsPage Hook - Hook لصفحة Audit Logs
 */

import { useDatabaseCorePage } from './useDatabaseCorePage'
import { useAuditLogs } from '@/application/features/database-core'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'

export interface UseAuditLogsPageReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  logs: ReturnType<typeof useAuditLogs>['logs']
  stats: ReturnType<typeof useAuditLogs>['statistics']
  trends: ReturnType<typeof useAuditLogs>['trends']
  refresh: () => Promise<void>
}

export function useAuditLogsPage(): UseAuditLogsPageReturn {
  const { canAccess, loading: authLoading } = useDatabaseCorePage('database-core.audit.view')
  const {
    logs,
    statistics,
    trends,
    loading: auditLoading,
    error: auditError,
    refresh,
  } = useAuditLogs({
    interval: ADMIN_REFRESH_INTERVALS.DATABASE_CORE,
  })

  return {
    canAccess,
    loading: authLoading || auditLoading,
    error: auditError?.message || null,
    logs,
    stats: statistics,
    trends,
    refresh,
  }
}
