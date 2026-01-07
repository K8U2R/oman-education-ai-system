/**
 * ProtectedRoute - مكون حماية المسار
 *
 * مكون يحمي المسارات التي تتطلب مصادقة
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useRole } from '@/application'
import { useAuthStore } from '@/application/features/auth/store/authStore'
import { ROUTES } from '@/domain/constants/routes.constants'
import { UserRole, Permission } from '@/domain/types/auth.types'

interface ProtectedRouteProps {
  children: React.ReactElement
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  redirectTo = ROUTES.LOGIN,
}) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const { hasRole, hasAnyRole, hasPermission, hasAllPermissions } = useRole()
  const location = useLocation()

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ التحقق من الصلاحيات...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
  }

  // Check single role
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  // Check multiple roles (any)
  if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }

  // Check multiple permissions (all required)
  if (
    requiredPermissions &&
    requiredPermissions.length > 0 &&
    !hasAllPermissions(requiredPermissions)
  ) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }

  return children
}
