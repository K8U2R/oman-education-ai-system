/**
 * ProtectedRoute - مكون حماية المسار
 *
 * مكون يحمي المسارات التي تتطلب مصادقة
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useRole } from '../hooks/useRole'
import { useAuthStore } from '../store/authStore'
import { authService } from '../api/auth.service'
import { ROUTES } from '@/domain/constants/routes.constants'
import { UserRole, Permission } from '@/domain/types/auth.types'
import { User } from '@/domain/entities/User'
import { useRouteContext } from '@/presentation/routing/providers/RouteContext'

interface ProtectedRouteProps {
  children: React.ReactElement
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  redirectTo?: string
}

import { LoadingOverlay } from '@/presentation/routing/guards/components/LoadingOverlay'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  redirectTo = ROUTES.LOGIN,
}) => {
  const {
    isAuthenticated: storeIsAuthenticated,
    isLoading: storeIsLoading,
    isInitialized,
    user,
    error: storeError, // Capture store error
  } = useAuthStore()
  const { hasRole, hasAnyRole, hasPermission, hasAllPermissions } = useRole()
  const location = useLocation()
  const { metadata: routeMetadata } = useRouteContext() // ✅ Get metadata from Context

  // التحقق من المصادقة من store و localStorage (fallback)
  const hasToken = authService.isAuthenticated()
  const isAuthenticated = storeIsAuthenticated || hasToken

  // 1. الانتظار حتى تهيئة المتجر (تحميل المحتوى من localStorage)
  if (!isInitialized) {
    return (
      <LoadingOverlay
        message="جارٍ تهيئة النظام..."
        context="Store Initialization"
        debugInfo={{ step: 'init', hasToken }}
      />
    )
  }

  // 🛑 1.5 - Freeze on Auth Error (User Request: Stop Auto-Redirect)
  if (storeError) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] p-8 overflow-auto flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <ProfessionalErrorPanel
            error={{
              code: 'AUTH_FAILURE',
              message: 'فشل عملية المصادقة (Auth Freeze Mode)',
              technicalDetails: {
                service: 'Frontend/ProtectedRoute',
                file: 'guards/ProtectedRoute.tsx',
                context: {
                  storeError,
                  hasToken,
                  storeAuthenticated: storeIsAuthenticated,
                  userId: user?.id,
                  route: location.pathname,
                },
              },
            }}
            onRetry={() => {
              // Manual Retry
              useAuthStore.getState().setError(null)
              window.location.reload()
            }}
          />
        </div>
      </div>
    )
  }

  // 2. الانتظار أثناء تحميل بيانات المستخدم (من الـ API)
  if (storeIsLoading) {
    return (
      <LoadingOverlay
        message="جارٍ التحقق من بيانات المستخدم..."
        context="API Loading"
        debugInfo={{ step: 'profile-fetch', userId: user?.id }}
      />
    )
  }

  // 3. حالة خاصة: وجود Token ولكن لا توجد بيانات مستخدم
  if (hasToken && !user) {
    return (
      <LoadingOverlay
        message="جاري استعادة الجلسة..."
        context="Token Recovery"
        debugInfo={{ step: 'token-recovery', hasToken: true, userMissing: true }}
      />
    )
  }

  // ✅ التحقق من المصادقة ووجود المستخدم
  // إذا لم يكن المستخدم مصادق عليه أو لا يوجد user، إعادة التوجيه إلى LOGIN
  // التأكد من أن redirectTo ليس /dashboard (يجب أن يكون /login)
  if (!isAuthenticated || !user) {
    const finalRedirectTo = redirectTo === ROUTES.DASHBOARD ? ROUTES.LOGIN : redirectTo
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[ProtectedRoute] Redirecting to:', finalRedirectTo, {
        isAuthenticated,
        hasToken,
        hasUser: !!user,
        location: location.pathname,
      })
    }
    return <Navigate to={finalRedirectTo} state={{ from: location.pathname }} replace />
  }

  // ✅ التحقق من أن المستخدم نشط
  // هذا يمنع الوصول للمستخدمين المعطلين
  // التحقق من كلاً من isActive و is_active للتعامل مع الكائنات الخام أثناء التحميل
  // ✅ التحقق من أن المستخدم نشط
  // هذا يمنع الوصول للمستخدمين المعطلين
  // التحقق من كلاً من isActive و is_active للتعامل مع الكائنات الخام أثناء التحميل
  const isActive =
    user instanceof User
      ? user.isActive
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((user as any).isActive ?? (user as any).is_active ?? true)

  if (!isActive) {
    // metadata is already available from context

    return (
      <Navigate
        to={ROUTES.UNAUTHORIZED}
        state={{
          from: location.pathname,
          error: {
            code: 'UNAUTHORIZED',
            message: 'حسابك غير نشط',
            status: 401,
            details: {
              userRole: user.role,
              userPermissions:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                user instanceof User ? user.permissions : (user as any).permissions || [],
              isActive: isActive,
              isVerified:
                user instanceof User
                  ? user.isVerified
                  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ((user as any).isVerified ?? (user as any).is_verified ?? true),
              routeTitle: routeMetadata?.title || location.pathname,
              requiredRole: routeMetadata?.requiredRole,
              requiredRoles: routeMetadata?.requiredRoles,
              requiredPermissions: routeMetadata?.requiredPermissions,
            },
          },
        }}
        replace
      />
    )
  }

  // ✅ تم إزالة التحقق من is_verified - ميزة التوثيق غير مهمة

  // Check single role
  if (requiredRole) {
    // Get hasRole result and log for debugging
    const hasAccess = hasRole(requiredRole)

    if (!hasAccess) {
      // Debug logging in development
      if (import.meta.env.DEV) {
        console.error('[ProtectedRoute] Access denied - Role check failed', {
          userRole: user.role,
          requiredRole,
          userPermissions: user.permissions?.length || 0,
          hasRoleResult: hasAccess,
          location: location.pathname,
          userObject: {
            id: user.id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            isVerified: user.isVerified,
          },
        })
      }

      // إعادة التوجيه إلى FORBIDDEN بدلاً من DASHBOARD
      return (
        <Navigate
          to={ROUTES.FORBIDDEN}
          state={{
            from: location.pathname,
            error: {
              code: 'FORBIDDEN',
              message: `يتطلب هذا المسار دور: ${requiredRole}`,
              details: {
                userRole: user.role,
                requiredRole,
              },
            },
          }}
          replace
        />
      )
    }
  }

  // Check multiple roles (any)
  if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return (
      <Navigate
        to={ROUTES.FORBIDDEN}
        state={{
          from: location.pathname,
          error: {
            code: 'FORBIDDEN',
            message: `يتطلب هذا المسار أحد الأدوار: ${requiredRoles.join(', ')}`,
            details: {
              userRole: user.role,
              requiredRoles,
            },
          },
        }}
        replace
      />
    )
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Navigate
        to={ROUTES.FORBIDDEN}
        state={{
          from: location.pathname,
          error: {
            code: 'FORBIDDEN',
            message: `يتطلب هذا المسار صلاحية: ${requiredPermission}`,
            details: {
              userPermissions: user.permissions,
              requiredPermission,
            },
          },
        }}
        replace
      />
    )
  }

  // Check multiple permissions (all required)
  if (
    requiredPermissions &&
    requiredPermissions.length > 0 &&
    !hasAllPermissions(requiredPermissions)
  ) {
    return (
      <Navigate
        to={ROUTES.FORBIDDEN}
        state={{
          from: location.pathname,
          error: {
            code: 'FORBIDDEN',
            message: `يتطلب هذا المسار : ${requiredPermissions.join(', ')}`,
            details: {
              userPermissions: user.permissions,
              requiredPermissions,
            },
          },
        }}
        replace
      />
    )
  }

  return children
}
