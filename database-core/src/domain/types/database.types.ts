/**
 * Database Types - أنواع قاعدة البيانات
 *
 * جميع الأنواع المستخدمة في قاعدة البيانات
 */

import { OperationType } from '../value-objects/OperationType'
import type { Actor } from '../value-objects/Actor'

/**
 * Database Operation Request
 */
export interface DatabaseOperationRequest {
  operation: OperationType
  entity: string
  conditions?: Record<string, unknown>
  payload?: Record<string, unknown>
  actor: string | Actor
  options?: {
    limit?: number
    offset?: number
    orderBy?: { column: string; direction: 'asc' | 'desc' }
  }
}

/**
 * Database Operation Response
 */
export interface DatabaseOperationResponse<T = unknown> {
  success: boolean
  data?: T | T[]
  error?: string
  metadata?: {
    executionTime?: number
    cached?: boolean
    count?: number
  }
}

/**
 * Query Conditions
 * Note: QueryCondition is exported from value-objects, not here
 */

/**
 * Database Adapter Options
 */
export interface DatabaseAdapterOptions {
  limit?: number
  offset?: number
  orderBy?: { column: string; direction: 'asc' | 'desc' }
}

/**
 * Database Connection Config (Legacy)
 * Note: Use DatabaseConnectionConfig from database-connection.types.ts instead
 */
export interface DatabaseConnectionConfigLegacy {
  url: string
  key: string
  timeout?: number
  poolSize?: number
}
