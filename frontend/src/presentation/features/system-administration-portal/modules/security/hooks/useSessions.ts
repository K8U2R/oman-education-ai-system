/**
 * useSessions Hook - Hook لإدارة الجلسات
 *
 * Hook مخصص لإدارة الجلسات النشطة
 */

import { useState, useEffect, useCallback } from 'react'
import { sessionService } from '../api'
import type { Session, SessionDetails, SessionFilter } from '../types/session.types'

interface UseSessionsReturn {
  sessions: Session[]
  selectedSession: SessionDetails | null
  loading: boolean
  error: string | null
  loadSessions: (filter?: SessionFilter) => Promise<void>
  loadSessionDetails: (sessionId: string) => Promise<void>
  terminateSession: (sessionId: string) => Promise<void>
  terminateAllSessions: (userId: string) => Promise<void>
  refreshSession: (sessionId: string, tokenHash: string) => Promise<void>
  clearSelectedSession: () => void
}

export const useSessions = (): UseSessionsReturn => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<SessionDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * تحميل الجلسات
   */
  const loadSessions = useCallback(async (filter?: SessionFilter) => {
    try {
      setLoading(true)
      setError(null)
      const data = await sessionService.getUserSessions(filter)
      setSessions(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل الجلسات'
      setError(errorMessage)
      console.error('Failed to load sessions:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * تحميل تفاصيل الجلسة
   */
  const loadSessionDetails = useCallback(async (sessionId: string) => {
    try {
      setError(null)
      const data = await sessionService.getSessionDetails(sessionId)
      setSelectedSession(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل تفاصيل الجلسة'
      setError(errorMessage)
      console.error('Failed to load session details:', err)
    }
  }, [])

  /**
   * إنهاء جلسة
   */
  const terminateSession = useCallback(
    async (sessionId: string) => {
      try {
        setError(null)
        await sessionService.terminateSession(sessionId)
        setSessions(prev => prev.filter(s => s.id !== sessionId))
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل في إنهاء الجلسة'
        setError(errorMessage)
        console.error('Failed to terminate session:', err)
        throw err
      }
    },
    [selectedSession]
  )

  /**
   * إنهاء جميع الجلسات
   */
  const terminateAllSessions = useCallback(async (userId: string) => {
    try {
      setError(null)
      await sessionService.terminateAllSessions(userId)
      setSessions([])
      setSelectedSession(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في إنهاء جميع الجلسات'
      setError(errorMessage)
      console.error('Failed to terminate all sessions:', err)
      throw err
    }
  }, [])

  /**
   * تحديث جلسة
   */
  const refreshSession = useCallback(
    async (sessionId: string, tokenHash: string) => {
      try {
        setError(null)
        const updated = await sessionService.refreshSession(sessionId, tokenHash)
        setSessions(prev => prev.map(s => (s.id === sessionId ? updated : s)))
        if (selectedSession?.id === sessionId) {
          await loadSessionDetails(sessionId)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل في تحديث الجلسة'
        setError(errorMessage)
        console.error('Failed to refresh session:', err)
      }
    },
    [selectedSession, loadSessionDetails]
  )

  /**
   * مسح الجلسة المحددة
   */
  const clearSelectedSession = useCallback(() => {
    setSelectedSession(null)
  }, [])

  /**
   * تحميل الجلسات عند التحميل الأول
   */
  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  return {
    sessions,
    selectedSession,
    loading,
    error,
    loadSessions,
    loadSessionDetails,
    terminateSession,
    terminateAllSessions,
    refreshSession,
    clearSelectedSession,
  }
}
