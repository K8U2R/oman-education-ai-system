/**
 * TransactionManager - مدير المعاملات
 *
 * إدارة المعاملات (Transactions) في قاعدة البيانات
 */

import {
  ITransactionManager,
  TransactionOptions,
  TransactionStatus,
  TransactionInfo,
} from '../../domain/interfaces/ITransactionManager'
import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { ITransactionAdapter } from '../../domain/interfaces/ITransactionAdapter'
import { logger } from '../../shared/utils/logger'
import { randomUUID } from 'crypto'

/**
 * معلومات المعاملة الداخلية
 */
interface InternalTransactionInfo {
  id: string
  status: TransactionStatus
  startedAt: Date
  committedAt?: Date
  rolledBackAt?: Date
  error?: string
  operations: number
  adapter: IDatabaseAdapter
  options: Required<TransactionOptions>
  adapterTransactionId?: string // Transaction ID من Adapter
}

/**
 * مدير المعاملات
 */
export class TransactionManager implements ITransactionManager {
  private transactions: Map<string, InternalTransactionInfo> = new Map()
  private readonly defaultOptions: Required<TransactionOptions> = {
    isolationLevel: 'READ_COMMITTED',
    timeout: 30000, // 30 seconds
    retries: 0,
  }
  private readonly transactionAdapter: ITransactionAdapter | null

  constructor(private readonly adapter: IDatabaseAdapter) {
    // التحقق من دعم Transactions
    if (
      'supportsTransactions' in adapter &&
      typeof (adapter as unknown as ITransactionAdapter).supportsTransactions === 'function'
    ) {
      this.transactionAdapter = adapter as unknown as ITransactionAdapter
      if (this.transactionAdapter.supportsTransactions()) {
        logger.info('Transaction support enabled for adapter')
      }
    } else {
      this.transactionAdapter = null
      logger.warn('Adapter does not support transactions. Using simulation mode.')
    }
  }

