/**
 * useErrorDashboard Hook - Hook لصفحة Error Dashboard
 */

import { useState, useCallback, useEffect } from 'react'
import { useAnalyticsPage } from './useAnalyticsPage'
import { monitoringService } from '@/infrastructure/services'
import type { ErrorEntry, ErrorStats } from '@/infrastructure/services'

export interface UseErrorDashboardReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  stats: ErrorStats | null
  errors: ErrorEntry[]
  refresh: () => Promise<void>
  resolveError: (errorId: string) => Promise<void>
}

export function useErrorDashboard(): UseErrorDashboardReturn {
  const { canAccess, loading: authLoading } = useAnalyticsPage()
  const [stats, setStats] = useState<ErrorStats | null>(null)
  const [errors, setErrors] = useState<ErrorEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [statsData, errorsData] = await Promise.all([
        monitoringService.getErrorStats(),
        monitoringService.getErrors({ limit: 20 }),
      ])
      setStats(statsData)
      setErrors(errorsData.errors)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }, [])

  const resolveError = useCallback(
    async (errorId: string) => {
      try {
        await monitoringService.resolveError(errorId)
        await loadData()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'فشل حل الخطأ')
      }
    },
    [loadData]
  )

  useEffect(() => {
    if (canAccess) {
      loadData()
    }
  }, [canAccess, loadData])

  return {
    canAccess,
    loading: authLoading || loading,
    error,
    stats,
    errors,
    refresh: loadData,
    resolveError,
  }
}
