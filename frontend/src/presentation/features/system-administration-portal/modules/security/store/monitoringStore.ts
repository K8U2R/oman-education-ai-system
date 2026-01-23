/**
 * Monitoring Store - Store المراقبة
 *
 * Zustand store لإدارة حالة المراقبة
 */

import { create } from 'zustand'
import type {
  SystemHealthStatus,
  RealTimeSecurityMetrics,
  AlertThreshold,
  MonitoringDashboardConfig,
} from '../types/monitoring.types'

interface MonitoringState {
  // System Health
  systemHealth: SystemHealthStatus | null
  setSystemHealth: (health: SystemHealthStatus | null) => void

  // Real-time Metrics
  realTimeMetrics: RealTimeSecurityMetrics | null
  setRealTimeMetrics: (metrics: RealTimeSecurityMetrics | null) => void

  // Alert Thresholds
  alertThresholds: AlertThreshold[]
  setAlertThresholds: (thresholds: AlertThreshold[]) => void
  addAlertThreshold: (threshold: AlertThreshold) => void
  updateAlertThreshold: (id: string, updates: Partial<AlertThreshold>) => void
  removeAlertThreshold: (id: string) => void

  // Config
  config: MonitoringDashboardConfig | null
  setConfig: (config: MonitoringDashboardConfig | null) => void

  // Auto Refresh
  autoRefresh: boolean
  setAutoRefresh: (enabled: boolean) => void
  refreshInterval: number
  setRefreshInterval: (interval: number) => void

  // UI State
  loading: boolean
  error: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Actions
  reset: () => void
}

const initialState = {
  systemHealth: null,
  realTimeMetrics: null,
  alertThresholds: [],
  config: null,
  autoRefresh: true,
  refreshInterval: 5,
  loading: false,
  error: null,
}

export const useMonitoringStore = create<MonitoringState>(set => ({
  ...initialState,

  // System Health
  setSystemHealth: health => set({ systemHealth: health }),

  // Real-time Metrics
  setRealTimeMetrics: metrics => set({ realTimeMetrics: metrics }),

  // Alert Thresholds
  setAlertThresholds: thresholds => set({ alertThresholds: thresholds }),
  addAlertThreshold: threshold =>
    set(state => ({
      alertThresholds: [threshold, ...state.alertThresholds],
    })),
  updateAlertThreshold: (id, updates) =>
    set(state => ({
      alertThresholds: state.alertThresholds.map(threshold =>
        threshold.id === id ? { ...threshold, ...updates } : threshold
      ),
    })),
  removeAlertThreshold: id =>
    set(state => ({
      alertThresholds: state.alertThresholds.filter(threshold => threshold.id !== id),
    })),

  // Config
  setConfig: config => set({ config }),

  // Auto Refresh
  setAutoRefresh: enabled => set({ autoRefresh: enabled }),
  setRefreshInterval: interval => set({ refreshInterval: interval }),

  // UI State
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),

  // Reset
  reset: () => set(initialState),
}))
