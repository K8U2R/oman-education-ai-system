/**
 * Project Types - أنواع المشاريع
 *
 * @description أنواع TypeScript الخاصة بميزة المشاريع
 * تجميع جميع الأنواع من Services
 */

// Re-export Project Types from Service
import type {
  ProjectStatus,
  ProjectType,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectProgress,
} from '../services/project.service'

export type {
  ProjectStatus,
  ProjectType,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectProgress,
}

// Application-specific Types

/**
 * حالة تحميل المشاريع
 */
export type ProjectsLoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * خيارات تحميل المشاريع
 */
export interface LoadProjectsOptions {
  type?: ProjectType
  status?: ProjectStatus
  subject?: string
  gradeLevel?: string
  page?: number
  perPage?: number
  search?: string
}

/**
 * نتيجة تحميل المشاريع
 */
export interface LoadProjectsResult {
  projects: Project[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

/**
 * بيانات مشروع كاملة
 */
export interface ProjectFullData extends Omit<
  Project,
  'progress' | 'lessons' | 'files' | 'reports'
> {
  progress?: ProjectProgress
  lessons?: Array<{
    id: string
    title: string
    completed: boolean
  }>
  files?: Array<{
    id: string
    name: string
    type: string
    url: string
  }>
  reports?: Array<{
    id: string
    title: string
    type: string
    generatedAt: string
  }>
}

/**
 * مرحلة المشروع
 */
export interface ProjectMilestone {
  id: string
  title: string
  description?: string
  completed: boolean
  completedAt?: Date
  dueDate?: Date
  tasks: ProjectTask[]
}

/**
 * مهمة المشروع
 */
export interface ProjectTask {
  id: string
  title: string
  description?: string
  completed: boolean
  completedAt?: Date
  assignedTo?: string
  priority: 'low' | 'medium' | 'high'
}

/**
 * إحصائيات المشاريع
 */
export interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  archivedProjects: number
  byType: Record<ProjectType, number>
  byStatus: Record<ProjectStatus, number>
  averageProgress: number
  totalTasks: number
  completedTasks: number
}

/**
 * فلتر المشاريع
 */
export interface ProjectFilter {
  type?: ProjectType
  status?: ProjectStatus
  subject?: string
  gradeLevel?: string
  search?: string
  page?: number
  perPage?: number
}

/**
 * ترتيب المشاريع
 */
export type ProjectSort = {
  field: 'title' | 'createdAt' | 'updatedAt' | 'dueDate' | 'progress'
  order: 'asc' | 'desc'
}

/**
 * خطأ المشاريع
 */
export interface ProjectError {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}

/**
 * نتيجة بناء المشروع
 */
export interface ProjectBuildResult {
  success: boolean
  project?: Project
  error?: string
  warnings?: string[]
}
