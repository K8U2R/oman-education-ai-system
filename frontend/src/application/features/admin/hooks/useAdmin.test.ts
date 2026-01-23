/**
 * useAdmin Hook Tests - اختبارات Hook الإدارة
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAdmin } from './useAdmin'
import { useAdminStore } from '../store'

// Mock dependencies
vi.mock('../store')

describe('useAdmin', () => {
  const mockUsers = [
    {
      id: '1',
      email: 'user@example.com',
      role: 'student',
      is_active: true,
      is_verified: true,
      created_at: '2025-01-01T00:00:00Z',
    },
  ]

  const mockStoreState = {
    systemStats: null,
    userStats: null,
    contentStats: null,
    usageStats: null,
    users: [],
    selectedUser: null,
    userActivities: [],
    isLoading: false,
    error: null,
    totalUsers: 0,
    hasMoreUsers: false,
    userSearchFilters: {
      page: 1,
      perPage: 20,
    },
    fetchSystemStats: vi.fn(),
    fetchUserStats: vi.fn(),
    fetchContentStats: vi.fn(),
    fetchUsageStats: vi.fn(),
    searchUsers: vi.fn(),
    selectUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    fetchUserActivities: vi.fn(),
    setUserSearchFilters: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAdminStore).mockReturnValue(
      mockStoreState as unknown as ReturnType<typeof useAdminStore>
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state from store', () => {
      const { result } = renderHook(() => useAdmin())

      expect(result.current.systemStats).toBeNull()
      expect(result.current.userStats).toBeNull()
      expect(result.current.contentStats).toBeNull()
      expect(result.current.usageStats).toBeNull()
      expect(result.current.users).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('auto-fetch stats', () => {
    it('should auto-fetch all stats on mount by default', async () => {
      renderHook(() => useAdmin())

      await waitFor(() => {
        expect(mockStoreState.fetchSystemStats).toHaveBeenCalled()
        expect(mockStoreState.fetchUserStats).toHaveBeenCalled()
        expect(mockStoreState.fetchContentStats).toHaveBeenCalled()
        expect(mockStoreState.fetchUsageStats).toHaveBeenCalled()
      })
    })

    it('should not auto-fetch when autoFetchStats is false', async () => {
      renderHook(() => useAdmin({ autoFetchStats: false }))

      await waitFor(() => {
        expect(mockStoreState.fetchSystemStats).not.toHaveBeenCalled()
        expect(mockStoreState.fetchUserStats).not.toHaveBeenCalled()
        expect(mockStoreState.fetchContentStats).not.toHaveBeenCalled()
        expect(mockStoreState.fetchUsageStats).not.toHaveBeenCalled()
      })
    })
  })

  describe('fetchAllStats', () => {
    it('should fetch all stats', async () => {
      const { result } = renderHook(() => useAdmin())

      await result.current.fetchAllStats()

      expect(mockStoreState.fetchSystemStats).toHaveBeenCalled()
      expect(mockStoreState.fetchUserStats).toHaveBeenCalled()
      expect(mockStoreState.fetchContentStats).toHaveBeenCalled()
      expect(mockStoreState.fetchUsageStats).toHaveBeenCalled()
    })
  })

  describe('searchUsers', () => {
    it('should search users with filters', async () => {
      const { result } = renderHook(() => useAdmin())

      await result.current.searchUsers({
        query: 'test',
        role: 'student',
        page: 1,
        per_page: 20,
      })

      expect(mockStoreState.searchUsers).toHaveBeenCalledWith({
        query: 'test',
        role: 'student',
        page: 1,
        per_page: 20,
      })
    })
  })

  describe('selectUser', () => {
    it('should select user', () => {
      const { result } = renderHook(() => useAdmin())

      const user = mockUsers[0]
      if (user) {
        result.current.selectUser(user)
        expect(mockStoreState.selectUser).toHaveBeenCalledWith(user)
      }
    })

    it('should deselect user when null', () => {
      const { result } = renderHook(() => useAdmin())

      result.current.selectUser(null)

      expect(mockStoreState.selectUser).toHaveBeenCalledWith(null)
    })
  })

  describe('updateUser', () => {
    it('should update user', async () => {
      const { result } = renderHook(() => useAdmin())

      const updateData = {
        role: 'teacher',
        is_active: true,
      }

      await result.current.updateUser('user-id', updateData)

      expect(mockStoreState.updateUser).toHaveBeenCalledWith('user-id', updateData)
    })
  })

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const { result } = renderHook(() => useAdmin())

      await result.current.deleteUser('user-id')

      expect(mockStoreState.deleteUser).toHaveBeenCalledWith('user-id')
    })
  })

  describe('fetchUserActivities', () => {
    it('should fetch user activities', async () => {
      const { result } = renderHook(() => useAdmin())

      await result.current.fetchUserActivities()

      expect(mockStoreState.fetchUserActivities).toHaveBeenCalled()
    })
  })

  describe('setUserSearchFilters', () => {
    it('should set user search filters', () => {
      const { result } = renderHook(() => useAdmin())

      result.current.setUserSearchFilters({
        query: 'test',
        role: 'student',
      })

      expect(mockStoreState.setUserSearchFilters).toHaveBeenCalledWith({
        query: 'test',
        role: 'student',
      })
    })
  })
})
