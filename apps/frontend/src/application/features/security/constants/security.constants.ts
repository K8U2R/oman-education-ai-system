/**
 * Security Constants - ثوابت الأمان
 *
 * @description ثوابت ميزة الأمان
 */

// API Endpoints (مستوردة من Domain)
export { API_ENDPOINTS } from '@/domain/constants/api.constants'

// Security-specific Configuration
export const SECURITY_CONFIG = {
  // Session Management
  SESSION: {
    DEFAULT_TIMEOUT: 30 * 60 * 1000, // 30 دقيقة
    MAX_IDLE_TIME: 15 * 60 * 1000, // 15 دقيقة
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 دقائق قبل انتهاء الصلاحية
    MAX_CONCURRENT_SESSIONS: 5,
  } as const,

  // Security Events
  EVENTS: {
    AUTO_REFRESH_INTERVAL: 30 * 1000, // تحديث كل 30 ثانية
    MAX_EVENTS_PER_PAGE: 100,
    DEFAULT_PAGE_SIZE: 50,
  } as const,

  // Analytics
  ANALYTICS: {
    DEFAULT_PERIOD: '7d' as const,
    SUPPORTED_PERIODS: ['1d', '7d', '30d', '90d', '1y', 'custom'] as const,
    MAX_IP_ACTIVITY_LIMIT: 100,
    MAX_USER_ACTIVITY_LIMIT: 100,
  } as const,

  // Monitoring
  MONITORING: {
    HEALTH_CHECK_INTERVAL: 60 * 1000, // كل دقيقة
    METRICS_UPDATE_INTERVAL: 30 * 1000, // كل 30 ثانية
    ALERT_CHECK_INTERVAL: 10 * 1000, // كل 10 ثواني
  } as const,

  // Rate Limiting
  RATE_LIMITING: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 دقيقة
    RESET_AFTER: 60 * 60 * 1000, // ساعة واحدة
  } as const,

  // Cache
  CACHE: {
    STATS_TTL: 2 * 60 * 1000, // 2 دقيقة
    LOGS_TTL: 5 * 60 * 1000, // 5 دقائق
    SETTINGS_TTL: 10 * 60 * 1000, // 10 دقائق
    ANALYTICS_TTL: 5 * 60 * 1000, // 5 دقائق
  } as const,

  // Error Messages
  ERROR_MESSAGES: {
    SESSION_NOT_FOUND: 'الجلسة غير موجودة',
    SESSION_EXPIRED: 'انتهت صلاحية الجلسة',
    SESSION_TERMINATED: 'تم إنهاء الجلسة',
    FAILED_TO_TERMINATE_SESSION: 'فشل إنهاء الجلسة',
    FAILED_TO_LOAD_SESSIONS: 'فشل تحميل الجلسات',
    FAILED_TO_LOAD_STATS: 'فشل تحميل الإحصائيات',
    FAILED_TO_LOAD_LOGS: 'فشل تحميل السجلات',
    FAILED_TO_UPDATE_SETTINGS: 'فشل تحديث الإعدادات',
    UNAUTHORIZED_ACCESS: 'غير مصرح لك بالوصول',
    NETWORK_ERROR: 'خطأ في الاتصال. يرجى المحاولة مرة أخرى',
    UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
  } as const,

  // Success Messages
  SUCCESS_MESSAGES: {
    SESSION_TERMINATED: 'تم إنهاء الجلسة بنجاح',
    ALL_SESSIONS_TERMINATED: 'تم إنهاء جميع الجلسات بنجاح',
    SETTINGS_UPDATED: 'تم تحديث الإعدادات بنجاح',
    LOGS_EXPORTED: 'تم تصدير السجلات بنجاح',
    ALERT_RESOLVED: 'تم حل التنبيه بنجاح',
  } as const,

  // Validation Rules
  VALIDATION: {
    IP_ADDRESS_REGEX:
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    SESSION_ID_MIN_LENGTH: 10,
    SESSION_ID_MAX_LENGTH: 100,
  } as const,
} as const

// Security Event Types
export const SECURITY_EVENT_TYPES = {
  // Authentication
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'password_reset_completed',
  EMAIL_VERIFICATION_SENT: 'email_verification_sent',
  EMAIL_VERIFICATION_COMPLETED: 'email_verification_completed',
  EMAIL_VERIFICATION_FAILED: 'email_verification_failed',
  // Session
  SESSION_CREATED: 'session_created',
  SESSION_TERMINATED: 'session_terminated',
  SESSION_EXPIRED: 'session_expired',
  SESSION_REFRESHED: 'session_refreshed',
  SESSION_FROZEN: 'session_frozen',
  SESSION_UNFROZEN: 'session_unfrozen',
  // OAuth
  OAUTH_LOGIN_SUCCESS: 'oauth_login_success',
  OAUTH_LOGIN_FAILED: 'oauth_login_failed',
  OAUTH_TOKEN_REFRESHED: 'oauth_token_refreshed',
  // Security
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  BRUTE_FORCE_ATTEMPT: 'brute_force_attempt',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  IP_BLOCKED: 'ip_blocked',
  ACCOUNT_LOCKED: 'account_locked',
  ACCOUNT_UNLOCKED: 'account_unlocked',
} as const

// Security Event Severity
export const SECURITY_EVENT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
} as const

export type SecurityEventSeverityValue =
  (typeof SECURITY_EVENT_SEVERITY)[keyof typeof SECURITY_EVENT_SEVERITY]

// System Health Status
export const SYSTEM_HEALTH_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  ERROR: 'error',
} as const

export type SystemHealthStatusValue =
  (typeof SYSTEM_HEALTH_STATUS)[keyof typeof SYSTEM_HEALTH_STATUS]

// Analytics Periods
export const ANALYTICS_PERIODS = {
  ONE_DAY: '1d',
  SEVEN_DAYS: '7d',
  THIRTY_DAYS: '30d',
  NINETY_DAYS: '90d',
  ONE_YEAR: '1y',
  CUSTOM: 'custom',
} as const

export type AnalyticsPeriodValue = (typeof ANALYTICS_PERIODS)[keyof typeof ANALYTICS_PERIODS]

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

export type RiskLevelValue = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS]
