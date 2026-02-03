/**
 * Route Utils - وظائف المسارات
 *
 * Utilities للتعامل مع المسارات
 */

import { RouteConfig, RouteMetadata } from '../types'
import { UserRole, Permission } from '@/domain/types/auth.types'
import { RoleService } from '@/domain/services/role.service'

/**
 * البحث عن Route بناءً على المسار
 */
export const findRouteByPath = (pathname: string, routes: RouteConfig[]): RouteConfig | null => {
  for (const route of routes) {
    if (route.path === pathname) {
      return route
    }
    if (route.children) {
      const found = findRouteByPath(pathname, route.children)
      if (found) return found
    }
  }
  return null
}

/**
 * التحقق من إمكانية الوصول للمسار
 */
export const canAccessRoute = (
  route: RouteConfig,
  isAuthenticated: boolean,
  userRole?: UserRole,
  userPermissions?: Permission[]
): boolean => {
  const metadata = route.metadata

  if (!metadata) {
    return true // No restrictions
  }

  // Check authentication
  if (metadata.requiresAuth && !isAuthenticated) {
    return false
  }

  // Check role - only if user is authenticated
  if (metadata.requiredRole) {
    if (!isAuthenticated || !userRole) {
      return false // Role required but user not authenticated
    }
    if (!RoleService.hasRole(userRole, metadata.requiredRole)) {
      return false
    }
  }

  // Check multiple roles (any) - only if user is authenticated
  if (metadata.requiredRoles && metadata.requiredRoles.length > 0) {
    if (!isAuthenticated || !userRole) {
      return false // Roles required but user not authenticated
    }
    if (!RoleService.hasAnyRole(userRole, metadata.requiredRoles)) {
      return false
    }
  }

  // Check permissions - only if user is authenticated
  // If requiresAuth is false and permissions are required, allow access (permissions are optional)
  if (metadata.requiredPermissions && metadata.requiredPermissions.length > 0) {
    // Only check permissions if authentication is required
    // If requiresAuth is false, permissions are optional (for public routes with optional features)
    if (metadata.requiresAuth) {
      if (!isAuthenticated) {
        return false // Permissions required but user not authenticated
      }
      if (!userPermissions || userPermissions.length === 0) {
        // If no user permissions, use role permissions
        if (userRole) {
          const rolePermissions = RoleService.getRolePermissions(userRole)
          const checkResult = RoleService.hasAllPermissions(
            rolePermissions,
            metadata.requiredPermissions
          )
          if (!checkResult.hasPermission) {
            return false
          }
        } else {
          return false
        }
      } else {
        const checkResult = RoleService.hasAllPermissions(
          userPermissions,
          metadata.requiredPermissions
        )
        if (!checkResult.hasPermission) {
          return false
        }
      }
    }
    // If requiresAuth is false, we allow access even without permissions
    // This allows public routes to have optional permission-based features
  }

  return true
}

/**
 * الحصول على Route Metadata
 */
export const getRouteMetadata = (pathname: string, routes: RouteConfig[]): RouteMetadata | null => {
  const route = findRouteByPath(pathname, routes)
  return route?.metadata || null
}
