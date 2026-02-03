/**
 * INotificationRepository - واجهة مستودع الإشعارات
 *
 * واجهة لتحديد عمليات CRUD للإشعارات
 */

import {
  NotificationData,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  NotificationListResponse,
  MarkAllAsReadResponse,
  NotificationStats,
} from '@/domain/types/notification.types'

export interface INotificationRepository {
  /**
   * Get all notifications for current user
   */
  getAll(params?: {
    page?: number
    per_page?: number
    status?: 'unread' | 'read' | 'archived' | 'all'
    type?: string
  }): Promise<NotificationListResponse>

  /**
   * Get notification by ID
   */
  getById(id: string): Promise<NotificationData>

  /**
   * Create a new notification
   */
  create(data: CreateNotificationRequest): Promise<NotificationData>

  /**
   * Update notification
   */
  update(id: string, data: UpdateNotificationRequest): Promise<NotificationData>

  /**
   * Mark notification as read
   */
  markAsRead(id: string): Promise<NotificationData>

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Promise<MarkAllAsReadResponse>

  /**
   * Delete notification
   */
  delete(id: string): Promise<void>

  /**
   * Delete all notifications
   */
  deleteAll(params?: { status?: 'unread' | 'read' | 'archived' | 'all' }): Promise<void>

  /**
   * Get notification statistics
   */
  getStats(): Promise<NotificationStats>

  /**
   * Subscribe to real-time notifications (WebSocket/SSE)
   */
  subscribe(callback: (notification: NotificationData) => void): () => void
}
