/**
 * usePerformanceDashboard Hook - Hook لصفحة Performance Dashboard
 */

import { useState, useCallback, useEffect } from 'react'
import { useAnalyticsPage } from './useAnalyticsPage'
import { monitoringService, performanceService } from '@/infrastructure/services'
import type { PerformanceStats, WebVitals, PerformanceMetrics } from '@/infrastructure/services'

export interface UsePerformanceDashboardReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  stats: (PerformanceStats & { errorRate: number; requestsPerSecond: number }) | null
  webVitals: WebVitals | null
  metrics: PerformanceMetrics | null
  refresh: () => Promise<void>
}

export function usePerformanceDashboard(): UsePerformanceDashboardReturn {
  const { canAccess, loading: authLoading } = useAnalyticsPage()
  const [stats, setStats] = useState<
    (PerformanceStats & { errorRate: number; requestsPerSecond: number }) | null
  >(null)
  const [webVitals, setWebVitals] = useState<WebVitals | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [statsData, webVitalsData, metricsData] = await Promise.all([
        monitoringService.getPerformanceStats(),
        Promise.resolve(performanceService.getWebVitals()),
        Promise.resolve(performanceService.getPerformanceMetrics()),
      ])

      // Calculate derived metrics
      const total = statsData.totalRequests || 1
      const errors = Object.entries(statsData.byStatusCode || {}).reduce(
        (sum, [code, count]) => (Number(code) >= 400 ? sum + count : sum),
        0
      )
      const errorRate = errors / total
      // Estimate RPS from last 1h trend (assuming evenly distributed) or just use 0 if not available
      const requestsPerSecond = statsData.trend?.last1h ? statsData.trend.last1h / 3600 : 0

      setStats({ ...statsData, errorRate, requestsPerSecond })
      setWebVitals(webVitalsData)
      setMetrics(metricsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }, [])

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
    webVitals,
    metrics,
    refresh: loadData,
  }
}
