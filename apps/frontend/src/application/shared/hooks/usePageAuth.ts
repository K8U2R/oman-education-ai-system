/**
 * usePageAuth Hook - Hook للمصادقة في الصفحات
 *
 * Hook موحد للتحقق من المصادقة وإعادة التوجيه في الصفحات
 * يقلل التكرار في كود authentication checks
 *
 * **العلاقة مع hooks أخرى:**
 * - يعتمد على `useAuth` و `useRole` من `@/application/features/auth`
 * - يستخدم `usePageLoading` لإدارة حالة التحميل
 * - لا يحتوي على منطق routing (يستخدم `getShouldRedirect()` للتحقق فقط)
 *
 * **متى نستخدم:**
 * - للصفحات التي تتطلب مصادقة أو صلاحيات محددة
 * - للتحقق من الأدوار و قبل عرض المحتوى
 *
 * **ملاحظات:**
 * - لا يقوم بإعادة التوجيه تلقائياً (يجب استخدام `getShouldRedirect()` في presentation layer)
 * - يعيد `loadingState` للاستخدام مع `LoadingState` component
 */

import { useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  useAuth,
  useRole,
  authService,
  useAuthStore,
} from '@/features/user-authentication-management'
import { usePageLoading } from './usePageLoading'
import { User } from '@/domain/entities/User'
import type { UserRole, Permission } from '@/domain/types/auth.types'

export interface UsePageAuthOptions {
  /**
   * هل الصفحة تتطلب مصادقة؟
   */
  requireAuth?: boolean

  /**
   * هل الصفحة تتطلب دور محدد؟
   */
  requiredRole?: UserRole

  /**
   * هل الصفحة تتطلب صلاحيات محددة؟
   */
  requiredPermissions?: Permission[]

  /**
   * هل يجب إعادة التوجيه تلقائياً عند فشل الوصول؟
   */
  autoRedirect?: boolean

  /**
   * مسار إعادة التوجيه عند فشل المصادقة (للاستخدام في presentation layer)
   * @deprecated يتم استخدام getShouldRedirect() في presentation layer بدلاً من ذلك
   */
  redirectTo?: string

  /**
   * هل يجب استبدال التاريخ في المتصفح؟ (للاستخدام في presentation layer)
   * @deprecated يتم استخدام getShouldRedirect() في presentation layer بدلاً من ذلك
   */
  replace?: boolean
}

export interface UsePageAuthReturn {
  /**
   * المستخدم الحالي
   */
  user: ReturnType<typeof useAuth>['user']

  /**
   * حالة التحميل
   */
  isLoading: boolean

  /**
   * هل المستخدم مصادق عليه؟
   */
  isAuthenticated: boolean

  /**
   * هل يمكن الوصول للصفحة؟
   */
  canAccess: boolean

  /**
   * دالة للتحقق من الحاجة لإعادة التوجيه (للاستخدام في presentation layer)
   */
  getShouldRedirect: () => boolean

  /**
   * معلومات حالة التحميل (للاستخدام في presentation layer)
   */
  loadingState: {
    isLoading: boolean
    shouldShowLoading: boolean
    loadingMessage: string
  }
}

/**
 * Hook للمصادقة في الصفحات
 *
 * @param options - خيارات المصادقة
 * @returns معلومات المصادقة والحالة
 *
 * @example
 * ```tsx
 * const { user, isLoading, canAccess } = usePageAuth({
 *   requireAuth: true,
 *   requiredRole: 'admin',
 * })
 *
 * if (!canAccess) {
 *   return null
 * }
 * ```
 */
