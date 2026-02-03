/**
 * Developer Utils - دوال مساعدة للمطور
 *
 * @description دوال مساعدة خاصة بميزة المطور
 */

import type { APIEndpointInfo, ServiceInfo, BuildStatus, ServiceStatus, LogLevel } from '../types'
import { DEVELOPER_CONFIG } from '../constants'

/**
 * تنسيق اسم حالة البناء
 */
export function formatBuildStatus(status: BuildStatus): string {
  const statusMap: Record<BuildStatus, string> = {
    success: 'نجح',
    failed: 'فشل',
    pending: 'قيد الانتظار',
  }
  return statusMap[status] || status
}

/**
 * الحصول على لون حالة البناء
 */
export function getBuildStatusColor(status: BuildStatus): string {
  const colorMap: Record<BuildStatus, string> = {
    success: '#22c55e', // green
    failed: '#ef4444', // red
    pending: '#f59e0b', // yellow
  }
  return colorMap[status] || '#6b7280'
}

/**
 * تنسيق اسم حالة الخدمة
 */
export function formatServiceStatus(status: ServiceStatus): string {
  const statusMap: Record<ServiceStatus, string> = {
    healthy: 'صحي',
    unhealthy: 'غير صحي',
    unknown: 'غير معروف',
  }
  return statusMap[status] || status
}

/**
 * الحصول على لون حالة الخدمة
 */
export function getServiceStatusColor(status: ServiceStatus): string {
  const colorMap: Record<ServiceStatus, string> = {
    healthy: '#22c55e', // green
    unhealthy: '#ef4444', // red
    unknown: '#6b7280', // gray
  }
  return colorMap[status] || '#6b7280'
}

/**
 * تنسيق اسم مستوى السجل
 */
export function formatLogLevel(level: LogLevel): string {
  const levelMap: Record<LogLevel, string> = {
    info: 'معلومات',
    warn: 'تحذير',
    error: 'خطأ',
    debug: 'تصحيح',
  }
  return levelMap[level] || level
}

/**
 * الحصول على لون مستوى السجل
 */
export function getLogLevelColor(level: LogLevel): string {
  const colorMap: Record<LogLevel, string> = {
    info: '#3b82f6', // blue
    warn: '#f59e0b', // yellow
    error: '#ef4444', // red
    debug: '#6b7280', // gray
  }
  return colorMap[level] || '#6b7280'
}

/**
 * تنسيق وقت الاستجابة
 */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * تنسيق وقت التشغيل
 */
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) {
    return `${days} ${days === 1 ? 'يوم' : 'أيام'} ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
  }
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'ساعة' : 'ساعات'} ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
  }
  return `${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
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
 * تنسيق نسبة الخطأ
 */
export function formatErrorRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`
}

/**
 * تنسيق نسبة تغطية الاختبارات
 */
export function formatTestCoverage(coverage: number): string {
  return `${coverage.toFixed(1)}%`
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
 * تنسيق تاريخ آخر بناء
 */
export function formatLastBuildTime(date: string | undefined): string {
  if (!date) return 'غير متوفر'
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / (1000 * 60))

  if (minutes < 1) return 'الآن'
  if (minutes < 60) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
  const days = Math.floor(hours / 24)
  return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`
}

/**
 * تنسيق تاريخ آخر استدعاء
 */
export function formatLastCalled(date: string | undefined): string {
  if (!date) return 'لم يتم الاستدعاء'
  return formatLastBuildTime(date)
}

/**
 * ترتيب نقاط API حسب عدد الطلبات
 */
export function sortEndpointsByRequestCount(endpoints: APIEndpointInfo[]): APIEndpointInfo[] {
  return [...endpoints].sort((a, b) => b.request_count - a.request_count)
}

/**
 * ترتيب نقاط API حسب وقت الاستجابة
 */
export function sortEndpointsByResponseTime(endpoints: APIEndpointInfo[]): APIEndpointInfo[] {
  return [...endpoints].sort((a, b) => b.average_response_time - a.average_response_time)
}

/**
 * ترتيب الخدمات حسب الحالة
 */
export function sortServicesByStatus(services: ServiceInfo[]): ServiceInfo[] {
  const statusOrder: Record<ServiceStatus, number> = {
    healthy: 1,
    unknown: 2,
    unhealthy: 3,
  }
  return [...services].sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
}

/**
 * تصفية الخدمات حسب الحالة
 */
export function filterServicesByStatus(
  services: ServiceInfo[],
  status: ServiceStatus
): ServiceInfo[] {
  return services.filter(s => s.status === status)
}

/**
 * تنسيق رسالة الخطأ
 */
export function formatDeveloperError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return DEVELOPER_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR
}
