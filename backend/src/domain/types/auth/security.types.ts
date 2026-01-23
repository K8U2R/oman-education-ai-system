/**
 * Security Types - أنواع الأمان
 *
 * جميع الأنواع المتعلقة بنظام الأمان المخصص
 */

/**
 * Security Event Types - أنواع الأحداث الأمنية
 */
export type SecurityEventType =
  | "login_attempt"
  | "login_success"
  | "login_failed"
  | "logout"
  | "password_change"
  | "password_reset"
  | "email_verification"
  | "two_factor_enabled"
  | "two_factor_disabled"
  | "session_created"
  | "session_terminated"
  | "session_expired"
  | "permission_granted"
  | "permission_revoked"
  | "role_changed"
  | "account_locked"
  | "account_unlocked"
  | "suspicious_activity"
  | "rate_limit_exceeded"
  | "unauthorized_access_attempt"
  | "data_access"
  | "data_modification"
  | "data_deletion"
  | "api_call"
  | "file_upload"
  | "file_download"
  | "export_data"
  | "import_data"
  | "settings_change"
  | "route_access"
  | "ip_blocked"
  | "ip_unblocked"
  | "device_registered"
  | "device_unregistered"
  | "backup_created"
  | "backup_restored"
  | "system_update"
  | "security_policy_updated"
  | "audit_log_accessed";

/**
 * Security Event Severity - مستوى خطورة الحدث
 */
export type SecurityEventSeverity = "info" | "warning" | "error" | "critical";

/**
 * Security Location - موقع الأمان
 */
export interface SecurityLocation {
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

/**
 * Security Event - حدث أمني
 */
export interface SecurityEvent {
  id: string;
  userId?: string;
  eventType: SecurityEventType;
  severity: SecurityEventSeverity;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  location?: SecurityLocation;
  source?: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
}

/**
 * Security Session - جلسة أمنية
 */
export interface SecuritySession {
  id: string;
  userId: string;
  tokenHash: string;
  refreshTokenHash?: string;
  deviceInfo?: DeviceInfo;
  ipAddress?: string;
  userAgent?: string;
  location?: SecurityLocation;
  isActive: boolean;
  lastActivityAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Device Info - معلومات الجهاز
 */
export interface DeviceInfo {
  type: "desktop" | "mobile" | "tablet" | "unknown";
  os?: string;
  osVersion?: string;
  browser?: string;
  browserVersion?: string;
  deviceName?: string;
}

/**
 * Security Settings - إعدادات الأمان
 */
export interface SecuritySettings {
  // Authentication Settings
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  twoFactorEnabled: boolean;

  // Session Settings
  sessionTimeout: number; // minutes
  maxConcurrentSessions: number;

  // Rate Limiting
  rateLimitEnabled: boolean;
  rateLimitRequests: number;
  rateLimitWindow: number; // seconds

