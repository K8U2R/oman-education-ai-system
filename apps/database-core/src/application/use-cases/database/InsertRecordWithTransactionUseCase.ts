/**
 * InsertRecordWithTransactionUseCase - Use Case لإدراج سجل مع معاملة
 *
 * Use Case لإدراج سجل جديد في قاعدة البيانات مع دعم المعاملات
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

export interface InsertRecordWithTransactionParams {
  entity: string
  data: Record<string, unknown>
  actor: Actor | string
  transactionId?: string // معاملة موجودة
  autoCommit?: boolean // تأكيد تلقائي بعد النجاح
}

/**
 * Use Case لإدراج سجل مع دعم المعاملات
 */
export class InsertRecordWithTransactionUseCase {
  constructor(
    private readonly databaseAdapter: IDatabaseAdapter,
    private readonly policyEngine: IPolicyEngine,
    private readonly auditLogger: IAuditLogger,
    private readonly transactionManager: ITransactionManager | null
  ) { }

  /**
   * تنفيذ إدراج سجل مع معاملة
   */
  async execute<T = unknown>(params: InsertRecordWithTransactionParams): Promise<QueryResult<T>> {
    const startTime = Date.now()
    const actor = params.actor instanceof Actor ? params.actor : new Actor(params.actor)
    const actorId = actor.getId()

    let transactionId: string | undefined = params.transactionId
    const shouldCommit = params.autoCommit !== false // افتراضي: true

    try {
      // 1. التحقق من البيانات
      if (!params.data || Object.keys(params.data).length === 0) {
        throw new ValidationException('البيانات مطلوبة لعملية الإدراج', [
          { field: 'data', message: 'البيانات مطلوبة' },
        ])
      }

      // 2. بدء معاملة جديدة إذا لم تكن موجودة
      if (!transactionId && this.transactionManager) {
        transactionId = await this.transactionManager.beginTransaction()
        logger.debug('Transaction started for insert operation', { transactionId })
      }

      // 3. التحقق من 
      const hasPermission = await this.policyEngine.checkPermission({
        actor: actorId,
        operation: OperationType.INSERT,
        entity: params.entity,
      })

      if (!hasPermission) {
        if (transactionId && this.transactionManager) {
          await this.transactionManager.rollbackTransaction(transactionId)
        }
        throw new PermissionDeniedException(actorId, OperationType.INSERT, params.entity)
      }

      // 4. تنفيذ الإدراج
      // Note: في التطبيق الحقيقي، يجب تمرير transactionId إلى adapter
      // حالياً، نستخدم الطريقة العادية لأن Adapters تحتاج دعم transactions
      const result = await this.databaseAdapter.insert<T>(params.entity, params.data)

      const executionTime = Date.now() - startTime

      // 5. تسجيل العملية
      await this.auditLogger.log({
        actor: actorId,
        action: OperationType.INSERT,
        entity: params.entity,
        conditions: {},
        after: params.data,
        success: true,
        executionTime,
      })

      // 6. تأكيد المعاملة إذا كان autoCommit = true
      if (transactionId && shouldCommit && this.transactionManager) {
        await this.transactionManager.commitTransaction(transactionId)
        logger.debug('Transaction committed after insert', { transactionId })
      }

      // 7. إرجاع النتيجة
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
        action: OperationType.INSERT,
        entity: params.entity,
        conditions: {},
        after: params.data,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
      })

      if (error instanceof PermissionDeniedException || error instanceof ValidationException) {
        throw error
      }

      logger.error('InsertRecordWithTransactionUseCase failed', {
        entity: params.entity,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      throw new QueryException(
        `فشل إدراج السجل في ${params.entity}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        undefined,
        { entity: params.entity, data: params.data }
      )
    }
  }
}
