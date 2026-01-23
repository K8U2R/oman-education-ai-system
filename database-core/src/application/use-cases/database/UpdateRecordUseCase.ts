/**
 * UpdateRecordUseCase - Use Case لتحديث سجل
 *
 * Use Case لتحديث سجل موجود في قاعدة البيانات
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

export interface UpdateRecordParams {
  entity: string
  conditions: Record<string, unknown>
  data: Record<string, unknown>
  actor: Actor | string
}

export class UpdateRecordUseCase {
  constructor(
    private readonly databaseAdapter: IDatabaseAdapter,
    private readonly policyEngine: IPolicyEngine,
    private readonly auditLogger: IAuditLogger
  ) { }

  /**
   * تنفيذ تحديث سجل
   */
  async execute<T = unknown>(params: UpdateRecordParams): Promise<QueryResult<T>> {
    const startTime = Date.now()
    const actor = params.actor instanceof Actor ? params.actor : new Actor(params.actor)
    const actorId = actor.getId()

    try {
      // 1. التحقق من البيانات
      if (!params.data || Object.keys(params.data).length === 0) {
        throw new ValidationException('البيانات مطلوبة لعملية التحديث', [
          { field: 'data', message: 'البيانات مطلوبة' },
        ])
      }

      if (!params.conditions || Object.keys(params.conditions).length === 0) {
        throw new ValidationException('شروط البحث مطلوبة لعملية التحديث', [
          { field: 'conditions', message: 'شروط البحث مطلوبة' },
        ])
      }

      // 2. التحقق من 
      const hasPermission = await this.policyEngine.checkPermission({
        actor: actorId,
        operation: OperationType.UPDATE,
        entity: params.entity,
        conditions: params.conditions,
      })

      if (!hasPermission) {
        throw new PermissionDeniedException(actorId, OperationType.UPDATE, params.entity)
      }

      // 3. الحصول على البيانات قبل التحديث (للتسجيل)
      let beforeData: unknown = null
      try {
        beforeData = await this.databaseAdapter.findOne(params.entity, params.conditions)
      } catch (error) {
        logger.warn('Failed to fetch before data for audit', {
          entity: params.entity,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }

      // 4. تنفيذ التحديث
      const result = await this.databaseAdapter.update<T>(
        params.entity,
        params.conditions,
        params.data
      )

      const executionTime = Date.now() - startTime

      // 5. تسجيل العملية
      await this.auditLogger.log({
        actor: actorId,
        action: OperationType.UPDATE,
        entity: params.entity,
        conditions: params.conditions,
        before: beforeData,
        after: result,
        success: true,
        executionTime,
      })

      // 6. إرجاع النتيجة
      return new QueryResult<T>({
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
        action: OperationType.UPDATE,
        entity: params.entity,
        conditions: params.conditions,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
      })

      if (error instanceof PermissionDeniedException || error instanceof ValidationException) {
        throw error
      }

      logger.error('UpdateRecordUseCase failed', {
        entity: params.entity,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      throw new QueryException(
        `فشل تحديث السجل في ${params.entity}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        undefined,
        { entity: params.entity, conditions: params.conditions }
      )
    }
  }
}
