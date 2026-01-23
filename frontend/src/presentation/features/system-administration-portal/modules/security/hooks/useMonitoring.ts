/**
 * useMonitoring Hook - Hook للمراقبة
 *
 * Hook مخصص للمطورين لمراقبة النظام في الوقت الفعلي
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { securityMonitoringService } from '../api'
import type {
  SystemHealthStatus,
  RealTimeSecurityMetrics,
  AlertThreshold,
  MonitoringDashboardConfig,
} from '../types/monitoring.types'

interface UseMonitoringReturn {
  systemHealth: SystemHealthStatus | null
  realTimeMetrics: RealTimeSecurityMetrics | null
  alertThresholds: AlertThreshold[]
  config: MonitoringDashboardConfig | null
  loading: boolean
  error: string | null
  autoRefresh: boolean
  setAutoRefresh: (enabled: boolean) => void
  refreshInterval: number
  setRefreshInterval: (interval: number) => void
  loadSystemHealth: () => Promise<void>
  loadRealTimeMetrics: () => Promise<void>
  loadAlertThresholds: () => Promise<void>
  loadConfig: () => Promise<void>
  createAlertThreshold: (
    threshold: Omit<AlertThreshold, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>
  updateAlertThreshold: (id: string, threshold: Partial<AlertThreshold>) => Promise<void>
  deleteAlertThreshold: (id: string) => Promise<void>
  updateConfig: (config: Partial<MonitoringDashboardConfig>) => Promise<void>
  refresh: () => Promise<void>
}

export const useMonitoring = (
  initialAutoRefresh: boolean = true,
  initialRefreshInterval: number = 5
): UseMonitoringReturn => {
  const [systemHealth, setSystemHealth] = useState<SystemHealthStatus | null>(null)
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeSecurityMetrics | null>(null)
  const [alertThresholds, setAlertThresholds] = useState<AlertThreshold[]>([])
  const [config, setConfig] = useState<MonitoringDashboardConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(initialAutoRefresh)
  const [refreshInterval, setRefreshInterval] = useState(initialRefreshInterval)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * تحميل حالة صحة النظام
   */
  const loadSystemHealth = useCallback(async () => {
    try {
      setError(null)
      const data = await securityMonitoringService.getSystemHealth()
      setSystemHealth(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل حالة صحة النظام'
      setError(errorMessage)
      console.error('Failed to load system health:', err)
    }
  }, [])

  /**
   * تحميل المقاييس في الوقت الفعلي
   */
  const loadRealTimeMetrics = useCallback(async () => {
    try {
      setError(null)
      const data = await securityMonitoringService.getRealTimeMetrics()
      setRealTimeMetrics(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل المقاييس'
      setError(errorMessage)
      console.error('Failed to load real-time metrics:', err)
    }
  }, [])

  /**
   * تحميل عتبات التنبيه
   */
  const loadAlertThresholds = useCallback(async () => {
    try {
      setError(null)
      const data = await securityMonitoringService.getAlertThresholds()
      setAlertThresholds(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل عتبات التنبيه'
      setError(errorMessage)
      console.error('Failed to load alert thresholds:', err)
    }
  }, [])

  /**
   * تحميل الإعدادات
   */
  const loadConfig = useCallback(async () => {
    try {
      setError(null)
      const data = await securityMonitoringService.getMonitoringConfig()
      setConfig(data)
      if (data) {
        setAutoRefresh(data.autoRefresh)
        setRefreshInterval(data.refreshInterval)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل الإعدادات'
      setError(errorMessage)
      console.error('Failed to load config:', err)
    }
  }, [])

  /**
   * إنشاء عتبة تنبيه جديدة
   */
  const createAlertThreshold = useCallback(
    async (_threshold: Omit<AlertThreshold, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setError(null)
        // TODO: Implement when backend supports creating alert thresholds
        throw new Error('Creating alert thresholds is not yet supported')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل في إنشاء عتبة التنبيه'
        setError(errorMessage)
        console.error('Failed to create alert threshold:', err)
        throw err
      }
    },
    []
  )

  /**
   * تحديث عتبة تنبيه
   */
  const updateAlertThreshold = useCallback(
    async (_id: string, _threshold: Partial<AlertThreshold>) => {
      try {
        setError(null)
        // TODO: Implement when backend supports updating alert thresholds
        throw new Error('Updating alert thresholds is not yet supported')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل في تحديث عتبة التنبيه'
        setError(errorMessage)
        console.error('Failed to update alert threshold:', err)
        throw err
      }
    },
    []
  )

  /**
   * حذف عتبة تنبيه
   */
  const deleteAlertThreshold = useCallback(async (_id: string) => {
    try {
      setError(null)
      // TODO: Implement when backend supports deleting alert thresholds
      throw new Error('Deleting alert thresholds is not yet supported')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في حذف عتبة التنبيه'
      setError(errorMessage)
      console.error('Failed to delete alert threshold:', err)
      throw err
    }
  }, [])

  /**
   * تحديث الإعدادات
   */
  const updateConfig = useCallback(async (newConfig: Partial<MonitoringDashboardConfig>) => {
    try {
      setError(null)
      const updated = await securityMonitoringService.updateMonitoringConfig(newConfig)
      setConfig(updated)
      if (updated.autoRefresh !== undefined) {
        setAutoRefresh(updated.autoRefresh)
      }
      if (updated.refreshInterval !== undefined) {
        setRefreshInterval(updated.refreshInterval)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحديث الإعدادات'
      setError(errorMessage)
      console.error('Failed to update config:', err)
      throw err
    }
  }, [])

  /**
   * تحديث جميع البيانات
   */
  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadSystemHealth(),
        loadRealTimeMetrics(),
        loadAlertThresholds(),
        loadConfig(),
      ])
    } finally {
      setLoading(false)
    }
  }, [loadSystemHealth, loadRealTimeMetrics, loadAlertThresholds, loadConfig])

  /**
   * إعداد Auto Refresh
   */
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        loadRealTimeMetrics()
        loadSystemHealth()
      }, refreshInterval * 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh, refreshInterval, loadRealTimeMetrics, loadSystemHealth])

  /**
   * تحميل البيانات عند التحميل الأول
   */
  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    systemHealth,
    realTimeMetrics,
    alertThresholds,
    config,
    loading,
    error,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    loadSystemHealth,
    loadRealTimeMetrics,
    loadAlertThresholds,
    loadConfig,
    createAlertThreshold,
    updateAlertThreshold,
    deleteAlertThreshold,
    updateConfig,
    refresh,
  }
}
