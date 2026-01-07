/**
 * useRouteGuard Hook - Hook لحماية المسارات
 *
 * Custom Hook للتحقق من صلاحيات الوصول للمسار
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth, useRole } from '@/application'
import { findRouteByPath, canAccessRoute } from '../utils/route-utils'
import { allRoutes } from '../index'
import { ROUTES } from '@/domain/constants/routes.constants'

export const useRouteGuard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { userRole, userPermissions } = useRole()

  useEffect(() => {
    // Skip if still loading authentication
    if (isAuthenticated === undefined) {
      return
    }

    const route = findRouteByPath(location.pathname, allRoutes)

    if (!route) {
      // Route not found - could redirect to 404
      return
    }

    // Skip guard check for public routes (requiresAuth: false)
    // This allows public pages to be accessible without authentication
    if (route.metadata && !route.metadata.requiresAuth) {
      // Public route - allow access
      return
    }

    // Check if user can access this route (only for protected routes)
    const canAccess = canAccessRoute(route, isAuthenticated, userRole, userPermissions)

    if (!canAccess) {
      // Redirect based on authentication status
      if (!isAuthenticated) {
        navigate(ROUTES.LOGIN, {
          state: { from: location.pathname },
          replace: true,
        })
      } else {
        // User authenticated but doesn't have permission
        navigate(ROUTES.DASHBOARD, { replace: true })
      }
    }
    // Only depend on pathname and isAuthenticated to avoid unnecessary re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isAuthenticated])
}
