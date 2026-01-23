/**
 * Audit Service - خدمة Audit Logs
 *
 * Application Service للـ Audit Logs & Analytics
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type {
  AuditStatistics,
  AuditTrend,
  AuditAlert,
  AuditReport,
  TimeWindow,
  Period,
  ApiResponse,
} from '../types'

class AuditService {
  /**
   * الحصول على Audit Statistics
   */
  async getStatistics(timeWindow: TimeWindow = '24h'): Promise<AuditStatistics> {
    const response = await apiClient.get<ApiResponse<{ statistics: AuditStatistics }>>(
      DATABASE_CORE_ENDPOINTS.AUDIT.ANALYTICS.STATISTICS,
      { params: { timeWindow } }
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get audit statistics')
    }

    return (response.data as { statistics: AuditStatistics }).statistics
  }

  /**
   * الحصول على Audit Trends
   */
  async getTrends(period: Period = 'daily'): Promise<AuditTrend[]> {
    const response = await apiClient.get<ApiResponse<{ trends: AuditTrend[] }>>(
      DATABASE_CORE_ENDPOINTS.AUDIT.ANALYTICS.TRENDS,
      { params: { period } }
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get audit trends')
    }

    return (response.data as { trends: AuditTrend[] }).trends
  }

  /**
   * الحصول على Audit Alerts
   */
  async getAlerts(timeWindow: TimeWindow = '24h'): Promise<AuditAlert[]> {
    const response = await apiClient.get<ApiResponse<{ alerts: AuditAlert[] }>>(
      DATABASE_CORE_ENDPOINTS.AUDIT.ANALYTICS.ALERTS,
      { params: { timeWindow } }
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get audit alerts')
    }

    return (response.data as { alerts: AuditAlert[] }).alerts
  }

  /**
   * إنشاء Audit Report
   */
  async generateReport(startDate: Date, endDate: Date): Promise<AuditReport> {
    const response = await apiClient.post<ApiResponse<AuditReport>>(
      DATABASE_CORE_ENDPOINTS.AUDIT.ANALYTICS.REPORT,
      { startDate, endDate }
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to generate audit report')
    }

    return response.data
  }
}

export const auditService = new AuditService()
