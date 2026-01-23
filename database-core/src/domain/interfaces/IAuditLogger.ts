/**
 * IAuditLogger - واجهة مسجل سجلات التدقيق
 *
 * واجهة مسجل سجلات التدقيق
 */

import { OperationType } from '../value-objects/OperationType'
import { Actor } from '../value-objects/Actor'

export interface AuditLogParams {
  actor: string | Actor
  action: OperationType | string
  entity: string
  conditions: Record<string, unknown>
  before?: unknown
  after?: unknown
  success?: boolean
  error?: string
  executionTime?: number
  ipAddress?: string
  userAgent?: string
}

export interface IAuditLogger {
  /**
   * تسجيل عملية
   */
  log(params: AuditLogParams): Promise<void>

  /**
   * الحصول على سجلات التدقيق
   */
  getLogs(params: {
    actor?: string
    entity?: string
    action?: OperationType | string
    startDate?: Date
    endDate?: Date
    success?: boolean
    limit?: number
    offset?: number
  }): Promise<
    Array<{
      id: string
      actor: string
      action: string
      entity: string
      timestamp: Date
      success: boolean
    }>
  >
}
