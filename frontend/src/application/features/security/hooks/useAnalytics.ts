/**
 * useAnalytics Hook - Hook للتحليلات
 *
 * Hook مخصص للمطورين والإدارة لتحليل الأمان
 */

import { useState, useEffect, useCallback } from 'react'
import { securityAnalyticsService } from '../services'
import type {
  SecurityAnalyticsReport,
  SecurityMetrics,
  LoginActivityData,
  SecurityEventsTimeline,
  SessionsDistribution,
  GeographicDistribution,
  IPActivityAnalysis,
  UserActivityAnalysis,
  AnalyticsPeriod,
} from '../types'

interface UseAnalyticsReturn {
  report: SecurityAnalyticsReport | null
  metrics: SecurityMetrics | null
  loginActivity: LoginActivityData[]
  eventsTimeline: SecurityEventsTimeline[]
  sessionsDistribution: SessionsDistribution[]
  geographicDistribution: GeographicDistribution[]
  topIPs: IPActivityAnalysis[]
  topUsers: UserActivityAnalysis[]
  loading: boolean
  error: string | null
  period: AnalyticsPeriod
  setPeriod: (period: AnalyticsPeriod) => void
  startDate: string | undefined
  setStartDate: (date: string | undefined) => void
  endDate: string | undefined
  setEndDate: (date: string | undefined) => void
  loadReport: () => Promise<void>
  loadMetrics: () => Promise<void>
  loadLoginActivity: () => Promise<void>
  loadEventsTimeline: () => Promise<void>
  loadSessionsDistribution: () => Promise<void>
  loadGeographicDistribution: () => Promise<void>
  loadIPActivity: (params?: {
    limit?: number
    riskLevel?: 'low' | 'medium' | 'high'
  }) => Promise<void>
  loadUserActivity: (params?: {
    limit?: number
    riskLevel?: 'low' | 'medium' | 'high'
  }) => Promise<void>
  exportReport: (format: 'pdf' | 'excel' | 'csv') => Promise<void>
  refresh: () => Promise<void>
}

