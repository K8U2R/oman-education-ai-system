/**
 * Admin Routes Metadata - بيانات مسارات المسؤول
 *
 * Metadata للمسارات الخاصة بالمسؤولين
 */

import { RouteMetadata } from '../../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Shield, Users, Settings, FileText, Globe, AlertTriangle, Activity } from 'lucide-react'

export const adminMetadata: Record<string, RouteMetadata> = {
  [ROUTES.ADMIN_DASHBOARD]: {
    title: 'لوحة تحكم المسؤول',
    description: 'إدارة شاملة للنظام والمستخدمين',
    requiresAuth: true,
    requiredRole: 'admin',
    breadcrumb: 'لوحة تحكم المسؤول',
    icon: Shield,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Admin',
      action: 'View Admin Dashboard',
    },
  },
  [ROUTES.ADMIN_USERS]: {
    title: 'إدارة المستخدمين',
    description: 'إدارة المستخدمين والصلاحيات والأدوار',
    requiresAuth: true,
    requiredRole: 'admin',
    breadcrumb: 'إدارة المستخدمين',
    icon: Users,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Admin',
      action: 'View Users Management',
    },
  },
  [ROUTES.ADMIN_SECURITY_DASHBOARD]: {
    title: 'لوحة تحكم الأمان',
    description: 'مراقبة وإدارة الأمان في النظام',
    requiresAuth: true,
    requiredRole: 'admin',
    breadcrumb: 'لوحة تحكم الأمان',
    icon: Shield,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Admin',
      action: 'View Security Dashboard',
    },
  },
  [ROUTES.ADMIN_SECURITY_SESSIONS]: {
    title: 'إدارة الجلسات',
    description: 'عرض وإدارة جميع الجلسات النشطة',
    requiresAuth: true,
    requiredRole: 'admin',
    breadcrumb: 'إدارة الجلسات',
    icon: Users,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.ADMIN_SECURITY_LOGS]: {
    title: 'سجلات الأمان',
    description: 'تتبع ومراقبة جميع الأحداث الأمنية',
    requiresAuth: true,
    requiredRole: 'admin',
    breadcrumb: 'سجلات الأمان',
    icon: FileText,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.ADMIN_SECURITY_SETTINGS]: {
    title: 'إعدادات الأمان',
    description: 'تكوين سياسات الأمان والمصادقة',
    requiresAuth: true,
    requiredRole: 'admin',
    breadcrumb: 'إعدادات الأمان',
    icon: Settings,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.ADMIN_SECURITY_ROUTES]: {
    title: 'حماية المسارات',
    description: 'إدارة قواعد حماية المسارات والصلاحيات',
    requiresAuth: true,
    requiredRole: 'admin',
    breadcrumb: 'حماية المسارات',
    icon: Globe,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.ADMIN_ANALYTICS_ERRORS]: {
    title: 'لوحة تحكم الأخطاء',
    description: 'عرض وتحليل الأخطاء في النظام',
    requiresAuth: true,
    requiredRole: 'admin',
    breadcrumb: 'لوحة تحكم الأخطاء',
    icon: AlertTriangle,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Admin',
      action: 'View Error Dashboard',
    },
  },
  [ROUTES.ADMIN_ANALYTICS_PERFORMANCE]: {
    title: 'لوحة تحكم الأداء',
    description: 'عرض وتحليل مقاييس الأداء في النظام',
    requiresAuth: true,
    requiredRole: 'admin',
    breadcrumb: 'لوحة تحكم الأداء',
    icon: Activity,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Admin',
      action: 'View Performance Dashboard',
    },
  },
  [ROUTES.DEVELOPER_DASHBOARD]: {
    title: 'لوحة تحكم المطور',
    description: 'أدوات وإحصائيات متخصصة للمطورين',
    requiresAuth: true,
    requiredRole: 'developer',
    breadcrumb: 'لوحة تحكم المطور',
    icon: Shield,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Developer',
      action: 'View Developer Dashboard',
    },
  },
  [ROUTES.DEVELOPER_SECURITY_ANALYTICS]: {
    title: 'تحليلات الأمان',
    description: 'تحليل متقدم للأمان والأنماط',
    requiresAuth: true,
    requiredRole: 'developer',
    breadcrumb: 'تحليلات الأمان',
    icon: Shield,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Developer',
      action: 'View Security Analytics',
    },
  },
  [ROUTES.DEVELOPER_SECURITY_MONITORING]: {
    title: 'مراقبة الأمان',
    description: 'مراقبة النظام في الوقت الفعلي',
    requiresAuth: true,
    requiredRole: 'developer',
    breadcrumb: 'مراقبة الأمان',
    icon: Shield,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Developer',
      action: 'View Security Monitoring',
    },
  },
}
