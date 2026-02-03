/**
 * Security Analytics Service - خدمة تحليلات الأمان
 *
 * مخصص للمطورين والإدارة لتحليل الأمان
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { API_ENDPOINTS } from '@/domain/constants/api.constants'
import type {
  SecurityAnalyticsReport,
  SecurityMetrics,
  AnalyticsPeriod,
  LoginActivityData,
  SecurityEventsTimeline,
  SessionsDistribution,
  GeographicDistribution,
  IPActivityAnalysis,
  UserActivityAnalysis,
} from '../types/analytics.types'

class SecurityAnalyticsService {
  /**
   * الحصول على تقرير تحليلات الأمان
   */
  async getAnalyticsReport(params: {
    period: AnalyticsPeriod
    startDate?: string
    endDate?: string
    userId?: string
  }): Promise<SecurityAnalyticsReport> {
    const response = await apiClient.get<{ success: boolean; data: SecurityAnalyticsReport }>(
      API_ENDPOINTS.SECURITY.ANALYTICS_REPORT,
      params ? { params } : undefined
    )
    return response.data
  }

  /**
   * الحصول على مقاييس الأمان
   */
  async getSecurityMetrics(params: {
    period: AnalyticsPeriod
    startDate?: string
    endDate?: string
  }): Promise<SecurityMetrics> {
    const response = await apiClient.get<{ success: boolean; data: SecurityMetrics }>(
      API_ENDPOINTS.SECURITY.ANALYTICS_METRICS,
      { params }
    )
    return response.data
  }

  /**
   * الحصول على محاولات تسجيل الدخول عبر الوقت
   */
  async getLoginAttemptsOverTime(params: {
    period?: AnalyticsPeriod
    startDate?: string
    endDate?: string
  }): Promise<LoginActivityData[]> {
    interface LoginAttemptsResponse {
      dates: string[]
      successCounts: number[]
      failedCounts: number[]
    }
    const response = await apiClient.get<{ success: boolean; data: LoginAttemptsResponse }>(
      API_ENDPOINTS.SECURITY.ANALYTICS_LOGIN_ATTEMPTS,
      params ? { params } : undefined
    )
    // Transform to LoginActivityData format
    const data = response.data
    if (data.dates && Array.isArray(data.dates)) {
      return data.dates.map((date: string, index: number) => ({
        time: date,
        successful: data.successCounts[index] || 0,
        failed: data.failedCounts[index] || 0,
        total: (data.successCounts[index] || 0) + (data.failedCounts[index] || 0),
      }))
    }
    return []
  }

  /**
   * الحصول على اتجاه نشاط المستخدم
   */
  async getUserActivityTrend(params: {
    period?: AnalyticsPeriod
    startDate?: string
    endDate?: string
  }): Promise<UserActivityAnalysis[]> {
    interface UserActivityResponse {
      topUsers: Array<{
        userId: string
        [key: string]: unknown
      }>
    }
    const response = await apiClient.get<{ success: boolean; data: UserActivityResponse }>(
      API_ENDPOINTS.SECURITY.ANALYTICS_USER_ACTIVITY,
      params ? { params } : undefined
    )
    // Transform to UserActivityAnalysis format
    const data = response.data
    if (data.topUsers && Array.isArray(data.topUsers)) {
      return data.topUsers.map(user => ({
        userId: user.userId,
        userEmail: '', // TODO: Fetch from user service
        userName: '', // TODO: Fetch from user service
        userRole: '', // TODO: Fetch from user service
        totalSessions: 0,
        activeSessions: 0,
        failedLogins: 0,
        successfulLogins: 0,
        lastLogin: '',
        lastActivity: '',
        riskLevel: 'low' as const,
        isLocked: false,
        isSuspended: false,
      }))
    }
    return []
  }

  /**
   * الحصول على التوزيع الجغرافي
   */
  async getGeographicDistribution(params?: {
    period?: AnalyticsPeriod
    startDate?: string
    endDate?: string
  }): Promise<GeographicDistribution[]> {
    interface GeographicResponse {
      countries: Array<{
        country: string
        loginCount: number
      }>
    }
    const response = await apiClient.get<{ success: boolean; data: GeographicResponse }>(
      API_ENDPOINTS.SECURITY.ANALYTICS_GEOGRAPHIC,
      params ? { params } : undefined
    )
    // Transform to GeographicDistribution format
    const data = response.data
    if (data.countries && Array.isArray(data.countries)) {
      return data.countries.map(country => ({
        country: country.country,
        sessions: country.loginCount,
        failedLogins: 0,
        suspiciousActivity: 0,
      }))
    }
    return []
  }

  /**
   * الحصول على أعلى محاولات تسجيل دخول فاشلة
   */
  async getTopFailedLogins(params?: {
    period?: AnalyticsPeriod
    startDate?: string
    endDate?: string
  }): Promise<IPActivityAnalysis[]> {
    interface TopFailedLoginsResponse {
      topIPs: Array<{
        ip: string
        failedAttempts: number
      }>
    }
    const response = await apiClient.get<{ success: boolean; data: TopFailedLoginsResponse }>(
      API_ENDPOINTS.SECURITY.ANALYTICS_TOP_FAILED_LOGINS,
      params ? { params } : undefined
    )
    // Transform to IPActivityAnalysis format
    const data = response.data
    if (data.topIPs && Array.isArray(data.topIPs)) {
      return data.topIPs.map(ip => ({
        ipAddress: ip.ip,
        totalRequests: ip.failedAttempts,
        failedLogins: ip.failedAttempts,
        successfulLogins: 0,
        suspiciousActivity: 0,
        riskLevel: ip.failedAttempts > 50 ? 'high' : ip.failedAttempts > 20 ? 'medium' : 'low',
        isBlocked: false,
        firstSeen: '',
        lastSeen: '',
      }))
    }
    return []
  }

  /**
   * الحصول على توزيع الجلسات
   */
  async getSessionsDistribution(params?: {
    period?: AnalyticsPeriod
    startDate?: string
    endDate?: string
  }): Promise<SessionsDistribution[]> {
    interface SessionDistributionResponse {
      byDeviceType: Record<string, number>
      totalSessions?: number
    }
    const response = await apiClient.get<{ success: boolean; data: SessionDistributionResponse }>(
      API_ENDPOINTS.SECURITY.ANALYTICS_SESSION_DISTRIBUTION,
      params ? { params } : undefined
    )
    // Transform to SessionsDistribution format
    const data = response.data
    if (data.byDeviceType) {
      const total = data.totalSessions || 0
      return Object.entries(data.byDeviceType).map(([deviceType, count]) => ({
        deviceType: deviceType as 'desktop' | 'mobile' | 'tablet' | 'unknown',
        count: count as number,
        percentage: total > 0 ? ((count as number) / total) * 100 : 0,
      }))
    }
    return []
  }

  /**
   * الحصول على درجات مخاطر المستخدمين
   */
  async getUserRiskScores(params?: {
    period?: AnalyticsPeriod
    startDate?: string
    endDate?: string
  }): Promise<UserActivityAnalysis[]> {
    interface UserRiskScore {
      userId: string
      riskScore: number
    }
    const response = await apiClient.get<{ success: boolean; data: UserRiskScore[] }>(
      API_ENDPOINTS.SECURITY.ANALYTICS_USER_RISK_SCORES,
      { params }
    )
    // Transform to UserActivityAnalysis format
    const data = response.data
    if (Array.isArray(data)) {
      return data.map((risk: UserRiskScore) => ({
        userId: risk.userId,
        userEmail: '', // TODO: Fetch from user service
        userName: '', // TODO: Fetch from user service
        userRole: '', // TODO: Fetch from user service
        totalSessions: 0,
        activeSessions: 0,
        failedLogins: 0,
        successfulLogins: 0,
        lastLogin: '',
        lastActivity: '',
        riskLevel: risk.riskScore > 50 ? 'high' : risk.riskScore > 20 ? 'medium' : 'low',
        isLocked: false,
        isSuspended: false,
      }))
    }
    return []
  }

  /**
   * الحصول على ملخص الأحداث الأمنية
   */
  async getSecurityEventSummary(params?: {
    period?: AnalyticsPeriod
    startDate?: string
    endDate?: string
  }): Promise<SecurityEventsTimeline[]> {
    interface SecurityEventSummaryResponse {
      byType: Record<string, number>
      bySeverity?: Record<string, number>
      totalEvents?: number
    }
    const response = await apiClient.get<{ success: boolean; data: SecurityEventSummaryResponse }>(
      API_ENDPOINTS.SECURITY.ANALYTICS_EVENT_SUMMARY,
      params ? { params } : undefined
    )
    // Transform to SecurityEventsTimeline format
    const data = response.data
    if (data.byType) {
      const dateStr = new Date().toISOString().split('T')[0]
      if (!dateStr) {
        return []
      }
      const date: string = dateStr
      return Object.entries(data.byType).map(([, count]) => ({
        date,
        events: count as number,
        critical: data.bySeverity?.critical || 0,
        warnings: data.bySeverity?.warning || 0,
        errors: data.bySeverity?.error || 0,
        info: data.bySeverity?.info || 0,
      }))
    }
    return []
  }
}

export const securityAnalyticsService = new SecurityAnalyticsService()
