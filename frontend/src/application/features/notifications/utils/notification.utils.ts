/**
 * Notification Utils - دوال مساعدة للإشعارات
 *
 * @description دوال مساعدة خاصة بميزة الإشعارات
 */

import type {
  NotificationData,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
} from '../types'
import { NOTIFICATION_CONFIG } from '../constants'

/**
 * التحقق من صحة عنوان الإشعار
 */
export function validateNotificationTitle(title: string): {
  valid: boolean
  error?: string
} {
  if (title.length < NOTIFICATION_CONFIG.VALIDATION.TITLE_MIN_LENGTH) {
    return {
      valid: false,
      error: `عنوان الإشعار يجب أن يكون على الأقل ${NOTIFICATION_CONFIG.VALIDATION.TITLE_MIN_LENGTH} حرف`,
    }
  }

  if (title.length > NOTIFICATION_CONFIG.VALIDATION.TITLE_MAX_LENGTH) {
    return {
      valid: false,
      error: `عنوان الإشعار يجب أن يكون أقل من ${NOTIFICATION_CONFIG.VALIDATION.TITLE_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * التحقق من صحة رسالة الإشعار
 */
export function validateNotificationMessage(message: string): {
  valid: boolean
  error?: string
} {
  if (message.length < NOTIFICATION_CONFIG.VALIDATION.MESSAGE_MIN_LENGTH) {
    return {
      valid: false,
      error: `رسالة الإشعار يجب أن تكون على الأقل ${NOTIFICATION_CONFIG.VALIDATION.MESSAGE_MIN_LENGTH} حرف`,
    }
  }

  if (message.length > NOTIFICATION_CONFIG.VALIDATION.MESSAGE_MAX_LENGTH) {
    return {
      valid: false,
      error: `رسالة الإشعار يجب أن تكون أقل من ${NOTIFICATION_CONFIG.VALIDATION.MESSAGE_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * تنسيق وقت الإشعار
 */
export function formatNotificationTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) {
    return `منذ ${years} ${years === 1 ? 'سنة' : 'سنوات'}`
  }

  if (months > 0) {
    return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`
  }

  if (weeks > 0) {
    return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`
  }

  if (days > 0) {
    return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`
  }

  if (hours > 0) {
    return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
  }

  if (minutes > 0) {
    return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
  }

  if (seconds > 0) {
    return `منذ ${seconds} ${seconds === 1 ? 'ثانية' : 'ثواني'}`
  }

  return 'الآن'
}

/**
 * تنسيق تاريخ الإشعار
 */
export function formatNotificationDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const notificationDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  if (notificationDate.getTime() === today.getTime()) {
    return 'اليوم'
  }

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (notificationDate.getTime() === yesterday.getTime()) {
    return 'أمس'
  }

  // تنسيق التاريخ بالعربية
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
 * تنسيق اسم نوع الإشعار
 */
export function formatNotificationType(type: NotificationType): string {
  const typeMap: Record<NotificationType, string> = {
    message: 'رسالة',
    alert: 'تنبيه',
    task: 'مهمة',
    test: 'اختبار',
    success: 'نجاح',
    warning: 'تحذير',
    error: 'خطأ',
    info: 'معلومات',
    assignment: 'واجب',
    announcement: 'إعلان',
  }
  return typeMap[type] || type
}

/**
 * تنسيق اسم الأولوية
 */
export function formatNotificationPriority(priority: NotificationPriority): string {
  const priorityMap: Record<NotificationPriority, string> = {
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'عالية',
    urgent: 'عاجلة',
  }
  return priorityMap[priority] || priority
}

/**
 * الحصول على لون نوع الإشعار
 */
export function getNotificationTypeColor(type: NotificationType): string {
  const colorMap: Record<NotificationType, string> = {
    message: '#3b82f6', // blue
    alert: '#f59e0b', // yellow
    task: '#8b5cf6', // purple
    test: '#06b6d4', // cyan
    success: '#22c55e', // green
    warning: '#f59e0b', // yellow
    error: '#ef4444', // red
    info: '#3b82f6', // blue
    assignment: '#6366f1', // indigo
    announcement: '#ec4899', // pink
  }
  return colorMap[type] || '#6b7280'
}

/**
 * الحصول على لون الأولوية
 */
export function getNotificationPriorityColor(priority: NotificationPriority): string {
  const colorMap: Record<NotificationPriority, string> = {
    low: '#6b7280', // gray
    medium: '#3b82f6', // blue
    high: '#f59e0b', // yellow
    urgent: '#ef4444', // red
  }
  return colorMap[priority] || '#6b7280'
}

/**
 * الحصول على أيقونة نوع الإشعار
 */
export function getNotificationTypeIcon(type: NotificationType): string {
  const iconMap: Record<NotificationType, string> = {
    message: 'message-circle',
    alert: 'bell',
    task: 'check-square',
    test: 'file-text',
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'x-circle',
    info: 'info',
    assignment: 'book',
    announcement: 'megaphone',
  }
  return iconMap[type] || 'bell'
}

/**
 * التحقق من أن الإشعار غير مقروء
 */
import { NOTIFICATION_STATUS } from '../constants'

export function isNotificationUnread(notification: NotificationData): boolean {
  return notification.status === NOTIFICATION_STATUS.UNREAD
}

/**
 * التحقق من أن الإشعار مقروء
 */
export function isNotificationRead(notification: NotificationData): boolean {
  return notification.status === NOTIFICATION_STATUS.READ
}

/**
 * التحقق من أن الإشعار مؤرشف
 */
export function isNotificationArchived(notification: NotificationData): boolean {
  return notification.status === NOTIFICATION_STATUS.ARCHIVED
}

/**
 * التحقق من أن الإشعار جديد (آخر 24 ساعة)
 */
export function isNotificationNew(notification: NotificationData): boolean {
  const createdAt = new Date(notification.created_at)
  const now = new Date()
  const diff = now.getTime() - createdAt.getTime()
  const hours = diff / (1000 * 60 * 60)
  return hours <= 24
}

/**
 * تجميع الإشعارات حسب التاريخ
 */
export function groupNotificationsByDate(
  notifications: NotificationData[]
): Array<{ date: string; notifications: NotificationData[] }> {
  const groups: Map<string, NotificationData[]> = new Map()

  notifications.forEach(notification => {
    const date = formatNotificationDate(notification.created_at)
    if (!groups.has(date)) {
      groups.set(date, [])
    }
    groups.get(date)!.push(notification)
  })

  return Array.from(groups.entries()).map(([date, notifications]) => ({
    date,
    notifications,
  }))
}

/**
 * ترتيب الإشعارات حسب الأولوية
 */
export function sortNotificationsByPriority(notifications: NotificationData[]): NotificationData[] {
  const priorityOrder: Record<NotificationPriority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  }

  return [...notifications].sort((a, b) => {
    const priorityA = priorityOrder[a.priority || 'low']
    const priorityB = priorityOrder[b.priority || 'low']
    return priorityB - priorityA
  })
}

/**
 * ترتيب الإشعارات حسب التاريخ (الأحدث أولاً)
 */
export function sortNotificationsByDate(notifications: NotificationData[]): NotificationData[] {
  return [...notifications].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateB - dateA
  })
}

/**
 * تصفية الإشعارات حسب الحالة
 */
export function filterNotificationsByStatus(
  notifications: NotificationData[],
  status: NotificationStatus
): NotificationData[] {
  if (status === NOTIFICATION_STATUS.ALL) {
    return notifications
  }
  return notifications.filter(n => n.status === status)
}

/**
 * تصفية الإشعارات حسب النوع
 */
export function filterNotificationsByType(
  notifications: NotificationData[],
  type: NotificationType
): NotificationData[] {
  return notifications.filter(n => n.type === type)
}

/**
 * تصفية الإشعارات حسب الأولوية
 */
export function filterNotificationsByPriority(
  notifications: NotificationData[],
  priority: NotificationPriority
): NotificationData[] {
  return notifications.filter(n => n.priority === priority)
}

/**
 * حساب عدد الإشعارات غير المقروءة
 */
export function countUnreadNotifications(notifications: NotificationData[]): number {
  return notifications.filter(isNotificationUnread).length
}

/**
 * تنسيق رسالة الخطأ
 */
export function formatNotificationError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return NOTIFICATION_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * تقصير نص الإشعار
 */
export function truncateNotificationText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * استخراج رابط من نص الإشعار
 */
export function extractUrlFromText(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const match = text.match(urlRegex)
  return match ? match[0] : null
}
