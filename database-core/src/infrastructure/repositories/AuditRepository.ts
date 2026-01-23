/**
 * AuditRepository - مستودع سجلات التدقيق
 *
 * مستودع للوصول إلى سجلات التدقيق
 */

import { IAuditLogger } from '../../domain/interfaces/IAuditLogger'
import { AuditLogEntry, AuditLogQueryParams } from '../../domain/types/audit.types'
import { OperationType } from '../../domain/value-objects/OperationType'

export class AuditRepository {
  constructor(private readonly auditLogger: IAuditLogger) {}

  /**
   * الحصول على سجلات التدقيق
   */
  async getLogs(params: AuditLogQueryParams): Promise<AuditLogEntry[]> {
    const logs = await this.auditLogger.getLogs(params)

    return logs.map(log => ({
      id: log.id,
      actor: log.actor,
      action: log.action,
      entity: log.entity,
      conditions: {},
      timestamp: log.timestamp,
      success: log.success,
      executionTime: undefined,
    }))
  }

  /**
   * الحصول على سجلات التدقيق لـ actor معين
   */
  async getLogsByActor(actor: string, limit?: number): Promise<AuditLogEntry[]> {
    return this.getLogs({ actor, limit })
  }

  /**
   * الحصول على سجلات التدقيق لـ entity معين
   */
  async getLogsByEntity(entity: string, limit?: number): Promise<AuditLogEntry[]> {
    return this.getLogs({ entity, limit })
  }

  /**
   * الحصول على سجلات التدقيق لـ action معين
   */
  async getLogsByAction(action: OperationType | string, limit?: number): Promise<AuditLogEntry[]> {
    return this.getLogs({ action, limit })
  }

  /**
   * الحصول على سجلات التدقيق في فترة زمنية
   */
  async getLogsByDateRange(
    startDate: Date,
    endDate: Date,
    limit?: number
  ): Promise<AuditLogEntry[]> {
    return this.getLogs({ startDate, endDate, limit })
  }

  /**
   * الحصول على سجلات التدقيق الناجحة فقط
   */
  async getSuccessfulLogs(limit?: number): Promise<AuditLogEntry[]> {
    return this.getLogs({ success: true, limit })
  }

  /**
   * الحصول على سجلات التدقيق الفاشلة فقط
   */
  async getFailedLogs(limit?: number): Promise<AuditLogEntry[]> {
    return this.getLogs({ success: false, limit })
  }
}
