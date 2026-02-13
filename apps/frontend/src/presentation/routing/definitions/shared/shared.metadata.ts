/**
 * Shared Routes Metadata - بيانات المسارات المشتركة
 *
 * Metadata للمسارات المشتركة بين جميع المستخدمين (Profile, Settings, Subscription, User Security)
 */

import { RouteMetadata } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import { User, Settings, CreditCard, Shield } from 'lucide-react'

export const sharedMetadata: Record<string, RouteMetadata> = {
  [ROUTES.PROFILE]: {
    title: 'الملف الشخصي',
    description: 'إدارة ملفك الشخصي',
    requiresAuth: true,
    breadcrumb: 'breadcrumbs.profile',
    icon: User,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.SETTINGS]: {
    title: 'الإعدادات',
    description: 'إعدادات الحساب',
    requiresAuth: true,
    breadcrumb: 'breadcrumbs.settings',
    icon: Settings,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.SUBSCRIPTION]: {
    title: 'الاشتراك والباقات',
    description: 'إدارة الاشتراك',
    requiresAuth: true,
    breadcrumb: 'breadcrumbs.subscription',
    icon: CreditCard,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.USER_SECURITY]: {
    title: 'الأمان',
    description: 'إدارة أمان حسابك',
    requiresAuth: true,
    breadcrumb: 'breadcrumbs.security',
    icon: Shield,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.USER_SECURITY_SETTINGS]: {
    title: 'إعدادات الأمان',
    description: 'تكوين إعدادات الأمان لحسابك',
    requiresAuth: true,
    breadcrumb: 'breadcrumbs.security_settings',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.USER_SECURITY_SESSIONS]: {
    title: 'الجلسات النشطة',
    description: 'عرض وإدارة جلساتك النشطة',
    requiresAuth: true,
    breadcrumb: 'breadcrumbs.active_sessions',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.USER_SECURITY_HISTORY]: {
    title: 'سجل الأمان',
    description: 'عرض سجل أحداث الأمان',
    requiresAuth: true,
    breadcrumb: 'breadcrumbs.security_logs',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.USER_SECURITY_ALERTS]: {
    title: 'تنبيهات الأمان',
    description: 'عرض تنبيهات الأمان',
    requiresAuth: true,
    breadcrumb: 'breadcrumbs.security_alerts',
    layout: 'main',
    showInNav: false,
  },
}
