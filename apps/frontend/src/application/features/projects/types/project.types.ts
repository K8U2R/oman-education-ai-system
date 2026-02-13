/**
 * Project Types - أنواع المشاريع
 *
 * @description تعريفات الأنواع للمشاريع التعليمية
 */

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
