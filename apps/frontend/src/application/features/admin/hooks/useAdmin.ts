/**
 * useAdmin Hook - Hook للإدارة (Refactored with TanStack Query)
 *
 * @description
 * Custom Hook لإدارة لوحة تحكم المسؤول
 * يستخدم TanStack Query لجلب البيانات و Zustand للحالة المحلية فقط
 */

import { useAllStats } from './useAdminStats'
import { useAdminUsers, useUserActivities, useUpdateUser, useDeleteUser } from './useAdminUsers'
import { useAdminUIStore } from '../store/ui.store'
import type { SearchUsersRequest, UpdateUserRequest } from '../types'

interface UseAdminOptions {
  autoFetchStats?: boolean
  autoFetchUsers?: boolean
}

/**
 * Hook لإدارة لوحة تحكم المسؤول
 *
 * @example
 * ```tsx
 * const {
 *   systemStats,
 *   isLoading,
 *   updateUser,
 *   selectUser
 * } = useAdmin({ autoFetchStats: true })
 * ```
 */
export const useAdmin = (options: UseAdminOptions = {}) => {
  const { autoFetchUsers = false } = options

  // Server State - من TanStack Query
  const {
    systemStats,
    userStats,
    contentStats,
    usageStats,
    isLoading: statsLoading,
    error: statsError,
    refetchAll,
  } = useAllStats()

  // UI State - من Zustand
  const {
    selectedUser,
    userSearchFilters,
    selectUser,
    setUserSearchFilters,
    activeTab,
    setActiveTab,
    isSidebarOpen,
    toggleSidebar,
  } = useAdminUIStore()

  // Users Query - مشروط بناءً على autoFetchUsers
  const usersQuery = useAdminUsers(autoFetchUsers ? userSearchFilters : undefined)
  const activitiesQuery = useUserActivities()

  // Mutations
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  // Combined Loading State
  const isLoading =
    statsLoading || usersQuery.isLoading || activitiesQuery.isLoading

  // Combined Error State
  const error =
    statsError ||
    usersQuery.error ||
    activitiesQuery.error ||
    updateUserMutation.error ||
    deleteUserMutation.error

  return {
    // Stats Data
    systemStats,
    userStats,
    contentStats,
    usageStats,

    // Users Data
    users: usersQuery.data?.users || [],
    totalUsers: usersQuery.data?.total || 0,
    hasMoreUsers: (usersQuery.data?.page || 0) < (usersQuery.data?.total_pages || 0),
    selectedUser,
    userActivities: activitiesQuery.data || [],

    // UI State
    activeTab,
    isSidebarOpen,
    userSearchFilters,

    // Loading & Error States
    isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,

    // Stats Actions
    fetchAllStats: refetchAll,
    fetchSystemStats: () => Promise.resolve(), // For backward compatibility
    fetchUserStats: () => Promise.resolve(),
    fetchContentStats: () => Promise.resolve(),
    fetchUsageStats: () => Promise.resolve(),

    // Users Actions
    searchUsers: (request: SearchUsersRequest) => {
      setUserSearchFilters(request)
      return Promise.resolve() // Triggers automatic refetch via query invalidation
    },
    updateUser: async (userId: string, request: UpdateUserRequest) => {
      return updateUserMutation.mutateAsync({ userId, data: request })
    },
    deleteUser: async (userId: string) => {
      await deleteUserMutation.mutateAsync(userId)
    },
    fetchUserActivities: () => {
      activitiesQuery.refetch()
      return Promise.resolve()
    },

    // UI Actions
    selectUser,
    setUserSearchFilters,
    setActiveTab,
    toggleSidebar,
  }
}
