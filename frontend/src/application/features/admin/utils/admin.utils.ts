/**
 * Admin Utils - دوال مساعدة للإدارة
 *
 * @description دوال مساعدة خاصة بميزة الإدارة
 */

import type {
  UserStats,
  ContentStats,
  UsageStats,
  SystemHealthStatus,
  DatabaseStatus,
  ServerStatus,
} from '../types'
import { ADMIN_CONFIG } from '../constants'

/**
 * تنسيق اسم حالة صحة النظام
 */
export function formatSystemHealthStatus(status: SystemHealthStatus): string {
  const statusMap: Record<SystemHealthStatus, string> = {
    healthy: 'صحي',
    warning: 'تحذير',
    error: 'خطأ',
  }
  return statusMap[status] || status
}

/**
 * الحصول على لون حالة صحة النظام
 */
export function getSystemHealthStatusColor(status: SystemHealthStatus): string {
  const colorMap: Record<SystemHealthStatus, string> = {
    healthy: '#22c55e', // green
    warning: '#f59e0b', // yellow
    error: '#ef4444', // red
  }
  return colorMap[status] || '#6b7280'
}

/**
 * تنسيق اسم حالة قاعدة البيانات
 */
export function formatDatabaseStatus(status: DatabaseStatus): string {
  const statusMap: Record<DatabaseStatus, string> = {
    connected: 'متصل',
    disconnected: 'منقطع',
  }
  return statusMap[status] || status
}

/**
 * الحصول على لون حالة قاعدة البيانات
 */
export function getDatabaseStatusColor(status: DatabaseStatus): string {
  const colorMap: Record<DatabaseStatus, string> = {
    connected: '#22c55e', // green
    disconnected: '#ef4444', // red
  }
  return colorMap[status] || '#6b7280'
}

/**
 * تنسيق اسم حالة الخادم
 */
export function formatServerStatus(status: ServerStatus): string {
  const statusMap: Record<ServerStatus, string> = {
    active: 'نشط',
    inactive: 'غير نشط',
  }
  return statusMap[status] || status
}

/**
 * الحصول على لون حالة الخادم
 */
export function getServerStatusColor(status: ServerStatus): string {
  const colorMap: Record<ServerStatus, string> = {
    active: '#22c55e', // green
    inactive: '#ef4444', // red
  }
  return colorMap[status] || '#6b7280'
}

/**
 * تنسيق استخدام الذاكرة
 */
export function formatMemoryUsage(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * تنسيق استخدام CPU
 */
export function formatCPUUsage(percentage: number): string {
  return `${percentage.toFixed(1)}%`
}

/**
 * حساب نسبة المستخدمين النشطين
 */
export function calculateActiveUsersPercentage(stats: UserStats): number {
  if (stats.total === 0) return 0
  return Math.round((stats.active / stats.total) * 100)
}

/**
 * حساب نسبة المستخدمين الموثقين
 */
export function calculateVerifiedUsersPercentage(stats: UserStats): number {
  if (stats.total === 0) return 0
  return Math.round((stats.verified / stats.total) * 100)
}

/**
 * حساب نسبة الدروس المنشورة
 */
export function calculatePublishedLessonsPercentage(stats: ContentStats): number {
  if (stats.total_lessons === 0) return 0
  return Math.round((stats.published_lessons / stats.total_lessons) * 100)
}

/**
 * حساب نسبة المسارات المنشورة
 */
export function calculatePublishedPathsPercentage(stats: ContentStats): number {
  if (stats.total_learning_paths === 0) return 0
  return Math.round((stats.published_paths / stats.total_learning_paths) * 100)
}

/**
 * حساب نسبة الجلسات النشطة
 */
export function calculateActiveSessionsPercentage(stats: UsageStats): number {
  if (stats.total_sessions === 0) return 0
  return Math.round((stats.active_sessions / stats.total_sessions) * 100)
}

/**
 * تنسيق عدد الطلبات
 */
export function formatRequestCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

/**
 * تنسيق ساعة الذروة
 */
export function formatPeakUsageHour(hour: number | undefined): string {
  if (hour === undefined) return 'غير متوفر'
  return `${hour}:00`
}

/**
 * تنسيق تاريخ آخر تسجيل دخول
 */
export function formatLastLogin(date: string | undefined): string {
  if (!date) return 'لم يسجل دخول'
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'اليوم'
  if (days === 1) return 'أمس'
  if (days < 7) return `منذ ${days} أيام`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`
  }

  const months = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ]

  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * تنسيق رسالة الخطأ
 */
export function formatAdminError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return ADMIN_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * التحقق من صحة استعلام البحث
 */
export function validateSearchQuery(query: string): {
  valid: boolean
  error?: string
} {
  if (query.length < ADMIN_CONFIG.VALIDATION.QUERY_MIN_LENGTH) {
    return {
      valid: false,
      error: `استعلام البحث يجب أن يكون على الأقل ${ADMIN_CONFIG.VALIDATION.QUERY_MIN_LENGTH} حرف`,
    }
  }

  if (query.length > ADMIN_CONFIG.VALIDATION.QUERY_MAX_LENGTH) {
    return {
      valid: false,
      error: `استعلام البحث يجب أن يكون أقل من ${ADMIN_CONFIG.VALIDATION.QUERY_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}
