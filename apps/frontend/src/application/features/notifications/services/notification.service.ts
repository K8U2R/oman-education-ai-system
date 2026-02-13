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
import { SSEService } from '@/infrastructure/services'
import type { SSEEvent } from '@/infrastructure/services'
import { tokenManager } from '@/infrastructure/services/auth/token-manager.service'

type NotificationCallback = (notification: NotificationData) => void

class NotificationService {
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
    // FORCE DISABLE IN DEV unless explicitly enabled
    if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'true') {
      console.warn('Realtime Notification Service skipped in DEV mode (set VITE_ENABLE_NOTIFICATIONS=true to enable)');
      this.isConnected = false
      return
    }

    if (isDevelopment && skipRealtime) {
      this.isConnected = false
      return
    }

    try {
      const token = tokenManager.getAccessToken() || undefined
      // Use same base URL as API client
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1'

      // Force SSE
      // Remove extra /api/v1 since apiBaseUrl likely includes it
      const sseUrl = import.meta.env.VITE_SSE_URL || `${apiBaseUrl}/notifications/stream`

      try {
        this.sseService = new SSEService(sseUrl)
        this.sseService.connect(token)

        const unsubscribe = this.sseService.on('notification', (event: SSEEvent) => {
          if (event.data) {
            this.handleNotification(event.data)
          }
        })

        // Listen for errors to handle auto-unsubscribe
        this.sseService.on('error', (event: SSEEvent) => {
          const error = event.data as any
          const isAuthError = error?.code === 401 || error?.error?.message?.includes('401') || error?.error?.code === 401

          if (isAuthError) {
            if (import.meta.env.DEV) console.warn('[NotificationService] Auth Error in SSE, unsubscribing...')
            this.unsubscribe()
          }
        })

        this.currentUnsubscribe = unsubscribe
        this.isConnected = true
        return
      } catch (_error) {
        // Error logging is handled by the error interceptor
        this.isConnected = false
      }
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
  get connectionStatus(): { connected: boolean; type?: 'sse' } {
    return {
      connected: this.isConnected,
      type: this.sseService ? 'sse' : undefined,
    }
  }
}

export const notificationService = new NotificationService()
