/**
 * Security Utils - دوال مساعدة للأمان
 *
 * @description دوال مساعدة خاصة بميزة الأمان
 */

import type { SecurityEvent, SecurityEventSeverity } from '../types/security.types'
import type { Session } from '../types/session.types'
import {
  SECURITY_CONFIG,
  SECURITY_EVENT_SEVERITY,
  SYSTEM_HEALTH_STATUS,
  type SystemHealthStatusValue,
} from '../constants/security.constants'

/**
 * التحقق من صحة عنوان IP
 */
export function isValidIPAddress(ip: string): boolean {
  return SECURITY_CONFIG.VALIDATION.IP_ADDRESS_REGEX.test(ip)
}

/**
 * التحقق من صحة معرف الجلسة
 */
export function isValidSessionId(sessionId: string): boolean {
  const length = sessionId.length
  return (
    length >= SECURITY_CONFIG.VALIDATION.SESSION_ID_MIN_LENGTH &&
    length <= SECURITY_CONFIG.VALIDATION.SESSION_ID_MAX_LENGTH
  )
}

/**
 * التحقق من انتهاء صلاحية الجلسة
 */
export function isSessionExpired(session: Session): boolean {
  if (!session.expiresAt) return false
  return new Date(session.expiresAt) < new Date()
}

/**
 * حساب الوقت المتبقي للجلسة
 */
export function calculateSessionTimeRemaining(session: Session): number {
  if (!session.expiresAt) return 0
  const expiresAt = new Date(session.expiresAt)
  const now = new Date()
  const remaining = expiresAt.getTime() - now.getTime()
  return Math.max(0, Math.floor(remaining / 1000)) // بالثواني
}

/**
 * التحقق من أن الجلسة نشطة
 */
export function isSessionActive(session: Session): boolean {
  return session.isActive && !isSessionExpired(session)
}

/**
 * تنسيق وقت الجلسة
 */
