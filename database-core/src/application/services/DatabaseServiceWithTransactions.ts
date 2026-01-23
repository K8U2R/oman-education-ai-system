/**
 * DatabaseServiceWithTransactions - خدمة قاعدة البيانات مع دعم المعاملات
 *
 * خدمة متقدمة تجمع بين DatabaseCoreService و TransactionManager
 */

import { DatabaseCoreService, type ExecuteOperationParams } from './DatabaseCoreService'
import { IDatabaseRouter } from '../../domain/interfaces/IDatabaseRouter'
import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { IPolicyEngine } from '../../domain/interfaces/IPolicyEngine'
import { IAuditLogger } from '../../domain/interfaces/IAuditLogger'
import {
  ITransactionManager,
  TransactionOptions,
} from '../../domain/interfaces/ITransactionManager'
import { DatabaseResponse } from '../dto/DatabaseResponse.dto'
import { logger } from '../../shared/utils/logger'

/**
 * خيارات تنفيذ العملية مع معاملة
 */
export interface ExecuteWithTransactionParams extends ExecuteOperationParams {
  transactionId?: string // إذا كان موجوداً، سيتم استخدام معاملة موجودة
  transactionOptions?: TransactionOptions // خيارات المعاملة الجديدة
  autoCommit?: boolean // تأكيد تلقائي بعد النجاح (افتراضي: true)
}

/**
 * خدمة قاعدة البيانات مع دعم المعاملات
 */
export class DatabaseServiceWithTransactions extends DatabaseCoreService {
  private readonly transactionManager: ITransactionManager | null

  constructor(
    adapterOrRouter: IDatabaseAdapter | IDatabaseRouter,
    policyEngine: IPolicyEngine,
    auditLogger: IAuditLogger,
    transactionManager: ITransactionManager | null = null
  ) {
    super(adapterOrRouter, policyEngine, auditLogger)
    this.transactionManager = transactionManager
  }

  /**
   * تنفيذ عملية مع معاملة
   */
  async executeWithTransaction<T = unknown>(
    params: ExecuteWithTransactionParams
  ): Promise<DatabaseResponse<T>> {
    const { transactionId, transactionOptions, autoCommit = true, ...operationParams } = params

    // إذا لم يكن هناك TransactionManager، استخدم الطريقة العادية
    if (!this.transactionManager) {
      logger.warn('TransactionManager not available, executing without transaction')
      return await this.executeOperation<T>(operationParams)
    }

    // استخدام معاملة موجودة أو إنشاء معاملة جديدة
    const activeTransactionId =
      transactionId || (await this.transactionManager.beginTransaction(transactionOptions))

    try {
      // تنفيذ العملية داخل المعاملة
      const result = await this.transactionManager.executeInTransaction(
        activeTransactionId,
        async () => {
          return await this.executeOperation<T>(operationParams)
        }
      )

      // تأكيد تلقائي إذا كان مفعّل
      if (autoCommit && !transactionId) {
        await this.transactionManager.commitTransaction(activeTransactionId)
      }

      return result
    } catch (error) {
      // إلغاء تلقائي في حالة الخطأ
      if (!transactionId) {
        try {
          await this.transactionManager.rollbackTransaction(activeTransactionId)
        } catch (rollbackError) {
          logger.error('Failed to rollback transaction', {
            transactionId: activeTransactionId,
            error: rollbackError instanceof Error ? rollbackError.message : String(rollbackError),
          })
        }
      }

      throw error
    }
  }

  /**
   * تنفيذ عدة عمليات داخل معاملة واحدة
   */
  async executeBatchWithTransaction<T = unknown>(
    operations: Array<ExecuteOperationParams>,
    transactionOptions?: TransactionOptions,
    autoCommit: boolean = true
  ): Promise<DatabaseResponse<T>[]> {
    if (!this.transactionManager) {
      logger.warn('TransactionManager not available, executing without transaction')
      const results: DatabaseResponse<T>[] = []
      for (const operation of operations) {
        const result = await this.executeOperation<T>(operation)
        results.push(result)
      }
      return results
    }

    const transactionId = await this.transactionManager.beginTransaction(transactionOptions)

    try {
      const results: DatabaseResponse<T>[] = []

      // تنفيذ جميع العمليات في المعاملة
      for (const operation of operations) {
        const result = await this.executeWithTransaction<T>({
          ...operation,
          transactionId,
          autoCommit: false, // لا نؤكد بعد كل عملية
        })
        results.push(result)

        // التحقق من وجود أخطاء
        if (!result.isSuccess()) {
          throw new Error(result.getError() || 'Operation failed')
        }
      }

      // تأكيد المعاملة إذا كان autoCommit = true
      if (autoCommit) {
        await this.transactionManager.commitTransaction(transactionId)
        logger.info('Batch transaction committed', {
          transactionId,
          operationsCount: operations.length,
        })
      }

      return results
    } catch (error) {
      try {
        await this.transactionManager.rollbackTransaction(transactionId)
      } catch (rollbackError) {
        logger.error('Failed to rollback transaction', {
          transactionId,
          error: rollbackError instanceof Error ? rollbackError.message : String(rollbackError),
        })
      }

      throw error
    }
  }

  /**
   * بدء معاملة جديدة
   */
  async beginTransaction(options?: TransactionOptions): Promise<string> {
    if (!this.transactionManager) {
      throw new Error('TransactionManager is not available')
    }

    return await this.transactionManager.beginTransaction(options)
  }

  /**
   * تأكيد معاملة
   */
  async commitTransaction(transactionId: string): Promise<void> {
    if (!this.transactionManager) {
      throw new Error('TransactionManager is not available')
    }

    await this.transactionManager.commitTransaction(transactionId)
  }

  /**
   * إلغاء معاملة
   */
  async rollbackTransaction(transactionId: string): Promise<void> {
    if (!this.transactionManager) {
      throw new Error('TransactionManager is not available')
    }

    await this.transactionManager.rollbackTransaction(transactionId)
  }

  /**
   * الحصول على معلومات معاملة
   */
  async getTransactionInfo(transactionId: string) {
    if (!this.transactionManager) {
      throw new Error('TransactionManager is not available')
    }

    return await this.transactionManager.getTransactionInfo(transactionId)
  }
}
