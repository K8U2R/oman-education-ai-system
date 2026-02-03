/**
 * ProfileMenu Utilities - وظائف مساعدة للـ ProfileMenu
 *
 * جميع الوظائف المساعدة المستخدمة في ProfileMenu
 */

import type { ProfileMenuGroup, ProfileMenuItem } from '../types'
import type { UserRole } from '@/domain/types/auth.types'

/**
 * فلترة مجموعات ProfileMenu حسب الدور
 *
 * @param groups - مجموعات ProfileMenu
 * @param userRole - دور المستخدم
 * @returns مجموعات ProfileMenu المفلترة
 */
export const filterProfileMenuGroups = (
  groups: ProfileMenuGroup[],
  userRole?: UserRole
): ProfileMenuGroup[] => {
  return groups
    .filter(group => {
      // إذا لم تكن المجموعة تتطلب دوراً محدداً، اعرضها
      if (!group.requiredRole) {
        return true
      }

      // إذا كان المستخدم لديه الدور المطلوب، اعرض المجموعة
      return userRole === group.requiredRole
    })
    .map(group => ({
      ...group,
      items: filterProfileMenuItems(group.items, userRole),
    }))
    .filter(group => group.items.length > 0) // إزالة المجموعات الفارغة
}

/**
 * فلترة عناصر ProfileMenu حسب الدور
 *
 * @param items - عناصر ProfileMenu
 * @param userRole - دور المستخدم
 * @returns عناصر ProfileMenu المفلترة
 */
export const filterProfileMenuItems = (
  items: ProfileMenuItem[],
  userRole?: UserRole
): ProfileMenuItem[] => {
  return items.filter(item => {
    // إذا لم يكن العنصر يتطلب دوراً محدداً، اعرضه
    if (!item.requiredRole) {
      return true
    }

    // إذا كان المستخدم لديه الدور المطلوب، اعرض العنصر
    return userRole === item.requiredRole
  })
}
