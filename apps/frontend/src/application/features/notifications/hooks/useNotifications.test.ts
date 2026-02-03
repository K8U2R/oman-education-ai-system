/**
 * useNotifications Hook Tests - اختبارات Hook الإشعارات
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useNotifications } from './useNotifications'
import { useNotificationStore } from '../store'

// Mock dependencies
vi.mock('../store')
vi.mock('@/features/user-authentication-management', () => ({
  authService: {
    isAuthenticated: vi.fn(() => true),
  },
}))

describe('useNotifications', () => {
  const mockNotifications = [
    {
      id: '1',
      user_id: 'user-1',
      type: 'message' as const,
      title: 'إشعار جديد',
      message: 'رسالة تجريبية',
      status: 'unread' as const,
      created_at: '2025-01-08T10:00:00Z',
      updated_at: '2025-01-08T10:00:00Z',
    },
  ]

  const mockStats = {
    total: 10,
    unread: 5,
    read: 3,
    archived: 2,
    by_type: {} as Record<string, number>,
    by_priority: {} as Record<string, number>,
  }

  const mockStoreState = {
    notifications: [],
    stats: null,
    isLoading: false,
    isSubscribed: false,
    error: null,
    filter: {
      status: 'all' as const,
      page: 1,
      per_page: 20,
    },
    unreadCount: 0,
    hasMore: false,
    fetchNotifications: vi.fn(),
    fetchStats: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    deleteNotification: vi.fn(),
    deleteAll: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    setFilter: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNotificationStore).mockReturnValue(
      mockStoreState as ReturnType<typeof useNotificationStore>
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state from store', () => {
      const { result } = renderHook(() => useNotifications())

      expect(result.current.notifications).toEqual([])
      expect(result.current.stats).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isSubscribed).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.unreadCount).toBe(0)
      expect(result.current.hasMore).toBe(false)
    })

    it('should return notifications from store when available', () => {
      vi.mocked(useNotificationStore).mockReturnValue({
        ...mockStoreState,
        notifications: mockNotifications,
        stats: mockStats,
        unreadCount: 5,
      } as ReturnType<typeof useNotificationStore>)

      const { result } = renderHook(() => useNotifications())

      expect(result.current.notifications).toEqual(mockNotifications)
      expect(result.current.stats).toEqual(mockStats)
      expect(result.current.unreadCount).toBe(5)
    })
  })

  describe('auto-fetch', () => {
    it('should auto-fetch notifications and stats on mount by default', async () => {
      renderHook(() => useNotifications())

      await waitFor(() => {
        expect(mockStoreState.fetchNotifications).toHaveBeenCalled()
        expect(mockStoreState.fetchStats).toHaveBeenCalled()
      })
    })

    it('should not auto-fetch when autoFetch is false', async () => {
      renderHook(() => useNotifications({ autoFetch: false }))

      await waitFor(() => {
        expect(mockStoreState.fetchNotifications).not.toHaveBeenCalled()
        expect(mockStoreState.fetchStats).not.toHaveBeenCalled()
      })
    })
  })

  describe('auto-subscribe', () => {
    it('should auto-subscribe on mount by default', async () => {
      const { unmount } = renderHook(() => useNotifications())

      await waitFor(() => {
        expect(mockStoreState.subscribe).toHaveBeenCalled()
      })

      unmount()

      await waitFor(() => {
        expect(mockStoreState.unsubscribe).toHaveBeenCalled()
      })
    })

    it('should not auto-subscribe when autoSubscribe is false', async () => {
      renderHook(() => useNotifications({ autoSubscribe: false }))

      await waitFor(() => {
        expect(mockStoreState.subscribe).not.toHaveBeenCalled()
      })
    })
  })

  describe('fetchNotifications', () => {
    it('should fetch notifications with filters', async () => {
      const { result } = renderHook(() => useNotifications())

      await result.current.fetchNotifications({
        status: 'unread',
        type: 'message',
        page: 1,
        perPage: 20,
      })

      expect(mockStoreState.fetchNotifications).toHaveBeenCalledWith({
        status: 'unread',
        type: 'message',
        page: 1,
        perPage: 20,
      })
    })
  })

  describe('fetchStats', () => {
    it('should fetch stats', async () => {
      const { result } = renderHook(() => useNotifications())

      await result.current.fetchStats()

      expect(mockStoreState.fetchStats).toHaveBeenCalled()
    })
  })

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const { result } = renderHook(() => useNotifications())

      await result.current.markAsRead('notification-id')

      expect(mockStoreState.markAsRead).toHaveBeenCalledWith('notification-id')
    })
  })

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const { result } = renderHook(() => useNotifications())

      await result.current.markAllAsRead()

      expect(mockStoreState.markAllAsRead).toHaveBeenCalled()
    })
  })

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const { result } = renderHook(() => useNotifications())

      await result.current.deleteNotification('notification-id')

      expect(mockStoreState.deleteNotification).toHaveBeenCalledWith('notification-id')
    })
  })

  describe('deleteAll', () => {
    it('should delete all notifications', async () => {
      const { result } = renderHook(() => useNotifications())

      await result.current.deleteAll({ status: 'read' })

      expect(mockStoreState.deleteAll).toHaveBeenCalledWith({ status: 'read' })
    })
  })

  describe('subscribe/unsubscribe', () => {
    it('should subscribe to notifications', () => {
      const { result } = renderHook(() => useNotifications())

      result.current.subscribe()

      expect(mockStoreState.subscribe).toHaveBeenCalled()
    })

    it('should unsubscribe from notifications', () => {
      const { result } = renderHook(() => useNotifications())

      result.current.unsubscribe()

      expect(mockStoreState.unsubscribe).toHaveBeenCalled()
    })
  })

  describe('setFilter', () => {
    it('should set filter', () => {
      const { result } = renderHook(() => useNotifications())

      result.current.setFilter({
        status: 'unread',
        type: 'message',
      })

      expect(mockStoreState.setFilter).toHaveBeenCalledWith({
        status: 'unread',
        type: 'message',
      })
    })
  })
})
