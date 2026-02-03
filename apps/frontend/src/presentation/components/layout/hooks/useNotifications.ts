/**
 * useNotifications Hook - Hook للإشعارات
 *
 * Custom Hook لإدارة الإشعارات مع التكامل مع Notification Service
 */

import { useEffect, useCallback, useMemo, useRef } from 'react'
import { useNotificationStore } from '@/features/notification-center'
import { NotificationData } from '@/domain/types/notification.types'
import { Notification } from '../types'
import { authService } from '@/features/user-authentication-management'
import { useAuth } from '@/features/user-authentication-management'

/**
 * Convert NotificationData to Notification format for UI
 */
const convertToUINotification = (data: NotificationData): Notification => {
  // Calculate relative time
  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'الآن'
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`
    if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`
    return date.toLocaleDateString('ar-OM')
  }

  return {
    id: data.id,
    type: data.type,
    title: data.title,
    message: data.message,
    time: timeAgo(data.created_at),
    read: data.status === 'read',
    actionUrl: data.action_url,
  }
}

export const useNotifications = () => {
  const { isAuthenticated } = useAuth()
  const {
    notifications: notificationData,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchStats,
    markAsRead: markAsReadStore,
    markAllAsRead: markAllAsReadStore,
    deleteNotification: deleteNotificationStore,
    deleteAll,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscribe: _subscribe,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unsubscribe: _unsubscribe,
  } = useNotificationStore()

  // Convert NotificationData to UI format
  const notifications = useMemo(
    () => (notificationData || []).map(convertToUINotification),
    [notificationData]
  )

  // Fetch notifications on mount (with debounce to avoid multiple calls)
  useEffect(() => {
    // Double check authentication
    if (!authService.isAuthenticated()) {
      return
    }

    let mounted = true
    const timeoutId = setTimeout(() => {
      if (mounted) {
        // Use store functions directly to avoid dependency issues
        const store = useNotificationStore.getState()
        store.fetchNotifications().catch(() => {
          // Silently handle errors to avoid console spam
        })
        store.fetchStats().catch(() => {
          // Silently handle errors to avoid console spam
        })
      }
    }, 100) // Small delay to batch initial calls

    return () => {
      mounted = false
      clearTimeout(timeoutId)
    }
  }, [])

  // Subscribe to real-time notifications (only once)
  useEffect(() => {
    // في development mode، نتخطى الاشتراك إذا كان الـ backend غير متاح
    const skipRealtime = import.meta.env.DEV && import.meta.env.VITE_SKIP_REALTIME === 'true'
    if (!skipRealtime) {
      const store = useNotificationStore.getState()
      if (!store.isSubscribed) {
        store.subscribe()
      }
      return () => {
        const store = useNotificationStore.getState()
        if (store.isSubscribed) {
          store.unsubscribe()
        }
      }
    }
    return undefined
  }, [])

  // Refresh notifications periodically (every 2 minutes) as fallback
  // في development mode، نزيد الفترة لتقليل الطلبات وتجنب 429 errors
  // استخدام useRef لضمان أن الـ interval لا يتم إعادة إنشائه
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Only set up interval if user is authenticated
    if (!authService.isAuthenticated()) {
      return // Don't set up interval if not authenticated
    }

    intervalRef.current = setInterval(
      () => {
        // Check authentication again before each fetch
        if (!authService.isAuthenticated()) {
          // Clear interval if user logged out
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return
        }

        // Use store functions directly to avoid dependency issues
        const currentStore = useNotificationStore.getState()
        // Only refresh if not loading to avoid overlapping requests
        if (!currentStore.isLoading) {
          currentStore.fetchNotifications().catch(() => {
            // Silently handle errors (429, etc.)
          })
          currentStore.fetchStats().catch(() => {
            // Silently handle errors (429, etc.)
          })
        }
      },
      import.meta.env.DEV ? 120000 : 120000
    ) // 2 minutes in both dev and production

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    // Intentionally empty dependency array - only run once on mount
    // Interval uses store functions directly to avoid dependency issues
  }, [])

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await markAsReadStore(id)
        // Refresh stats after marking as read
        await fetchStats()
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
        throw error
      }
    },
    [markAsReadStore, fetchStats]
  )

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadStore()
      await fetchStats()
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      throw error
    }
  }, [markAllAsReadStore, fetchStats])

  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        await deleteNotificationStore(id)
        await fetchStats()
      } catch (error) {
        console.error('Failed to delete notification:', error)
        throw error
      }
    },
    [deleteNotificationStore, fetchStats]
  )

  const clearAll = useCallback(async () => {
    try {
      await deleteAll()
      await fetchStats()
    } catch (error) {
      console.error('Failed to clear all notifications:', error)
      throw error
    }
  }, [deleteAll, fetchStats])

  const refresh = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchStats()])
  }, [fetchNotifications, fetchStats])

  // Return default values if not authenticated
  if (!isAuthenticated) {
    return {
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      markAsRead: async () => {},
      markAllAsRead: async () => {},
      deleteNotification: async () => {},
      clearAll: async () => {},
      refresh: async () => {},
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refresh,
  }
}
