import { useState, useEffect, useCallback } from 'react'
import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import { useSessions } from '@/application/features/security'
import { loggingService } from '@/infrastructure/services'
import { sessionService } from '@/application/features/security/services'
import type { Session } from '@/application/features/security/types'

/**
 * useSecurity - هوك مخصص لإدارة منطق الأمان والجلسات
 */
export const useSecurity = () => {
  const { user, canAccess } = usePageAuth({
    requireAuth: true,
    autoRedirect: true,
  })

  const { sessions, loading: sessionsLoading, loadSessions } = useSessions()
  const [activeSessions, setActiveSessions] = useState<Session[]>([])
  const [terminating, setTerminating] = useState<string | null>(null)

  const { isLoading, shouldShowLoading, loadingMessage } = usePageLoading({
    isLoading: !canAccess || sessionsLoading,
    message: 'جاري تحميل إعدادات الأمان...',
  })

  useEffect(() => {
    if (sessions) {
      setActiveSessions(sessions.filter(s => s.status === 'active'))
    }
  }, [sessions])

  // إنهاء جلسة محددة
  const handleTerminateSession = useCallback(
    async (sessionId: string) => {
      try {
        setTerminating(sessionId)
        await sessionService.terminateSession(sessionId)
        await loadSessions()
      } catch (error) {
        loggingService.error('Failed to terminate session', error as Error)
      } finally {
        setTerminating(null)
      }
    },
    [loadSessions]
  )

  // إنهاء جميع الجلسات الأخرى
  const handleTerminateAllOtherSessions = useCallback(async () => {
    if (!user?.id) return
    try {
      setTerminating('all')
      await sessionService.terminateAllOtherSessions(user.id)
      await loadSessions()
    } catch (error) {
      loggingService.error('Failed to terminate all sessions', error as Error)
    } finally {
      setTerminating(null)
    }
  }, [user?.id, loadSessions])

  return {
    user,
    canAccess,
    activeSessions,
    terminating,
    isLoading,
    shouldShowLoading,
    loadingMessage,
    handleTerminateSession,
    handleTerminateAllOtherSessions,
  }
}
