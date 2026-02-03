/**
 * useSessionsManagement Hook - Hook لصفحة Sessions Management
 */

import { useSecurityPage } from './useSecurityPage'
import { useSessions } from '@/features/system-administration-portal'

export interface UseSessionsManagementReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  sessions: ReturnType<typeof useSessions>['sessions']
  selectedSession: ReturnType<typeof useSessions>['selectedSession']
  loadSessions: ReturnType<typeof useSessions>['loadSessions']
  terminateSession: ReturnType<typeof useSessions>['terminateSession']
  terminateAllSessions: ReturnType<typeof useSessions>['terminateAllSessions']
  loadSessionDetails: ReturnType<typeof useSessions>['loadSessionDetails']
  clearSelectedSession: ReturnType<typeof useSessions>['clearSelectedSession']
}

export function useSessionsManagement(): UseSessionsManagementReturn {
  const { canAccess, loading: authLoading } = useSecurityPage('system.view')
  const {
    sessions,
    selectedSession,
    loading: sessionsLoading,
    error: sessionsError,
    loadSessions,
    terminateSession,
    terminateAllSessions,
    loadSessionDetails,
    clearSelectedSession,
  } = useSessions()

  return {
    canAccess,
    loading: authLoading || sessionsLoading,
    error:
      typeof sessionsError === 'string'
        ? sessionsError
        : sessionsError !== null && typeof sessionsError === 'object' && 'message' in sessionsError
          ? String((sessionsError as { message: string }).message)
          : null,
    sessions,
    selectedSession,
    loadSessions,
    terminateSession,
    terminateAllSessions,
    loadSessionDetails,
    clearSelectedSession,
  }
}
