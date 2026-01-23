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
