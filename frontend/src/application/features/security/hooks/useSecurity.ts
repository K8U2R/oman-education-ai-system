/**
 * useSecurity Hook - Hook لإدارة الأمان
 *
 * Hook مخصص لإدارة الأمان والمصادقة
 */

import { useState, useEffect, useCallback } from 'react'
import { securityService } from '../services'
import type { SecurityStats, SecuritySettings, SecurityAlert } from '../types'

interface UseSecurityReturn {
  stats: SecurityStats | null
  settings: SecuritySettings | null
  alerts: SecurityAlert[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  refreshStats: () => Promise<void>
  refreshSettings: () => Promise<void>
  refreshAlerts: () => Promise<void>
  updateSettings: (settings: Partial<SecuritySettings>) => Promise<void>
  markAlertAsRead: (alertId: string) => Promise<void>
  markAllAlertsAsRead: () => Promise<void>
}

export const useSecurity = (): UseSecurityReturn => {
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [settings, setSettings] = useState<SecuritySettings | null>(null)
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * تحميل الإحصائيات
   */
  const refreshStats = useCallback(async () => {
    try {
      setError(null)
      const data = await securityService.getSecurityStats()
      setStats(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل الإحصائيات'
      setError(errorMessage)
      console.error('Failed to load security stats:', err)
    }
  }, [])

  /**
   * تحميل الإعدادات
   */
  const refreshSettings = useCallback(async () => {
    try {
      setError(null)
      const data = await securityService.getSecuritySettings()
      setSettings(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل الإعدادات'
      setError(errorMessage)
      console.error('Failed to load security settings:', err)
    }
  }, [])

  /**
   * تحميل التنبيهات
   */
  const refreshAlerts = useCallback(async () => {
    try {
      setError(null)
      const data = await securityService.getSecurityAlerts({ limit: 50 })
      setAlerts(data.alerts)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل التنبيهات'
      setError(errorMessage)
      console.error('Failed to load security alerts:', err)
    }
  }, [])

  /**
   * تحديث الإعدادات
   */
  const updateSettings = useCallback(async (newSettings: Partial<SecuritySettings>) => {
    try {
      setError(null)
      setLoading(true)
      const updated = await securityService.updateSecuritySettings(newSettings)
      setSettings(updated)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحديث الإعدادات'
      setError(errorMessage)
      console.error('Failed to update security settings:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * تحديد تنبيه كمقروء
   */
  const markAlertAsRead = useCallback(async (alertId: string) => {
    try {
      await securityService.markAlertAsRead(alertId)
      setAlerts(prev =>
        prev.map(alert => (alert.id === alertId ? { ...alert, isRead: true } : alert))
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحديث التنبيه'
      setError(errorMessage)
      console.error('Failed to mark alert as read:', err)
    }
  }, [])

  /**
   * تحديد جميع التنبيهات كمقروءة
   */
  const markAllAlertsAsRead = useCallback(async () => {
    try {
      await securityService.markAllAlertsAsRead()
      setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحديث التنبيهات'
      setError(errorMessage)
      console.error('Failed to mark all alerts as read:', err)
    }
  }, [])

  /**
   * تحديث جميع البيانات
   */
  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([refreshStats(), refreshSettings(), refreshAlerts()])
    } finally {
      setLoading(false)
    }
  }, [refreshStats, refreshSettings, refreshAlerts])

  /**
   * تحميل البيانات عند التحميل الأول
   */
  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    stats,
    settings,
    alerts,
    loading,
    error,
    refresh,
    refreshStats,
    refreshSettings,
    refreshAlerts,
    updateSettings,
    markAlertAsRead,
    markAllAlertsAsRead,
  }
}
