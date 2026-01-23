/**
 * Projects Store - مخزن المشاريع
 *
 * @description Zustand Store لإدارة حالة المشاريع
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { projectService } from '../api/project.service'
import type {
  Project,
  ProjectProgress,
  ProjectType,
  ProjectStatus,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../types/project.types'

interface ProjectsState {
  // State
  projects: Project[]
  selectedProject: Project | null
  selectedProjectProgress: ProjectProgress | null
  isLoading: boolean
  error: string | null

  // Filters
  filters: {
    type?: ProjectType
    status?: ProjectStatus
    subject?: string
    gradeLevel?: string
    search?: string
    page: number
    perPage: number
  }

  // Stats
  stats: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    byType: Record<ProjectType, number>
    averageProgress: number
  } | null

  // Computed
  totalProjects: number
  hasMore: boolean

  // Actions
  fetchProjects: (params?: {
    type?: ProjectType
    status?: ProjectStatus
    subject?: string
    gradeLevel?: string
    search?: string
    page?: number
    perPage?: number
  }) => Promise<void>
  selectProject: (id: string) => Promise<void>
  createProject: (data: CreateProjectRequest) => Promise<Project>
  updateProject: (id: string, data: UpdateProjectRequest) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
  fetchProjectProgress: (id: string) => Promise<void>
  fetchStats: () => Promise<void>
  setFilter: (filter: Partial<ProjectsState['filters']>) => void
  reset: () => void
}

const initialState = {
  projects: [],
  selectedProject: null,
  selectedProjectProgress: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    perPage: 20,
  },
  stats: null,
  totalProjects: 0,
  hasMore: false,
}

export const useProjectsStore = create<ProjectsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchProjects: async params => {
        set({ isLoading: true, error: null })
        try {
          const currentFilters = get().filters
          const mergedParams = {
            ...currentFilters,
            ...params,
          }

          const result = await projectService.getProjects({
            type: mergedParams.type,
            status: mergedParams.status,
            subject: mergedParams.subject,
            page: mergedParams.page,
            per_page: mergedParams.perPage,
          })

          set({
            projects: result.projects,
            isLoading: false,
            totalProjects: result.total,
            hasMore: result.page < result.total_pages,
            filters: mergedParams,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch projects',
            isLoading: false,
          })
        }
      },

      selectProject: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const project = await projectService.getProject(id)
          set({
            selectedProject: project,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load project',
            isLoading: false,
          })
        }
      },

      createProject: async (data: CreateProjectRequest) => {
        set({ isLoading: true, error: null })
        try {
          const newProject = await projectService.createProject(data)
          set(state => ({
            projects: [newProject, ...state.projects],
            isLoading: false,
            totalProjects: state.totalProjects + 1,
          }))
          return newProject
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create project'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw new Error(errorMessage)
        }
      },

      updateProject: async (id: string, data: UpdateProjectRequest) => {
        set({ isLoading: true, error: null })
        try {
          const updatedProject = await projectService.updateProject(id, data)
          set(state => ({
            projects: state.projects.map(p => (p.id === id ? updatedProject : p)),
            selectedProject:
              state.selectedProject?.id === id ? updatedProject : state.selectedProject,
            isLoading: false,
          }))
          return updatedProject
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update project'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw new Error(errorMessage)
        }
      },

      deleteProject: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          await projectService.deleteProject(id)
          set(state => ({
            projects: state.projects.filter(p => p.id !== id),
            selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
            totalProjects: Math.max(0, state.totalProjects - 1),
            isLoading: false,
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete project'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw new Error(errorMessage)
        }
      },

      fetchProjectProgress: async (id: string) => {
        try {
          const progress = await projectService.getProjectProgress(id)
          set({
            selectedProjectProgress: progress,
          })
        } catch (error) {
          console.error('Failed to load project progress:', error)
        }
      },

      fetchStats: async () => {
        try {
          const stats = await projectService.getProjectStats()
          set({
            stats: {
              totalProjects: stats.total_projects,
              activeProjects: stats.active_projects,
              completedProjects: stats.completed_projects,
              byType: stats.by_type,
              averageProgress: stats.average_progress,
            },
          })
        } catch (error) {
          console.error('Failed to load project stats:', error)
        }
      },

      setFilter: filter => {
        set(state => ({
          filters: {
            ...state.filters,
            ...filter,
          },
        }))
      },

      reset: () => {
        set(initialState)
      },
    }),
    { name: 'ProjectsStore' }
  )
)
