/**
 * ProfileMenu Configuration - تكوين ProfileMenu
 *
 * جميع مجموعات وعناصر ProfileMenu منظمة حسب الفئات
 */

import { User as UserIcon, Settings, Shield, CreditCard, Code, Lock } from 'lucide-react'
import { ROUTES } from '@/domain/constants/routes.constants'
import type { ProfileMenuGroup } from '../types'

/**
 * جميع مجموعات ProfileMenu
 */
export const PROFILE_MENU_GROUPS: ProfileMenuGroup[] = [
  // 📋 الحساب الشخصي
  {
    id: 'personal',
    label: 'الحساب الشخصي',
    items: [
      {
        id: 'profile',
        label: 'الملف الشخصي',
        path: ROUTES.PROFILE,
        icon: UserIcon,
      },
      {
        id: 'settings',
        label: 'الإعدادات',
        path: ROUTES.SETTINGS,
        icon: Settings,
      },
      {
        id: 'security',
        label: 'إعدادات الأمان',
        path: ROUTES.USER_SECURITY_SETTINGS,
        icon: Shield,
      },
      {
        id: 'subscription',
        label: 'الاشتراك والباقات',
        path: ROUTES.SUBSCRIPTION,
        icon: CreditCard,
      },
    ],
  },

  // 🛡️ لوحات التحكم (Admin)
  {
    id: 'admin',
    label: 'لوحات التحكم',
    requiredRole: 'admin',
    items: [
      {
        id: 'admin-dashboard',
        label: 'لوحة تحكم المسؤول',
        path: ROUTES.ADMIN_DASHBOARD,
        icon: Shield,
        requiredRole: 'admin',
      },
      {
        id: 'admin-security',
        label: 'أمان النظام',
        path: ROUTES.ADMIN_SECURITY_DASHBOARD,
        icon: Shield,
        requiredRole: 'admin',
      },
    ],
  },

  // 💻 المطور (Developer)
  {
    id: 'developer',
    label: 'المطور',
    requiredRole: 'developer',
    items: [
      {
        id: 'developer-dashboard',
        label: 'لوحة تحكم المطور',
        path: ROUTES.DEVELOPER_DASHBOARD,
        icon: Code,
        requiredRole: 'developer',
      },
    ],
  },

  // 🔒 الخصوصية
  {
    id: 'privacy',
    items: [
      {
        id: 'privacy',
        label: 'الخصوصية',
        path: ROUTES.PRIVACY,
        icon: Lock,
      },
    ],
  },
]
