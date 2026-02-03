/**
 * Admin Users Store - مخزن المستخدمين
 *
 * Store للمستخدمين مع دعم البحث والصفحات
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createPaginatedStore } from '@/application/shared/store'
import { adminService } from '../services'
import type { AdminUserInfo, SearchUsersRequest, UpdateUserRequest } from '../types'

interface UsersState {
  selectedUser: AdminUserInfo | null
  userActivities: Array<unknown>

  // Actions
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
 * Store للمستخدمين مع Pagination
 */
const useUsersPaginatedStoreBase = createPaginatedStore<AdminUserInfo>({
  fetchFn: async params => {
    const request: SearchUsersRequest = {
      page: params.page,
      per_page: params.perPage,
    }

    const result = await adminService.searchUsers(request)

    return {
      data: result.users,
      meta: {
        currentPage: result.page,
        perPage: result.per_page,
        total: result.total,
        totalPages: result.total_pages,
        hasPreviousPage: result.page > 1,
        hasNextPage: result.page < result.total_pages,
      },
    }
  },
  defaultPerPage: 20,
  defaultErrorMessage: 'فشل جلب المستخدمين',
  name: 'UsersPaginatedStore',
})

// Get store instance for direct state access (outside React components)
// Note: Zustand stores created with create() have getState() method
const getUsersPaginatedStoreState = () => {
  // Access the store's getState method
  const store = useUsersPaginatedStoreBase as unknown as {
    getState: () => ReturnType<typeof useUsersPaginatedStoreBase>
  }
  return store.getState()
}

/**
 * Store إضافي لإدارة حالة المستخدمين
 */
export const useUsersStateStore = create<UsersState>()(
  devtools(
    set => ({
      selectedUser: null,
      userActivities: [],

      selectUser: user => {
        set({ selectedUser: user })
      },

      updateUser: async (userId, request) => {
        try {
          const updated = await adminService.updateUser(userId, request)

          // تحديث في Paginated Store - نستخدم fetchData لإعادة جلب البيانات
          const paginatedState = getUsersPaginatedStoreState()
          await paginatedState.fetchData()

          // تحديث selectedUser
          set(state => ({
            selectedUser: state.selectedUser?.id === userId ? updated : state.selectedUser,
          }))

          return updated
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'فشل تحديث المستخدم'
          throw new Error(errorMessage)
        }
      },

      deleteUser: async userId => {
        try {
          await adminService.deleteUser(userId)

          // إعادة جلب البيانات من Paginated Store
          const paginatedState = getUsersPaginatedStoreState()
          await paginatedState.fetchData()

          // إزالة selectedUser إذا كان محذوفاً
          set(state => ({
            selectedUser: state.selectedUser?.id === userId ? null : state.selectedUser,
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'فشل حذف المستخدم'
          throw new Error(errorMessage)
        }
      },

      fetchUserActivities: async () => {
        try {
          const activities = await adminService.getUserActivities()
          set({ userActivities: activities })
        } catch (error) {
          console.error('Failed to load user activities:', error)
        }
      },

      setUserSearchFilters: filters => {
        // يمكن استخدام filters لتحديث Paginated Store
        const paginatedState = getUsersPaginatedStoreState()
        if (paginatedState.fetchData) {
          paginatedState.fetchData({
            ...paginatedState.params,
            ...filters,
          })
        }
      },
    }),
    { name: 'UsersStateStore' }
  )
)

/**
 * Export combined store
 */
export const useUsersStore = () => {
  const paginatedStore = useUsersPaginatedStoreBase()
  const stateStore = useUsersStateStore()

  return {
    // Paginated data
    users: paginatedStore.data,
    meta: paginatedStore.meta,
    isLoading: paginatedStore.isLoading,
    error: paginatedStore.error,
    params: paginatedStore.params,

    // Pagination actions
    fetchData: paginatedStore.fetchData,
    nextPage: paginatedStore.nextPage,
    previousPage: paginatedStore.previousPage,
    goToPage: paginatedStore.goToPage,
    setPerPage: paginatedStore.setPerPage,
    reset: paginatedStore.reset,
    clearError: paginatedStore.clearError,

    // State actions
    selectedUser: stateStore.selectedUser,
    userActivities: stateStore.userActivities,
    selectUser: stateStore.selectUser,
    updateUser: stateStore.updateUser,
    deleteUser: stateStore.deleteUser,
    fetchUserActivities: stateStore.fetchUserActivities,
    setUserSearchFilters: stateStore.setUserSearchFilters,
  }
}
