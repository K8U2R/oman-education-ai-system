/**
 * Admin UI Store - مخزن حالة واجهة الإدارة
 *
 * @description
 * يدير حالة الواجهة المحلية فقط (UI State) - لا يجلب بيانات من السيرفر
 * البيانات من السيرفر تُدار بواسطة TanStack Query
 */

import { create } from 'zustand'
import type { AdminUserInfo } from '../types'

interface AdminUIStore {
    // UI State
    selectedUser: AdminUserInfo | null
    isSidebarOpen: boolean
    activeTab: 'stats' | 'users' | 'activities'
    userSearchFilters: {
        query?: string
        role?: string
        isActive?: boolean
        isVerified?: boolean
        page: number
        perPage: number
    }

    // Actions
    selectUser: (user: AdminUserInfo | null) => void
    toggleSidebar: () => void
    setActiveTab: (tab: AdminUIStore['activeTab']) => void
    setUserSearchFilters: (filters: Partial<AdminUIStore['userSearchFilters']>) => void
}

export const useAdminUIStore = create<AdminUIStore>((set) => ({
    // Initial State
    selectedUser: null,
    isSidebarOpen: true,
    activeTab: 'stats',
    userSearchFilters: {
        page: 1,
        perPage: 20,
    },

    // Actions
    selectUser: (user) => set({ selectedUser: user }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setUserSearchFilters: (filters) =>
        set((state) => ({
            userSearchFilters: { ...state.userSearchFilters, ...filters },
        })),
}))
