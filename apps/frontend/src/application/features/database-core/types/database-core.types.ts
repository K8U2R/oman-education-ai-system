/**
 * Database Core Types - أنواع عامة
 *
 * أنواع TypeScript المشتركة لـ database-core feature
 */

/**
 * Health Status
 */
export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error'
  service: string
  timestamp: string
  database: 'connected' | 'disconnected'
  uptime?: {
    seconds: number
    formatted: string
  }
}

/**
 * API Response Base
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    details?: unknown
  }
  timestamp?: string
}

/**
 * Pagination
 */
export interface Pagination {
  page: number
  perPage: number
  total: number
  totalPages: number
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination
}

/**
 * Loading State
 */
export interface LoadingState {
  loading: boolean
  error: Error | null
}

/**
 * Real-time Update Options
 */
export interface RealTimeUpdateOptions {
  endpoint: string
  interval?: number
  enabled?: boolean
  onUpdate?: (data: unknown) => void
  onError?: (error: Error) => void
}

/**
 * Filter Configuration
 */
export interface FilterConfig<T> {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number' | 'boolean'
  options?: { label: string; value: unknown }[]
  predicate: (item: T, value: unknown) => boolean
}

/**
 * Sorting Configuration
 */
export interface SortingConfig {
  column: string
  direction: 'asc' | 'desc'
}

/**
 * Time Window
 */
export type TimeWindow = '1h' | '24h' | '7d' | '30d' | 'custom'

/**
 * Period
 */
export type Period = 'hourly' | 'daily' | 'weekly' | 'monthly'
