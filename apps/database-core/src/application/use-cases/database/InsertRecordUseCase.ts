/**
 * InsertRecordUseCase - Use Case لإدراج سجل جديد
 *
 * Use Case لإدراج سجل جديد في قاعدة البيانات
 */

import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import { IPolicyEngine } from '../../../domain/interfaces/IPolicyEngine'
import { IAuditLogger } from '../../../domain/interfaces/IAuditLogger'
import { OperationType } from '@/domain/value-objects/OperationType'
import { Actor } from '@/domain/value-objects/Actor'
import { QueryResult } from '@/domain/entities/QueryResult'
import { PermissionDeniedException, QueryException, ValidationException } from '@/domain/exceptions'
import { logger } from '@/shared/utils/logger'

export interface InsertRecordParams {
  entity: string
  data: Record<string, unknown>
  actor: Actor | string
}

export class InsertRecordUseCase {
  constructor(
    private readonly databaseAdapter: IDatabaseAdapter,
    private readonly policyEngine: IPolicyEngine,
    private readonly auditLogger: IAuditLogger
  ) { }

  /**
   * تنفيذ إدراج سجل جديد
   */
  async execute<T = unknown>(params: InsertRecordParams): Promise<QueryResult<T>> {
    const startTime = Date.now()
    const actor = params.actor instanceof Actor ? params.actor : new Actor(params.actor)

    try {
      // 1. التحقق من البيانات
      if (!params.data || Object.keys(params.data).length === 0) {
        throw new ValidationException('البيانات مطلوبة لعملية الإدراج', [
          { field: 'data', message: 'البيانات مطلوبة' },
        ])
      }

      // 2. التحقق من 
      const hasPermission = await this.policyEngine.checkPermission({
        actor,
        operation: OperationType.INSERT,
        entity: params.entity,
      })

      if (!hasPermission) {
        throw new PermissionDeniedException(actor.getId(), OperationType.INSERT, params.entity)
      }

      // 3. تنفيذ الإدراج
      const result = await this.databaseAdapter.insert<T>(params.entity, params.data)

      const executionTime = Date.now() - startTime

      // 4. تسجيل العملية
      await this.auditLogger.log({
        actor: actor.getId(),
        action: OperationType.INSERT,
        entity: params.entity,
        conditions: {},
        after: result,
        success: true,
        executionTime,
      })

      // 5. إرجاع النتيجة
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
        actor: actor.getId(),
        action: OperationType.INSERT,
        entity: params.entity,
        conditions: {},
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
      })

      if (error instanceof PermissionDeniedException || error instanceof ValidationException) {
        throw error
      }

      logger.error('InsertRecordUseCase failed', {
        entity: params.entity,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      throw new QueryException(
        `فشل إدراج السجل في ${params.entity}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        undefined,
        { entity: params.entity }
      )
    }
  }
}
