/**
 * useWhitelistManagement Hook - Hook لإدارة القائمة البيضاء
 *
 * Hook موحد يجمع:
 * - Authentication check
 * - Data fetching (using existing useWhitelist)
 * - CRUD operations
 * - Loading state
 * - Error handling
 */

import { useAdminPage } from '../../../core/hooks'
import { useAdminPermissions } from '../../../core/hooks/useAdminPermissions'
import { useWhitelist } from '@/application/features/whitelist'
import type { WhitelistEntry, WhitelistEntryFormData } from '../types'

export interface UseWhitelistManagementReturn {
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
  error: Error | null

  /**
   * الإدخالات
   */
  entries: WhitelistEntry[]

  /**
   * جميع
   */
  allPermissions: string[]

  /**
   * تحديث البيانات
   */
  refresh: () => Promise<void>

  /**
   * إنشاء إدخال
   */
  createEntry: (data: WhitelistEntryFormData) => Promise<WhitelistEntry>

  /**
   * تحديث إدخال
   */
  updateEntry: (id: string, data: Partial<WhitelistEntryFormData>) => Promise<WhitelistEntry>

  /**
   * حذف إدخال
   */
  deleteEntry: (id: string) => Promise<void>

  /**
   * تفعيل إدخال
   */
  activateEntry: (id: string) => Promise<WhitelistEntry>

  /**
   * تعطيل إدخال
   */
  deactivateEntry: (id: string) => Promise<WhitelistEntry>

  /**
   * مسح الخطأ
   */
  clearError: () => void
}

/**
 * Hook لإدارة القائمة البيضاء
 *
 * @returns معلومات القائمة البيضاء والحالة
 *
 * @example
 * ```tsx
 * const { canAccess, loading, error, entries, refresh, createEntry } = useWhitelistManagement()
 * ```
 */
export function useWhitelistManagement(): UseWhitelistManagementReturn {
  // استخدام useAdminPage للتحقق من المصادقة
  const { canAccess } = useAdminPage({
    requiredPermissions: ['whitelist.manage'],
    autoFetch: false,
  })

  // استخدام useAdminPermissions للحصول على جميع
  const { allPermissions } = useAdminPermissions()

  // استخدام useWhitelist الموجود (من Application Layer)
  const {
    entries,
    loading,
    error,
    refresh,
    createEntry,
    updateEntry,
    deleteEntry,
    activateEntry,
    deactivateEntry,
    clearError,
  } = useWhitelist({ autoFetch: canAccess })

  return {
    canAccess,
    loading,
    error,
    entries,
    allPermissions: allPermissions.map(p => p as string),
    refresh,
    createEntry,
    updateEntry,
    deleteEntry,
    activateEntry,
    deactivateEntry,
    clearError,
  }
}
