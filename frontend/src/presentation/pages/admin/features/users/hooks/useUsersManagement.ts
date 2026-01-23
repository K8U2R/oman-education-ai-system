/**
 * useUsersManagement Hook - Hook لإدارة المستخدمين
 *
 * Hook موحد يجمع:
 * - Authentication check
 * - Data fetching
 * - CRUD operations
 * - Loading state
 * - Error handling
 */

import { useCallback } from 'react'
import { useAdminPage, useAdminDataFetch } from '../../../core/hooks'
import { useAdminPermissions } from '../../../core/hooks/useAdminPermissions'
import { usersManagementService } from '@/application/features/admin/services/users-management.service'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'
import type { AdminUserInfo, UpdateUserRequest } from '../types'
import type { SearchUsersRequest } from '@/application/features/admin/services/admin.service'

export interface UseUsersManagementReturn {
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
   * المستخدمون
   */
  users: AdminUserInfo[]

  /**
   * جميع
   */
  allPermissions: string[]

  /**
   * تحديث البيانات
   */
  refresh: () => Promise<void>

  /**
   * تحديث مستخدم
   */
  updateUser: (userId: string, data: UpdateUserRequest) => Promise<AdminUserInfo>

  /**
   * حذف مستخدم
   */
  deleteUser: (userId: string) => Promise<void>

  /**
   * البحث عن المستخدمين
   */
  searchUsers: (request: SearchUsersRequest) => Promise<void>
}

/**
 * Hook لإدارة المستخدمين
 *
 * @returns معلومات المستخدمين والحالة
 *
 * @example
 * ```tsx
 * const { canAccess, loading, error, users, refresh, updateUser } = useUsersManagement()
 * ```
 */
export function useUsersManagement(): UseUsersManagementReturn {
  // استخدام useAdminPage للتحقق من المصادقة
  const { canAccess, loading: authLoading } = useAdminPage({
    requiredRole: 'admin',
    requiredPermissions: ['admin.users'],
    autoFetch: false,
  })

  // استخدام useAdminPermissions للحصول على جميع
  const { allPermissions } = useAdminPermissions()

  // استخدام useAdminDataFetch لجلب البيانات
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refresh,
  } = useAdminDataFetch(() => usersManagementService.searchUsers({ per_page: 100 }), {
    interval: ADMIN_REFRESH_INTERVALS.USERS,
    autoFetch: canAccess,
    defaultErrorMessage: 'فشل تحميل المستخدمين',
  })

  // تحويل البيانات
  const users = usersData?.users || []

  // دالة تحديث مستخدم
  const updateUser = useCallback(
    async (userId: string, data: UpdateUserRequest): Promise<AdminUserInfo> => {
      const updatedUser = await usersManagementService.updateUser(userId, data)
      await refresh() // تحديث القائمة
      return updatedUser
    },
    [refresh]
  )

  // دالة حذف مستخدم
  const deleteUser = useCallback(
    async (userId: string): Promise<void> => {
      await usersManagementService.deleteUser(userId)
      await refresh() // تحديث القائمة
    },
    [refresh]
  )

  // دالة البحث
  const searchUsers = useCallback(
    async (request: SearchUsersRequest): Promise<void> => {
      await usersManagementService.searchUsers(request)
      // سيتم تحديث users من خلال refresh
      await refresh()
    },
    [refresh]
  )

  return {
    canAccess,
    loading: authLoading || usersLoading,
    error: usersError,
    users,
    allPermissions: allPermissions.map(p => p as string),
    refresh,
    updateUser,
    deleteUser,
    searchUsers,
  }
}
