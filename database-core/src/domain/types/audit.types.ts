/**
 * Audit Types - أنواع التدقيق
 *
 * جميع الأنواع المستخدمة في نظام التدقيق
 */

import { OperationType } from '../value-objects/OperationType'

/**
 * Audit Log Entry
 */
export interface AuditLogEntry {
  id: string
  actor: string
  action: OperationType | string
  entity: string
  conditions: Record<string, unknown>
  before?: unknown
  after?: unknown
  timestamp: Date
  success: boolean
  error?: string
  executionTime?: number
  ipAddress?: string
  userAgent?: string
}

/**
 * Audit Log Query Parameters
 */
export interface AuditLogQueryParams {
  actor?: string
  entity?: string
  action?: OperationType | string
  startDate?: Date
  endDate?: Date
  success?: boolean
  limit?: number
  offset?: number
}
