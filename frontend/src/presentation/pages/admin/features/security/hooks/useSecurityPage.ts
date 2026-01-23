/**
 * useSecurityPage Hook - Hook أساسي لصفحات Security
 *
 * Hook موحد لجميع صفحات Security
 */

import { useAdminPage } from '../../../core/hooks'
import type { Permission } from '@/domain/types/auth.types'

export interface UseSecurityPageReturn {
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
 * Hook أساسي لصفحات Security
 *
 * @param requiredPermission - الصلاحية المطلوبة
 * @returns معلومات الصفحة والحالة
 */
export function useSecurityPage(requiredPermission?: Permission | string): UseSecurityPageReturn {
  const { canAccess, loading, error, refresh } = useAdminPage({
    requiredPermissions: requiredPermission ? [requiredPermission as Permission] : ['system.view'],
    autoFetch: false,
  })

  return {
    canAccess,
    loading,
    error,
    refresh,
  }
}
