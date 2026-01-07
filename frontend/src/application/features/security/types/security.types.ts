/**
 * Security Types - أنواع الأمان
 *
 * جميع الأنواع المتعلقة بنظام الأمان
 * مخصص للمطورين وطاقم الإدارة والدعم الفني
 */

/**
 * Security Stats - إحصائيات الأمان
 */
export interface SecurityStats {
  // Sessions
  totalSessions: number
  activeSessions: number
  activeSessionsChange?: number // نسبة التغيير
  idleSessions: number
  expiredSessions: number

  // Authentication
  failedLoginAttempts: number
  failedLoginAttempts24h: number
  failedLoginAttemptsChange?: number
  successfulLogins24h: number
  blockedAccounts: number

  // Security Alerts
  securityAlerts: number
  securityAlertsChange?: number
  criticalAlerts: number
  unreadAlerts: number

  // System Health
  systemHealth: 'healthy' | 'warning' | 'error'
  systemHealthScore: number // 0-100
  twoFactorEnabledPercentage: number

  // Network & IP
  blockedIPs: number
  blockedIPsChange?: number
  suspiciousIPs: number

  // Rate Limiting
  rateLimitHits: number
  rateLimitHits24h: number

  // Last Events
  lastSecurityEvent?: SecurityEvent
  lastFailedLogin?: string
  lastSuspiciousActivity?: string
}

/**
 * Security Event - حدث أمني
 */
export interface SecurityEvent {
  id: string
  type: SecurityEventType
  severity: SecurityEventSeverity
  message: string
  details?: string // تفاصيل إضافية
  userId?: string
  userEmail?: string
  userName?: string
  userRole?: string
  ipAddress?: string
  userAgent?: string
  location?: SecurityLocation
  metadata?: Record<string, unknown>
  resolved: boolean // تم حله
  resolvedBy?: string
  resolvedAt?: string
  createdAt: string
  updatedAt?: string
}

/**
 * Security Event Type - نوع الحدث الأمني
 */
export type SecurityEventType =
  // Authentication Events
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'password_change'
  | 'password_reset_requested'
  | 'password_reset_completed'
  | 'email_verification_sent'
  | 'email_verification_completed'
  | 'email_verification_failed'
  // Session Events
  | 'session_created'
  | 'session_terminated'
  | 'session_expired'
  | 'session_refreshed'
  | 'session_frozen'
  | 'session_unfrozen'
  // OAuth Events
  | 'oauth_login_success'
  | 'oauth_login_failed'
  | 'oauth_token_refreshed'
  | 'oauth_token_expired'
  // Security Events
  | 'unauthorized_access'
  | 'unauthorized_access_attempt'
  | 'suspicious_activity'
  | 'suspicious_activity_detected'
  | 'brute_force_detected'
  | 'brute_force_blocked'
  | 'rate_limit_exceeded'
  | 'rate_limit_reset'
  // Account Events
  | 'account_locked'
  | 'account_unlocked'
  | 'account_suspended'
  | 'account_activated'
  | 'account_deactivated'
  // IP & Network Events
  | 'ip_blocked'
  | 'ip_unblocked'
  | 'ip_whitelisted'
  | 'ip_blacklisted'
  // 2FA Events
  | '2fa_enabled'
  | '2fa_disabled'
  | '2fa_verification_success'
  | '2fa_verification_failed'
  // Permission Events
  | 'permission_granted'
  | 'permission_revoked'
  | 'role_changed'
  // System Events
  | 'system_config_changed'
  | 'security_settings_updated'
  | 'route_protection_updated'

/**
 * Security Event Severity - خطورة الحدث الأمني
 */
export type SecurityEventSeverity = 'info' | 'warning' | 'error' | 'critical'

/**
 * Security Location - موقع الأمان
 */
export interface SecurityLocation {
  country?: string
  city?: string
  region?: string
  latitude?: number
  longitude?: number
}

/**
 * Security Settings - إعدادات الأمان
 */
