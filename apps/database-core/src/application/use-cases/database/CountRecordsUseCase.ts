/**
 * CountRecordsUseCase - Use Case لعد السجلات
 *
 * Use Case لعد السجلات المطابقة لشروط معينة في قاعدة البيانات
 */

import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import { IPolicyEngine } from '../../../domain/interfaces/IPolicyEngine'
import { IAuditLogger } from '../../../domain/interfaces/IAuditLogger'
import { OperationType } from '../../../domain/value-objects/OperationType'
import { Actor } from '../../../domain/value-objects/Actor'
import { QueryResult } from '../../../domain/entities/QueryResult'
import { PermissionDeniedException, QueryException } from '../../../domain/exceptions'
import { logger } from '../../../shared/utils/logger'

export interface CountRecordsParams {
  entity: string
  conditions?: Record<string, unknown>
  actor: Actor | string
}

export class CountRecordsUseCase {
  constructor(
    private readonly databaseAdapter: IDatabaseAdapter,
    private readonly policyEngine: IPolicyEngine,
    private readonly auditLogger: IAuditLogger
  ) { }

  /**
   * تنفيذ عد السجلات
   */
  async execute(params: CountRecordsParams): Promise<QueryResult<number>> {
    const startTime = Date.now()
    const actor = params.actor instanceof Actor ? params.actor : new Actor(params.actor)
    const actorId = actor.getId()

    try {
      // 1. التحقق من  (COUNT يعتبر عملية FIND)
      const hasPermission = await this.policyEngine.checkPermission({
        actor: actorId,
        operation: OperationType.FIND,
        entity: params.entity,
        conditions: params.conditions,
      })

      if (!hasPermission) {
        throw new PermissionDeniedException(actorId, OperationType.FIND, params.entity)
      }

      // 2. تنفيذ العد باستخدام طريقة count المباشرة
      const count = await this.databaseAdapter.count(params.entity, params.conditions || {})
      const executionTime = Date.now() - startTime

      // 3. تسجيل العملية
      await this.auditLogger.log({
        actor: actorId,
        action: OperationType.COUNT,
        entity: params.entity,
        conditions: params.conditions || {},
        success: true,
        executionTime,
      })

      // 4. إرجاع النتيجة
      return new QueryResult<number>({
        data: count,
        count,
        metadata: {
          executionTime,
        },
      })
    } catch (error) {
      const executionTime = Date.now() - startTime

      // تسجيل الخطأ
      await this.auditLogger.log({
        actor: actorId,
        action: OperationType.COUNT,
        entity: params.entity,
        conditions: params.conditions || {},
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
      })

      if (error instanceof PermissionDeniedException) {
        throw error
      }

      logger.error('CountRecordsUseCase failed', {
        entity: params.entity,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      throw new QueryException(
        `فشل عد السجلات في ${params.entity}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        undefined,
        { entity: params.entity, conditions: params.conditions }
      )
    }
  }
}
