/**
 * Notification Preferences Constants - ثوابت تفضيلات الإشعارات
 */

import { NotificationCategory, NotificationType } from '../types'
import {
  BookOpen,
  Bell,
  FileText,
  Award,
  MessageCircle,
  Reply,
  Mail,
  Wrench,
  Download,
  Megaphone,
  Calendar,
  Clock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * تسميات أنواع الإشعارات
 */
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  'new-lesson': 'درس جديد',
  assignment: 'واجب',
  grade: 'درجة',
  comment: 'تعليق',
  reply: 'رد',
  message: 'رسالة',
  maintenance: 'صيانة',
  update: 'تحديث',
  announcement: 'إعلان',
  'weekly-report': 'تقرير أسبوعي',
  reminder: 'تذكير',
}

/**
 * أوصاف أنواع الإشعارات
 */
export const NOTIFICATION_TYPE_DESCRIPTIONS: Partial<Record<NotificationType, string>> = {
  'new-lesson': 'إشعار عند إضافة درس جديد في مسارك التعليمي',
  assignment: 'إشعار عند تعيين واجب جديد أو قرب موعد التسليم',
  grade: 'إشعار عند نشر درجات جديدة',
  comment: 'إشعار عند إضافة تعليق على مشاركتك',
  reply: 'إشعار عند الرد على تعليقك',
  message: 'إشعار عند استلام رسالة جديدة',
  maintenance: 'إشعارات حول صيانة النظام',
  update: 'إشعارات حول التحديثات الجديدة',
  announcement: 'إشعارات الإعلانات العامة',
  'weekly-report': 'تقرير أسبوعي عن تقدمك',
  reminder: 'تذكيرات للمهام والمواعيد',
}

/**
 * أيقونات أنواع الإشعارات
 */
export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  'new-lesson': BookOpen,
  assignment: FileText,
  grade: Award,
  comment: MessageCircle,
  reply: Reply,
  message: Mail,
  maintenance: Wrench,
  update: Download,
  announcement: Megaphone,
  'weekly-report': Calendar,
  reminder: Clock,
}

/**
 * تسميات القنوات
 */
export const CHANNEL_LABELS: Record<'in-app' | 'email' | 'push', string> = {
  'in-app': 'في التطبيق',
  email: 'بريد إلكتروني',
  push: 'إشعارات Push',
}

/**
 * أيقونات القنوات
 */
export const CHANNEL_ICONS: Record<'in-app' | 'email' | 'push', LucideIcon> = {
  'in-app': Bell,
  email: Mail,
  push: Bell,
}

/**
 * التفضيلات الافتراضية
 */
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationCategory[] = [
  {
    id: 'educational',
    title: 'إشعارات تعليمية',
    description: 'إشعارات حول الدروس والواجبات والدرجات',
    icon: 'BookOpen',
    defaultExpanded: true,
    preferences: [
      {
        type: 'new-lesson',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: true },
          email: { enabled: false },
          push: { enabled: true },
        },
      },
      {
        type: 'assignment',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: true },
          email: { enabled: true },
          push: { enabled: true },
        },
      },
      {
        type: 'grade',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: false },
          email: { enabled: true },
          push: { enabled: false },
        },
      },
    ],
  },
  {
    id: 'interactive',
    title: 'إشعارات تفاعلية',
    description: 'إشعارات حول التعليقات والردود والرسائل',
    icon: 'MessageSquare',
    defaultExpanded: false,
    preferences: [
      {
        type: 'comment',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: true },
          email: { enabled: false },
          push: { enabled: true },
        },
      },
      {
        type: 'reply',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: true },
          email: { enabled: false },
          push: { enabled: true },
        },
      },
      {
        type: 'message',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: true },
          email: { enabled: true },
          push: { enabled: true },
        },
      },
    ],
  },
  {
    id: 'system',
    title: 'إشعارات النظام',
    description: 'إشعارات حول الصيانة والتحديثات والإعلانات',
    icon: 'Bell',
    defaultExpanded: false,
    preferences: [
      {
        type: 'maintenance',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: false },
          email: { enabled: true },
          push: { enabled: true },
        },
      },
      {
        type: 'update',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: false },
          email: { enabled: false },
          push: { enabled: true },
        },
      },
      {
        type: 'announcement',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: true },
          email: { enabled: true },
          push: { enabled: true },
        },
      },
    ],
  },
  {
    id: 'personal',
    title: 'إشعارات شخصية',
    description: 'تقارير أسبوعية وتذكيرات',
    icon: 'User',
    defaultExpanded: false,
    preferences: [
      {
        type: 'weekly-report',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: false },
          email: { enabled: true },
          push: { enabled: false },
        },
      },
      {
        type: 'reminder',
        enabled: true,
        channels: {
          'in-app': { enabled: true, sound: true },
          email: { enabled: false },
          push: { enabled: true },
        },
      },
    ],
  },
]