  // Alerts
  alertOnSuspiciousLogin: boolean;
  alertOnPasswordChange: boolean;
}

/**
 * Route Protection Rule - قاعدة حماية المسار
 */
export interface RouteProtectionRule {
  id: string;
  routePath: string;
  routePattern: string;
  requiredRoles: string[];
  requiredPermissions: string[];
  rateLimitEnabled: boolean;
  rateLimitMax: number;
  rateLimitWindow: number; // seconds
  isActive: boolean;
  description?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Security Alert Type - نوع التنبيه الأمني
 */
export type SecurityAlertType =
  | "suspicious_login"
  | "password_breach"
  | "unusual_activity"
  | "multiple_failed_logins"
  | "new_device"
  | "new_location"
  | "permission_change"
  | "role_change"
  | "account_locked"
  | "session_compromised"
  | "data_breach_attempt"
  | "rate_limit_exceeded";

/**
 * Security Alert - تنبيه أمني
 */
export interface SecurityAlert {
  id: string;
  userId?: string;
  alertType: SecurityAlertType;
  severity: SecurityEventSeverity;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
  actionRequired: boolean;
  actionTaken: boolean;
  actionTakenAt?: Date;
  createdAt: Date;
}

/**
 * Security Stats - إحصائيات الأمان
 */
export interface SecurityStats {
  totalSessions: number;
  activeSessions: number;
  totalEvents: number;
  criticalEvents: number;
  totalAlerts: number;
  unreadAlerts: number;
  failedLogins: number;
  successfulLogins: number;
  blockedIPs: number;
}

/**
 * Session Filter - فلتر الجلسات
 */
export interface SessionFilter {
  userId?: string;
  isActive?: boolean;
  deviceType?: DeviceInfo["type"];
  ipAddress?: string;
  country?: string;
}

/**
 * Security Event Filter - فلتر الأحداث الأمنية
 */
export interface SecurityEventFilter {
  userId?: string;
  eventType?: SecurityEventType;
  severity?: SecurityEventSeverity;
  resolved?: boolean;
  startDate?: Date;
  endDate?: Date;
  ipAddress?: string;
}

/**
 * Security Alert Filter - فلتر التنبيهات الأمنية
 */
export interface SecurityAlertFilter {
  userId?: string;
  alertType?: SecurityAlertType;
  severity?: SecurityEventSeverity;
  isRead?: boolean;
  actionRequired?: boolean;
}

/**
 * Analytics Period - فترة التحليل
 */
export type AnalyticsPeriod = "1h" | "24h" | "7d" | "30d" | "90d" | "custom";

/**
 * Security Analytics Filter - فلتر التحليلات الأمنية
 */
export interface SecurityAnalyticsFilter {
  period?: AnalyticsPeriod;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

/**
 * Login Attempts Over Time - محاولات تسجيل الدخول عبر الوقت
 */
export interface LoginAttemptsOverTime {
  dates: string[];
  successCounts: number[];
  failedCounts: number[];
  totalAttempts: number;
  successRate: number;
}

/**
 * User Activity Trend - اتجاه نشاط المستخدم
 */
export interface UserActivityTrend {
  topUsers: Array<{ userId: string; activityCount: number }>;
  totalUsers: number;
  averageActivityPerUser: number;
}

/**
 * Geographic Login Distribution - التوزيع الجغرافي لتسجيلات الدخول
 */
export interface GeographicLoginDistribution {
  countries: Array<{ country: string; loginCount: number }>;
  totalLogins: number;
}

/**
 * Top Failed Logins - أعلى محاولات تسجيل دخول فاشلة
 */
export interface TopFailedLogins {
  topIPs: Array<{ ip: string; failedAttempts: number }>;
  totalFailedAttempts: number;
}

/**
 * Security Event Summary - ملخص الأحداث الأمنية
 */
export interface SecurityEventSummary {
  totalEvents: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  criticalEvents: number;
  resolvedEvents: number;
}

/**
 * Session Distribution - توزيع الجلسات
 */
export interface SessionDistribution {
  totalSessions: number;
  activeSessions: number;
  byDeviceType: Record<string, number>;
  averageSessionDuration: number; // minutes
}

/**
 * User Risk Score - درجة مخاطر المستخدم
 */
export interface UserRiskScore {
  userId: string;
  riskScore: number;
  factors: string[];
}

/**
 * Security Metric - مقياس أمني
 */
export interface SecurityMetric {
  name: string;
  value: number;
  unit: string;
  trend: "increasing" | "decreasing" | "stable";
}

/**
 * Security Analytics Report - تقرير تحليلات الأمان
 */
export interface SecurityAnalyticsReport {
  period: AnalyticsPeriod;
  startDate: Date;
  endDate: Date;
  loginAttempts: LoginAttemptsOverTime;
  userActivityTrend: UserActivityTrend;
  geographicDistribution: GeographicLoginDistribution;
  topFailedLogins: TopFailedLogins;
  eventSummary: SecurityEventSummary;
  sessionDistribution: SessionDistribution;
  riskScores: UserRiskScore[];
  generatedAt: Date;
}

/**
 * System Health Status - حالة صحة النظام
 */
export interface SystemHealthStatus {
  overall: "healthy" | "warning" | "error" | "critical";
  score: number; // 0-100
  components: {
    authentication: ComponentHealth;
    sessions: ComponentHealth;
    database: ComponentHealth;
    cache: ComponentHealth;
    api: ComponentHealth;
    websocket: ComponentHealth;
  };
  lastChecked: Date;
}

/**
 * Component Health - صحة المكون
 */
export interface ComponentHealth {
  status: "healthy" | "warning" | "error" | "critical";
  uptime: number; // in seconds
  responseTime: number; // in milliseconds
  errorRate: number; // percentage
  lastError?: string;
  lastErrorAt?: Date;
}

/**
 * Real-time Security Metrics - مقاييس الأمان في الوقت الفعلي
 */
export interface RealTimeSecurityMetrics {
  timestamp: Date;
  activeSessions: number;
  activeSessionsChange: number;
  loginsLastMinute: number;
  failedLoginsLastMinute: number;
  loginSuccessRate: number;
  eventsLastMinute: number;
  criticalEventsLastMinute: number;
  rateLimitHitsLastMinute: number;
  rateLimitBlocksLastMinute: number;
  requestsLastMinute: number;
  averageResponseTime: number; // in milliseconds
  errorRate: number; // percentage
}

/**
 * Alert Threshold - عتبة التنبيه
 */
export interface AlertThreshold {
  id: string;
  name: string;
  metric: string;
  operator: "gt" | "lt" | "eq" | "gte" | "lte";
  value: number;
  severity: SecurityEventSeverity;
  enabled: boolean;
  notifyChannels: ("email" | "sms" | "webhook" | "slack")[];
  webhookUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Monitoring Dashboard Config - إعدادات لوحة المراقبة
 */
export interface MonitoringDashboardConfig {
  refreshInterval: number; // in seconds
  metricsToShow: string[];
  chartsToShow: string[];
  alertsToShow: string[];
  autoRefresh: boolean;
  darkMode: boolean;
}
