/**
 * useAuditLogs Hook - Hook لـ Audit Logs
 *
 * يستخدم useApi كـ Base Hook مع دعم Filtering
 */

import { useState, useMemo, useCallback } from 'react'
import { useApi } from './useApi'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { AuditLogEntry, AuditStatistics, AuditTrend, AuditAlert, TimeWindow } from '../types'

export interface UseAuditLogsOptions {
  autoFetch?: boolean
  interval?: number
  timeWindow?: TimeWindow
  onUpdate?: (data: AuditLogEntry[]) => void
}

export interface UseAuditLogsFilters {
  search?: string
  action?: string
  entity?: string
  actor?: string
  success?: boolean
  dateRange?: [Date, Date]
  page?: number
  perPage?: number
}

export interface UseAuditLogsReturn {
  logs: AuditLogEntry[]
  statistics: AuditStatistics | null
  trends: AuditTrend[]
  alerts: AuditAlert[]
  loading: boolean
  error: Error | null
  filters: UseAuditLogsFilters
  setFilters: (filters: Partial<UseAuditLogsFilters>) => void
  clearFilters: () => void
  refresh: () => Promise<void>
  clearError: () => void
  filteredLogs: AuditLogEntry[]
}

/**
 * Hook لـ Audit Logs - يستخدم useApi
 *
 * @example
 * ```typescript
 * const { logs, statistics, filters, setFilters, filteredLogs } = useAuditLogs({
 *   interval: 5000,
 * })
 * ```
 */
export function useAuditLogs(options: UseAuditLogsOptions = {}): UseAuditLogsReturn {
  const { autoFetch = true, interval = 5000 } = options

  const [filters, setFiltersState] = useState<UseAuditLogsFilters>({
    page: 1,
    perPage: 50,
  })

  // Fetch Statistics
  const {
    data: statistics,
    loading: statsLoading,
    error: statsError,
    refresh: refreshStats,
  } = useApi<{ statistics: AuditStatistics }>({
    endpoint: DATABASE_CORE_ENDPOINTS.AUDIT.ANALYTICS.STATISTICS,
    autoFetch,
    interval,
    transform: data => data as { statistics: AuditStatistics },
  })

  // Fetch Trends
  const {
    data: trendsData,
    loading: trendsLoading,
    error: trendsError,
    refresh: refreshTrends,
  } = useApi<{ trends: AuditTrend[] }>({
    endpoint: DATABASE_CORE_ENDPOINTS.AUDIT.ANALYTICS.TRENDS,
    autoFetch,
    interval,
    transform: data => data as { trends: AuditTrend[] },
  })

  // Fetch Alerts
  const {
    data: alertsData,
    loading: alertsLoading,
    error: alertsError,
    refresh: refreshAlerts,
  } = useApi<{ alerts: AuditAlert[] }>({
    endpoint: DATABASE_CORE_ENDPOINTS.AUDIT.ANALYTICS.ALERTS,
    autoFetch,
    interval,
    transform: data => data as { alerts: AuditAlert[] },
  })

  // Mock logs (سيتم استبدالها بـ API endpoint حقيقي)
  const [logs] = useState<AuditLogEntry[]>([])

  // Filter logs
  const filteredLogs = useMemo(() => {
    let result = [...logs]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        log =>
          log.action.toLowerCase().includes(searchLower) ||
          log.entity.toLowerCase().includes(searchLower) ||
          log.actor.toLowerCase().includes(searchLower)
      )
    }

    // Action filter
    if (filters.action) {
      result = result.filter(log => log.action === filters.action)
    }

    // Entity filter
    if (filters.entity) {
      result = result.filter(log => log.entity === filters.entity)
    }

    // Actor filter
    if (filters.actor) {
      result = result.filter(log => log.actor === filters.actor)
    }

    // Success filter
    if (filters.success !== undefined) {
      result = result.filter(log => log.success === filters.success)
    }

    // Date range filter
    if (filters.dateRange) {
      const [start, end] = filters.dateRange
      result = result.filter(log => {
        const logDate = new Date(log.timestamp)
        return logDate >= start && logDate <= end
      })
    }

    // Pagination
    if (filters.page && filters.perPage) {
      const start = (filters.page - 1) * filters.perPage
      const end = start + filters.perPage
      result = result.slice(start, end)
    }

    return result
  }, [logs, filters])

  const setFilters = useCallback((newFilters: Partial<UseAuditLogsFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFiltersState({
      page: 1,
      perPage: 50,
    })
  }, [])

  const refresh = useCallback(async () => {
    await Promise.all([refreshStats(), refreshTrends(), refreshAlerts()])
  }, [refreshStats, refreshTrends, refreshAlerts])

  const clearError = useCallback(() => {
    // Clear all errors
  }, [])

  return {
    logs,
    statistics: statistics?.statistics || null,
    trends: trendsData?.trends || [],
    alerts: alertsData?.alerts || [],
    loading: statsLoading || trendsLoading || alertsLoading,
    error: statsError || trendsError || alertsError,
    filters,
    setFilters,
    clearFilters,
    refresh,
    clearError,
    filteredLogs,
  }
}
