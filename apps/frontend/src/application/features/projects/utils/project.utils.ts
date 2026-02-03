/**
 * Project Utils - دوال مساعدة للمشاريع
 *
 * @description دوال مساعدة خاصة بميزة المشاريع
 */

import type { Project, ProjectStatus, ProjectType, ProjectProgress } from '../types'
import { PROJECT_CONFIG, PROJECT_STATUS, PROJECT_TYPES } from '../constants'

/**
 * التحقق من صحة عنوان المشروع
 */
export function validateProjectTitle(title: string): {
  valid: boolean
  error?: string
} {
  if (title.length < PROJECT_CONFIG.VALIDATION.TITLE_MIN_LENGTH) {
    return {
      valid: false,
      error: `عنوان المشروع يجب أن يكون على الأقل ${PROJECT_CONFIG.VALIDATION.TITLE_MIN_LENGTH} أحرف`,
    }
  }

  if (title.length > PROJECT_CONFIG.VALIDATION.TITLE_MAX_LENGTH) {
    return {
      valid: false,
      error: `عنوان المشروع يجب أن يكون أقل من ${PROJECT_CONFIG.VALIDATION.TITLE_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * التحقق من صحة وصف المشروع
 */
export function validateProjectDescription(description: string): {
  valid: boolean
  error?: string
} {
  if (description.length > PROJECT_CONFIG.VALIDATION.DESCRIPTION_MAX_LENGTH) {
    return {
      valid: false,
      error: `وصف المشروع يجب أن يكون أقل من ${PROJECT_CONFIG.VALIDATION.DESCRIPTION_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * حساب التقدم في المشروع
 */
export function calculateProjectProgress(progress: ProjectProgress | null): number {
  if (!progress) return 0
  return Math.min(100, Math.max(0, progress.progress_percentage))
}

/**
 * التحقق من اكتمال المشروع
 */
export function isProjectCompleted(project: Project): boolean {
  return (
    project.status === PROJECT_STATUS.COMPLETED ||
    (project.progress !== undefined &&
      project.progress >= PROJECT_CONFIG.PROGRESS.COMPLETION_THRESHOLD)
  )
}

/**
 * التحقق من أن المشروع قيد التنفيذ
 */
export function isProjectInProgress(project: Project): boolean {
  return project.status === PROJECT_STATUS.IN_PROGRESS
}

/**
 * التحقق من أن المشروع مسودة
 */
export function isProjectDraft(project: Project): boolean {
  return project.status === PROJECT_STATUS.DRAFT
}

/**
 * التحقق من أن المشروع مؤرشف
 */
export function isProjectArchived(project: Project): boolean {
  return project.status === PROJECT_STATUS.ARCHIVED
}

/**
 * تنسيق اسم نوع المشروع
 */
export function formatProjectType(type: ProjectType): string {
  const typeMap: Record<ProjectType, string> = {
    educational: 'تعليمي',
    research: 'بحثي',
    assignment: 'واجب',
    presentation: 'عرض تقديمي',
  }
  return typeMap[type] || type
}

/**
 * تنسيق اسم حالة المشروع
 */
export function formatProjectStatus(status: ProjectStatus): string {
  const statusMap: Record<ProjectStatus, string> = {
    draft: 'مسودة',
    in_progress: 'قيد التنفيذ',
    completed: 'مكتمل',
    archived: 'مؤرشف',
  }
  return statusMap[status] || status
}

/**
 * الحصول على لون حالة المشروع
 */
export function getProjectStatusColor(status: ProjectStatus): string {
  const colorMap: Record<ProjectStatus, string> = {
    draft: '#6b7280', // gray
    in_progress: '#3b82f6', // blue
    completed: '#22c55e', // green
    archived: '#9ca3af', // light gray
  }
  return colorMap[status] || '#6b7280'
}

/**
 * تنسيق تاريخ المشروع
 */
export function formatProjectDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'اليوم'
  if (days === 1) return 'أمس'
  if (days < 7) return `منذ ${days} أيام`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`
  }
  if (days < 365) {
    const months = Math.floor(days / 30)
    return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`
  }

  const years = Math.floor(days / 365)
  return `منذ ${years} ${years === 1 ? 'سنة' : 'سنوات'}`
}

/**
 * التحقق من انتهاء موعد المشروع
 */
export function isProjectOverdue(project: Project): boolean {
  if (!project.due_date) return false
  const dueDate = new Date(project.due_date)
  const now = new Date()
  return now > dueDate && !isProjectCompleted(project)
}

/**
 * حساب الأيام المتبقية للمشروع
 */
export function calculateDaysRemaining(project: Project): number | null {
  if (!project.due_date) return null
  const dueDate = new Date(project.due_date)
  const now = new Date()
  const diff = dueDate.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days
}

/**
 * تنسيق الأيام المتبقية
 */
export function formatDaysRemaining(project: Project): string {
  const days = calculateDaysRemaining(project)
  if (days === null) return 'لا يوجد موعد نهائي'
  if (days < 0) return 'منتهي'
  if (days === 0) return 'ينتهي اليوم'
  if (days === 1) return 'يوم واحد متبقي'
  return `${days} أيام متبقية`
}

/**
 * حساب عدد المهام المكتملة
 */
export function countCompletedTasks(progress: ProjectProgress | null): number {
  if (!progress) return 0
  return progress.completed_tasks
}

/**
 * حساب عدد المهام الإجمالية
 */
export function countTotalTasks(progress: ProjectProgress | null): number {
  if (!progress) return 0
  return progress.total_tasks
}

/**
 * حساب عدد المراحل المكتملة
 */
export function countCompletedMilestones(progress: ProjectProgress | null): number {
  if (!progress) return 0
  return progress.milestones.filter(m => m.completed).length
}

/**
 * حساب عدد المراحل الإجمالية
 */
export function countTotalMilestones(progress: ProjectProgress | null): number {
  if (!progress) return 0
  return progress.milestones.length
}

/**
 * تصفية المشاريع حسب الحالة
 */
export function filterProjectsByStatus(projects: Project[], status: ProjectStatus): Project[] {
  return projects.filter(p => p.status === status)
}

/**
 * تصفية المشاريع حسب النوع
 */
export function filterProjectsByType(projects: Project[], type: ProjectType): Project[] {
  return projects.filter(p => p.type === type)
}

/**
 * ترتيب المشاريع حسب التاريخ (الأحدث أولاً)
 */
export function sortProjectsByDate(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateB - dateA
  })
}

/**
 * ترتيب المشاريع حسب التقدم
 */
export function sortProjectsByProgress(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const progressA = a.progress || 0
    const progressB = b.progress || 0
    return progressB - progressA
  })
}

/**
 * ترتيب المشاريع حسب الموعد النهائي
 */
export function sortProjectsByDueDate(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (!a.due_date) return 1
    if (!b.due_date) return -1
    const dateA = new Date(a.due_date).getTime()
    const dateB = new Date(b.due_date).getTime()
    return dateA - dateB
  })
}

/**
 * تنسيق رسالة الخطأ
 */
export function formatProjectError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return PROJECT_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * التحقق من صحة نوع المشروع
 */
export function isValidProjectType(type: string): type is ProjectType {
  return Object.values(PROJECT_TYPES).includes(type as ProjectType)
}

/**
 * التحقق من صحة حالة المشروع
 */
export function isValidProjectStatus(status: string): status is ProjectStatus {
  return Object.values(PROJECT_STATUS).includes(status as ProjectStatus)
}
