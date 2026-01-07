/**
 * Notification Store - مخزن الإشعارات
 *
 * Zustand store لإدارة حالة الإشعارات
 */

import { create } from 'zustand'
import {
  NotificationData,
  NotificationStats,
  NotificationFilter,
  NotificationType,
} from '@/domain/types/notification.types'
import { notificationService } from '../services'
import { authService } from '@/application/features/auth/services'

interface NotificationState {
  // State
  notifications: NotificationData[]
  stats: NotificationStats | null
  isLoading: boolean
  isSubscribed: boolean
  error: string | null

  // Filters
  filter: {
    status: 'unread' | 'read' | 'archived' | 'all'
    type?: NotificationType
    page: number
    per_page: number
  }

  // Computed
  unreadCount: number
  hasMore: boolean

  // Actions
  fetchNotifications: (params?: {
    page?: number
    per_page?: number
    status?: 'unread' | 'read' | 'archived' | 'all'
    type?: NotificationType
  }) => Promise<void>
  fetchStats: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  deleteAll: (params?: { status?: 'unread' | 'read' | 'archived' | 'all' }) => Promise<void>
  addNotification: (notification: NotificationData) => void
  updateNotification: (id: string, updates: Partial<NotificationData>) => void
  setFilter: (filter: Partial<NotificationState['filter']>) => void
  subscribe: () => void
  unsubscribe: () => void
  reset: () => void
}

const initialState = {
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
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  ...initialState,

  get unreadCount() {
    return get().stats?.unread ?? 0
  },

  get hasMore() {
    const { notifications, stats } = get()
    if (!stats) return false
    return notifications.length < stats.total
  },

  fetchNotifications: async params => {
    // Check authentication before making request
    if (!authService.isAuthenticated()) {
      return
    }

    // Prevent multiple simultaneous requests
    if (get().isLoading) {
      return
    }

    set({ isLoading: true, error: null })
    try {
      const currentFilter = get().filter
      const mergedParams: NotificationFilter = {
        page: currentFilter.page,
        per_page: currentFilter.per_page,
        status: params?.status ?? currentFilter.status,
        type: params?.type ?? currentFilter.type,
      }

      const response = await notificationService.getNotifications(mergedParams)

      set({
        notifications: response.notifications,
        isLoading: false,
        filter: {
          ...currentFilter,
          ...mergedParams,
        },
      })
    } catch (error: unknown) {
      // Handle 429 (Too Many Requests) gracefully
      const axiosError = error as { response?: { status?: number } }
      if (axiosError?.response?.status === 429) {
        // Don't log 429 errors to avoid console spam
        set({
          error: null, // Don't show error to user for rate limiting
          isLoading: false,
          // Keep existing notifications
        })
        return
      }

      // Only log non-rate-limit errors
      if (axiosError?.response?.status !== 429) {
        // Error logging is handled by the error interceptor
      }

      set({
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        isLoading: false,
        // Keep existing notifications on error
      })
    }
  },

  fetchStats: async () => {
    // Check authentication before making request
    if (!authService.isAuthenticated()) {
      return
    }

    try {
      const stats = await notificationService.getNotificationStats()
      set({ stats })
    } catch (error: unknown) {
      // Handle 429 (Too Many Requests) gracefully
      const axiosError = error as { response?: { status?: number } }
      if (axiosError?.response?.status === 429) {
        // Don't log or update stats for rate limiting
        return
      }

      // Only log non-rate-limit errors
      if (axiosError?.response?.status !== 429) {
        // Error logging is handled by the error interceptor
      }

      // Keep existing stats on error (don't reset to empty)
      // Only reset if we don't have stats at all
      if (!get().stats) {
        set({
          stats: {
            total: 0,
            unread: 0,
            read: 0,
            archived: 0,
            by_type: {} as Record<string, number>,
            by_priority: {} as Record<string, number>,
          },
        })
      }
    }
  },

  markAsRead: async (id: string) => {
    const updated = await notificationService.markNotificationAsRead(id)
    set(state => ({
      notifications: state.notifications.map(n => (n.id === id ? updated : n)),
      stats: state.stats
        ? {
            ...state.stats,
            unread: Math.max(0, state.stats.unread - 1),
            read: state.stats.read + 1,
          }
        : null,
    }))
  },

  markAllAsRead: async () => {
    const response = await notificationService.markAllNotificationsAsRead()
    set(state => ({
      notifications: state.notifications.map(n => ({
        ...n,
        status: 'read' as const,
        read_at: new Date().toISOString(),
      })),
      stats: state.stats
        ? {
            ...state.stats,
            unread: 0,
            read: state.stats.read + (response.updated_count || 0),
          }
        : null,
    }))
  },

  deleteNotification: async (id: string) => {
    await notificationService.deleteNotification(id)
    set(state => {
      const notification = state.notifications.find(n => n.id === id)
      const wasUnread = notification?.status === 'unread'

      return {
        notifications: state.notifications.filter(n => n.id !== id),
        stats: state.stats
          ? {
              ...state.stats,
              total: state.stats.total - 1,
              unread: wasUnread ? Math.max(0, state.stats.unread - 1) : state.stats.unread,
              read: !wasUnread ? Math.max(0, state.stats.read - 1) : state.stats.read,
            }
          : null,
      }
    })
  },

  deleteAll: async params => {
    await notificationService.deleteAllNotifications(params)
    set({
      notifications: [],
      stats: null,
    })
    await get().fetchStats()
  },

  addNotification: (notification: NotificationData) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      stats: state.stats
        ? {
            ...state.stats,
            total: state.stats.total + 1,
            unread: notification.status === 'unread' ? state.stats.unread + 1 : state.stats.unread,
            by_type: {
              ...state.stats.by_type,
              [notification.type]: (state.stats.by_type[notification.type] || 0) + 1,
            },
          }
        : null,
    }))
  },

  updateNotification: (id: string, updates: Partial<NotificationData>) => {
    set(state => ({
      notifications: state.notifications.map(n => (n.id === id ? { ...n, ...updates } : n)),
    }))
  },

  setFilter: filter => {
    set(state => ({
      filter: {
        ...state.filter,
        ...filter,
      },
    }))
  },

  subscribe: () => {
    // Check authentication before subscribing
    if (!authService.isAuthenticated()) {
      return
    }

    if (get().isSubscribed) {
      return // Already subscribed
    }

    notificationService.subscribe((notification: NotificationData) => {
      get().addNotification(notification)
      // Don't fetch stats on every notification to avoid rate limiting
      // Stats will be updated by periodic refresh
    })

    set({ isSubscribed: true })
  },

  unsubscribe: () => {
    if (!get().isSubscribed) {
      return // Not subscribed
    }

    notificationService.unsubscribe()
    set({ isSubscribed: false })
  },

  reset: () => {
    set(initialState)
  },
}))
