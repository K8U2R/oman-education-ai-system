/**
 * Security Store - Store الأمان
 *
 * Zustand store لإدارة حالة الأمان
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  SecurityStats,
  SecuritySettings,
  SecurityAlert,
  SecurityEvent,
  SecurityLogFilter,
} from '../types'

interface SecurityState {
  // Stats
  stats: SecurityStats | null
  setStats: (stats: SecurityStats | null) => void

  // Settings
  settings: SecuritySettings | null
  setSettings: (settings: SecuritySettings | null) => void

  // Alerts
  alerts: SecurityAlert[]
  setAlerts: (alerts: SecurityAlert[]) => void
  addAlert: (alert: SecurityAlert) => void
  updateAlert: (id: string, alert: Partial<SecurityAlert>) => void
  removeAlert: (id: string) => void
  markAlertAsRead: (id: string) => void
  markAllAlertsAsRead: () => void

  // Logs
  logs: SecurityEvent[]
  logsFilter: SecurityLogFilter
  logsTotal: number
  logsPage: number
  logsPerPage: number
  setLogs: (logs: SecurityEvent[]) => void
  setLogsFilter: (filter: SecurityLogFilter) => void
  setLogsTotal: (total: number) => void
  setLogsPage: (page: number) => void
  setLogsPerPage: (perPage: number) => void

  // UI State
  loading: boolean
  error: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Actions
  reset: () => void
}

const initialState = {
  stats: null,
  settings: null,
  alerts: [],
  logs: [],
  logsFilter: {},
  logsTotal: 0,
  logsPage: 1,
  logsPerPage: 20,
  loading: false,
  error: null,
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    set => ({
      ...initialState,

      // Stats
      setStats: stats => set({ stats }),

      // Settings
      setSettings: settings => set({ settings }),

      // Alerts
      setAlerts: alerts => set({ alerts }),
      addAlert: alert => set(state => ({ alerts: [alert, ...state.alerts] })),
      updateAlert: (id, updates) =>
        set(state => ({
          alerts: state.alerts.map(alert => (alert.id === id ? { ...alert, ...updates } : alert)),
        })),
      removeAlert: id =>
        set(state => ({
          alerts: state.alerts.filter(alert => alert.id !== id),
        })),
      markAlertAsRead: id =>
        set(state => ({
          alerts: state.alerts.map(alert => (alert.id === id ? { ...alert, isRead: true } : alert)),
        })),
      markAllAlertsAsRead: () =>
        set(state => ({
          alerts: state.alerts.map(alert => ({ ...alert, isRead: true })),
        })),

      // Logs
      setLogs: logs => set({ logs }),
      setLogsFilter: filter => set({ logsFilter: filter }),
      setLogsTotal: total => set({ logsTotal: total }),
      setLogsPage: page => set({ logsPage: page }),
      setLogsPerPage: perPage => set({ logsPerPage: perPage }),

      // UI State
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'security-store',
      partialize: state => ({
        settings: state.settings,
        logsFilter: state.logsFilter,
        logsPerPage: state.logsPerPage,
      }),
    }
  )
)
