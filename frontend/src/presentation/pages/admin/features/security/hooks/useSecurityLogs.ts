/**
 * useSecurityLogs Hook - Hook لصفحة Security Logs
 */

import { useState, useCallback, useEffect } from 'react'
import { useSecurityPage } from './useSecurityPage'
import { securityService } from '@/features/system-administration-portal'
import type {
  SecurityEvent,
  SecurityEventType,
  SecurityEventSeverity,
} from '@/features/system-administration-portal'

export interface UseSecurityLogsReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  logs: SecurityEvent[]
  page: number
  perPage: number
  searchQuery: string
  severityFilter: SecurityEventSeverity | 'all'
  eventTypeFilter: SecurityEventType | 'all'
  setPage: (page: number) => void
  setSearchQuery: (query: string) => void
  setSeverityFilter: (filter: SecurityEventSeverity | 'all') => void
  setEventTypeFilter: (filter: SecurityEventType | 'all') => void
  refresh: () => Promise<void>
}

export function useSecurityLogs(): UseSecurityLogsReturn {
  const { canAccess, loading: authLoading } = useSecurityPage('system.view')
  const [logs, setLogs] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<SecurityEventSeverity | 'all'>('all')
  const [eventTypeFilter, setEventTypeFilter] = useState<SecurityEventType | 'all'>('all')

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const filter: {
        page: number
        per_page: number
        severity?: SecurityEventSeverity
        eventType?: SecurityEventType
        search?: string
      } = {
        page,
        per_page: perPage,
      }
      if (severityFilter !== 'all') {
        filter.severity = severityFilter
      }
      if (eventTypeFilter !== 'all') {
        filter.eventType = eventTypeFilter
      }
      if (searchQuery) {
        filter.search = searchQuery
      }
      const data = await securityService.getSecurityLogs(filter)
      setLogs(data.logs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل السجلات')
    } finally {
      setLoading(false)
    }
  }, [page, perPage, severityFilter, eventTypeFilter, searchQuery])

  const refresh = useCallback(async () => {
    await loadLogs()
  }, [loadLogs])

  // Auto-load on mount and when filters change
  useEffect(() => {
    if (canAccess) {
      loadLogs()
    }
  }, [canAccess, loadLogs])

  return {
    canAccess,
    loading: authLoading || loading,
    error,
    logs,
    page,
    perPage,
    searchQuery,
    severityFilter,
    eventTypeFilter,
    setPage,
    setSearchQuery,
    setSeverityFilter,
    setEventTypeFilter,
    refresh,
  }
}
