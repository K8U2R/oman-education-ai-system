/**
 * useRole Hook - Hook للأدوار و
 *
 * Custom Hook للتحقق من الأدوار و
 */

import { useMemo } from 'react'
import { useAuth } from './useAuth'
import { User } from '@/domain/entities/User'
import { UserRole, Permission } from '@/domain/types/auth.types'
import { RoleService } from '@/domain/services/role.service'

export const useRole = () => {
  const { user } = useAuth()

  const userRole = useMemo(() => user?.role || 'student', [user?.role])
  const userPermissions = useMemo(() => {
    if (!user) return []

    // التحقق من أن user هو instance من User class
    if (user instanceof User) {
      // استخدام getEffectivePermissions() للحصول على  الفعالة
      // هذا يضمن استخدام  من whitelist إذا كانت موجودة
      return user.getEffectivePermissions()
    }

    // التحقق من وجود getEffectivePermissions method في user object
    const userWithMethod = user as { getEffectivePermissions?: () => Permission[] }
    if (
      userWithMethod.getEffectivePermissions &&
      typeof userWithMethod.getEffectivePermissions === 'function'
    ) {
      return userWithMethod.getEffectivePermissions()
    }

    // إذا كان user هو plain object، استخدم permissions مباشرة أو صلاحيات الدور
    const plainUser = user as { permissions?: Permission[]; role?: UserRole }

    // التحقق من permissions في الـ plain object
    if (plainUser.permissions && Array.isArray(plainUser.permissions)) {
      // إذا كانت المصفوفة فارغة، فقد نحتاج للاعتماد على صلاحيات الدور
      if (plainUser.permissions.length > 0) {
        return plainUser.permissions
      }
    }

    // الانتظار إذا كان الدور غير موجود أو student (كقيمة افتراضية أثناء التحميل)
    const role = plainUser.role || 'student'

    // استخدام صلاحيات الدور الافتراضية
    return RoleService.getRolePermissions(role)
  }, [user])

  /**
   * التحقق من أن المستخدم لديه دور معين
   * يستخدم hierarchy: developer (5) يمكنه الوصول لصفحات admin (4)
   */
  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) {
      return false
    }

    // استخدام user.role مباشرة للتأكد من الحصول على القيمة الصحيحة
    const actualUserRole = user.role
    if (!actualUserRole) {
      return false
    }

    const result = RoleService.hasRole(actualUserRole, requiredRole)

    // Log for debugging (only in development)
    /* if (import.meta.env.DEV) {
      if (!result) {
        console.error('[useRole.hasRole] ❌ Role check FAILED', {
          userRole: actualUserRole,
          requiredRole,
          hierarchy: {
            user: RoleService.hasRole(actualUserRole, actualUserRole),
            required: RoleService.hasRole(requiredRole, requiredRole),
          },
        })
      } else {
        // eslint-disable-next-line no-console
        console.log('[useRole.hasRole] ✅ Role check PASSED', {
          userRole: actualUserRole,
          requiredRole,
        })
      }
    } */

    return result
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
   * التحقق من أن المستخدم لديه إحدى  المطلوبة
   */
  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    if (!user) return false
    return RoleService.hasAnyPermission(userPermissions, requiredPermissions)
  }

  /**
   * التحقق من أن المستخدم لديه جميع  المطلوبة
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