export function formatSessionTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`
  }

  if (hours > 0) {
    return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
  }

  if (minutes > 0) {
    return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
  }

  return 'الآن'
}

/**
 * تنسيق اسم نوع الحدث الأمني
 */
export function formatSecurityEventType(type: string): string {
  const typeMap: Record<string, string> = {
    login_success: 'تسجيل دخول ناجح',
    login_failed: 'فشل تسجيل الدخول',
    logout: 'تسجيل خروج',
    password_change: 'تغيير كلمة المرور',
    password_reset_requested: 'طلب إعادة تعيين كلمة المرور',
    password_reset_completed: 'إعادة تعيين كلمة المرور مكتملة',
    email_verification_sent: 'إرسال بريد التحقق',
    email_verification_completed: 'التحقق من البريد مكتمل',
    email_verification_failed: 'فشل التحقق من البريد',
    session_created: 'إنشاء جلسة',
    session_terminated: 'إنهاء جلسة',
    session_expired: 'انتهاء صلاحية الجلسة',
    session_refreshed: 'تحديث جلسة',
    session_frozen: 'تجميد جلسة',
    session_unfrozen: 'إلغاء تجميد جلسة',
    oauth_login_success: 'تسجيل دخول OAuth ناجح',
    oauth_login_failed: 'فشل تسجيل دخول OAuth',
    oauth_token_refreshed: 'تحديث رمز OAuth',
    suspicious_activity: 'نشاط مشبوه',
    brute_force_attempt: 'محاولة هجوم brute force',
    unauthorized_access: 'وصول غير مصرح',
    rate_limit_exceeded: 'تجاوز حد المعدل',
    ip_blocked: 'حظر IP',
    account_locked: 'قفل الحساب',
    account_unlocked: 'إلغاء قفل الحساب',
  }
  return typeMap[type] || type
}

/**
 * تنسيق اسم مستوى الخطورة
 */
export function formatSecurityEventSeverity(severity: SecurityEventSeverity): string {
  const severityMap: Record<SecurityEventSeverity, string> = {
    info: 'معلومات',
    warning: 'تحذير',
    error: 'خطأ',
    critical: 'حرج',
  }
  return severityMap[severity] || severity
}

/**
 * الحصول على لون مستوى الخطورة
 */
export function getSeverityColor(severity: SecurityEventSeverity): string {
  const colorMap: Record<SecurityEventSeverity, string> = {
    info: '#3b82f6', // blue
    warning: '#f59e0b', // yellow
    error: '#ef4444', // red
    critical: '#dc2626', // dark red
  }
  return colorMap[severity] || '#6b7280'
}

/**
 * تنسيق اسم حالة صحة النظام
 */
export function formatSystemHealthStatus(status: SystemHealthStatusValue): string {
  const statusMap: Record<SystemHealthStatusValue, string> = {
    healthy: 'صحي',
    warning: 'تحذير',
    error: 'خطأ',
  }
  return statusMap[status] || status
}

/**
 * الحصول على لون حالة صحة النظام
 */
export function getSystemHealthColor(status: SystemHealthStatusValue): string {
  const colorMap: Record<SystemHealthStatusValue, string> = {
    healthy: '#22c55e', // green
    warning: '#f59e0b', // yellow
    error: '#ef4444', // red
  }
  return colorMap[status] || '#6b7280'
}

/**
 * حساب درجة صحة النظام
 */
export function calculateSystemHealthScore(stats: {
  failedLoginAttempts24h: number
  securityAlerts: number
  criticalAlerts: number
  blockedIPs: number
}): number {
  let score = 100

  // خصم نقاط لكل محاولة فاشلة
  score -= Math.min(20, stats.failedLoginAttempts24h * 2)

  // خصم نقاط لكل تنبيه
  score -= Math.min(30, stats.securityAlerts * 5)

  // خصم نقاط لكل تنبيه حرج
  score -= Math.min(40, stats.criticalAlerts * 10)

  // خصم نقاط لكل IP محظور
  score -= Math.min(10, stats.blockedIPs * 2)

  return Math.max(0, Math.min(100, score))
}

/**
 * تحديد حالة صحة النظام بناءً على الدرجة
 */
export function determineSystemHealthStatus(score: number): SystemHealthStatusValue {
  if (score >= 80) return SYSTEM_HEALTH_STATUS.HEALTHY
  if (score >= 50) return SYSTEM_HEALTH_STATUS.WARNING
  return SYSTEM_HEALTH_STATUS.ERROR
}

/**
 * تنسيق عنوان IP
 */
export function formatIPAddress(ip: string): string {
  return ip
}

/**
 * تنسيق User Agent
 */
export function formatUserAgent(userAgent: string): string {
  // استخراج اسم المتصفح ونظام التشغيل
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'متصفح آخر'
}

/**
 * تنسيق اسم الجهاز
 */
export function formatDeviceName(device: string | undefined): string {
  if (!device) return 'جهاز غير معروف'

  const deviceMap: Record<string, string> = {
    desktop: 'سطح المكتب',
    mobile: 'جوال',
    tablet: 'جهاز لوحي',
    unknown: 'جهاز غير معروف',
  }

  return deviceMap[device.toLowerCase()] || device
}

/**
 * تنسيق الموقع الجغرافي
 */
export function formatLocation(location: {
  country?: string
  city?: string
  region?: string
}): string {
  const parts: string[] = []

  if (location.city) parts.push(location.city)
  if (location.region) parts.push(location.region)
  if (location.country) parts.push(location.country)

  return parts.length > 0 ? parts.join(', ') : 'موقع غير معروف'
}

/**
 * التحقق من أن الحدث حرج
 */
export function isCriticalEvent(event: SecurityEvent): boolean {
  return event.severity === SECURITY_EVENT_SEVERITY.CRITICAL
}

/**
 * التحقق من أن الحدث تم حله
 */
export function isEventResolved(event: SecurityEvent): boolean {
  return event.resolved === true
}

/**
 * تنسيق رسالة الخطأ
 */
export function formatSecurityError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return SECURITY_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * حساب النسبة المئوية للتغيير
 */
export function calculateChangePercentage(current: number, previous: number): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 100)
}

/**
 * تنسيق النسبة المئوية للتغيير
 */
export function formatChangePercentage(change: number | null | undefined): string {
  if (change === null || change === undefined) return '—'

  const sign = change > 0 ? '+' : ''
  return `${sign}${change}%`
}

/**
 * الحصول على اتجاه التغيير
 */
export function getChangeDirection(change: number | null | undefined): 'up' | 'down' | 'neutral' {
  if (change === null || change === undefined) return 'neutral'
  if (change > 0) return 'up'
  if (change < 0) return 'down'
  return 'neutral'
}
