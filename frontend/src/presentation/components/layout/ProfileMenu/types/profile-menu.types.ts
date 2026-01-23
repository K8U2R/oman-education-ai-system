/**
 * ProfileMenu Types - أنواع ProfileMenu
 *
 * جميع الأنواع المستخدمة في ProfileMenu
 */

import type { UserRole } from '@/domain/types/auth.types'

/**
 * Profile Menu Item - عنصر في قائمة الملف الشخصي
 */
export interface ProfileMenuItem {
  /**
   * معرف العنصر
   */
  id: string

  /**
   * نص العنصر
   */
  label: string

  /**
   * مسار الصفحة
   */
  path: string

  /**
   * أيقونة العنصر
   */
  icon: React.ComponentType<{ className?: string }>

  /**
   * الدور المطلوب
   */
  requiredRole?: UserRole

  /**
   * هل العنصر خطير (مثل تسجيل الخروج)؟
   */
  isDangerous?: boolean

  /**
   * دالة التنقل المخصصة
   */
  onClick?: () => void
}

/**
 * Profile Menu Group - مجموعة في قائمة الملف الشخصي
 */
export interface ProfileMenuGroup {
  /**
   * معرف المجموعة
   */
  id: string

  /**
   * عنوان المجموعة (اختياري)
   */
  label?: string

  /**
   * عناصر المجموعة
   */
  items: ProfileMenuItem[]

  /**
   * الدور المطلوب لعرض المجموعة
   */
  requiredRole?: UserRole
}

/**
 * ProfileMenu Props - خصائص ProfileMenu
 */
export interface ProfileMenuProps {
  /**
   * ClassName إضافي
   */
  className?: string
}
