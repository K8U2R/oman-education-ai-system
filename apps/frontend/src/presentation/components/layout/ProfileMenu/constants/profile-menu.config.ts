/**
 * ProfileMenu Dynamic Configuration - تكوين القائمة الديناميكي
 *
 * ✅ LAW 08 (Secure Closure): Routes encrypted at runtime
 * ✅ LAW 14 (Package Sovereignty): No static exports
 * 
 * Dynamic menu generation with role-based filtering and route encryption
 */

import { User as UserIcon, Settings, Shield, CreditCard, Code, Lock } from 'lucide-react'
import { ROUTES } from '@/domain/constants/routes.constants'
import { encryptRoute, isSensitiveRoute } from '@/domain/security/route-encryption'
import type { ProfileMenuGroup, ProfileMenuItem } from '../types'
import type { User } from '@/domain/entities/User'

/**
 * Base menu configuration (PRIVATE - not exported)
 * Only used internally for menu generation
 */
const BASE_MENU_GROUPS: ProfileMenuGroup[] = [
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

/**
 * Check if user has required role
 */
function hasRequiredRole(user: User | null, requiredRole?: string): boolean {
  if (!requiredRole) return true
  if (!user) return false

  // Check user roles - admin is the highest role
  return user.role === requiredRole || user.role === 'admin'
}

/**
 * Encrypt menu item path if sensitive
 */
function encryptMenuItem(item: ProfileMenuItem): ProfileMenuItem {
  if (isSensitiveRoute(item.path)) {
    return {
      ...item,
      path: encryptRoute(item.path),
    }
  }
  return item
}

/**
 * ✅ PUBLIC API - Get dynamic profile menu items with encryption
 * 
 * This function:
 * 1. Filters menu items by user role
 * 2. Encrypts sensitive routes (admin/developer)
 * 3. Returns runtime-generated menu structure
 * 
 * @param user - Current authenticated user
 * @returns Filtered and encrypted menu groups
 * 
 * @example
 * ```typescript
 * // Admin user sees encrypted admin routes
 * const menuItems = getProfileMenuItems(adminUser)
 * // menuItems contains: path: '/p/a3b8d1c4f8e9' (encrypted /admin)
 * 
 * // Regular user doesn't see admin routes at all
 * const menuItems = getProfileMenuItems(regularUser)
 * // menuItems contains only: profile, settings, privacy
 * ```
 */
export function getProfileMenuItems(user: User | null): ProfileMenuGroup[] {
  return BASE_MENU_GROUPS
    .map(group => {
      // Filter group by role
      if (group.requiredRole && !hasRequiredRole(user, group.requiredRole)) {
        return null
      }

      // Filter and encrypt items
      const filteredItems = group.items
        .filter(item => hasRequiredRole(user, item.requiredRole))
        .map(item => encryptMenuItem(item))

      // Skip empty groups
      if (filteredItems.length === 0) {
        return null
      }

      return {
        ...group,
        items: filteredItems,
      }
    })
    .filter((group): group is ProfileMenuGroup => group !== null)
}


