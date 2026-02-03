/**
 * Project Service
 * خدمة إدارة المشاريع التعليمية
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'

export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'archived'
export type ProjectType = 'educational' | 'research' | 'assignment' | 'presentation'

export interface Project {
  id: string
  title: string
  description?: string
  type: ProjectType
  status: ProjectStatus
  subject?: string
  grade_level?: string
  created_by: string
  created_at: string
  updated_at: string
  due_date?: string
  progress?: number
  lessons?: string[]
  files?: string[]
  reports?: string[]
}

export interface CreateProjectRequest {
  title: string
  description?: string
  type: ProjectType
  subject?: string
  grade_level?: string
  due_date?: string
  requirements?: string[]
}

export interface UpdateProjectRequest {
  title?: string
  description?: string
  type?: ProjectType
  status?: ProjectStatus
  subject?: string
  grade_level?: string
  due_date?: string
  requirements?: string[]
}

export interface ProjectProgress {
  project_id: string
  total_tasks: number
  completed_tasks: number
  progress_percentage: number
  milestones: Array<{
    id: string
    title: string
    completed: boolean
    completed_at?: string
  }>
}

class ProjectService {
  /**
   * Get all projects
   */
  async getProjects(filters?: {
    type?: ProjectType
    status?: ProjectStatus
    subject?: string
    page?: number
    per_page?: number
  }): Promise<{
    projects: Project[]
    total: number
    page: number
    per_page: number
    total_pages: number
  }> {
    const params: Record<string, string> = {}
    if (filters?.type) params.type = filters.type
    if (filters?.status) params.status = filters.status
    if (filters?.subject) params.subject = filters.subject
    if (filters?.page) params.page = filters.page.toString()
    if (filters?.per_page) params.per_page = filters.per_page.toString()

    const response = await apiClient.get<{
      data: {
        projects: Project[]
        total: number
        page: number
        per_page: number
        total_pages: number
      }
    }>('/projects', { params })
    return response.data
  }

  /**
   * Get project by ID
   */
  async getProject(projectId: string): Promise<Project> {
    const response = await apiClient.get<{ data: Project }>(`/projects/${projectId}`)
    return response.data
  }

  /**
   * Create project
   */
  async createProject(request: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post<{ data: Project }>('/projects', request)
    return response.data
  }

  /**
   * Update project
   */
  async updateProject(projectId: string, request: UpdateProjectRequest): Promise<Project> {
    const response = await apiClient.put<{ data: Project }>(`/projects/${projectId}`, request)
    return response.data
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}`)
  }

  /**
   * Get project progress
   */
  async getProjectProgress(projectId: string): Promise<ProjectProgress> {
    const response = await apiClient.get<{ data: ProjectProgress }>(
      `/projects/${projectId}/progress`
    )
    return response.data
  }

  /**
   * Get project statistics
   */
  async getProjectStats(): Promise<{
    total_projects: number
    active_projects: number
    completed_projects: number
    by_type: Record<ProjectType, number>
    average_progress: number
  }> {
    const response = await apiClient.get<{
      data: {
        total_projects: number
        active_projects: number
        completed_projects: number
        by_type: Record<ProjectType, number>
        average_progress: number
      }
    }>('/projects/stats')
    return response.data
  }
}

export const projectService = new ProjectService()
