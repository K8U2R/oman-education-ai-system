/**
 * Formatters Utility - دوال تنسيق البيانات
 *
 * دوال مساعدة لتنسيق البيانات في لوحة تحكم database-core
 */

/**
 * تنسيق الوقت (Uptime)
 */
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (days > 0) {
    return `${days} يوم ${hours} ساعة ${minutes} دقيقة`
  }
  if (hours > 0) {
    return `${hours} ساعة ${minutes} دقيقة ${secs} ثانية`
  }
  if (minutes > 0) {
    return `${minutes} دقيقة ${secs} ثانية`
  }
  return `${secs} ثانية`
}

/**
 * تنسيق حجم البيانات (Bytes)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * تنسيق الوقت (Duration)
 */
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`
  }
  if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(2)}s`
  }
  if (milliseconds < 3600000) {
    return `${Math.floor(milliseconds / 60000)}m ${Math.floor((milliseconds % 60000) / 1000)}s`
  }
  return `${Math.floor(milliseconds / 3600000)}h ${Math.floor((milliseconds % 3600000) / 60000)}m`
}

/**
 * تنسيق النسبة المئوية
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * تنسيق الرقم مع فواصل
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * تنسيق التاريخ والوقت
 */
export function formatDateTime(date: string | Date, includeTime = true): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  }
  return new Intl.DateTimeFormat('ar-SA', options).format(d)
}

/**
 * تنسيق التاريخ فقط
 */
export function formatDate(date: string | Date): string {
  return formatDateTime(date, false)
}

/**
 * تنسيق الوقت فقط
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d)
}

/**
 * تنسيق Query للعرض
 */
export function formatQuery(query: string, maxLength = 100): string {
  if (query.length <= maxLength) {
    return query
  }
  return `${query.substring(0, maxLength)}...`
}

/**
 * تنسيق Status Badge
 */
export function formatStatus(status: string): {
  label: string
  color: 'success' | 'warning' | 'danger' | 'info'
} {
  const statusMap: Record<
    string,
    { label: string; color: 'success' | 'warning' | 'danger' | 'info' }
  > = {
    healthy: { label: 'صحي', color: 'success' },
    degraded: { label: 'متراجع', color: 'warning' },
    error: { label: 'خطأ', color: 'danger' },
    disconnected: { label: 'غير متصل', color: 'danger' },
    connected: { label: 'متصل', color: 'success' },
    ok: { label: 'جيد', color: 'success' },
  }

  return statusMap[status.toLowerCase()] || { label: status, color: 'info' }
}
