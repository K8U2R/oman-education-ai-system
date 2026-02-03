/**
 * useDeveloperDashboard Hook - Hook لصفحة Developer Dashboard
 *
 * Hook موحد يجمع:
 * - Authentication check
 * - Data fetching
 * - Loading state
 * - Error handling
 */

import { useAdminPage, useAdminDataFetch } from '../../../core/hooks'
import { developerService } from '@/application/features/developer/services'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'
import type { DeveloperStats } from '../types'

export interface UseDeveloperDashboardReturn {
  /**
   * هل يمكن الوصول للصفحة؟
   */
  canAccess: boolean

  /**
   * حالة التحميل
   */
  loading: boolean

  /**
   * الخطأ (إن وجد)
   */
  error: string | null

  /**
   * الإحصائيات
   */
  stats: DeveloperStats | null

  /**
   * تحديث البيانات
   */
  refresh: () => Promise<void>
}

/**
 * Hook لصفحة Developer Dashboard
 *
 * @returns معلومات Developer Dashboard والحالة
 *
 * @example
 * ```tsx
 * const { canAccess, loading, error, stats, refresh } = useDeveloperDashboard()
 * ```
 */
export function useDeveloperDashboard(): UseDeveloperDashboardReturn {
  // استخدام useAdminPage للتحقق من المصادقة
  const { canAccess, loading: authLoading } = useAdminPage({
    requiredRole: 'developer',
    autoFetch: false,
  })

  // استخدام useAdminDataFetch لجلب البيانات
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refresh,
  } = useAdminDataFetch(() => developerService.getDeveloperStats(), {
    interval: ADMIN_REFRESH_INTERVALS.DEVELOPER,
    autoFetch: canAccess,
    defaultErrorMessage: 'فشل تحميل إحصائيات المطور',
    onError: () => {
      // في حالة الخطأ، نستخدم قيم افتراضية
      // سيتم التعامل معها في الصفحة
    },
  })

  return {
    canAccess,
    loading: authLoading || statsLoading,
    error: statsError,
    stats,
    refresh,
  }
}
