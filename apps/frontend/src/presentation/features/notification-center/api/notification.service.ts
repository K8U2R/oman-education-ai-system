/**
 * Notification Service - خدمة الإشعارات
 *
 * خدمة للتعامل مع API الإشعارات
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { API_ENDPOINTS } from '@/domain/constants/api.constants'
import {
  NotificationData,
  NotificationStats,
  NotificationFilter,
} from '@/domain/types/notification.types'
import { WebSocketService, SSEService } from '@/infrastructure/services'
import type { WebSocketEvent, SSEEvent } from '@/infrastructure/services'

type NotificationCallback = (notification: NotificationData) => void

class NotificationService {
  private wsService: WebSocketService | null = null
  private sseService: SSEService | null = null
  private currentUnsubscribe: (() => void) | null = null
  private callbacks: Set<NotificationCallback> = new Set()
  private isConnected = false

  /**
   * الحصول على جميع الإشعارات
   */
  async getNotifications(
    params?: NotificationFilter
  ): Promise<{ notifications: NotificationData[]; total: number }> {
    try {
      const response = await apiClient.get<{
        success: boolean
        data: {
          notifications: NotificationData[]
          total: number
          page: number
          per_page: number
          total_pages: number
        }
      }>(API_ENDPOINTS.NOTIFICATIONS.LIST, { params })
      // Extract data from response structure
      const data = response.data || response
      return {
        notifications: data.notifications || [],
        total: data.total || 0,
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications'
      throw new Error(errorMessage)
    }
  }

  /**
   * الحصول على إشعار واحد
   */
  async getNotification(id: string): Promise<NotificationData> {
    const response = await apiClient.get<NotificationData>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id))
    return response
  }

  /**
   * إنشاء إشعار جديد
   */
  async createNotification(
    data: Omit<NotificationData, 'id' | 'created_at' | 'updated_at'>
  ): Promise<NotificationData> {
    const response = await apiClient.post<NotificationData>(API_ENDPOINTS.NOTIFICATIONS.LIST, data)
    return response
  }

  /**
   * تحديث إشعار
   */
  async updateNotification(id: string, data: Partial<NotificationData>): Promise<NotificationData> {
    const response = await apiClient.patch<NotificationData>(
      API_ENDPOINTS.NOTIFICATIONS.BY_ID(id),
      data
    )
    return response
  }

  /**
   * حذف إشعار
   */
  async deleteNotification(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id))
  }

  /**
   * حذف جميع الإشعارات
   */
  async deleteAllNotifications(params?: {
    status?: 'unread' | 'read' | 'archived' | 'all'
  }): Promise<void> {
    const url = params
      ? `${API_ENDPOINTS.NOTIFICATIONS.LIST}?status=${params.status || 'all'}`
      : API_ENDPOINTS.NOTIFICATIONS.LIST
    await apiClient.delete(url)
  }

  /**
   * تحديد إشعار كمقروء
   */
  async markNotificationAsRead(id: string): Promise<NotificationData> {
    const response = await apiClient.post<NotificationData>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
    )
    return response
  }

  /**
   * تحديد جميع الإشعارات كمقروءة
   */
  async markAllNotificationsAsRead(): Promise<{ updated_count: number }> {
    const response = await apiClient.post<{ updated_count: number }>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
    )
    return response
  }

  /**
   * الحصول على إحصائيات الإشعارات
   */
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const response = await apiClient.get<{
        success: boolean
        data: NotificationStats
      }>(API_ENDPOINTS.NOTIFICATIONS.STATS)
      // Extract data from response structure
      return response.data || response
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch notification stats'
      throw new Error(errorMessage)
    }
  }

  /**
   * الاشتراك في الإشعارات في الوقت الفعلي
   */
  subscribe(callback: NotificationCallback): () => void {
    this.callbacks.add(callback)

    // If already connected, return unsubscribe function
    if (this.isConnected && this.currentUnsubscribe) {
      return () => {
        this.callbacks.delete(callback)
        if (this.callbacks.size === 0) {
          this.unsubscribe()
        }
      }
    }

    // Initialize connection if not already connected
    if (!this.isConnected) {
      this.initializeRealtimeConnection()
    }

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback)
      if (this.callbacks.size === 0) {
        this.unsubscribe()
      }
    }
  }

  /**
   * إلغاء الاشتراك
   */
  unsubscribe(): void {
    if (this.currentUnsubscribe) {
      this.currentUnsubscribe()
      this.currentUnsubscribe = null
    }

    if (this.wsService) {
      this.wsService.disconnect()
      this.wsService = null
    }

    if (this.sseService) {
      this.sseService.disconnect()
      this.sseService = null
    }

    this.callbacks.clear()
    this.isConnected = false
  }

  /**
   * تهيئة الاتصال في الوقت الفعلي
   */
  private async initializeRealtimeConnection(): Promise<void> {
    // في development mode، نتخطى الاتصال تماماً إذا كان الـ backend لا يدعم WebSocket/SSE
    const isDevelopment = import.meta.env.DEV
    const skipRealtime = import.meta.env.VITE_SKIP_REALTIME === 'true'

    // في development mode، إذا كان VITE_SKIP_REALTIME=true، نتخطى الاتصال تماماً
    if (isDevelopment && skipRealtime) {
      this.isConnected = false
      return
    }

    try {
      const token =
        localStorage.getItem('access_token') || localStorage.getItem('token') || undefined
      // Use same base URL as API client, convert http to ws
      // Extract base URL without /api/v1 suffix
      let apiBaseUrl = import.meta.env.VITE_API_BASE_URL      // Remove /api/v1 if present
      apiBaseUrl = apiBaseUrl.replace(/\/api\/v1$/, '')
      const wsBaseUrl = apiBaseUrl.replace(/^http/, 'ws')
      const wsUrl = import.meta.env.VITE_WS_URL || `${wsBaseUrl}/ws/notifications`
      const sseUrl = import.meta.env.VITE_SSE_URL || `${apiBaseUrl}/notifications/stream`

      // في development mode، نحاول الاتصال مرة واحدة فقط بدون إعادة محاولة
      if (isDevelopment) {
        // Try WebSocket first (with very short timeout)
        if (typeof WebSocket !== 'undefined') {
          try {
            this.wsService = new WebSocketService(wsUrl)
            // Set a very short timeout for connection (2 seconds in dev)
            const connectPromise = this.wsService.connect(token)
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Connection timeout')), 2000)
            )

            await Promise.race([connectPromise, timeoutPromise])

            const unsubscribe = this.wsService.on('notification', (event: WebSocketEvent) => {
              if (event.data) {
                this.handleNotification(event.data)
              }
            })

            this.currentUnsubscribe = unsubscribe
            this.isConnected = true
            return
          } catch (_error: unknown) {
            // في development mode، نتوقف بهدوء بدون أخطاء
            this.wsService = null
          }
        }

        // Fallback to SSE - try once only
        try {
          this.sseService = new SSEService(sseUrl)
          this.sseService.connect(token)

          const unsubscribe = this.sseService.on('notification', (event: SSEEvent) => {
            if (event.data) {
              this.handleNotification(event.data)
            }
          })

          this.currentUnsubscribe = unsubscribe
          this.isConnected = true
          return
        } catch (_error) {
          // في development mode، نتوقف بهدوء
          this.sseService = null
        }

        // في development mode، إذا فشل الاتصال، نتوقف بدون أخطاء
        this.isConnected = false
        return
      }

      // Production mode - full retry logic
      // Try WebSocket first
      if (typeof WebSocket !== 'undefined') {
        try {
          this.wsService = new WebSocketService(wsUrl)
          // Set a timeout for connection (5 seconds)
          const connectPromise = this.wsService.connect(token)
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timeout')), 5000)
          )

          await Promise.race([connectPromise, timeoutPromise])

          const unsubscribe = this.wsService.on('notification', (event: WebSocketEvent) => {
            if (event.data) {
              this.handleNotification(event.data)
            }
          })

          this.currentUnsubscribe = unsubscribe
          this.isConnected = true
          return
        } catch (_error: unknown) {
          // Error logging is handled by the error interceptor
          // In development, errors are logged automatically
        }
      }

      // Fallback to SSE
      this.sseService = new SSEService(sseUrl)
      this.sseService.connect(token)

      const unsubscribe = this.sseService.on('notification', (event: SSEEvent) => {
        if (event.data) {
          this.handleNotification(event.data)
        }
      })

      this.currentUnsubscribe = unsubscribe
      this.isConnected = true
    } catch (_error) {
      // Error logging is handled by the error interceptor
      this.isConnected = false
    }
  }

  /**
   * معالجة إشعار جديد
   */
  private handleNotification(data: unknown): void {
    try {
      // Type guard للتحقق من البيانات
      if (!data || typeof data !== 'object') {
        return
      }

      const notificationData = data as Record<string, unknown>

      // Convert to NotificationData format if needed
      const notification: NotificationData = {
        id: (notificationData.id as string) || (notificationData.notification_id as string) || '',
        user_id: notificationData.user_id as string,
        type: notificationData.type as NotificationData['type'],
        title: notificationData.title as string,
        message: notificationData.message as string,
        status: (notificationData.status as NotificationData['status']) || 'unread',
        action_url: notificationData.action_url as string | undefined,
        created_at: (notificationData.created_at as string) || new Date().toISOString(),
        updated_at: (notificationData.updated_at as string) || new Date().toISOString(),
        read_at: notificationData.read_at as string | undefined,
      }

      // Notify all callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(notification)
        } catch (_error) {
          // Error logging is handled by the error interceptor
        }
      })
    } catch (_error) {
      // Error logging is handled by the error interceptor
    }
  }

  /**
   * التحقق من حالة الاتصال
   */
  get connectionStatus(): { connected: boolean; type?: 'websocket' | 'sse' } {
    return {
      connected: this.isConnected,
      type: this.wsService ? 'websocket' : this.sseService ? 'sse' : undefined,
    }
  }
}

export const notificationService = new NotificationService()
