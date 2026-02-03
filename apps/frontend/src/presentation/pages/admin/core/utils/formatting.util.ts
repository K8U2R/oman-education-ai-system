/**
 * Formatting Utility - أدوات التنسيق
 *
 * دوال مساعدة لتنسيق التواريخ والأرقام
 */

/**
 * تنسيق التاريخ
 */
export function formatAdminDate(
  date: string | Date,
  format: 'short' | 'long' | 'datetime' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return 'تاريخ غير صحيح'
  }

  // الجزء المصحح: تعريف الكائن options
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Muscat', // Oman timezone
  }

  switch (format) {
    case 'short':
      options.year = 'numeric'
      options.month = '2-digit'
      options.day = '2-digit'
      break
    case 'long':
      options.year = 'numeric'
      options.month = 'long'
      options.day = 'numeric'
      break
    case 'datetime':
      options.year = 'numeric'
      options.month = '2-digit'
      options.day = '2-digit'
      options.hour = '2-digit'
      options.minute = '2-digit'
      break
  }

  return new Intl.DateTimeFormat('ar-EG', options).format(dateObj)
}

/**
 * تنسيق الرقم
 */
export function formatAdminNumber(value: number): string {
  return new Intl.NumberFormat('ar-EG').format(value)
}

/**
 * تنسيق النسبة المئوية
 */
export function formatAdminPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * تنسيق البايتات
 */
export function formatAdminBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * تنسيق المدة الزمنية
 */
export function formatAdminDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
  if (ms < 3600000) return `${(ms / 60000).toFixed(2)}m`
  return `${(ms / 3600000).toFixed(2)}h`
}
