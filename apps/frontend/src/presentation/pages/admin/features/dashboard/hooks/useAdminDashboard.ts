/**
 * useAdminDashboard Hook - Hook لصفحة Dashboard
 *
 * Hook موحد يجمع:
 * - Authentication check
 * - Data fetching
 * - Loading state
 * - Error handling
 */

import { useAdminPage, useAdminDataFetch } from '../../../core/hooks'
import { adminDashboardService } from '@/application/features/admin/services/admin-dashboard.service'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'
import type { DashboardStats } from '../types'

export interface UseAdminDashboardReturn {
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
  stats: DashboardStats | null

  /**
   * تحديث البيانات
   */
  refresh: () => Promise<void>
}

/**
 * Hook لصفحة Dashboard
 *
 * @returns معلومات Dashboard والحالة
 *
 * @example
 * ```tsx
 * const { canAccess, loading, error, stats, refresh } = useAdminDashboard()
 * ```
 */
export function useAdminDashboard(): UseAdminDashboardReturn {
  // استخدام useAdminPage للتحقق من المصادقة
  const { canAccess, loading: authLoading } = useAdminPage({
    requiredRole: 'admin',
    autoFetch: false,
  })

  // استخدام useAdminDataFetch لجلب البيانات
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refresh,
  } = useAdminDataFetch(() => adminDashboardService.getStats(), {
    interval: ADMIN_REFRESH_INTERVALS.DASHBOARD,
    autoFetch: canAccess,
    defaultErrorMessage: 'فشل تحميل إحصائيات لوحة التحكم',
  })

  return {
    canAccess,
    loading: authLoading || statsLoading,
    error: statsError,
    stats,
    refresh,
  }
}
