/**
 * Security Analytics Types - أنواع تحليلات الأمان
 *
 * مخصص للمطورين والإدارة لتحليل الأمان
 */

/**
 * Security Analytics Period - فترة التحليل
 */
export type AnalyticsPeriod =
  | '1h' // آخر ساعة
  | '24h' // آخر 24 ساعة
  | '7d' // آخر 7 أيام
  | '30d' // آخر 30 يوم
  | '90d' // آخر 90 يوم
  | 'custom' // مخصص

/**
 * Login Activity Data - بيانات نشاط تسجيل الدخول
 */
export interface LoginActivityData {
  time: string
  successful: number
  failed: number
  total: number
}

/**
 * Security Events Timeline - خط زمني للأحداث الأمنية
 */
export interface SecurityEventsTimeline {
  date: string
  events: number
  critical: number
  warnings: number
  errors: number
  info: number
}

/**
 * Sessions Distribution - توزيع الجلسات
 */
export interface SessionsDistribution {
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  count: number
  percentage: number
}

/**
 * Geographic Distribution - التوزيع الجغرافي
 */
export interface GeographicDistribution {
  country: string
  city?: string
  sessions: number
  failedLogins: number
  suspiciousActivity: number
}

/**
 * IP Activity Analysis - تحليل نشاط IP
 */
export interface IPActivityAnalysis {
  ipAddress: string
  country?: string
  city?: string
  totalRequests: number
  failedLogins: number
  successfulLogins: number
  suspiciousActivity: number
  riskLevel: 'low' | 'medium' | 'high'
  isBlocked: boolean
  firstSeen: string
  lastSeen: string
}

/**
 * User Activity Analysis - تحليل نشاط المستخدم
 */
export interface UserActivityAnalysis {
  userId: string
  userEmail: string
  userName: string
  userRole: string
  totalSessions: number
  activeSessions: number
  failedLogins: number
  successfulLogins: number
  lastLogin: string
  lastActivity: string
  riskLevel: 'low' | 'medium' | 'high'
  isLocked: boolean
  isSuspended: boolean
}

/**
 * Security Metrics - مقاييس الأمان
 */
export interface SecurityMetrics {
  period: AnalyticsPeriod
  startDate: string
  endDate: string

  // Authentication Metrics
  totalLogins: number
  successfulLogins: number
  failedLogins: number
  loginSuccessRate: number // percentage

  // Session Metrics
  totalSessions: number
  activeSessions: number
  averageSessionDuration: number // in minutes
  longestSessionDuration: number // in minutes

  // Security Events Metrics
  totalEvents: number
  criticalEvents: number
  warningEvents: number
  errorEvents: number
  infoEvents: number

  // Rate Limiting Metrics
  rateLimitHits: number
  rateLimitBlocks: number

  // IP Metrics
  uniqueIPs: number
  blockedIPs: number
  suspiciousIPs: number

  // User Metrics
  uniqueUsers: number
  lockedAccounts: number
  suspendedAccounts: number

  // 2FA Metrics
  usersWith2FA: number
  twoFAPercentage: number
}

/**
 * Security Analytics Report - تقرير تحليلات الأمان
 */
export interface SecurityAnalyticsReport {
  metrics: SecurityMetrics
  loginActivity: LoginActivityData[]
  eventsTimeline: SecurityEventsTimeline[]
  sessionsDistribution: SessionsDistribution[]
  geographicDistribution: GeographicDistribution[]
  topIPs: IPActivityAnalysis[]
  topUsers: UserActivityAnalysis[]
  generatedAt: string
  generatedBy?: string
}
