/**
 * DeleteRecordUseCase - Use Case لحذف سجل
 *
 * Use Case لحذف سجل من قاعدة البيانات
 */

import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import { IPolicyEngine } from '../../../domain/interfaces/IPolicyEngine'
import { IAuditLogger } from '../../../domain/interfaces/IAuditLogger'
import { OperationType } from '../../../domain/value-objects/OperationType'
import { Actor } from '../../../domain/value-objects/Actor'
import { QueryResult } from '../../../domain/entities/QueryResult'
import {
  PermissionDeniedException,
  QueryException,
  ValidationException,
} from '../../../domain/exceptions'
import { logger } from '../../../shared/utils/logger'

export interface DeleteRecordParams {
  entity: string
  conditions: Record<string, unknown>
  actor: Actor | string
  soft?: boolean
}

export class DeleteRecordUseCase {
  constructor(
    private readonly databaseAdapter: IDatabaseAdapter,
    private readonly policyEngine: IPolicyEngine,
    private readonly auditLogger: IAuditLogger
  ) { }

  /**
   * تنفيذ حذف سجل
   */
  async execute(params: DeleteRecordParams): Promise<QueryResult<boolean>> {
    const startTime = Date.now()
    const actor = params.actor instanceof Actor ? params.actor : new Actor(params.actor)
    const actorId = actor.getId()

    try {
      // 1. التحقق من الشروط
      if (!params.conditions || Object.keys(params.conditions).length === 0) {
        throw new ValidationException('شروط البحث مطلوبة لعملية الحذف', [
          { field: 'conditions', message: 'شروط البحث مطلوبة' },
        ])
      }

      // 2. التحقق من 
      const hasPermission = await this.policyEngine.checkPermission({
        actor: actorId,
        operation: OperationType.DELETE,
        entity: params.entity,
        conditions: params.conditions,
      })

      if (!hasPermission) {
        throw new PermissionDeniedException(actorId, OperationType.DELETE, params.entity)
      }

      // 3. الحصول على البيانات قبل الحذف (للتسجيل)
      let beforeData: unknown = null
      try {
        beforeData = await this.databaseAdapter.findOne(params.entity, params.conditions)
      } catch (error) {
        logger.warn('Failed to fetch before data for audit', {
          entity: params.entity,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }

      // 4. تنفيذ الحذف
      const result = await this.databaseAdapter.delete(
        params.entity,
        params.conditions,
        params.soft ?? false
      )

      const executionTime = Date.now() - startTime

      // 5. تسجيل العملية
      // Note: result هو boolean - true إذا تم الحذف بنجاح، false إذا لم يتم العثور على السجل
      // لكن في audit log، نعتبر العملية ناجحة إذا لم يحدث خطأ
      await this.auditLogger.log({
        actor: actorId,
        action: OperationType.DELETE,
        entity: params.entity,
        conditions: params.conditions,
        before: beforeData,
        success: true, // العملية ناجحة إذا لم يحدث exception
        executionTime,
      })

      // 6. إرجاع النتيجة
      return new QueryResult<boolean>({
        data: result,
        metadata: {
          executionTime,
        },
      })
    } catch (error) {
      const executionTime = Date.now() - startTime

      // تسجيل الخطأ
      await this.auditLogger.log({
        actor: actorId,
        action: OperationType.DELETE,
        entity: params.entity,
        conditions: params.conditions,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
      })

      if (error instanceof PermissionDeniedException || error instanceof ValidationException) {
        throw error
      }

      logger.error('DeleteRecordUseCase failed', {
        entity: params.entity,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      throw new QueryException(
        `فشل حذف السجل من ${params.entity}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        undefined,
        { entity: params.entity, conditions: params.conditions }
      )
    }
  }
}
