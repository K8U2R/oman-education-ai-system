import winston from 'winston'
import { createAuditLog } from '../../domain/entities/AuditLog'
import { IAuditLogger, type AuditLogParams } from '../../domain/interfaces/IAuditLogger'
import { OperationType } from '../../domain/value-objects/OperationType'
import { Actor } from '../../domain/value-objects/Actor'
import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { AuditDatabaseRepository } from './AuditDatabaseRepository'
import type { AuditMetadata } from '../../shared/types'

/**
 * AuditLogger - مسجل سجلات التدقيق
 *
 * يسجل جميع العمليات على قاعدة البيانات
 * يطبق IAuditLogger من Domain Layer
 */
export class AuditLogger implements IAuditLogger {
  private logger: winston.Logger
  private auditRepository: AuditDatabaseRepository | null = null
  private auditLogs: Array<{
    id: string
    actor: string
    action: string
    entity: string
    timestamp: Date
    success: boolean
  }> = []
  private saveToDatabase: boolean = false

  constructor(databaseAdapter?: IDatabaseAdapter) {
    // إنشاء AuditDatabaseRepository إذا كان هناك DatabaseAdapter
    if (databaseAdapter) {
      this.auditRepository = new AuditDatabaseRepository(databaseAdapter)
      this.saveToDatabase = true
    }
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.File({
          filename: 'audit.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
    })
  }

  /**
   * تسجيل إجراء على قاعدة البيانات
   */
  async log(params: AuditLogParams): Promise<void> {
    const actorId =
      typeof params.actor === 'string' || params.actor instanceof Actor
        ? params.actor instanceof Actor
          ? params.actor.getId()
          : params.actor
        : 'unknown'

    const action =
      typeof params.action === 'string'
        ? params.action
        : typeof params.action === 'object' && params.action !== null
          ? String(params.action)
          : 'unknown'

    const auditLog = createAuditLog({
      actor: actorId,
      action,
      entity: params.entity,
      conditions: params.conditions,
      before: params.before as AuditMetadata | undefined,
      after: params.after as AuditMetadata | undefined,
      success: params.success ?? true,
      error: params.error,
    })

    // تسجيل في ملف
    this.logger.info('Database operation', {
      id: auditLog.id,
      actor: auditLog.actor,
      action: auditLog.action,
      entity: auditLog.entity,
      conditions: auditLog.conditions,
      before: auditLog.before,
      after: auditLog.after,
      timestamp: auditLog.timestamp.toISOString(),
      success: auditLog.success,
      error: auditLog.error,
      executionTime: params.executionTime,
    })

    // حفظ في الذاكرة (للاستعلام)
    this.auditLogs.push({
      id: auditLog.id || `audit-${Date.now()}-${Math.random()}`,
      actor: actorId,
      action,
      entity: params.entity,
      timestamp: auditLog.timestamp,
      success: auditLog.success ?? true,
    })

    // حفظ في قاعدة البيانات إذا كان AuditRepository متاحاً
    if (this.auditRepository && this.saveToDatabase) {
      try {
        await this.auditRepository.save({
          id: auditLog.id || `audit-${Date.now()}-${Math.random()}`,
          actor: actorId,
          action,
          entity: params.entity,
          conditions: params.conditions as Record<string, unknown> | undefined,
          before: params.before as Record<string, unknown> | undefined,
          after: params.after as Record<string, unknown> | undefined,
          success: auditLog.success ?? true,
          error: params.error,
          execution_time: params.executionTime,
          timestamp: auditLog.timestamp,
        })
        this.logger.debug('Audit log saved to database', { id: auditLog.id })
      } catch (error) {
        // لا نرمي خطأ - نكتفي بتسجيله لأن Audit Logging يجب ألا يعطل العملية الرئيسية
        this.logger.warn('Failed to save audit log to database', {
          error: error instanceof Error ? error.message : String(error),
          auditLogId: auditLog.id,
        })
      }
    }
  }

  /**
   * الحصول على سجلات التدقيق
   */
  async getLogs(params: {
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
  > {
    let filtered = this.auditLogs

    // تصفية حسب actor
    if (params.actor) {
      filtered = filtered.filter(log => log.actor === params.actor)
    }

    // تصفية حسب entity
    if (params.entity) {
      filtered = filtered.filter(log => log.entity === params.entity)
    }

    // تصفية حسب action
    if (params.action) {
      const actionStr = typeof params.action === 'string' ? params.action : params.action
      filtered = filtered.filter(log => log.action === actionStr)
    }

    // تصفية حسب startDate
    if (params.startDate) {
      filtered = filtered.filter(log => log.timestamp >= params.startDate!)
    }

    // تصفية حسب endDate
    if (params.endDate) {
      filtered = filtered.filter(log => log.timestamp <= params.endDate!)
    }

    // تصفية حسب success
    if (params.success !== undefined) {
      filtered = filtered.filter(log => log.success === params.success)
    }

    // ترتيب حسب التاريخ (الأحدث أولاً)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // تطبيق pagination
    const offset = params.offset || 0
    const limit = params.limit || 100

    return filtered.slice(offset, offset + limit)
  }

  /**
   * الحصول على Logger (legacy method)
   */
  getLogger(): winston.Logger {
    return this.logger
  }
}
