/**
 * Header Utilities - وظائف مساعدة للـ Header
 *
 * جميع الوظائف المساعدة المستخدمة في Header
 */

import type { UserRole } from '@/domain/types/auth.types'
import type { NavigationItem } from '../types'

/**
 * فلترة عناصر التنقل حسب الدور
 *
 * @param items - عناصر التنقل
 * @param userRole - دور المستخدم
 * @returns عناصر التنقل المفلترة
 */
export const filterNavigationItems = (
  items: NavigationItem[],
  userRole?: string
): NavigationItem[] => {
  if (!userRole) {
    return items.filter(item => !item.roles || item.roles.length === 0)
  }

  return items.filter(
    item => !item.roles || item.roles.length === 0 || item.roles.includes(userRole as UserRole)
  )
}

/**
 * التحقق من أن المسار نشط
 *
 * @param currentPath - المسار الحالي
 * @param targetPath - المسار المستهدف
 * @returns هل المسار نشط؟
 */
export const isActivePath = (currentPath: string, targetPath: string): boolean => {
  if (targetPath === '/') {
    return currentPath === '/'
  }
  return currentPath.startsWith(targetPath)
}

/**
 * الحصول على حجم Header حسب الشاشة
 *
 * @param width - عرض الشاشة
 * @returns حجم Header
 */
export const getHeaderSize = (width: number): 'sm' | 'md' | 'lg' => {
  if (width < 768) {
    return 'sm'
  }
  if (width < 1024) {
    return 'md'
  }
  return 'lg'
}

/**
 * الحصول على variant Header حسب الشاشة
 *
 * @param width - عرض الشاشة
 * @returns variant Header
 */
export const getHeaderVariant = (width: number): 'default' | 'compact' | 'minimal' => {
  if (width < 768) {
    return 'minimal'
  }
  if (width < 1024) {
    return 'compact'
  }
  return 'default'
}
