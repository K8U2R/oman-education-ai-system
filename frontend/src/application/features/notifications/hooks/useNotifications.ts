/**
 * useNotifications Hook - Hook للإشعارات
 *
 * @description Custom Hook لإدارة الإشعارات
 */

import { useEffect, useCallback } from 'react'
import { useNotificationStore } from '../store'
import type {
  NotificationData,
  NotificationType,
  NotificationStatus,
  NotificationStats,
} from '../types'

interface UseNotificationsOptions {
  autoSubscribe?: boolean
  autoFetch?: boolean
  filters?: {
    status?: NotificationStatus
    type?: NotificationType
  }
}

interface UseNotificationsReturn {
  // State
  notifications: NotificationData[]
  stats: NotificationStats | null
  isLoading: boolean
  isSubscribed: boolean
  error: string | null
  unreadCount: number
  hasMore: boolean

  // Actions
  fetchNotifications: (params?: {
    page?: number
    perPage?: number
    status?: NotificationStatus
    type?: NotificationType
  }) => Promise<void>
  fetchStats: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  deleteAll: (params?: { status?: NotificationStatus }) => Promise<void>
  subscribe: () => void
  unsubscribe: () => void
  setFilter: (
    filter: Partial<{
      status: NotificationStatus
      type?: NotificationType
      page: number
      perPage: number
    }>
  ) => void
}

/**
 * Hook لإدارة الإشعارات
 */
export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsReturn => {
  const { autoSubscribe = true, autoFetch = true, filters = {} } = options

  const {
    notifications,
    stats,
    isLoading,
    isSubscribed,
    error,
    unreadCount,
    hasMore,
    // filter,
    fetchNotifications: storeFetchNotifications,
    fetchStats: storeFetchStats,
    markAsRead: storeMarkAsRead,
    markAllAsRead: storeMarkAllAsRead,
    deleteNotification: storeDeleteNotification,
    deleteAll: storeDeleteAll,
    subscribe: storeSubscribe,
    unsubscribe: storeUnsubscribe,
    setFilter: storeSetFilter,
  } = useNotificationStore()

  /**
   * جلب الإشعارات
   */
  const fetchNotifications = useCallback(
    async (params?: {
      page?: number
      perPage?: number
      status?: NotificationStatus
      type?: NotificationType
    }) => {
      await storeFetchNotifications({
        ...filters,
        ...params,
      })
    },
    [storeFetchNotifications, filters]
  )

  /**
   * جلب الإحصائيات
   */
  const fetchStats = useCallback(async () => {
    await storeFetchStats()
  }, [storeFetchStats])

  /**
   * تحديد إشعار كمقروء
   */
  const markAsRead = useCallback(
    async (id: string) => {
      await storeMarkAsRead(id)
    },
    [storeMarkAsRead]
  )

  /**
   * تحديد جميع الإشعارات كمقروءة
   */
  const markAllAsRead = useCallback(async () => {
    await storeMarkAllAsRead()
  }, [storeMarkAllAsRead])

  /**
   * حذف إشعار
   */
  const deleteNotification = useCallback(
    async (id: string) => {
      await storeDeleteNotification(id)
    },
    [storeDeleteNotification]
  )

  /**
   * حذف جميع الإشعارات
   */
  const deleteAll = useCallback(
    async (params?: { status?: NotificationStatus }) => {
      await storeDeleteAll(params)
    },
    [storeDeleteAll]
  )

  /**
   * الاشتراك في الإشعارات الفورية
   */
  const subscribe = useCallback(() => {
    storeSubscribe()
  }, [storeSubscribe])

  /**
   * إلغاء الاشتراك
   */
  const unsubscribe = useCallback(() => {
    storeUnsubscribe()
  }, [storeUnsubscribe])

  /**
   * تعيين الفلتر
   */
  const setFilter = useCallback(
    (
      newFilter: Partial<{
        status: NotificationStatus
        type?: NotificationType
        page: number
        perPage: number
      }>
    ) => {
      storeSetFilter(newFilter)
    },
    [storeSetFilter]
  )

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications()
      fetchStats()
    }
  }, [autoFetch, fetchNotifications, fetchStats])

  // Auto-subscribe on mount
  useEffect(() => {
    if (autoSubscribe) {
      subscribe()
      return () => {
        unsubscribe()
      }
    }
    return undefined
  }, [autoSubscribe, subscribe, unsubscribe])

  return {
    notifications,
    stats,
    isLoading,
    isSubscribed,
    error,
    unreadCount,
    hasMore,
    fetchNotifications,
    fetchStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAll,
    subscribe,
    unsubscribe,
    setFilter,
  }
}
