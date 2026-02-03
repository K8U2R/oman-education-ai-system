/**
 * Notification Types - أنواع الإشعارات
 *
 * جميع Types و Interfaces المتعلقة بالإشعارات
 */

/**
 * Notification Type
 */
export type NotificationType =
  | 'message'
  | 'alert'
  | 'task'
  | 'test'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'assignment'
  | 'announcement'

/**
 * Notification Priority
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

/**
 * Notification Status
 */
export type NotificationStatus = 'unread' | 'read' | 'archived' | 'all'

/**
 * Notification Data (from API)
 */
export interface NotificationData {
  id: string
  type: NotificationType
  title: string
  message: string
  priority?: NotificationPriority
  status: NotificationStatus
  action_url?: string
  action_label?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at?: string
  read_at?: string
  user_id: string
}

/**
 * Create Notification Request
 */
export interface CreateNotificationRequest {
  type: NotificationType
  title: string
  message: string
  priority?: NotificationPriority
  action_url?: string
  action_label?: string
  metadata?: Record<string, unknown>
  user_id?: string
}

/**
 * Update Notification Request
 */
export interface UpdateNotificationRequest {
  status?: NotificationStatus
  read_at?: string
}

/**
 * Notification List Response
 */
export interface NotificationListResponse {
  notifications: NotificationData[]
  total: number
  unread_count: number
  page?: number
  per_page?: number
  total_pages?: number
}

/**
 * Mark All as Read Response
 */
export interface MarkAllAsReadResponse {
  success: boolean
  updated_count: number
}

/**
 * Notification Statistics
 */
export interface NotificationStats {
  total: number
  unread: number
  read: number
  archived: number
  by_type: Record<NotificationType, number>
  by_priority: Record<NotificationPriority, number>
}

/**
 * NotificationFilter - فلتر الإشعارات
 */
export interface NotificationFilter {
  page?: number
  per_page?: number
  status?: NotificationStatus
  type?: NotificationType
}
