/**
 * useAdminPage Hook - Hook أساسي لصفحات Admin
 *
 * Hook موحد يوفر:
 * - Authentication check
 * - Authorization check (role & permissions)
 * - Loading state management
 * - Error handling
 *
 *
 * **Clean Architecture:**
 * - لا يعتمد على Presentation Layer
 * - يستخدم Application Layer hooks
 * - يعيد state فقط (لا components)
 */

import { useCallback, useMemo } from 'react'
import { usePageAuth, usePageLoading } from '@/application/shared/hooks'

import type { AdminPageOptions, AdminPageReturn } from '../types'

/**
 * Hook أساسي لصفحات Admin
 *
 * @param options - خيارات الصفحة
 * @returns معلومات الصفحة والحالة
 *
 * @example
 * ```tsx
 * const { canAccess, loading, error, user, refresh } = useAdminPage({
 *   requiredRole: 'admin',
 *   requiredPermissions: ['admin.dashboard'],
 * })
 * ```
 */
export function useAdminPage<T = unknown>(options: AdminPageOptions = {}): AdminPageReturn<T> {
  const { requiredRole, requiredPermission, requiredPermissions } = options

  // استخدام usePageAuth للتحقق من المصادقة و
  const {
    user,
    canAccess,
    isLoading: authLoading,
  } = usePageAuth({
    requireAuth: true,
    requiredRole,
    requiredPermissions: requiredPermission ? [requiredPermission] : requiredPermissions,
  })

  // استخدام usePageLoading لإدارة حالة التحميل
  const { isLoading: pageLoading } = usePageLoading({
    isLoading: authLoading,
    message: 'جاري تحميل الصفحة...',
  })

  // حساب حالة التحميل الموحدة
  const loading = useMemo(() => {
    return pageLoading || authLoading
  }, [pageLoading, authLoading])

  // دالة التحديث (سيتم استخدامها في useAdminDataFetch)
  const refresh = useCallback(async () => {
    // سيتم تنفيذها في useAdminDataFetch
  }, [])

  return {
    canAccess,
    loading,
    error: null, // سيتم إدارتها في useAdminDataFetch
    user: user
      ? {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions: user.permissions || [],
        }
      : null,
    data: null as T | null, // سيتم إدارتها في useAdminDataFetch
    refresh,
  }
}
