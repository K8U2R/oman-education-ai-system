/**
 * Role Service - خدمة الأدوار و
 *
 * Domain Service للتحقق من الأدوار و
 */

import {
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
  RoleCheckResult,
  PermissionCheckResult,
} from '../types/auth.types'

export class RoleService {
  /**
   * التحقق من أن المستخدم لديه دور معين
   */
  static hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    // إذا لم يكن userRole موجوداً، إرجاع false
    if (!userRole || !requiredRole) {
      if (import.meta.env.DEV) {
        console.warn('[RoleService.hasRole] Missing roles', { userRole, requiredRole })
      }
      return false
    }

    const roleHierarchy: Record<UserRole, number> = {
      guest: 0,
      student: 1,
      parent: 1,
      teacher: 2,
      moderator: 3,
      admin: 4,
      developer: 5,
    }

    // التحقق من أن كلا الدورين موجودان في الـ hierarchy
    if (!(userRole in roleHierarchy)) {
      if (import.meta.env.DEV) {
        console.warn('[RoleService.hasRole] User role not in hierarchy', {
          userRole,
          availableRoles: Object.keys(roleHierarchy),
        })
      }
      return false
    }

    if (!(requiredRole in roleHierarchy)) {
      if (import.meta.env.DEV) {
        console.warn('[RoleService.hasRole] Required role not in hierarchy', {
          requiredRole,
          availableRoles: Object.keys(roleHierarchy),
        })
      }
      return false
    }

    // developer (5) أعلى من admin (4)، لذلك developer يمكنه الوصول لصفحات admin
    const userLevel = roleHierarchy[userRole]
    const requiredLevel = roleHierarchy[requiredRole]
    const hasAccess = userLevel >= requiredLevel

    // Log for debugging (only in development) - use console.error to ensure visibility
    /* if (import.meta.env.DEV) {
      if (!hasAccess) {
        console.error('[RoleService.hasRole] ❌ Access DENIED', {
          userRole,
          requiredRole,
          userLevel,
          requiredLevel,
          comparison: `${userLevel} >= ${requiredLevel} = ${hasAccess}`,
          hierarchy: roleHierarchy,
        })
      } else {
        // eslint-disable-next-line no-console
        console.log('[RoleService.hasRole] ✅ Access GRANTED', {
          userRole,
          requiredRole,
          userLevel,
          requiredLevel,
          comparison: `${userLevel} >= ${requiredLevel} = ${hasAccess}`,
        })
      }
    } */

    return hasAccess
  }

  /**
   * التحقق من أن المستخدم لديه أحد الأدوار المطلوبة
   */
  static hasAnyRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
    return requiredRoles.some(role => this.hasRole(userRole, role))
  }

  /**
   * التحقق من أن المستخدم لديه جميع الأدوار المطلوبة
   */
  static hasAllRoles(userRole: UserRole, requiredRoles: UserRole[]): RoleCheckResult {
    const missingRoles = requiredRoles.filter(role => !this.hasRole(userRole, role))

    return {
      hasRole: missingRoles.length === 0,
      missingRoles: missingRoles.length > 0 ? missingRoles : undefined,
    }
  }

  /**
   * الحصول على صلاحيات الدور
   */
  static getRolePermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || []
  }

  /**
   * التحقق من أن المستخدم لديه صلاحية معينة
   */
  static hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
    return userPermissions.includes(requiredPermission)
  }

  /**
   * التحقق من أن المستخدم لديه إحدى  المطلوبة
   */
  static hasAnyPermission(
    userPermissions: Permission[],
    requiredPermissions: Permission[]
  ): boolean {
    return requiredPermissions.some(permission => userPermissions.includes(permission))
  }

  /**
   * التحقق من أن المستخدم لديه جميع  المطلوبة
   */
  static hasAllPermissions(
    userPermissions: Permission[],
    requiredPermissions: Permission[]
  ): PermissionCheckResult {
    const missingPermissions = requiredPermissions.filter(
      permission => !userPermissions.includes(permission)
    )

    return {
      hasPermission: missingPermissions.length === 0,
      missingPermissions: missingPermissions.length > 0 ? missingPermissions : undefined,
    }
  }

  /**
   * التحقق من الصلاحية بناءً على الدور
   */
  static hasPermissionByRole(userRole: UserRole, requiredPermission: Permission): boolean {
    const rolePermissions = this.getRolePermissions(userRole)
    return rolePermissions.includes(requiredPermission)
  }

  /**
   * التحقق من  بناءً على الدور
   */
  static hasPermissionsByRole(
    userRole: UserRole,
    requiredPermissions: Permission[]
  ): PermissionCheckResult {
    const rolePermissions = this.getRolePermissions(userRole)
    return this.hasAllPermissions(rolePermissions, requiredPermissions)
  }
}
