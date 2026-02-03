/**
 * useAnalyticsPage Hook - Hook أساسي لصفحات Analytics
 *
 * Hook موحد لجميع صفحات Analytics
 */

import { useAdminPage } from '../../../core/hooks'

export interface UseAnalyticsPageReturn {
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
   * تحديث البيانات
   */
  refresh: () => Promise<void>
}

/**
 * Hook أساسي لصفحات Analytics
 *
 * @returns معلومات الصفحة والحالة
 */
export function useAnalyticsPage(): UseAnalyticsPageReturn {
  const { canAccess, loading, error, refresh } = useAdminPage({
    requiredPermissions: ['admin.reports'],
    autoFetch: false,
  })

  return {
    canAccess,
    loading,
    error,
    refresh,
  }
}
