/**
 * Admin Constants - ثوابت الإدارة
 *
 * @description ثوابت ميزة الإدارة
 */

// Admin-specific Configuration
export const ADMIN_CONFIG = {
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    MIN_PAGE_SIZE: 10,
  } as const,

  // Stats Refresh
  STATS: {
    REFRESH_INTERVAL: 30 * 1000, // 30 ثانية
    CACHE_TTL: 5 * 60 * 1000, // 5 دقائق
  } as const,

  // Cache
  CACHE: {
    SYSTEM_STATS_TTL: 2 * 60 * 1000, // 2 دقيقة
    USER_STATS_TTL: 5 * 60 * 1000, // 5 دقائق
    CONTENT_STATS_TTL: 5 * 60 * 1000, // 5 دقائق
    USAGE_STATS_TTL: 1 * 60 * 1000, // 1 دقيقة
    USER_ACTIVITIES_TTL: 2 * 60 * 1000, // 2 دقيقة
  } as const,

  // Error Messages
  ERROR_MESSAGES: {
    USER_NOT_FOUND: 'المستخدم غير موجود',
    FAILED_TO_LOAD_STATS: 'فشل تحميل الإحصائيات',
    FAILED_TO_LOAD_USERS: 'فشل تحميل المستخدمين',
    FAILED_TO_UPDATE_USER: 'فشل تحديث المستخدم',
    FAILED_TO_DELETE_USER: 'فشل حذف المستخدم',
    FAILED_TO_LOAD_ACTIVITIES: 'فشل تحميل الأنشطة',
    NETWORK_ERROR: 'خطأ في الاتصال. يرجى المحاولة مرة أخرى',
    UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
  } as const,

  // Success Messages
  SUCCESS_MESSAGES: {
    STATS_LOADED: 'تم تحميل الإحصائيات بنجاح',
    USERS_LOADED: 'تم تحميل المستخدمين بنجاح',
    USER_UPDATED: 'تم تحديث المستخدم بنجاح',
    USER_DELETED: 'تم حذف المستخدم بنجاح',
    ACTIVITIES_LOADED: 'تم تحميل الأنشطة بنجاح',
  } as const,

  // Validation Rules
  VALIDATION: {
    QUERY_MIN_LENGTH: 1,
    QUERY_MAX_LENGTH: 100,
  } as const,
} as const

// System Health Status
export const SYSTEM_HEALTH_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  ERROR: 'error',
} as const

export type SystemHealthStatusValue =
  (typeof SYSTEM_HEALTH_STATUS)[keyof typeof SYSTEM_HEALTH_STATUS]

// Database Status
export const DATABASE_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
} as const

export type DatabaseStatusValue = (typeof DATABASE_STATUS)[keyof typeof DATABASE_STATUS]

// Server Status
export const SERVER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export type ServerStatusValue = (typeof SERVER_STATUS)[keyof typeof SERVER_STATUS]