export interface SecuritySettings {
  // Authentication Settings
  requireEmailVerification: boolean
  requirePasswordComplexity: boolean
  passwordMinLength: number
  passwordRequireUppercase: boolean
  passwordRequireLowercase: boolean
  passwordRequireNumbers: boolean
  passwordRequireSpecialChars: boolean
  maxLoginAttempts: number
  lockoutDuration: number // in minutes

  // Session Settings
  sessionTimeout: number // in minutes
  maxConcurrentSessions: number
  requireSessionValidation: boolean
  sessionRefreshInterval: number // in minutes

  // OAuth Settings
  oauthEnabled: boolean
  oauthProviders: string[]
  oauthRequireEmailVerification: boolean

  // Rate Limiting
  rateLimitEnabled: boolean
  rateLimitRequests: number
  rateLimitWindow: number // in seconds

  // Security Features
  twoFactorEnabled: boolean
  ipWhitelistEnabled: boolean
  ipWhitelist: string[]
  suspiciousActivityDetection: boolean

  // Notifications
  notifyOnFailedLogin: boolean
  notifyOnNewDevice: boolean
  notifyOnSuspiciousActivity: boolean
}

/**
 * Security Log Filter - فلتر سجلات الأمان
 */
export interface SecurityLogFilter {
  eventType?: SecurityEventType
  severity?: SecurityEventSeverity
  userId?: string
  startDate?: string
  endDate?: string
  ipAddress?: string
  page?: number
  per_page?: number
}

/**
 * Route Protection Rule - قاعدة حماية المسار
 */
export interface RouteProtectionRule {
  id: string
  route: string
  method?: string
  requiresAuth: boolean
  requiredRoles?: string[]
  requiredPermissions?: string[]
  rateLimit?: {
    requests: number
    window: number
  }
  ipWhitelist?: string[]
  ipBlacklist?: string[]
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

/**
 * Security Alert - تنبيه أمني
 */
export interface SecurityAlert {
  id: string
  type: SecurityAlertType
  severity: SecurityEventSeverity
  title: string
  message: string
  description?: string
  userId?: string
  userEmail?: string
  userName?: string
  isRead: boolean
  isAcknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt?: string
}

/**
 * Security Alert Type - نوع التنبيه الأمني
 */
export type SecurityAlertType =
  | 'failed_login'
  | 'multiple_failed_logins'
  | 'new_device'
  | 'new_location'
  | 'suspicious_activity'
  | 'suspicious_ip'
  | 'password_change'
  | 'password_reset'
  | 'session_terminated'
  | 'session_expired'
  | 'unauthorized_access'
  | 'unauthorized_access_attempt'
  | 'rate_limit_exceeded'
  | 'brute_force_detected'
  | 'account_locked'
  | 'account_suspended'
  | 'ip_blocked'
  | '2fa_disabled'
  | 'permission_changed'
  | 'system_config_changed'

/**
 * Security Dashboard View - نوع عرض لوحة الأمان
 * مخصص للمطورين والإدارة والدعم الفني
 */
export type SecurityDashboardView =
  | 'overview' // نظرة عامة
  | 'sessions' // الجلسات
  | 'events' // الأحداث
  | 'alerts' // التنبيهات
  | 'settings' // الإعدادات
  | 'analytics' // التحليلات (للمطورين)
  | 'monitoring' // المراقبة (للمطورين)
  | 'audit' // التدقيق (للإدارة)

/**
 * Security Role Access - صلاحيات الوصول للأمان
 */
export interface SecurityRoleAccess {
  role: 'admin' | 'developer' | 'moderator' | 'support'
  canViewDashboard: boolean
  canViewSessions: boolean
  canManageSessions: boolean
  canViewLogs: boolean
  canExportLogs: boolean
  canViewAlerts: boolean
  canManageAlerts: boolean
  canViewSettings: boolean
  canManageSettings: boolean
  canViewAnalytics: boolean
  canViewMonitoring: boolean
  canViewAudit: boolean
  canManageRouteProtection: boolean
  canBlockIPs: boolean
  canUnblockIPs: boolean
  canLockAccounts: boolean
  canUnlockAccounts: boolean
}
