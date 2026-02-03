/**
 * ITransactionManager - واجهة مدير المعاملات
 *
 * واجهة لإدارة المعاملات (Transactions) في قاعدة البيانات
 */

/**
 * خيارات المعاملة
 */
export interface TransactionOptions {
  isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE'
  timeout?: number // Timeout بالمللي ثانية
  retries?: number // عدد المحاولات
}

/**
 * حالة المعاملة
 */
export enum TransactionStatus {
  PENDING = 'pending',
  COMMITTED = 'committed',
  ROLLED_BACK = 'rolled_back',
  ERROR = 'error',
}

/**
 * معلومات المعاملة
 */
export interface TransactionInfo {
  id: string
  status: TransactionStatus
  startedAt: Date
  committedAt?: Date
  rolledBackAt?: Date
  error?: string
  operations: number
}

/**
 * واجهة مدير المعاملات
 */
export interface ITransactionManager {
  /**
   * بدء معاملة جديدة
   */
  beginTransaction(options?: TransactionOptions): Promise<string> // إرجاع Transaction ID

  /**
   * تأكيد المعاملة (Commit)
   */
  commitTransaction(transactionId: string): Promise<void>

  /**
   * إلغاء المعاملة (Rollback)
   */
  rollbackTransaction(transactionId: string): Promise<void>

  /**
   * الحصول على معلومات المعاملة
   */
  getTransactionInfo(transactionId: string): Promise<TransactionInfo | null>

  /**
   * التحقق من حالة المعاملة
   */
  getTransactionStatus(transactionId: string): Promise<TransactionStatus>

  /**
   * تنفيذ عملية داخل معاملة
   */
  executeInTransaction<T>(transactionId: string, operation: () => Promise<T>): Promise<T>

  /**
   * تنفيذ عدة عمليات داخل معاملة
   */
  executeBatchInTransaction<T>(
    transactionId: string,
    operations: Array<() => Promise<T>>
  ): Promise<T[]>
}