  /**
   * بدء معاملة جديدة مع دعم Isolation Levels و Timeout
   */
  async beginTransaction(options: TransactionOptions = {}): Promise<string> {
    const transactionId = randomUUID()
    const mergedOptions: Required<TransactionOptions> = {
      ...this.defaultOptions,
      ...options,
    }

    const transactionInfo: InternalTransactionInfo = {
      id: transactionId,
      status: TransactionStatus.PENDING,
      startedAt: new Date(),
      operations: 0,
      adapter: this.adapter,
      options: mergedOptions,
    }

    this.transactions.set(transactionId, transactionInfo)

    logger.info('Transaction started', {
      transactionId,
      isolationLevel: mergedOptions.isolationLevel,
      timeout: mergedOptions.timeout,
    })

    // تنفيذ BEGIN TRANSACTION في Adapter إذا كان يدعم Transactions
    if (this.transactionAdapter) {
      try {
        // تحويل TransactionOptions إلى TransactionOptions للـ Adapter
        const adapterOptions = {
          isolationLevel: mergedOptions.isolationLevel,
          timeout: mergedOptions.timeout,
        }
        const adapterTransactionId = await this.transactionAdapter.beginTransaction(adapterOptions)
        // ربط transactionId الداخلي بـ adapterTransactionId
        transactionInfo.adapterTransactionId = adapterTransactionId
      } catch (error) {
        this.transactions.delete(transactionId)
        logger.error('Failed to start transaction in adapter', {
          transactionId,
          error: error instanceof Error ? error.message : String(error),
        })
        throw error
      }
    }

    // تعيين Timeout timer إذا كان محدداً
    if (mergedOptions.timeout && mergedOptions.timeout > 0) {
      setTimeout(async () => {
        const transaction = this.transactions.get(transactionId)
        if (transaction && transaction.status === TransactionStatus.PENDING) {
          logger.warn('Transaction timeout, rolling back', { transactionId })
          try {
            await this.rollbackTransaction(transactionId)
          } catch (error) {
            logger.error('Failed to rollback transaction on timeout', {
              transactionId,
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }
      }, mergedOptions.timeout)
    }

    return transactionId
  }

  /**
   * تأكيد المعاملة (Commit)
   */
  async commitTransaction(transactionId: string): Promise<void> {
    const transaction = this.transactions.get(transactionId)

    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new Error(`Transaction is not in PENDING state: ${transaction.status}`)
    }

    try {
      // تنفيذ COMMIT في Adapter إذا كان يدعم Transactions
      if (this.transactionAdapter && transaction.adapterTransactionId) {
        await this.transactionAdapter.commitTransaction(transaction.adapterTransactionId)
      }

      transaction.status = TransactionStatus.COMMITTED
      transaction.committedAt = new Date()

      logger.info('Transaction committed', {
        transactionId,
        operations: transaction.operations,
        duration: transaction.committedAt.getTime() - transaction.startedAt.getTime(),
      })
    } catch (error) {
      transaction.status = TransactionStatus.ERROR
      transaction.error = error instanceof Error ? error.message : String(error)

      logger.error('Transaction commit failed', {
        transactionId,
        error: transaction.error,
      })

      throw error
    }
  }

  /**
   * إلغاء المعاملة (Rollback)
   */
  async rollbackTransaction(transactionId: string): Promise<void> {
    const transaction = this.transactions.get(transactionId)

    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    if (transaction.status === TransactionStatus.COMMITTED) {
      throw new Error('Cannot rollback a committed transaction')
    }

    try {
      // تنفيذ ROLLBACK في Adapter إذا كان يدعم Transactions
      if (this.transactionAdapter && transaction.adapterTransactionId) {
        await this.transactionAdapter.rollbackTransaction(transaction.adapterTransactionId)
      }

      transaction.status = TransactionStatus.ROLLED_BACK
      transaction.rolledBackAt = new Date()

      logger.info('Transaction rolled back', {
        transactionId,
        operations: transaction.operations,
        duration: transaction.rolledBackAt.getTime() - transaction.startedAt.getTime(),
      })
    } catch (error) {
      transaction.status = TransactionStatus.ERROR
      transaction.error = error instanceof Error ? error.message : String(error)

      logger.error('Transaction rollback failed', {
        transactionId,
        error: transaction.error,
      })

      throw error
    }
  }

  /**
   * الحصول على معلومات المعاملة
   */
  async getTransactionInfo(transactionId: string): Promise<TransactionInfo | null> {
    const transaction = this.transactions.get(transactionId)

    if (!transaction) {
      return null
    }

    return {
      id: transaction.id,
      status: transaction.status,
      startedAt: transaction.startedAt,
      committedAt: transaction.committedAt,
      rolledBackAt: transaction.rolledBackAt,
      error: transaction.error,
      operations: transaction.operations,
    }
  }

  /**
   * التحقق من حالة المعاملة
   */
  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    const transaction = this.transactions.get(transactionId)

    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    return transaction.status
  }

  /**
   * تنفيذ عملية داخل معاملة
   */
  async executeInTransaction<T>(transactionId: string, operation: () => Promise<T>): Promise<T> {
    const transaction = this.transactions.get(transactionId)

    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new Error(`Transaction is not in PENDING state: ${transaction.status}`)
    }

    try {
      const result = await operation()
      transaction.operations++

      logger.debug('Operation executed in transaction', {
        transactionId,
        operations: transaction.operations,
      })

      return result
    } catch (error) {
      transaction.status = TransactionStatus.ERROR
      transaction.error = error instanceof Error ? error.message : String(error)

      logger.error('Operation failed in transaction', {
        transactionId,
        error: transaction.error,
      })

      // محاولة Rollback تلقائي
      try {
        await this.rollbackTransaction(transactionId)
      } catch (rollbackError) {
        logger.error('Failed to rollback transaction after error', {
          transactionId,
          error: rollbackError instanceof Error ? rollbackError.message : String(rollbackError),
        })
      }

      throw error
    }
  }

