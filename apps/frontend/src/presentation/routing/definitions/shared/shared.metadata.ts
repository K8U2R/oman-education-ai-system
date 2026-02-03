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
    breadcrumb: 'الملف الشخصي',
    icon: User,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.SETTINGS]: {
    title: 'الإعدادات',
    description: 'إعدادات الحساب',
    requiresAuth: true,
    breadcrumb: 'الإعدادات',
    icon: Settings,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.SUBSCRIPTION]: {
    title: 'الاشتراك والباقات',
    description: 'إدارة الاشتراك',
    requiresAuth: true,
    breadcrumb: 'الاشتراك',
    icon: CreditCard,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.USER_SECURITY]: {
    title: 'الأمان',
    description: 'إدارة أمان حسابك',
    requiresAuth: true,
    breadcrumb: 'الأمان',
    icon: Shield,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.USER_SECURITY_SETTINGS]: {
    title: 'إعدادات الأمان',
    description: 'تكوين إعدادات الأمان لحسابك',
    requiresAuth: true,
    breadcrumb: 'إعدادات الأمان',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.USER_SECURITY_SESSIONS]: {
    title: 'الجلسات النشطة',
    description: 'عرض وإدارة جلساتك النشطة',
    requiresAuth: true,
    breadcrumb: 'الجلسات النشطة',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.USER_SECURITY_HISTORY]: {
    title: 'سجل الأمان',
    description: 'عرض سجل أحداث الأمان',
    requiresAuth: true,
    breadcrumb: 'سجل الأمان',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.USER_SECURITY_ALERTS]: {
    title: 'تنبيهات الأمان',
    description: 'عرض تنبيهات الأمان',
    requiresAuth: true,
    breadcrumb: 'تنبيهات الأمان',
    layout: 'main',
    showInNav: false,
  },
}
