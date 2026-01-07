/**
 * useRole Hook - Hook للأدوار والصلاحيات
 *
 * Custom Hook للتحقق من الأدوار والصلاحيات
 */

import { useMemo } from 'react'
import { useAuth } from './useAuth'
import { UserRole, Permission } from '@/domain/types/auth.types'
import { RoleService } from '@/domain/services/role.service'

export const useRole = () => {
  const { user } = useAuth()

  const userRole = useMemo(() => user?.role || 'student', [user?.role])
  const userPermissions = useMemo(() => {
    if (!user) return []
    // استخدام الصلاحيات المخصصة إذا كانت موجودة، وإلا استخدام صلاحيات الدور
    return user.permissions.length > 0
      ? user.permissions
      : RoleService.getRolePermissions(user.role)
  }, [user])

  /**
   * التحقق من أن المستخدم لديه دور معين
   */
  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false
    return RoleService.hasRole(userRole, requiredRole)
  }

  /**
   * التحقق من أن المستخدم لديه أحد الأدوار المطلوبة
   */
  const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false
    return RoleService.hasAnyRole(userRole, requiredRoles)
  }

  /**
   * التحقق من أن المستخدم لديه جميع الأدوار المطلوبة
   */
  const hasAllRoles = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false
    return RoleService.hasAllRoles(userRole, requiredRoles).hasRole
  }

  /**
   * التحقق من أن المستخدم لديه صلاحية معينة
   */
  const hasPermission = (requiredPermission: Permission): boolean => {
    if (!user) return false
    return RoleService.hasPermission(userPermissions, requiredPermission)
  }

  /**
   * التحقق من أن المستخدم لديه إحدى الصلاحيات المطلوبة
   */
  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    if (!user) return false
    return RoleService.hasAnyPermission(userPermissions, requiredPermissions)
  }

  /**
   * التحقق من أن المستخدم لديه جميع الصلاحيات المطلوبة
   */
  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    if (!user) return false
    return RoleService.hasAllPermissions(userPermissions, requiredPermissions).hasPermission
  }

  /**
   * التحقق من أن المستخدم مسؤول
   */
  const isAdmin = useMemo(() => userRole === 'admin', [userRole])

  /**
   * التحقق من أن المستخدم معلم
   */
  const isTeacher = useMemo(() => userRole === 'teacher' || userRole === 'admin', [userRole])

  /**
   * التحقق من أن المستخدم طالب
   */
  const isStudent = useMemo(() => userRole === 'student', [userRole])

  /**
   * التحقق من أن المستخدم مطور
   */
  const isDeveloper = useMemo(() => userRole === 'developer' || userRole === 'admin', [userRole])

  return {
    userRole,
    userPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isTeacher,
    isStudent,
    isDeveloper,
  }
}
