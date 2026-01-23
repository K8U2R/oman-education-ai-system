import { DatabaseOperation } from '../entities/DatabaseOperation'
import { AuditLog } from '../entities/AuditLog'

/**
 * IDatabaseCoreRepository - واجهة المستودع الأساسي
 *
 * واجهة للمستودع الذي يدير عمليات قاعدة البيانات
 */
export interface IDatabaseCoreRepository {
  /**
   * تنفيذ عملية على قاعدة البيانات
   */
  executeOperation<T = unknown>(operation: DatabaseOperation): Promise<T>

  /**
   * حفظ سجل تدقيق
   */
  saveAuditLog(auditLog: AuditLog): Promise<void>

  /**
   * الحصول على سجلات التدقيق
   */
  getAuditLogs(filters?: {
    actor?: string
    entity?: string
    action?: string
    startDate?: Date
    endDate?: Date
  }): Promise<AuditLog[]>
}
