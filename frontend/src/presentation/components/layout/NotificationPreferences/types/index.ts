/**
 * Notification Preferences Types - أنواع تفضيلات الإشعارات
 */

/**
 * نوع القناة (Channel Type)
 */
export type ChannelType = 'in-app' | 'email' | 'push'

/**
 * نوع فئة الإشعار (Notification Category Type)
 */
export type NotificationCategoryType =
  | 'educational' // إشعارات تعليمية
  | 'interactive' // إشعارات تفاعلية
  | 'system' // إشعارات النظام
  | 'personal' // إشعارات شخصية

/**
 * نوع الإشعار الفردي (Notification Type)
 */
export type NotificationType =
  | 'new-lesson' // درس جديد
  | 'assignment' // واجب
  | 'grade' // درجة
  | 'comment' // تعليق
  | 'reply' // رد
  | 'message' // رسالة
  | 'maintenance' // صيانة
  | 'update' // تحديث
  | 'announcement' // إعلان
  | 'weekly-report' // تقرير أسبوعي
  | 'reminder' // تذكير

/**
 * إعدادات القناة (Channel Settings)
 */
export interface ChannelSettings {
  enabled: boolean
  sound?: boolean // للـ in-app فقط
}

/**
 * تفضيلات الإشعار الفردي (Notification Preference)
 */
export interface NotificationPreference {
  type: NotificationType
  enabled: boolean
  channels: {
    'in-app': ChannelSettings
    email: ChannelSettings
    push: ChannelSettings
  }
  description?: string // وصف اختياري
}

/**
 * فئة الإشعارات (Notification Category)
 */
export interface NotificationCategory {
  id: NotificationCategoryType
  title: string
  description?: string
  icon?: string // اسم الأيقونة من lucide-react
  preferences: NotificationPreference[]
  defaultExpanded?: boolean
}

/**
 * تفضيلات الإشعارات الكاملة (Full Notification Preferences)
 */
export interface NotificationPreferences {
  categories: NotificationCategory[]
  globalMute?: boolean // كتم عام
  lastUpdated?: string // تاريخ آخر تحديث
}

/**
 * بيانات API Response
 */
export interface NotificationPreferencesResponse {
  success: boolean
  data: NotificationPreferences
  error?: {
    message: string
    code: string
  }
}

/**
 * بيانات Update Request
 */
export interface UpdateNotificationPreferencesRequest {
  categories?: NotificationCategory[]
  globalMute?: boolean
}
