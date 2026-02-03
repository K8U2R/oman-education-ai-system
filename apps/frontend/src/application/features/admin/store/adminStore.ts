/**
 * Admin Store - مخزن الإدارة
 *
 * @description Zustand Store لإدارة حالة الإدارة
 * يستخدم Generic Store Factory لتقليل التكرار
 */

import {
  useSystemStatsStore,
  useUserStatsStore,
  useContentStatsStore,
  useUsageStatsStore,
} from './statsStore'
import { useUsersStore } from './usersStore'

/**
 * Combined Admin Store Hook
 *
 * يجمع جميع الـ stores الفرعية في hook واحد
 */
export const useAdminStore = () => {
  const systemStatsStore = useSystemStatsStore()
  const userStatsStore = useUserStatsStore()
  const contentStatsStore = useContentStatsStore()
  const usageStatsStore = useUsageStatsStore()
  const usersStore = useUsersStore()

  return {
    // Stats
    systemStats: systemStatsStore.data,
    userStats: userStatsStore.data,
    contentStats: contentStatsStore.data,
    usageStats: usageStatsStore.data,

    // Stats Loading & Error
    statsLoading:
      systemStatsStore.isLoading ||
      userStatsStore.isLoading ||
      contentStatsStore.isLoading ||
      usageStatsStore.isLoading,
    statsError:
      systemStatsStore.error ||
      userStatsStore.error ||
      contentStatsStore.error ||
      usageStatsStore.error,

    // Stats Actions
    fetchSystemStats: systemStatsStore.fetchData,
    fetchUserStats: userStatsStore.fetchData,
    fetchContentStats: contentStatsStore.fetchData,
    fetchUsageStats: usageStatsStore.fetchData,
    fetchAllStats: async () => {
      await Promise.all([
        systemStatsStore.fetchData(),
        userStatsStore.fetchData(),
        contentStatsStore.fetchData(),
        usageStatsStore.fetchData(),
      ])
    },

    // Users
    users: usersStore.users,
    selectedUser: usersStore.selectedUser,
    userActivities: usersStore.userActivities,
    totalUsers: usersStore.meta?.total || 0,
    hasMoreUsers: usersStore.meta?.hasNextPage || false,
    userSearchFilters: usersStore.params,

    // Users Loading & Error
    usersLoading: usersStore.isLoading,
    usersError: usersStore.error,

    // Users Actions
    searchUsers: usersStore.fetchData,
    selectUser: usersStore.selectUser,
    updateUser: usersStore.updateUser,
    deleteUser: usersStore.deleteUser,
    fetchUserActivities: usersStore.fetchUserActivities,
    setUserSearchFilters: usersStore.setUserSearchFilters,
    nextPage: usersStore.nextPage,
    previousPage: usersStore.previousPage,
    goToPage: usersStore.goToPage,
    setPerPage: usersStore.setPerPage,

    // Combined Loading & Error
    isLoading:
      systemStatsStore.isLoading ||
      userStatsStore.isLoading ||
      contentStatsStore.isLoading ||
      usageStatsStore.isLoading ||
      usersStore.isLoading,
    error:
      systemStatsStore.error ||
      userStatsStore.error ||
      contentStatsStore.error ||
      usageStatsStore.error ||
      usersStore.error,

    // Reset
    reset: () => {
      systemStatsStore.reset()
      userStatsStore.reset()
      contentStatsStore.reset()
      usageStatsStore.reset()
      usersStore.reset()
    },
  }
}
