/**
 * Developer Constants - ثوابت المطور
 *
 * @description ثوابت ميزة المطور
 */

// Developer-specific Configuration
export const DEVELOPER_CONFIG = {
  // Refresh Intervals
  REFRESH: {
    STATS_INTERVAL: 30 * 1000, // 30 ثانية
    ENDPOINTS_INTERVAL: 60 * 1000, // 60 ثانية
    SERVICES_INTERVAL: 30 * 1000, // 30 ثانية
    PERFORMANCE_INTERVAL: 60 * 1000, // 60 ثانية
  } as const,

  // Cache
  CACHE: {
    STATS_TTL: 30 * 1000, // 30 ثانية
    ENDPOINTS_TTL: 60 * 1000, // 60 ثانية
    SERVICES_TTL: 30 * 1000, // 30 ثانية
    PERFORMANCE_TTL: 60 * 1000, // 60 ثانية
  } as const,

  // Error Messages
  ERROR_MESSAGES: {
    FAILED_TO_LOAD_STATS: 'فشل تحميل الإحصائيات',
    FAILED_TO_LOAD_ENDPOINTS: 'فشل تحميل نقاط API',
    FAILED_TO_LOAD_SERVICES: 'فشل تحميل الخدمات',
    FAILED_TO_LOAD_PERFORMANCE: 'فشل تحميل مقاييس الأداء',
    NETWORK_ERROR: 'خطأ في الاتصال. يرجى المحاولة مرة أخرى',
    UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
  } as const,

  // Success Messages
  SUCCESS_MESSAGES: {
    STATS_LOADED: 'تم تحميل الإحصائيات بنجاح',
    ENDPOINTS_LOADED: 'تم تحميل نقاط API بنجاح',
    SERVICES_LOADED: 'تم تحميل الخدمات بنجاح',
    PERFORMANCE_LOADED: 'تم تحميل مقاييس الأداء بنجاح',
  } as const,
} as const

// Build Status
export const BUILD_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING: 'pending',
} as const

export type BuildStatusValue = (typeof BUILD_STATUS)[keyof typeof BUILD_STATUS]

// Service Status
export const SERVICE_STATUS = {
  HEALTHY: 'healthy',
  UNHEALTHY: 'unhealthy',
  UNKNOWN: 'unknown',
} as const

export type ServiceStatusValue = (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS]

// Log Levels
export const LOG_LEVELS = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug',
} as const

export type LogLevelValue = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS]
