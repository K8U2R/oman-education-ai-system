/**
 * Common Types - أنواع مشتركة
 *
 * أنواع مشتركة تستخدم في جميع أنحاء المشروع لتقليل التكرار
 */

/**
 * نوع للبيانات العامة (Generic Data)
 */
export type GenericData = Record<string, unknown>

/**
 * نوع للبيانات القابلة للتحويل إلى JSON
 */
export type JsonSerializable =
  | string
  | number
  | boolean
  | null
  | JsonSerializable[]
  | { [key: string]: JsonSerializable }

/**
 * نوع للـ Metadata في Audit Logs
 */
export type AuditMetadata = Record<string, JsonSerializable>

/**
 * نوع للـ Conditions في Queries
 */
export type QueryConditions = Record<string, unknown>

/**
 * نوع للـ Payload في Operations
 */
export type OperationPayload = Record<string, unknown>

/**
 * نوع للـ Parameters في Database Operations
 */
export type DatabaseParams = Record<string, unknown>

/**
 * نوع للـ Result من Database Operations
 */
export type DatabaseResult<T = unknown> = T | T[] | null

/**
 * نوع للـ Error Details
 */
export interface ErrorDetails {
  message: string
  code?: string
  details?: Record<string, unknown>
}

/**
 * نوع للـ Pagination Options
 */
export interface PaginationOptions {
  limit?: number
  offset?: number
  page?: number
  pageSize?: number
}

/**
 * نوع للـ Sort Options
 */
export interface SortOptions {
  column: string
  direction: 'asc' | 'desc'
}

/**
 * نوع للـ Filter Options
 */
export interface FilterOptions {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'notIn'
  value: unknown
}
