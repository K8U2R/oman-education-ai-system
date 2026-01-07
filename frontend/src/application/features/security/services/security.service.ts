/**
 * Security Service - خدمة الأمان
 *
 * خدمة لإدارة جميع جوانب الأمان والمصادقة
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/api'
import { API_ENDPOINTS } from '@/domain/constants/api.constants'
import type {
  SecurityStats,
  SecurityEvent,
  SecurityLogFilter,
  SecuritySettings,
  RouteProtectionRule,
  SecurityAlert,
} from '../types/security.types'

class SecurityService {
  /**
   * الحصول على إحصائيات الأمان
   */
  async getSecurityStats(): Promise<SecurityStats> {
    const response = await apiClient.get<{ success: boolean; data: SecurityStats }>(
      API_ENDPOINTS.SECURITY.STATS
    )
    return response.data
  }

  /**
   * الحصول على سجلات الأمان
   */
  async getSecurityLogs(params?: SecurityLogFilter): Promise<{
    logs: SecurityEvent[]
    total: number
    page: number
    per_page: number
  }> {
    const response = await apiClient.get<{
      success: boolean
      data: SecurityEvent[]
      pagination: {
        page: number
        limit: number
        total: number
      }
    }>(API_ENDPOINTS.SECURITY.LOGS, { params })

    return {
      logs: response.data || [],
      total: response.pagination?.total || response.data?.length || 0,
      page: response.pagination?.page || 1,
      per_page: response.pagination?.limit || 50,
    }
  }

  /**
   * تصدير سجلات الأمان
   */
  async exportSecurityLogs(params?: SecurityLogFilter): Promise<Blob> {
    const response = await apiClient.get<Blob>(API_ENDPOINTS.SECURITY.EXPORT_LOGS, {
      params,
      responseType: 'blob',
    })
    return response as Blob
  }

  /**
   * الحصول على إعدادات الأمان
   */
  async getSecuritySettings(): Promise<SecuritySettings> {
    const response = await apiClient.get<{ success: boolean; data: SecuritySettings }>(
      API_ENDPOINTS.SECURITY.SETTINGS
    )
    return response.data
  }

  /**
   * تحديث إعدادات الأمان
   */
  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    const response = await apiClient.put<{ success: boolean; data: SecuritySettings }>(
      API_ENDPOINTS.SECURITY.SETTINGS,
      settings
    )
    return response.data
  }

  /**
   * الحصول على قواعد حماية المسارات
   */
  async getRouteProtectionRules(): Promise<RouteProtectionRule[]> {
    const response = await apiClient.get<{ success: boolean; data: RouteProtectionRule[] }>(
      API_ENDPOINTS.SECURITY.ROUTES
    )
    return response.data || []
  }

  /**
   * إنشاء قاعدة حماية مسار
   */
  async createRouteProtectionRule(
    rule: Omit<RouteProtectionRule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RouteProtectionRule> {
    const response = await apiClient.post<{ success: boolean; data: RouteProtectionRule }>(
      API_ENDPOINTS.SECURITY.ROUTES,
      rule
    )
    return response.data
  }

  /**
   * تحديث قاعدة حماية مسار
   */
  async updateRouteProtectionRule(
    id: string,
    rule: Partial<RouteProtectionRule>
  ): Promise<RouteProtectionRule> {
    const response = await apiClient.put<{ success: boolean; data: RouteProtectionRule }>(
      API_ENDPOINTS.SECURITY.ROUTE(id),
      rule
    )
    return response.data
  }

  /**
   * حذف قاعدة حماية مسار
   */
  async deleteRouteProtectionRule(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SECURITY.ROUTE(id))
  }

  /**
   * الحصول على تنبيهات الأمان
   */
  async getSecurityAlerts(params?: {
    page?: number
    limit?: number
    isRead?: boolean
    userId?: string
    alertType?: string
    severity?: string
    actionRequired?: boolean
  }): Promise<{
    alerts: SecurityAlert[]
    total: number
  }> {
    const response = await apiClient.get<{
      success: boolean
      data: SecurityAlert[]
      pagination: {
        page: number
        limit: number
        total: number
      }
    }>(API_ENDPOINTS.SECURITY.ALERTS, { params })

    return {
      alerts: response.data || [],
      total: response.pagination?.total || response.data?.length || 0,
    }
  }

  /**
   * تحديد تنبيه كمقروء
   */
  async markAlertAsRead(alertId: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.SECURITY.ALERT_READ(alertId))
  }

  /**
   * تحديد جميع التنبيهات كمقروءة
   */
  async markAllAlertsAsRead(userId?: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.SECURITY.ALERTS_READ_ALL, {
      params: userId ? { userId } : undefined,
    })
  }
}

export const securityService = new SecurityService()
