/**
 * Security Monitoring Service - خدمة مراقبة الأمان
 *
 * مخصص للمطورين لمراقبة النظام في الوقت الفعلي
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { API_ENDPOINTS } from '@/domain/constants/api.constants'
import type {
  SystemHealthStatus,
  RealTimeSecurityMetrics,
  AlertThreshold,
  MonitoringDashboardConfig,
} from '../types/monitoring.types'

class SecurityMonitoringService {
  /**
   * الحصول على حالة صحة النظام
   */
  async getSystemHealth(): Promise<SystemHealthStatus> {
    const response = await apiClient.get<{ success: boolean; data: SystemHealthStatus }>(
      API_ENDPOINTS.SECURITY.MONITORING_HEALTH
    )
    return response.data
  }

  /**
   * الحصول على مقاييس الأمان في الوقت الفعلي
   */
  async getRealTimeMetrics(): Promise<RealTimeSecurityMetrics> {
    const response = await apiClient.get<{ success: boolean; data: RealTimeSecurityMetrics }>(
      API_ENDPOINTS.SECURITY.MONITORING_REALTIME
    )
    return response.data
  }

  /**
   * الحصول على عتبات التنبيه
   */
  async getAlertThresholds(): Promise<AlertThreshold[]> {
    const response = await apiClient.get<{ success: boolean; data: AlertThreshold[] }>(
      API_ENDPOINTS.SECURITY.MONITORING_ALERT_THRESHOLDS
    )
    return response.data || []
  }

  /**
   * الحصول على إعدادات لوحة المراقبة
   */
  async getMonitoringConfig(): Promise<MonitoringDashboardConfig> {
    // TODO: إضافة endpoint للحصول على config
    // حالياً نرجع config افتراضي
    return {
      refreshInterval: 30,
      metricsToShow: ['activeSessions', 'loginsLastMinute', 'eventsLastMinute'],
      chartsToShow: ['loginAttempts', 'eventsTimeline', 'sessionsDistribution'],
      alertsToShow: ['critical', 'error'],
      autoRefresh: true,
      darkMode: false,
    }
  }

  /**
   * تحديث إعدادات لوحة المراقبة
   */
  async updateMonitoringConfig(
    config: Partial<MonitoringDashboardConfig>
  ): Promise<MonitoringDashboardConfig> {
    const response = await apiClient.put<{ success: boolean; data: MonitoringDashboardConfig }>(
      API_ENDPOINTS.SECURITY.MONITORING_CONFIG,
      config
    )
    return response.data
  }

  /**
   * الاشتراك في التحديثات في الوقت الفعلي (WebSocket)
   */
  subscribeToRealTimeUpdates(_callback: (metrics: RealTimeSecurityMetrics) => void): () => void {
    // TODO: تنفيذ WebSocket connection
    // سيتم تنفيذها لاحقاً
    return () => {
      // Cleanup function
    }
  }
}

export const securityMonitoringService = new SecurityMonitoringService()
