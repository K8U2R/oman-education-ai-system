/**
 * useDatabaseCorePage Hook - Hook أساسي لصفحات Database Core
 *
 * Hook موحد لجميع صفحات Database Core
 */

import { useAdminPage } from '../../../core/hooks'
import type { Permission } from '@/domain/types/auth.types'

export interface UseDatabaseCorePageReturn {
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
 * Hook أساسي لصفحات Database Core
 *
 * @param requiredPermission - الصلاحية المطلوبة
 * @returns معلومات الصفحة والحالة
 */
export function useDatabaseCorePage(
  requiredPermission?: Permission | string
): UseDatabaseCorePageReturn {
  const { canAccess, loading, error, refresh } = useAdminPage({
    requiredPermissions: requiredPermission
      ? [requiredPermission as Permission]
      : ['database-core.view'],
    autoFetch: false,
  })

  return {
    canAccess,
    loading,
    error,
    refresh,
  }
}
