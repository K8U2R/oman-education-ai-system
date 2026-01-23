/**
 * useSecurityDashboard Hook - Hook لصفحة Security Dashboard
 */

import { useSecurityPage } from './useSecurityPage'
import { useSecurity, useSessions } from '@/features/system-administration-portal'

export interface UseSecurityDashboardReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  stats: ReturnType<typeof useSecurity>['stats']
  alerts: ReturnType<typeof useSecurity>['alerts']
  sessions: ReturnType<typeof useSessions>['sessions']
  refresh: () => Promise<void>
  refreshStats: ReturnType<typeof useSecurity>['refreshStats']
  refreshAlerts: ReturnType<typeof useSecurity>['refreshAlerts']
  loadSessions: ReturnType<typeof useSessions>['loadSessions']
  terminateSession: ReturnType<typeof useSessions>['terminateSession']
  markAlertAsRead: ReturnType<typeof useSecurity>['markAlertAsRead']
}

export function useSecurityDashboard(): UseSecurityDashboardReturn {
  const { canAccess, loading: authLoading } = useSecurityPage('system.view')
  const {
    stats,
    alerts,
    loading: securityLoading,
    error: securityError,
    refreshStats,
    refreshAlerts,
    markAlertAsRead,
  } = useSecurity()
  const { sessions, loading: sessionsLoading, loadSessions, terminateSession } = useSessions()

  const loading = authLoading || securityLoading || sessionsLoading
  const error: string | null =
    typeof securityError === 'string'
      ? securityError
      : securityError !== null && typeof securityError === 'object' && 'message' in securityError
        ? String((securityError as { message: string }).message)
        : null

  const refresh = async () => {
    await Promise.all([refreshStats(), refreshAlerts(), loadSessions()])
  }

  return {
    canAccess,
    loading,
    error,
    stats,
    alerts,
    sessions,
    refresh,
    refreshStats,
    refreshAlerts,
    loadSessions,
    terminateSession,
    markAlertAsRead,
  }
}
