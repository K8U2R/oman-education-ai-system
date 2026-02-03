/**
 * Notification Constants - ثوابت الإشعارات
 *
 * @description ثوابت ميزة الإشعارات
 */

// API Endpoints (مستوردة من Domain)
export { API_ENDPOINTS } from '@/domain/constants/api.constants'

// Notification-specific Configuration
export const NOTIFICATION_CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,

  // Realtime Connection
  REALTIME: {
    WEBSOCKET_URL: import.meta.env.VITE_WS_URL,
    SSE_URL: import.meta.env.VITE_SSE_URL,
    CONNECTION_TIMEOUT: 5000, // 5 ثواني
    RECONNECT_DELAY: 3000, // 3 ثواني
    MAX_RECONNECT_ATTEMPTS: 5,
    HEARTBEAT_INTERVAL: 30000, // 30 ثانية
  } as const,

  // Polling (Fallback)
  POLLING: {
    INTERVAL: 30 * 1000, // 30 ثانية
    ENABLED: true,
  } as const,

  // Display
  DISPLAY: {
    MAX_TITLE_LENGTH: 100,
    MAX_MESSAGE_LENGTH: 500,
    AUTO_DISMISS_DELAY: 5000, // 5 ثواني
    GROUP_BY_DATE: true,
    SHOW_TIME_AGO: true,
  } as const,

  // Cache
  CACHE: {
    NOTIFICATIONS_TTL: 2 * 60 * 1000, // 2 دقيقة
    STATS_TTL: 5 * 60 * 1000, // 5 دقائق
    SETTINGS_TTL: 10 * 60 * 1000, // 10 دقائق
  } as const,

  // Error Messages
  ERROR_MESSAGES: {
    NOTIFICATION_NOT_FOUND: 'الإشعار غير موجود',
    FAILED_TO_LOAD_NOTIFICATIONS: 'فشل تحميل الإشعارات',
    FAILED_TO_LOAD_STATS: 'فشل تحميل الإحصائيات',
    FAILED_TO_MARK_AS_READ: 'فشل تحديد الإشعار كمقروء',
    FAILED_TO_DELETE: 'فشل حذف الإشعار',
    FAILED_TO_SUBSCRIBE: 'فشل الاشتراك في الإشعارات الفورية',
    CONNECTION_FAILED: 'فشل الاتصال بخدمة الإشعارات',
    NETWORK_ERROR: 'خطأ في الاتصال. يرجى المحاولة مرة أخرى',
    UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
  } as const,

  // Success Messages
  SUCCESS_MESSAGES: {
    NOTIFICATION_LOADED: 'تم تحميل الإشعارات بنجاح',
    MARKED_AS_READ: 'تم تحديد الإشعار كمقروء',
    ALL_MARKED_AS_READ: 'تم تحديد جميع الإشعارات كمقروءة',
    NOTIFICATION_DELETED: 'تم حذف الإشعار بنجاح',
    ALL_DELETED: 'تم حذف جميع الإشعارات بنجاح',
    SUBSCRIBED: 'تم الاشتراك في الإشعارات الفورية',
    UNSUBSCRIBED: 'تم إلغاء الاشتراك',
  } as const,

  // Validation Rules
  VALIDATION: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    MESSAGE_MIN_LENGTH: 1,
    MESSAGE_MAX_LENGTH: 1000,
  } as const,
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  ALERT: 'alert',
  TASK: 'task',
  TEST: 'test',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
  ASSIGNMENT: 'assignment',
  ANNOUNCEMENT: 'announcement',
} as const

export type NotificationTypeValue = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

// Notification Status
export const NOTIFICATION_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  ARCHIVED: 'archived',
  ALL: 'all',
} as const

export type NotificationStatusValue = (typeof NOTIFICATION_STATUS)[keyof typeof NOTIFICATION_STATUS]

// Notification Priority
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const

export type NotificationPriorityValue =
  (typeof NOTIFICATION_PRIORITY)[keyof typeof NOTIFICATION_PRIORITY]

// Realtime Connection Types
export const REALTIME_CONNECTION_TYPES = {
  WEBSOCKET: 'websocket',
  SSE: 'sse',
  POLLING: 'polling',
  NONE: 'none',
} as const

export type RealtimeConnectionTypeValue =
  (typeof REALTIME_CONNECTION_TYPES)[keyof typeof REALTIME_CONNECTION_TYPES]