  /**
   * تنفيذ عدة عمليات داخل معاملة
   */
  async executeBatchInTransaction<T>(
    transactionId: string,
    operations: Array<() => Promise<T>>
  ): Promise<T[]> {
    const results: T[] = []

    for (const operation of operations) {
      const result = await this.executeInTransaction(transactionId, operation)
      results.push(result)
    }

    return results
  }

  /**
   * تنظيف المعاملات المنتهية
   */
  cleanupExpiredTransactions(): void {
    const now = Date.now()
    const expiredTransactions: string[] = []

    for (const [id, transaction] of this.transactions.entries()) {
      const age = now - transaction.startedAt.getTime()

      // تنظيف المعاملات المنتهية (أكثر من ساعة)
      if (age > 60 * 60 * 1000) {
        expiredTransactions.push(id)
      }
    }

    for (const id of expiredTransactions) {
      this.transactions.delete(id)
      logger.debug('Expired transaction cleaned up', { transactionId: id })
    }
  }

  /**
   * الحصول على إحصائيات المعاملات
   */
  getStatistics(): {
    total: number
    pending: number
    committed: number
    rolledBack: number
    error: number
  } {
    const stats = {
      total: this.transactions.size,
      pending: 0,
      committed: 0,
      rolledBack: 0,
      error: 0,
    }

    for (const transaction of this.transactions.values()) {
      switch (transaction.status) {
        case TransactionStatus.PENDING:
          stats.pending++
          break
        case TransactionStatus.COMMITTED:
          stats.committed++
          break
        case TransactionStatus.ROLLED_BACK:
          stats.rolledBack++
          break
        case TransactionStatus.ERROR:
          stats.error++
          break
      }
    }

    return stats
  }

  /**
   * دعم Nested Transactions (Savepoints)
   */
  supportsNestedTransactions(): boolean {
    return (
      this.transactionAdapter !== null &&
      'supportsNestedTransactions' in this.transactionAdapter &&
      typeof (this.transactionAdapter as any).supportsNestedTransactions === 'function' &&
      (this.transactionAdapter as any).supportsNestedTransactions()
    )
  }

  /**
   * إنشاء Savepoint
   */
  async createSavepoint(transactionId: string, name: string): Promise<string> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    if (!this.supportsNestedTransactions()) {
      throw new Error('Nested transactions are not supported by the adapter')
    }

    if (!this.transactionAdapter || !('createSavepoint' in this.transactionAdapter)) {
      throw new Error('Adapter does not support savepoints')
    }

    try {
      const savepointName = await (this.transactionAdapter as any).createSavepoint(
        transaction.adapterTransactionId!,
        name
      )
      logger.debug('Savepoint created', { transactionId, savepointName })
      return savepointName
    } catch (error) {
      logger.error('Failed to create savepoint', {
        transactionId,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  /**
   * Rollback إلى Savepoint
   */
  async rollbackToSavepoint(transactionId: string, savepointName: string): Promise<void> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    if (!this.transactionAdapter || !('rollbackToSavepoint' in this.transactionAdapter)) {
      throw new Error('Adapter does not support savepoints')
    }

    try {
      await (this.transactionAdapter as any).rollbackToSavepoint(
        transaction.adapterTransactionId!,
        savepointName
      )
      logger.debug('Rolled back to savepoint', { transactionId, savepointName })
    } catch (error) {
      logger.error('Failed to rollback to savepoint', {
        transactionId,
        savepointName,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  /**
   * إطلاق Savepoint
   */
  async releaseSavepoint(transactionId: string, savepointName: string): Promise<void> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`)
    }

    if (!this.transactionAdapter || !('releaseSavepoint' in this.transactionAdapter)) {
      throw new Error('Adapter does not support savepoints')
    }

    try {
      await (this.transactionAdapter as any).releaseSavepoint(
        transaction.adapterTransactionId!,
        savepointName
      )
      logger.debug('Savepoint released', { transactionId, savepointName })
    } catch (error) {
      logger.error('Failed to release savepoint', {
        transactionId,
        savepointName,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }
}
