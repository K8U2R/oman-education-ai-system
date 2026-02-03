/**
 * useSidebar Hook - Hook موحد لـ Sidebar
 *
 * Hook موحد يوفر:
 * - Authentication check
 * - Authorization check (role & permissions)
 * - Filtering groups and items
 * - Loading state management
 */

import { useMemo } from 'react'
import { usePageAuth } from '@/application/shared/hooks'
import { useAuth, useRole, authService } from '@/features/user-authentication-management'
import { SIDEBAR_GROUPS } from '../constants'
import { filterSidebarGroups } from '../utils'
import type { UseSidebarOptions, UseSidebarReturn } from '../types'

/**
 * Hook موحد لـ Sidebar
 *
 * @param options - خيارات Sidebar
 * @returns معلومات Sidebar والحالة
 */
export function useSidebar(options: UseSidebarOptions = {}): UseSidebarReturn {
  const { requireAuth = true } = options

  // استخدام usePageAuth للتحقق من المصادقة
  const {
    user,
    canAccess,
    isLoading: authLoading,
  } = usePageAuth({
    requireAuth,
  })

  // استخدام useAuth و useRole للتحقق من
  const { isAuthenticated: storeIsAuthenticated } = useAuth()
  const { hasRole, hasAllPermissions } = useRole()

  // Fallback إلى authService.isAuthenticated() إذا كان store غير جاهز
  const hasToken = authService.isAuthenticated()
  const isAuthenticated = storeIsAuthenticated || hasToken

  // تصفية المجموعات بناءً على
  const filteredGroups = useMemo(() => {
    if (!requireAuth || isAuthenticated) {
      const groups = filterSidebarGroups(
        SIDEBAR_GROUPS,
        isAuthenticated,
        user || null,
        hasRole,
        hasAllPermissions
      )

      // Logging في development mode
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.debug('[useSidebar] Filtered groups:', {
          totalGroups: SIDEBAR_GROUPS.length,
          filteredGroups: groups.length,
          userRole: user?.role,
          isAuthenticated,
        })
      }

      return groups
    }
    return []
  }, [isAuthenticated, user, hasRole, hasAllPermissions, requireAuth])

  // العناصر المفلترة (للمجموعات غير القابلة للطي - حالياً لا يوجد)
  const filteredItems = useMemo(() => {
    return []
  }, [])

  return {
    user: user || null,
    canAccess,
    isLoading: authLoading,
    groups: filteredGroups,
    items: filteredItems,
  }
}
