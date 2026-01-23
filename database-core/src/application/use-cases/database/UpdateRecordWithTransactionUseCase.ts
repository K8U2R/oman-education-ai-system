/**
 * UpdateRecordWithTransactionUseCase - Use Case لتحديث سجل مع معاملة
 *
 * Use Case لتحديث سجل في قاعدة البيانات مع دعم المعاملات
 */

import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import { IPolicyEngine } from '../../../domain/interfaces/IPolicyEngine'
import { IAuditLogger } from '../../../domain/interfaces/IAuditLogger'
import { ITransactionManager } from '../../../domain/interfaces/ITransactionManager'
import { OperationType } from '../../../domain/value-objects/OperationType'
import { Actor } from '../../../domain/value-objects/Actor'
import { QueryResult } from '../../../domain/entities/QueryResult'
import {
  PermissionDeniedException,
  QueryException,
  ValidationException,
} from '../../../domain/exceptions'
import { logger } from '../../../shared/utils/logger'

export interface UpdateRecordWithTransactionParams {
  entity: string
  conditions: Record<string, unknown>
  data: Record<string, unknown>
  actor: Actor | string
  transactionId?: string // معاملة موجودة
  autoCommit?: boolean // تأكيد تلقائي بعد النجاح
}

/**
 * Use Case لتحديث سجل مع دعم المعاملات
 */
export class UpdateRecordWithTransactionUseCase {
  constructor(
    private readonly databaseAdapter: IDatabaseAdapter,
    private readonly policyEngine: IPolicyEngine,
    private readonly auditLogger: IAuditLogger,
    private readonly transactionManager: ITransactionManager | null
  ) { }

  /**
   * تنفيذ تحديث سجل مع معاملة
   */
  async execute<T = unknown>(params: UpdateRecordWithTransactionParams): Promise<QueryResult<T>> {
    const startTime = Date.now()
    const actor = params.actor instanceof Actor ? params.actor : new Actor(params.actor)
    const actorId = actor.getId()

    let transactionId: string | undefined = params.transactionId
    let shouldCommit = false
    let beforeData: Record<string, unknown> | undefined

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

      // 2. بدء معاملة جديدة إذا لم تكن موجودة
      if (!transactionId && this.transactionManager) {
        transactionId = await this.transactionManager.beginTransaction()
        shouldCommit = params.autoCommit !== false // افتراضي: true
        logger.debug('Transaction started for update operation', { transactionId })
      }

      // 3. الحصول على البيانات قبل التحديث (للتسجيل)
      try {
        const existingRecord = await this.databaseAdapter.findOne(params.entity, params.conditions)
        beforeData = existingRecord as Record<string, unknown> | undefined
      } catch (error) {
        logger.warn('Failed to fetch before data for audit', {
          error: error instanceof Error ? error.message : String(error),
        })
      }

      // 4. التحقق من 
      const hasPermission = await this.policyEngine.checkPermission({
        actor: actorId,
        operation: OperationType.UPDATE,
        entity: params.entity,
        conditions: params.conditions,
      })

      if (!hasPermission) {
        if (transactionId && this.transactionManager) {
          await this.transactionManager.rollbackTransaction(transactionId)
        }
        throw new PermissionDeniedException(actorId, OperationType.UPDATE, params.entity)
      }

      // 5. تنفيذ التحديث
      const result = await this.databaseAdapter.update<T>(
        params.entity,
        params.conditions,
        params.data
      )

      const executionTime = Date.now() - startTime

      // 6. تسجيل العملية
      await this.auditLogger.log({
        actor: actorId,
        action: OperationType.UPDATE,
        entity: params.entity,
        conditions: params.conditions,
        before: beforeData,
        after: params.data,
        success: true,
        executionTime,
      })

      // 7. تأكيد المعاملة إذا كان autoCommit = true
      if (transactionId && shouldCommit && this.transactionManager) {
        await this.transactionManager.commitTransaction(transactionId)
        logger.debug('Transaction committed after update', { transactionId })
      }

      // 8. إرجاع النتيجة
      return new QueryResult<T>({
        data: result,
        metadata: {
          executionTime,
        },
      })
    } catch (error) {
      const executionTime = Date.now() - startTime

      // إلغاء المعاملة في حالة الخطأ
      if (transactionId && this.transactionManager) {
        try {
          await this.transactionManager.rollbackTransaction(transactionId)
          logger.debug('Transaction rolled back due to error', { transactionId })
        } catch (rollbackError) {
          logger.error('Failed to rollback transaction', {
            transactionId,
            error: rollbackError instanceof Error ? rollbackError.message : String(rollbackError),
          })
        }
      }

      // تسجيل الخطأ
      await this.auditLogger.log({
        actor: actorId,
        action: OperationType.UPDATE,
        entity: params.entity,
        conditions: params.conditions,
        before: beforeData,
        after: params.data,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
      })

      if (error instanceof PermissionDeniedException || error instanceof ValidationException) {
        throw error
      }

      logger.error('UpdateRecordWithTransactionUseCase failed', {
        entity: params.entity,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      throw new QueryException(
        `فشل تحديث السجل في ${params.entity}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        undefined,
        { entity: params.entity, conditions: params.conditions, data: params.data }
      )
    }
  }
}
