/**
 * Notification Types - أنواع الإشعارات
 *
 * TypeScript types للإشعارات
 */

/**
 * نوع الإشعار
 */
export type NotificationType =
  | "info" // معلومات عامة
  | "success" // نجاح عملية
  | "warning" // تحذير
  | "error" // خطأ
  | "lesson" // إشعار متعلق بدرس
  | "assignment" // إشعار متعلق بواجب
  | "achievement" // إشعار إنجاز
  | "system"; // إشعار نظام

/**
 * حالة الإشعار
 */
export type NotificationStatus =
  | "unread" // غير مقروء
  | "read" // مقروء
  | "archived"; // مؤرشف

/**
 * بيانات الإشعار من قاعدة البيانات
 */
export interface NotificationData {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  action_url?: string | null;
  action_label?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  read_at?: string | null;
  archived_at?: string | null;
  updated_at: string;
}

/**
 * بيانات إنشاء إشعار جديد
 */
export interface CreateNotificationRequest {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  metadata?: Record<string, unknown>;
}

/**
 * بيانات تحديث إشعار
 */
export interface UpdateNotificationRequest {
  status?: NotificationStatus;
  read_at?: Date;
  archived_at?: Date;
}

/**
 * إحصائيات الإشعارات
 */
export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
}

/**
 * نتيجة جلب الإشعارات
 */
export interface NotificationListResponse {
  data: NotificationData[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
