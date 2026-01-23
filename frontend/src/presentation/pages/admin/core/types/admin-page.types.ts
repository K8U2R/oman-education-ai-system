/**
 * Admin Page Types - أنواع صفحات Admin
 *
 * أنواع TypeScript المشتركة لصفحات Admin
 */

import type { UserRole, Permission } from '@/domain/types/auth.types'

/**
 * خيارات صفحة Admin
 */
export interface AdminPageOptions {
  /**
   * الدور المطلوب
   */
  requiredRole?: UserRole

  /**
   * الأدوار المطلوبة (أي واحد منهم)
   */
  requiredRoles?: UserRole[]

  /**
   * الصلاحية المطلوبة
   */
  requiredPermission?: Permission

  /**
   *  المطلوبة (جميعها)
   */
  requiredPermissions?: Permission[]

  /**
   * مسار إعادة التوجيه عند فشل الوصول
   */
  redirectTo?: string

  /**
   * هل يجب جلب البيانات تلقائياً؟
   */
  autoFetch?: boolean
}

/**
 * حالة صفحة Admin
 */
export interface AdminPageState<T = unknown> {
  /**
   * هل يمكن الوصول للصفحة؟
   */
  canAccess: boolean

  /**
   * حالة التحميل
   */
  loading: boolean

  /**
   * الخطأ (إن وجد)
   */
  error: string | null

  /**
   * المستخدم الحالي
   */
  user: {
    id: string
    email: string
    role: UserRole
    permissions: Permission[]
  } | null

  /**
   * البيانات
   */
  data: T | null
}

/**
 * إرجاع صفحة Admin
 */
export interface AdminPageReturn<T = unknown> extends AdminPageState<T> {
  /**
   * تحديث البيانات
   */
  refresh: () => Promise<void>
}
