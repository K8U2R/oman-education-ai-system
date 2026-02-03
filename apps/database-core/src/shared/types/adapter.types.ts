/**
 * Adapter Types - أنواع Adapters
 *
 * أنواع مشتركة لجميع Database Adapters
 */

import type { DatabaseResult, GenericData, QueryConditions, OperationPayload } from './common.types'

/**
 * نوع للـ Find Options
 */
export interface FindOptions {
  conditions?: QueryConditions
  limit?: number
  offset?: number
  orderBy?: Array<{ column: string; direction: 'asc' | 'desc' }>
  select?: string[]
}

/**
 * نوع للـ Update Options
 */
export interface UpdateOptions {
  conditions: QueryConditions
  data: OperationPayload
  returning?: string[]
}

/**
 * نوع للـ Delete Options
 */
export interface DeleteOptions {
  conditions: QueryConditions
  returning?: string[]
}

/**
 * نوع للـ Insert Options
 */
export interface InsertOptions {
  data: OperationPayload | OperationPayload[]
  returning?: string[]
}

/**
 * نوع للـ Count Options
 */
export interface CountOptions {
  conditions?: QueryConditions
  distinct?: string[]
}

/**
 * نوع للـ Execute Raw Options
 */
export interface ExecuteRawOptions {
  query: string
  params?: GenericData
}

/**
 * نوع للـ Result من Find Operations
 */
export type FindResult<T = unknown> = DatabaseResult<T>

/**
 * نوع للـ Result من Insert Operations
 */
export interface InsertResult {
  id?: string | number
  rows?: unknown[]
  count?: number
}

/**
 * نوع للـ Result من Update Operations
 */
export interface UpdateResult {
  count: number
  rows?: unknown[]
}

/**
 * نوع للـ Result من Delete Operations
 */
export interface DeleteResult {
  count: number
  rows?: unknown[]
}
