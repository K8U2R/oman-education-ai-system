/**
 * useAdmin Hook - Hook للإدارة
 *
 * @description Custom Hook لإدارة لوحة تحكم المسؤول
 */

import { useEffect, useCallback } from 'react'
import { useAdminStore } from '../store'
import type {
  SystemStats,
  UserStats,
  ContentStats,
  UsageStats,
  AdminUserInfo,
  UpdateUserRequest,
  SearchUsersRequest,
} from '../types'

interface UseAdminOptions {
  autoFetchStats?: boolean
  autoFetchUsers?: boolean
}

interface UseAdminReturn {
  // Stats
  systemStats: SystemStats | null
  userStats: UserStats | null
  contentStats: ContentStats | null
  usageStats: UsageStats | null

  // Users
  users: AdminUserInfo[]
  selectedUser: AdminUserInfo | null
  userActivities: ReturnType<typeof useAdminStore>['userActivities']

  // State
  isLoading: boolean
  error: string | null
  totalUsers: number
  hasMoreUsers: boolean

  // Actions
  fetchSystemStats: () => Promise<void>
  fetchUserStats: () => Promise<void>
  fetchContentStats: () => Promise<void>
  fetchUsageStats: () => Promise<void>
  fetchAllStats: () => Promise<void>
  searchUsers: (request: SearchUsersRequest) => Promise<void>
  selectUser: (user: AdminUserInfo | null) => void
  updateUser: (userId: string, request: UpdateUserRequest) => Promise<AdminUserInfo>
  deleteUser: (userId: string) => Promise<void>
  fetchUserActivities: () => Promise<void>
  setUserSearchFilters: (
    filters: Partial<{
      query?: string
      role?: string
      isActive?: boolean
      isVerified?: boolean
      page: number
      perPage: number
    }>
  ) => void
}

/**
 * Hook لإدارة لوحة تحكم المسؤول
 */
export const useAdmin = (options: UseAdminOptions = {}): UseAdminReturn => {
  const { autoFetchStats = true, autoFetchUsers = false } = options

  const {
    systemStats,
    userStats,
    contentStats,
    usageStats,
    users,
    selectedUser,
    userActivities,
    isLoading,
    error,
    totalUsers,
    hasMoreUsers,
    userSearchFilters,
    fetchSystemStats: storeFetchSystemStats,
    fetchUserStats: storeFetchUserStats,
    fetchContentStats: storeFetchContentStats,
    fetchUsageStats: storeFetchUsageStats,
    searchUsers: storeSearchUsers,
    selectUser: storeSelectUser,
    updateUser: storeUpdateUser,
    deleteUser: storeDeleteUser,
    fetchUserActivities: storeFetchUserActivities,
    setUserSearchFilters: storeSetUserSearchFilters,
  } = useAdminStore()

  /**
   * جلب جميع الإحصائيات
   */
  const fetchAllStats = useCallback(async () => {
    await Promise.all([
      storeFetchSystemStats(),
      storeFetchUserStats(),
      storeFetchContentStats(),
      storeFetchUsageStats(),
    ])
  }, [storeFetchSystemStats, storeFetchUserStats, storeFetchContentStats, storeFetchUsageStats])

  /**
   * البحث عن المستخدمين
   */
  const searchUsers = useCallback(
    async (request: SearchUsersRequest) => {
      await storeSearchUsers(request)
    },
    [storeSearchUsers]
  )

  /**
   * تحديد مستخدم
   */
  const selectUser = useCallback(
    (user: AdminUserInfo | null) => {
      storeSelectUser(user)
    },
    [storeSelectUser]
  )

  /**
   * تحديث مستخدم
   */
  const updateUser = useCallback(
    async (userId: string, request: UpdateUserRequest) => {
      return await storeUpdateUser(userId, request)
    },
    [storeUpdateUser]
  )

  /**
   * حذف مستخدم
   */
  const deleteUser = useCallback(
    async (userId: string) => {
      await storeDeleteUser(userId)
    },
    [storeDeleteUser]
  )

  /**
   * جلب أنشطة المستخدمين
   */
  const fetchUserActivities = useCallback(async () => {
    await storeFetchUserActivities()
  }, [storeFetchUserActivities])

  /**
   * تعيين فلاتر البحث
   */
  const setUserSearchFilters = useCallback(
    (
      filters: Partial<{
        query?: string
        role?: string
        isActive?: boolean
        isVerified?: boolean
        page: number
        perPage: number
      }>
    ) => {
      storeSetUserSearchFilters(filters)
    },
    [storeSetUserSearchFilters]
  )

  // Auto-fetch stats on mount
  useEffect(() => {
    if (autoFetchStats) {
      fetchAllStats()
    }
  }, [autoFetchStats, fetchAllStats])

  // Auto-fetch users on mount
  useEffect(() => {
    if (autoFetchUsers) {
      searchUsers({
        page: userSearchFilters.page,
        per_page: userSearchFilters.perPage,
      })
    }
  }, [autoFetchUsers, searchUsers, userSearchFilters])

  return {
    systemStats,
    userStats,
    contentStats,
    usageStats,
    users,
    selectedUser,
    userActivities,
    isLoading,
    error,
    totalUsers,
    hasMoreUsers,
    fetchSystemStats: storeFetchSystemStats,
    fetchUserStats: storeFetchUserStats,
    fetchContentStats: storeFetchContentStats,
    fetchUsageStats: storeFetchUsageStats,
    fetchAllStats,
    searchUsers,
    selectUser,
    updateUser,
    deleteUser,
    fetchUserActivities,
    setUserSearchFilters,
  }
}
