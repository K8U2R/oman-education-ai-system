/**
 * Sidebar Types - أنواع Sidebar
 *
 * جميع الأنواع المستخدمة في Sidebar
 */

import type { UserRole, Permission } from '@/domain/types/auth.types'

/**
 * Sidebar Item - عنصر في القائمة الجانبية
 */
export interface SidebarItem {
  /**
   * مسار الصفحة
   */
  path: string

  /**
   * نص العنصر
   */
  label: string

  /**
   * أيقونة العنصر
   */
  icon: React.ComponentType<{ className?: string }>

  /**
   * هل يتطلب مصادقة؟
   */
  requiresAuth?: boolean

  /**
   * الدور المطلوب (أو قائمة الأدوار)
   */
  requiredRole?: UserRole | UserRole[]

  /**
   *  المطلوبة
   */
  requiredPermissions?: Permission[]

  /**
   * Badge (للإشعارات)
   */
  badge?: string | number

  /**
   * هل الرابط خارجي؟
   */
  external?: boolean
}

/**
 * Sidebar Group - مجموعة في القائمة الجانبية
 */
export interface SidebarGroup {
  /**
   * معرف المجموعة
   */
  id: string

  /**
   * عنوان المجموعة
   */
  label: string

  /**
   * أيقونة المجموعة
   */
  icon?: React.ComponentType<{ className?: string }>

  /**
   * عناصر المجموعة
   */
  items: SidebarItem[]

  /**
   * هل المجموعة مفتوحة افتراضياً؟
   */
  defaultOpen?: boolean

  /**
   * الدور المطلوب لعرض المجموعة (أو قائمة الأدوار)
   */
  requiredRole?: UserRole | UserRole[]

  /**
   *  المطلوبة لعرض المجموعة
   */
  requiredPermissions?: Permission[]

  /**
   * هل المجموعة قابلة للطي؟
   */
  collapsible?: boolean
}

/**
 * Sidebar Props - خصائص Sidebar
 */
export interface SidebarProps {
  /**
   * هل Sidebar مفتوح؟
   */
  isOpen?: boolean

  /**
   * دالة الإغلاق
   */
  onClose?: () => void

  /**
   * نوع Sidebar
   */
  variant?: 'default' | 'collapsed'

  /**
   * هل Sidebar مطوي؟
   */
  isCollapsed?: boolean

  /**
   * كلاسات CSS إضافية
   */
  className?: string
}

/**
 * UseSidebar Options - خيارات useSidebar Hook
 */
export interface UseSidebarOptions {
  /**
   * هل يتطلب مصادقة؟
   */
  requireAuth?: boolean
}

/**
 * UseSidebar Return - قيمة إرجاع useSidebar Hook
 */
export interface UseSidebarReturn {
  /**
   * المستخدم الحالي
   */
  // تم فك الارتباط مع ميزة المصادقة لضمان استقلالية الـ Shell
  user: unknown

  /**
   * هل يمكن الوصول؟
   */
  canAccess: boolean

  /**
   * حالة التحميل
   */
  isLoading: boolean

  /**
   * المجموعات المفلترة
   */
  groups: SidebarGroup[]

  /**
   * العناصر المفلترة (للمجموعات غير القابلة للطي)
   */
  items: SidebarItem[]
}
