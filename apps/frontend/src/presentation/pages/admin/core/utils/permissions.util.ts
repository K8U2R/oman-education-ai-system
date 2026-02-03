/**
 * Permissions Utility - أدوات
 *
 * دوال مساعدة للتعامل مع
 */

import type { Permission } from '@/domain/types/auth.types'
import { ADMIN_PERMISSIONS, getAllAdminPermissions } from '../constants'

/**
 * التحقق من وجود صلاحية
 */
export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission)
}

/**
 * التحقق من وجود جميع  المطلوبة
 */
export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every(permission => userPermissions.includes(permission))
}

/**
 * التحقق من وجود أي صلاحية من  المطلوبة
 */
export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some(permission => userPermissions.includes(permission))
}

/**
 * الحصول على جميع صلاحيات Admin
 */
export function getAllPermissions(): Permission[] {
  return getAllAdminPermissions()
}

/**
 * الحصول على صلاحيات فئة محددة
 */
export function getPermissionsByCategory(category: keyof typeof ADMIN_PERMISSIONS): Permission[] {
  return Object.values(ADMIN_PERMISSIONS[category])
}

/**
 * التحقق من صحة صلاحية
 */
export function validatePermission(permission: string): permission is Permission {
  const allPermissions = getAllAdminPermissions()
  return allPermissions.includes(permission as Permission)
}
