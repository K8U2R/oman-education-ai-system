/**
 * Sidebar Utils - أدوات Sidebar
 *
 * دوال مساعدة لـ Sidebar
 */

import type { SidebarGroup, SidebarItem } from './Sidebar.types'
import type { User } from '@/domain/entities/User'
import type { UserRole, Permission } from '@/domain/types/auth.types'

/**
 * التحقق من إمكانية الوصول لعنصر
 */
export function canAccessItem(
  item: SidebarItem,
  isAuthenticated: boolean,
  user: User | null,
  hasRole: (role: UserRole) => boolean,
  hasAllPermissions: (permissions: Permission[]) => boolean
): boolean {
  // Public items - لا تحتاج مصادقة
  if (!item.requiresAuth) {
    return true
  }

  // التحقق من المصادقة ووجود المستخدم
  if (!isAuthenticated || !user) {
    return false
  }

  // التحقق من أن المستخدم نشط
  if (!user.isActive) {
    return false
  }

  // التحقق من الدور المطلوب
  if (item.requiredRole) {
    const roles = Array.isArray(item.requiredRole) ? item.requiredRole : [item.requiredRole]
    if (!roles.some(role => hasRole(role))) {
      return false
    }
  }

  // التحقق من  المطلوبة
  if (item.requiredPermissions && item.requiredPermissions.length > 0) {
    if (!hasAllPermissions(item.requiredPermissions)) {
      return false
    }
  }

  return true
}

/**
 * التحقق من إمكانية الوصول لمجموعة
 */
export function canAccessGroup(
  group: SidebarGroup,
  isAuthenticated: boolean,
  user: User | null,
  hasRole: (role: UserRole) => boolean,
  hasAllPermissions: (permissions: Permission[]) => boolean
): boolean {
  // التحقق من الدور المطلوب للمجموعة
  if (group.requiredRole) {
    if (!user) return false
    const roles = Array.isArray(group.requiredRole) ? group.requiredRole : [group.requiredRole]
    if (!roles.some(role => hasRole(role))) {
      return false
    }
  }

  // التحقق من  المطلوبة للمجموعة
  if (group.requiredPermissions && group.requiredPermissions.length > 0) {
    if (!user || !hasAllPermissions(group.requiredPermissions)) {
      return false
    }
  }

  // التحقق من وجود عناصر يمكن الوصول إليها
  const accessibleItems = group.items.filter(item =>
    canAccessItem(item, isAuthenticated, user, hasRole, hasAllPermissions)
  )

  return accessibleItems.length > 0
}

/**
 * تصفية مجموعات Sidebar بناءً على
 */
export function filterSidebarGroups(
  groups: SidebarGroup[],
  isAuthenticated: boolean,
  user: User | null,
  hasRole: (role: UserRole) => boolean,
  hasAllPermissions: (permissions: Permission[]) => boolean
): SidebarGroup[] {
  return groups
    .filter(group => canAccessGroup(group, isAuthenticated, user, hasRole, hasAllPermissions))
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        canAccessItem(item, isAuthenticated, user, hasRole, hasAllPermissions)
      ),
    }))
}
/**
 * Sidebar Storage Utils - أدوات التخزين لـ Sidebar
 *
 * دوال مساعدة لحفظ/تحميل حالة Sidebar من localStorage
 */

const STORAGE_KEY = 'sidebar-groups-state'

export interface SidebarGroupState {
  [groupId: string]: boolean
}

/**
 * تحميل حالة المجموعات من localStorage
 */
export function loadSidebarGroupsState(): SidebarGroupState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved) as SidebarGroupState
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[SidebarStorage] Failed to load state from localStorage:', error)
    }
  }
  return {}
}

/**
 * حفظ حالة المجموعات في localStorage
 */
export function saveSidebarGroupsState(states: SidebarGroupState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[SidebarStorage] Failed to save state to localStorage:', error)
    }
  }
}

/**
 * الحصول على حالة مجموعة محددة
 */
export function getGroupState(groupId: string, defaultState: boolean = false): boolean {
  const states = loadSidebarGroupsState()
  return states[groupId] ?? defaultState
}

/**
 * حفظ حالة مجموعة محددة
 */
export function setGroupState(groupId: string, isOpen: boolean): void {
  const states = loadSidebarGroupsState()
  states[groupId] = isOpen
  saveSidebarGroupsState(states)
}

/**
 * مسح جميع الحالات المحفوظة
 */
export function clearSidebarGroupsState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[SidebarStorage] Failed to clear state from localStorage:', error)
    }
  }
}