export function usePageAuth(options: UsePageAuthOptions = {}): UsePageAuthReturn {
  const { requireAuth = true, requiredRole, requiredPermissions, autoRedirect = false } = options

  const navigate = useNavigate()
  const location = useLocation()

  const {
    user,
    isLoading: storeIsLoading,
    isAuthenticated: storeIsAuthenticated,
    isInitialized,
  } = useAuthStore()
  const { hasRole, hasAllPermissions: hasAllPermissionsFromRole } = useRole()

  // التحقق من المصادقة من store و localStorage (fallback)
  const isAuthenticated = storeIsAuthenticated || authService.isAuthenticated()

  // التحقق من
  const canAccess = (() => {
    // 1. إذا لم يتم تهيئة المتجر بعد
    if (!isInitialized) {
      return false
    }

    // 2. إذا كانت الصفحة لا تتطلب مصادقة
    if (!requireAuth) {
      return true
    }

    // 3. إذا كان التحميل لا يزال جارياً (من الـ API)
    if (storeIsLoading) {
      return false
    }

    // 4. إذا لم يكن المستخدم مصادق عليه
    if (!isAuthenticated) {
      return false
    }

    // إذا كان token موجود لكن user غير موجود، نعطي فرصة لتحميل المستخدم
    if (!user && authService.isAuthenticated()) {
      // سيتم تحميل المستخدم تلقائياً من useAuth hook
      return false // ننتظر تحميل المستخدم
    }

    if (!user) {
      return false
    }

    // التحقق من الدور المطلوب - استخدام hierarchy بدلاً من المساواة المباشرة
    // developer (5) يمكنه الوصول لصفحات admin (4)
    if (requiredRole && !hasRole(requiredRole)) {
      if (import.meta.env.DEV) {
        console.error('[usePageAuth] ❌ Role check FAILED', {
          userRole: user.role,
          requiredRole,
        })
      }
      return false
    }

    // التحقق من  المطلوبة
    if (requiredPermissions && requiredPermissions.length > 0) {
      if (!hasAllPermissionsFromRole(requiredPermissions)) {
        if (import.meta.env.DEV) {
          // الحصول على  بأمان
          let userPerms: Permission[] = []
          if (user instanceof User) {
            userPerms = user.getEffectivePermissions()
          } else {
            const userWithMethod = user as {
              getEffectivePermissions?: () => Permission[]
              permissions?: Permission[]
            }
            if (
              userWithMethod.getEffectivePermissions &&
              typeof userWithMethod.getEffectivePermissions === 'function'
            ) {
              userPerms = userWithMethod.getEffectivePermissions()
            } else {
              userPerms = userWithMethod.permissions || []
            }
          }

          console.error('[usePageAuth] ❌ Permissions check FAILED', {
            userPermissions: userPerms,
            requiredPermissions,
          })
        }
        return false
      }
    }

    if (
      import.meta.env.DEV &&
      (requiredRole || (requiredPermissions && requiredPermissions.length > 0))
    ) {
      // eslint-disable-next-line no-console
      console.log('[usePageAuth] ✅ Access GRANTED', {
        userRole: user.role,
        requiredRole,
        requiredPermissions,
      })
    }

    return true
  })()

  // استخدام usePageLoading لإدارة حالة التحميل
  const loadingState = usePageLoading({
    isLoading: storeIsLoading || !canAccess,
    message: 'جاري التحميل...',
  })

  // دالة للتحقق من الحاجة لإعادة التوجيه (للاستخدام في presentation layer)
  const getShouldRedirect = useCallback(() => {
    return requireAuth && isInitialized && !storeIsLoading && !canAccess
  }, [requireAuth, isInitialized, storeIsLoading, canAccess])

  // تأثير لإعادة التوجيه التلقائي إذا تم تفعيل الخيار
  useEffect(() => {
    if (autoRedirect && getShouldRedirect()) {
      const isForbidden = isAuthenticated && !canAccess

      navigate(isForbidden ? '/forbidden' : '/unauthorized', {
        replace: true,
        state: {
          from: location.pathname,
          error: {
            code: isForbidden ? 'FORBIDDEN' : 'UNAUTHORIZED',
            message: isForbidden
              ? 'ليس لديك  الكافية للوصول لهذه الصفحة'
              : 'يرجى تسجيل الدخول للوصول لهذه الصفحة',
            details: {
              userRole: user?.role,
              userPermissions: user?.permissions,
              requiredRole,
              requiredPermissions,
              path: location.pathname,
            },
          },
        },
      })
    }
  }, [
    autoRedirect,
    getShouldRedirect,
    navigate,
    location.pathname,
    isAuthenticated,
    canAccess,
    user,
    requiredRole,
    requiredPermissions,
  ])

  return {
    user,
    isLoading: storeIsLoading,
    isAuthenticated,
    canAccess,
    getShouldRedirect,
    loadingState,
  }
}
