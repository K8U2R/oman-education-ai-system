/**
 * IDatabaseAdapter - واجهة محايدة للمزود لقاعدة البيانات
 *
 * هذه الواجهة تضمن حيادية المزود - يمكن استبدال Supabase بـ PostgreSQL
 * أو أي مزود آخر بدون تغيير الكود
 */
export interface IDatabaseAdapter {
  /**
   * البحث عن سجلات
   */
  find<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
    options?: {
      limit?: number
      offset?: number
      orderBy?: { column: string; direction: 'asc' | 'desc' }
    }
  ): Promise<T[]>

  /**
   * البحث عن سجل واحد
   */
  findOne<T = unknown>(entity: string, conditions: Record<string, unknown>): Promise<T | null>

  /**
   * إدراج سجل جديد
   */
  insert<T = unknown>(entity: string, data: Record<string, unknown>): Promise<T>

  /**
   * إدراج عدة سجلات
   */
  insertMany<T = unknown>(entity: string, data: Record<string, unknown>[]): Promise<T[]>

  /**
   * تحديث سجلات
   */
  update<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<T>

  /**
   * حذف سجلات
   */
  delete(entity: string, conditions: Record<string, unknown>, soft?: boolean): Promise<boolean>

  /**
   * عد السجلات المطابقة لشروط معينة
   */
  count(entity: string, conditions?: Record<string, unknown>): Promise<number>

  /**
   * تنفيذ استعلام خام (بحذر)
   */
  executeRaw<T = unknown>(query: string, params?: Record<string, unknown>): Promise<T>
}
