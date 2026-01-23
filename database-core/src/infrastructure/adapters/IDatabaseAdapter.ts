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
  find<T = any>(
    entity: string,
    conditions: Record<string, any>,
    options?: {
      limit?: number
      offset?: number
      orderBy?: { column: string; direction: 'asc' | 'desc' }
    }
  ): Promise<T[]>

  /**
   * البحث عن سجل واحد
   */
  findOne<T = any>(entity: string, conditions: Record<string, any>): Promise<T | null>

  /**
   * إدراج سجل جديد
   */
  insert<T = any>(entity: string, data: Record<string, any>): Promise<T>

  /**
   * إدراج عدة سجلات
   */
  insertMany<T = any>(entity: string, data: Record<string, any>[]): Promise<T[]>

  /**
   * تحديث سجلات
   */
  update<T = any>(
    entity: string,
    conditions: Record<string, any>,
    data: Record<string, any>
  ): Promise<T>

  /**
   * حذف سجلات
   */
  delete(entity: string, conditions: Record<string, any>, soft?: boolean): Promise<boolean>

  /**
   * تنفيذ استعلام خام (بحذر)
   */
  executeRaw<T = any>(query: string, params?: Record<string, any>): Promise<T>
}
