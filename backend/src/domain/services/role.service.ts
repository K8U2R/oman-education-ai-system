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
} from "../types/auth/index.js";

export class RoleService {
  /**
   * التحقق من أن المستخدم لديه دور معين
   */
  static hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      student: 1,
      parent: 1,
      teacher: 2,
      moderator: 3,
      admin: 4,
      developer: 5,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  /**
   * التحقق من أن المستخدم لديه أحد الأدوار المطلوبة
   */
  static hasAnyRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
    return requiredRoles.some((role) => this.hasRole(userRole, role));
  }

  /**
   * التحقق من أن المستخدم لديه جميع الأدوار المطلوبة
   */
  static hasAllRoles(
    userRole: UserRole,
    requiredRoles: UserRole[],
  ): RoleCheckResult {
    const missingRoles = requiredRoles.filter(
      (role) => !this.hasRole(userRole, role),
    );

    return {
      hasRole: missingRoles.length === 0,
      missingRoles: missingRoles.length > 0 ? missingRoles : undefined,
    };
  }

  /**
   * الحصول على صلاحيات الدور
   */
  static getRolePermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  /**
   * التحقق من أن المستخدم لديه صلاحية معينة
   */
  static hasPermission(
    userPermissions: Permission[],
    requiredPermission: Permission,
  ): boolean {
    return userPermissions.includes(requiredPermission);
  }

  /**
   * التحقق من أن المستخدم لديه إحدى  المطلوبة
   */
  static hasAnyPermission(
    userPermissions: Permission[],
    requiredPermissions: Permission[],
  ): boolean {
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }

  /**
   * التحقق من أن المستخدم لديه جميع  المطلوبة
   */
  static hasAllPermissions(
    userPermissions: Permission[],
    requiredPermissions: Permission[],
  ): PermissionCheckResult {
    const missingPermissions = requiredPermissions.filter(
      (permission) => !userPermissions.includes(permission),
    );

    return {
      hasPermission: missingPermissions.length === 0,
      missingPermissions:
        missingPermissions.length > 0 ? missingPermissions : undefined,
    };
  }

  /**
   * التحقق من الصلاحية بناءً على الدور
   */
  static hasPermissionByRole(
    userRole: UserRole,
    requiredPermission: Permission,
  ): boolean {
    const rolePermissions = this.getRolePermissions(userRole);
    return rolePermissions.includes(requiredPermission);
  }

  /**
   * التحقق من  بناءً على الدور
   */
  static hasPermissionsByRole(
    userRole: UserRole,
    requiredPermissions: Permission[],
  ): PermissionCheckResult {
    const rolePermissions = this.getRolePermissions(userRole);
    return this.hasAllPermissions(rolePermissions, requiredPermissions);
  }
}
