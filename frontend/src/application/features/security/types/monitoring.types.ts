/**
 * Security Monitoring Types - أنواع مراقبة الأمان
 *
 * مخصص للمطورين لمراقبة النظام في الوقت الفعلي
 */

/**
 * System Health Status - حالة صحة النظام
 */
export interface SystemHealthStatus {
  overall: 'healthy' | 'warning' | 'error' | 'critical'
  score: number // 0-100
  components: {
    authentication: ComponentHealth
    sessions: ComponentHealth
    database: ComponentHealth
    cache: ComponentHealth
    api: ComponentHealth
    websocket: ComponentHealth
  }
  lastChecked: string
}

/**
 * Component Health - صحة المكون
 */
export interface ComponentHealth {
  status: 'healthy' | 'warning' | 'error' | 'critical'
  uptime: number // in seconds
  responseTime: number // in milliseconds
  errorRate: number // percentage
  lastError?: string
  lastErrorAt?: string
}

/**
 * Real-time Security Metrics - مقاييس الأمان في الوقت الفعلي
 */
export interface RealTimeSecurityMetrics {
  timestamp: string

  // Active Sessions
  activeSessions: number
  activeSessionsChange: number // change from last minute

  // Authentication
  loginsLastMinute: number
  failedLoginsLastMinute: number
  loginSuccessRate: number

  // Security Events
  eventsLastMinute: number
  criticalEventsLastMinute: number

  // Rate Limiting
  rateLimitHitsLastMinute: number
  rateLimitBlocksLastMinute: number

  // Network
  requestsLastMinute: number
  averageResponseTime: number // in milliseconds
  errorRate: number // percentage
}

/**
 * Alert Threshold - عتبة التنبيه
 */
export interface AlertThreshold {
  id: string
  name: string
  metric: string
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
  value: number
  severity: 'info' | 'warning' | 'error' | 'critical'
  enabled: boolean
  notifyChannels: ('email' | 'sms' | 'webhook' | 'slack')[]
  webhookUrl?: string
  createdAt: string
  updatedAt: string
}

/**
 * Monitoring Dashboard Config - إعدادات لوحة المراقبة
 */
export interface MonitoringDashboardConfig {
  refreshInterval: number // in seconds
  metricsToShow: string[]
  chartsToShow: string[]
  alertsToShow: string[]
  autoRefresh: boolean
  darkMode: boolean
}
