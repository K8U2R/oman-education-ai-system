/**
 * ITransactionAdapter - واجهة محول المعاملات
 *
 * واجهة إضافية للـ Adapters التي تدعم Transactions
 */

import type { DatabaseClient } from '../types/database-client.types'

/**
 * خيارات المعاملة
 */
export interface TransactionOptions {
  isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE'
  timeout?: number // Timeout بالمللي ثانية
  readOnly?: boolean // معاملة للقراءة فقط
}

/**
 * معلومات المعاملة
 */
export interface TransactionInfo {
  id: string
  status: 'pending' | 'committed' | 'rolled_back'
  startedAt: Date
  isolationLevel?: string
  timeout?: number
  readOnly?: boolean
}

/**
 * معلومات Savepoint (لـ Nested Transactions)
 */
export interface SavepointInfo {
  id: string
  transactionId: string
  name: string
  createdAt: Date
}

/**
 * واجهة محول المعاملات
 */
export interface ITransactionAdapter {
  /**
   * بدء معاملة جديدة
   */
  beginTransaction(options?: TransactionOptions): Promise<string> // إرجاع Transaction ID

  /**
   * تأكيد المعاملة
   */
  commitTransaction(transactionId: string): Promise<void>

  /**
   * إلغاء المعاملة
   */
  rollbackTransaction(transactionId: string): Promise<void>

  /**
   * الحصول على معلومات المعاملة
   */
  getTransactionInfo(transactionId: string): Promise<TransactionInfo | null>

  /**
   * التحقق من دعم المعاملات
   */
  supportsTransactions(): boolean

  /**
   * تنفيذ عملية داخل معاملة
   */
  executeInTransaction<T>(
    transactionId: string,
    operation: (client: DatabaseClient) => Promise<T>
  ): Promise<T>

  /**
   * دعم Nested Transactions (Savepoints)
   */
  supportsNestedTransactions(): boolean

  /**
   * إنشاء Savepoint
   */
  createSavepoint(transactionId: string, name: string): Promise<string>

  /**
   * Rollback إلى Savepoint
   */
  rollbackToSavepoint(transactionId: string, savepointName: string): Promise<void>

  /**
   * إطلاق Savepoint
   */
  releaseSavepoint(transactionId: string, savepointName: string): Promise<void>
}
