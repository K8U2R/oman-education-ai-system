/**
 * Projects UI Store - مخزن حالة واجهة المشاريع
 *
 * @description
 * يدير حالة الواجهة المحلية فقط (UI State)
 * البيانات من السيرفر تُدار بواسطة TanStack Query
 */

import { create } from 'zustand'
import type { Project, ProjectType, ProjectStatus } from '../services/project.service'

interface ProjectsUIStore {
    // UI State
    selectedProject: Project | null
    viewMode: 'grid' | 'list'
    filterPanelOpen: boolean
    filters: {
        type?: ProjectType
        status?: ProjectStatus
        subject?: string
        search?: string
        page?: number
        per_page?: number
    }
    sortBy: 'created_at' | 'updated_at' | 'title'
    sortOrder: 'asc' | 'desc'

    // Actions
    selectProject: (project: Project | null) => void
    setViewMode: (mode: ProjectsUIStore['viewMode']) => void
    toggleFilterPanel: () => void
    setFilters: (filters: Partial<ProjectsUIStore['filters']>) => void
    setSorting: (sortBy: ProjectsUIStore['sortBy'], sortOrder: ProjectsUIStore['sortOrder']) => void
    clearFilters: () => void
}

export const useProjectsUIStore = create<ProjectsUIStore>((set) => ({
    // Initial State
    selectedProject: null,
    viewMode: 'grid',
    filterPanelOpen: false,
    filters: {},
    sortBy: 'updated_at',
    sortOrder: 'desc',

    // Actions
    selectProject: (project) => set({ selectedProject: project }),
    setViewMode: (mode) => set({ viewMode: mode }),
    toggleFilterPanel: () => set((state) => ({ filterPanelOpen: !state.filterPanelOpen })),
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
    setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
    clearFilters: () => set({ filters: {} }),
}))
