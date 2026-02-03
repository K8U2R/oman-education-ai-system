/**
 * useAdminPermissions Hook - Hook للصلاحيات
 *
 * Hook موحد للتعامل مع صلاحيات Admin
 *
 * **Clean Architecture:**
 * - لا يعتمد على Presentation Layer
 * - يستخدم constants من core
 */

import { useMemo, useCallback } from 'react'
import { useAuth } from '@/features/user-authentication-management'
import type { Permission } from '@/domain/types/auth.types'
import { ADMIN_PERMISSIONS, getAllAdminPermissions, getPermissionsByCategory } from '../constants'
import { hasPermission, hasAllPermissions, hasAnyPermission } from '../utils/permissions.util'

/**
 * Hook للصلاحيات
 *
 * @returns معلومات
 *
 * @example
 * ```tsx
 * const { allPermissions, hasPermission, hasAllPermissions } = useAdminPermissions()
 *
 * if (hasPermission('admin.dashboard')) {
 *   // ...
 * }
 * ```
 */
export function useAdminPermissions() {
  const { user } = useAuth()

  // جميع صلاحيات المستخدم
  const userPermissions = useMemo(() => {
    return user?.permissions || []
  }, [user?.permissions])

  // التحقق من وجود صلاحية
  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      return hasPermission(userPermissions, permission)
    },
    [userPermissions]
  )

  // التحقق من وجود جميع
  const checkAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      return hasAllPermissions(userPermissions, permissions)
    },
    [userPermissions]
  )

  // التحقق من وجود أي صلاحية
  const checkAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      return hasAnyPermission(userPermissions, permissions)
    },
    [userPermissions]
  )

  return {
    /**
     * جميع صلاحيات Admin
     */
    allPermissions: getAllAdminPermissions(),

    /**
     * صلاحيات المستخدم الحالي
     */
    userPermissions,

    /**
     * التحقق من وجود صلاحية
     */
    hasPermission: checkPermission,

    /**
     * التحقق من وجود جميع
     */
    hasAllPermissions: checkAllPermissions,

    /**
     * التحقق من وجود أي صلاحية
     */
    hasAnyPermission: checkAnyPermission,

    /**
     * الحصول على صلاحيات فئة محددة
     */
    getPermissionsByCategory: (category: keyof typeof ADMIN_PERMISSIONS) =>
      getPermissionsByCategory(category),
  }
}
