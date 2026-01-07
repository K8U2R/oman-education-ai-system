/**
 * Navigation Utilities - أدوات التنقل
 *
 * وظائف مساعدة للتنقل في Layout Components
 */

import { NavigationItem } from '../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Home, LayoutDashboard, BookOpen, Cloud, User, Settings } from 'lucide-react'

/**
 * Get navigation items for authenticated users
 */
export const getAuthenticatedNavItems = (): NavigationItem[] => {
  return [
    {
      path: ROUTES.HOME,
      label: 'الرئيسية',
      icon: Home,
      requiresAuth: false,
    },
    {
      path: ROUTES.DASHBOARD,
      label: 'لوحة التحكم',
      icon: LayoutDashboard,
      requiresAuth: true,
    },
    {
      path: ROUTES.LESSONS,
      label: 'الدروس',
      icon: BookOpen,
      requiresAuth: true,
    },
    {
      path: ROUTES.STORAGE,
      label: 'التخزين',
      icon: Cloud,
      requiresAuth: true,
    },
  ]
}

/**
 * Get navigation items for unauthenticated users
 */
export const getUnauthenticatedNavItems = (): NavigationItem[] => {
  return [
    {
      path: ROUTES.HOME,
      label: 'الرئيسية',
      icon: Home,
      requiresAuth: false,
    },
  ]
}

/**
 * Get user menu items
 */
export const getUserMenuItems = (): NavigationItem[] => {
  return [
    {
      path: ROUTES.PROFILE,
      label: 'الملف الشخصي',
      icon: User,
      requiresAuth: true,
    },
    {
      path: ROUTES.SETTINGS,
      label: 'الإعدادات',
      icon: Settings,
      requiresAuth: true,
    },
  ]
}
