/**
 * Developer Types - أنواع المطور
 *
 * @description أنواع TypeScript الخاصة بميزة المطور
 * تجميع جميع الأنواع من Domain و Service
 */

// Re-export from Domain
import type {
  DeveloperStats,
  APIEndpointInfo,
  ServiceInfo,
  PerformanceMetric,
  DeveloperLog,
} from '@/domain/types/developer.types'

export type { DeveloperStats, APIEndpointInfo, ServiceInfo, PerformanceMetric, DeveloperLog }

// Application-specific Types

/**
 * حالة تحميل المطور
 */
export type DeveloperLoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * حالة البناء
 */
export type BuildStatus = 'success' | 'failed' | 'pending'

/**
 * حالة الخدمة
 */
export type ServiceStatus = 'healthy' | 'unhealthy' | 'unknown'

/**
 * مستوى السجل
 */
export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

/**
 * إحصائيات شاملة للمطور
 */
export interface DeveloperDashboardStats {
  stats: DeveloperStats
  endpoints: APIEndpointInfo[]
  services: ServiceInfo[]
  performance: PerformanceMetric[]
}

/**
 * خيارات تصفية السجلات
 */
export interface FilterLogsOptions {
  level?: LogLevel
  service?: string
  endpoint?: string
  startDate?: Date
  endDate?: Date
  page?: number
  perPage?: number
}

/**
 * خطأ المطور
 */
export interface DeveloperError {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}
