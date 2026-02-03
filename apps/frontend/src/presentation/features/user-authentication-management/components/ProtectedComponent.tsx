/**
 * ProtectedComponent - مكون حماية عام
 *
 * مكون يحمي أجزاء من الصفحة بناءً على
 */

import React from 'react'
import { useRole } from '@/features/user-authentication-management'
import { UserRole, Permission } from '@/domain/types/auth.types'

interface ProtectedComponentProps {
  children: React.ReactElement
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  fallback?: React.ReactElement | null
  showFallback?: boolean
}

/**
 * ProtectedComponent - مكون حماية
 *
 * يخفي أو يعرض محتوى بناءً على صلاحيات المستخدم
 *
 * @example
 * ```tsx
 * <ProtectedComponent requiredPermission="lessons.create">
 *   <Button>إنشاء درس</Button>
 * </ProtectedComponent>
 * ```
 */
export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  fallback = null,
  showFallback = false,
}) => {
  const { hasRole, hasAnyRole, hasPermission, hasAllPermissions } = useRole()

  // Check single role
  if (requiredRole && !hasRole(requiredRole)) {
    return showFallback ? fallback || null : null
  }

  // Check multiple roles (any)
  if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return showFallback ? fallback || null : null
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return showFallback ? fallback || null : null
  }

  // Check multiple permissions (all required)
  if (
    requiredPermissions &&
    requiredPermissions.length > 0 &&
    !hasAllPermissions(requiredPermissions)
  ) {
    return showFallback ? fallback || null : null
  }

  return children
}
