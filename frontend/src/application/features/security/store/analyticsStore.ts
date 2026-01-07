/**
 * Analytics Store - Store التحليلات
 *
 * Zustand store لإدارة حالة التحليلات
 */

import { create } from 'zustand'
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

interface AnalyticsState {
  // Report
  report: SecurityAnalyticsReport | null
  setReport: (report: SecurityAnalyticsReport | null) => void

  // Metrics
  metrics: SecurityMetrics | null
  setMetrics: (metrics: SecurityMetrics | null) => void

  // Data
  loginActivity: LoginActivityData[]
  setLoginActivity: (data: LoginActivityData[]) => void

  eventsTimeline: SecurityEventsTimeline[]
  setEventsTimeline: (data: SecurityEventsTimeline[]) => void

  sessionsDistribution: SessionsDistribution[]
  setSessionsDistribution: (data: SessionsDistribution[]) => void

  geographicDistribution: GeographicDistribution[]
  setGeographicDistribution: (data: GeographicDistribution[]) => void

  topIPs: IPActivityAnalysis[]
  setTopIPs: (data: IPActivityAnalysis[]) => void

  topUsers: UserActivityAnalysis[]
  setTopUsers: (data: UserActivityAnalysis[]) => void

  // Period & Dates
  period: AnalyticsPeriod
  setPeriod: (period: AnalyticsPeriod) => void
  startDate: string | undefined
  setStartDate: (date: string | undefined) => void
  endDate: string | undefined
  setEndDate: (date: string | undefined) => void

  // UI State
  loading: boolean
  error: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Actions
  reset: () => void
}

const initialState = {
  report: null,
  metrics: null,
  loginActivity: [],
  eventsTimeline: [],
  sessionsDistribution: [],
  geographicDistribution: [],
  topIPs: [],
  topUsers: [],
  period: '7d' as AnalyticsPeriod,
  startDate: undefined,
  endDate: undefined,
  loading: false,
  error: null,
}

export const useAnalyticsStore = create<AnalyticsState>(set => ({
  ...initialState,

  // Report
  setReport: report => set({ report }),

  // Metrics
  setMetrics: metrics => set({ metrics }),

  // Data
  setLoginActivity: data => set({ loginActivity: data }),
  setEventsTimeline: data => set({ eventsTimeline: data }),
  setSessionsDistribution: data => set({ sessionsDistribution: data }),
  setGeographicDistribution: data => set({ geographicDistribution: data }),
  setTopIPs: data => set({ topIPs: data }),
  setTopUsers: data => set({ topUsers: data }),

  // Period & Dates
  setPeriod: period => set({ period }),
  setStartDate: date => set({ startDate: date }),
  setEndDate: date => set({ endDate: date }),

  // UI State
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),

  // Reset
  reset: () => set(initialState),
}))
