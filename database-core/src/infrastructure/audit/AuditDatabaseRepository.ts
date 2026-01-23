/**
 * AuditDatabaseRepository - مستودع قاعدة البيانات لسجلات التدقيق
 *
 * مستودع للوصول إلى سجلات التدقيق في قاعدة البيانات
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { logger } from '../../shared/utils/logger'

/**
 * Audit Log Entity في قاعدة البيانات
 */
export interface AuditLogEntity {
  id: string
  actor: string
  action: string
  entity: string
  conditions?: Record<string, unknown>
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  success: boolean
  error?: string
  execution_time?: number
  timestamp: Date | string
  created_at?: Date | string
}

/**
 * مستودع قاعدة البيانات لسجلات التدقيق
 */
export class AuditDatabaseRepository {
  private readonly entityName = 'audit_logs'

  constructor(private readonly adapter: IDatabaseAdapter) {}

  /**
   * حفظ سجل تدقيق في قاعدة البيانات
   */
  async save(auditLog: AuditLogEntity): Promise<AuditLogEntity> {
    try {
      const savedLog = await this.adapter.insert<AuditLogEntity>(this.entityName, {
        id: auditLog.id,
        actor: auditLog.actor,
        action: auditLog.action,
        entity: auditLog.entity,
        conditions: auditLog.conditions ? JSON.stringify(auditLog.conditions) : null,
        before_data: auditLog.before ? JSON.stringify(auditLog.before) : null,
        after_data: auditLog.after ? JSON.stringify(auditLog.after) : null,
        success: auditLog.success,
        error: auditLog.error || null,
        execution_time: auditLog.execution_time || null,
        timestamp:
          auditLog.timestamp instanceof Date
            ? auditLog.timestamp.toISOString()
            : auditLog.timestamp,
        created_at: new Date().toISOString(),
      })

      logger.debug('Audit log saved to database', { id: savedLog.id })
      return savedLog
    } catch (error) {
      logger.error('Failed to save audit log to database', {
        error: error instanceof Error ? error.message : String(error),
        auditLogId: auditLog.id,
      })
      // لا نرمي خطأ - نكتفي بتسجيله لأن Audit Logging يجب ألا يعطل العملية الرئيسية
      throw error
    }
  }

  /**
   * البحث عن سجلات التدقيق
   */
  async find(params: {
    actor?: string
    entity?: string
    action?: string
    startDate?: Date
    endDate?: Date
    success?: boolean
    limit?: number
    offset?: number
  }): Promise<AuditLogEntity[]> {
    try {
      const conditions: Record<string, unknown> = {}

      if (params.actor) {
        conditions.actor = params.actor
      }
      if (params.entity) {
        conditions.entity = params.entity
      }
      if (params.action) {
        conditions.action = params.action
      }
      if (params.success !== undefined) {
        conditions.success = params.success
      }

      // Note: Date filtering يجب أن يتم في Application Layer أو باستخدام executeRaw
      // لأن Adapters الحالية لا تدعم range queries بشكل مباشر

      const logs = await this.adapter.find<AuditLogEntity>(this.entityName, conditions, {
        limit: params.limit || 100,
        offset: params.offset || 0,
        orderBy: { column: 'timestamp', direction: 'desc' },
      })

      // Parse JSON fields
      return logs.map(log => ({
        ...log,
        conditions: log.conditions
          ? typeof log.conditions === 'string'
            ? JSON.parse(log.conditions)
            : log.conditions
          : undefined,
        before: log.before
          ? typeof log.before === 'string'
            ? JSON.parse(log.before)
            : log.before
          : undefined,
        after: log.after
          ? typeof log.after === 'string'
            ? JSON.parse(log.after)
            : log.after
          : undefined,
      }))
    } catch (error) {
      logger.error('Failed to find audit logs', {
        error: error instanceof Error ? error.message : String(error),
        params,
      })
      throw error
    }
  }

  /**
   * عد سجلات التدقيق
   */
  async count(params: {
    actor?: string
    entity?: string
    action?: string
    success?: boolean
  }): Promise<number> {
    try {
      const conditions: Record<string, unknown> = {}

      if (params.actor) {
        conditions.actor = params.actor
      }
      if (params.entity) {
        conditions.entity = params.entity
      }
      if (params.action) {
        conditions.action = params.action
      }
      if (params.success !== undefined) {
        conditions.success = params.success
      }

      return await this.adapter.count(this.entityName, conditions)
    } catch (error) {
      logger.error('Failed to count audit logs', {
        error: error instanceof Error ? error.message : String(error),
        params,
      })
      throw error
    }
  }
}