export const useAnalytics = (initialPeriod: AnalyticsPeriod = '7d'): UseAnalyticsReturn => {
  const [report, setReport] = useState<SecurityAnalyticsReport | null>(null)
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [loginActivity, setLoginActivity] = useState<LoginActivityData[]>([])
  const [eventsTimeline, setEventsTimeline] = useState<SecurityEventsTimeline[]>([])
  const [sessionsDistribution, setSessionsDistribution] = useState<SessionsDistribution[]>([])
  const [geographicDistribution, setGeographicDistribution] = useState<GeographicDistribution[]>([])
  const [topIPs, setTopIPs] = useState<IPActivityAnalysis[]>([])
  const [topUsers, setTopUsers] = useState<UserActivityAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<AnalyticsPeriod>(initialPeriod)
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)

  /**
   * تحميل التقرير الكامل
   */
  const loadReport = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await securityAnalyticsService.getAnalyticsReport({
        period,
        startDate,
        endDate,
      })
      setReport(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل التقرير'
      setError(errorMessage)
      console.error('Failed to load analytics report:', err)
    } finally {
      setLoading(false)
    }
  }, [period, startDate, endDate])

  /**
   * تحميل المقاييس
   */
  const loadMetrics = useCallback(async () => {
    try {
      setError(null)
      const data = await securityAnalyticsService.getSecurityMetrics({
        period,
        startDate,
        endDate,
      })
      setMetrics(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل المقاييس'
      setError(errorMessage)
      console.error('Failed to load metrics:', err)
    }
  }, [period, startDate, endDate])

  /**
   * تحميل نشاط تسجيل الدخول
   */
  const loadLoginActivity = useCallback(async () => {
    try {
      setError(null)
      const data = await securityAnalyticsService.getLoginAttemptsOverTime({
        period,
        startDate,
        endDate,
      })
      setLoginActivity(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل نشاط تسجيل الدخول'
      setError(errorMessage)
      console.error('Failed to load login activity:', err)
    }
  }, [period, startDate, endDate])

  /**
   * تحميل خط زمني الأحداث
   */
  const loadEventsTimeline = useCallback(async () => {
    try {
      setError(null)
      const data = await securityAnalyticsService.getSecurityEventSummary({
        period,
        startDate,
        endDate,
      })
      setEventsTimeline(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل خط زمني الأحداث'
      setError(errorMessage)
      console.error('Failed to load events timeline:', err)
    }
  }, [period, startDate, endDate])

  /**
   * تحميل توزيع الجلسات
   */
  const loadSessionsDistribution = useCallback(async () => {
    try {
      setError(null)
      const data = await securityAnalyticsService.getSessionsDistribution({
        startDate,
        endDate,
      })
      setSessionsDistribution(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل توزيع الجلسات'
      setError(errorMessage)
      console.error('Failed to load sessions distribution:', err)
    }
  }, [startDate, endDate])

  /**
   * تحميل التوزيع الجغرافي
   */
  const loadGeographicDistribution = useCallback(async () => {
    try {
      setError(null)
      const data = await securityAnalyticsService.getGeographicDistribution({
        startDate,
        endDate,
      })
      setGeographicDistribution(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل التوزيع الجغرافي'
      setError(errorMessage)
      console.error('Failed to load geographic distribution:', err)
    }
  }, [startDate, endDate])

  /**
   * تحميل تحليل نشاط IP
   */
  const loadIPActivity = useCallback(
    async (_params?: { limit?: number; riskLevel?: 'low' | 'medium' | 'high' }) => {
      try {
        setError(null)
        const data = await securityAnalyticsService.getTopFailedLogins({
          period,
          startDate,
          endDate,
        })
        setTopIPs(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل تحليل نشاط IP'
        setError(errorMessage)
        console.error('Failed to load IP activity:', err)
      }
    },
    [period, startDate, endDate]
  )

  /**
   * تحميل تحليل نشاط المستخدم
   */
  const loadUserActivity = useCallback(
    async (_params?: { limit?: number; riskLevel?: 'low' | 'medium' | 'high' }) => {
      try {
        setError(null)
        const data = await securityAnalyticsService.getUserActivityTrend({
          period,
          startDate,
          endDate,
        })
        setTopUsers(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل تحليل نشاط المستخدم'
        setError(errorMessage)
        console.error('Failed to load user activity:', err)
      }
    },
    [period, startDate, endDate]
  )

  /**
   * تصدير التقرير
   */
  const exportReport = useCallback(
    async (format: 'pdf' | 'excel' | 'csv') => {
      try {
        setError(null)
        // TODO: Implement export functionality when backend supports it
        const report = await securityAnalyticsService.getAnalyticsReport({
          period,
          startDate,
          endDate,
        })

        // Convert to JSON for now
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `security-analytics-report.${format === 'csv' ? 'csv' : 'json'}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل في تصدير التقرير'
        setError(errorMessage)
        console.error('Failed to export report:', err)
        throw err
      }
    },
    [period, startDate, endDate]
  )

  /**
   * تحديث جميع البيانات
   */
  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadReport(),
        loadMetrics(),
        loadLoginActivity(),
        loadEventsTimeline(),
        loadSessionsDistribution(),
        loadGeographicDistribution(),
        loadIPActivity({ limit: 10 }),
        loadUserActivity({ limit: 10 }),
      ])
    } finally {
      setLoading(false)
    }
  }, [
    loadReport,
    loadMetrics,
    loadLoginActivity,
    loadEventsTimeline,
    loadSessionsDistribution,
    loadGeographicDistribution,
    loadIPActivity,
    loadUserActivity,
  ])

  /**
   * تحميل البيانات عند تغيير الفترة
   */
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, startDate, endDate]) // refresh فقط عند تغيير الفترة

  return {
    report,
    metrics,
    loginActivity,
    eventsTimeline,
    sessionsDistribution,
    geographicDistribution,
    topIPs,
    topUsers,
    loading,
    error,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loadReport,
    loadMetrics,
    loadLoginActivity,
    loadEventsTimeline,
    loadSessionsDistribution,
    loadGeographicDistribution,
    loadIPActivity,
    loadUserActivity,
    exportReport,
    refresh,
  }
}
