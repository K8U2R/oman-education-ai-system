/**
 * Notification Types - أنواع الإشعارات
 *
 * @description أنواع TypeScript الخاصة بميزة الإشعارات
 * تجميع جميع الأنواع من Domain
 */

// Re-export Domain Types
import type {
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationData,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  NotificationListResponse,
  MarkAllAsReadResponse,
  NotificationStats,
  NotificationFilter,
} from '@/domain/types/notification.types'

export type {
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationData,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  NotificationListResponse,
  MarkAllAsReadResponse,
  NotificationStats,
  NotificationFilter,
}

// Application-specific Types

/**
 * حالة تحميل الإشعارات
 */
export type NotificationsLoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * حالة الاتصال في الوقت الفعلي
 */
export type RealtimeConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

/**
 * نوع الاتصال في الوقت الفعلي
 */
export type RealtimeConnectionType = 'websocket' | 'sse' | 'polling' | 'none'

/**
 * خيارات تحميل الإشعارات
 */
export interface LoadNotificationsOptions {
  page?: number
  perPage?: number
  status?: NotificationStatus
  type?: NotificationType
  priority?: NotificationPriority
}

/**
 * نتيجة تحميل الإشعارات
 */
export interface LoadNotificationsResult {
  notifications: NotificationData[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

/**
 * إعدادات الإشعارات
 */
export interface NotificationSettings {
  enableRealtime: boolean
  enableSound: boolean
  enableDesktop: boolean
  enableEmail: boolean
  enablePush: boolean
  quietHours: {
    enabled: boolean
    start: string // HH:mm format
    end: string // HH:mm format
  }
  types: {
    [key in NotificationType]?: {
      enabled: boolean
      sound?: boolean
      desktop?: boolean
      email?: boolean
      push?: boolean
    }
  }
}

/**
 * إشعار مع معلومات إضافية
 */
export interface NotificationWithMetadata extends NotificationData {
  isNew?: boolean
  timeAgo?: string
  formattedTime?: string
}

/**
 * مجموعة إشعارات
 */
export interface NotificationGroup {
  date: string
  notifications: NotificationData[]
  count: number
}

/**
 * إحصائيات الإشعارات المخصصة
 */
export interface CustomNotificationStats extends NotificationStats {
  unreadByType: Record<NotificationType, number>
  unreadByPriority: Record<NotificationPriority, number>
  recentCount: number // آخر 24 ساعة
}

/**
 * خطأ الإشعارات
 */
export interface NotificationError {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}

/**
 * نتيجة الاشتراك في الوقت الفعلي
 */
export interface RealtimeSubscriptionResult {
  success: boolean
  connectionType: RealtimeConnectionType
  error?: string
}
