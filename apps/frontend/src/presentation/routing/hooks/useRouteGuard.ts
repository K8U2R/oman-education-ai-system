/**
 * useRouteGuard Hook - Hook لحماية المسارات
 *
 * Custom Hook للتحقق من صلاحيات الوصول للمسار
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore, useRole } from '@/features/user-authentication-management'
import { findRouteByPath, canAccessRoute } from '../utils/route-utils'
import { allRoutes } from '../index'
import { ROUTES } from '@/domain/constants/routes.constants'

export const useRouteGuard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: storeIsLoading, isInitialized, user } = useAuthStore()
  const { userRole, userPermissions } = useRole()

  useEffect(() => {
    // 1. الانتظار حتى تهيئة المتجر
    if (!isInitialized) {
      return
    }

    // 2. الانتظار أثناء تحميل البيانات من الـ API
    if (storeIsLoading) {
      return
    }

    // ✅ Bypass guard for developer routes (/__*)
    if (location.pathname.startsWith('/__')) {
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

    // ✅ إذا لم يكن المستخدم مصادق عليه أو لا يوجد user، إعادة التوجيه إلى LOGIN
    if (!isAuthenticated || !user) {
      navigate(ROUTES.LOGIN, {
        state: { from: location.pathname },
        replace: true,
      })
      return
    }

    // Check if user can access this route (only for protected routes)
    const canAccess = canAccessRoute(route, isAuthenticated, userRole, userPermissions)

    if (!canAccess) {
      // User authenticated but doesn't have permission
      // ✅ إعادة التوجيه إلى FORBIDDEN مع معلومات الخطأ
      const routeMetadata = route.metadata
      navigate(ROUTES.FORBIDDEN, {
        replace: true,
        state: {
          from: location.pathname,
          error: {
            code: 'FORBIDDEN',
            message: 'ليس لديك  للوصول إلى هذا المسار',
            details: {
              routeTitle: routeMetadata?.title,
              requiredRole: routeMetadata?.requiredRole,
              requiredRoles: routeMetadata?.requiredRoles,
              requiredPermissions: routeMetadata?.requiredPermissions,
              userRole,
              userPermissions,
            },
          },
        },
      })
    }
    // Only depend on pathname and isAuthenticated to avoid unnecessary re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isAuthenticated, storeIsLoading, isInitialized, user])
}
