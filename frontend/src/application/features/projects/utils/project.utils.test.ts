/**
 * Project Utils Tests - اختبارات دوال مساعدة المشاريع
 */

import { describe, it, expect } from 'vitest'
import {
  validateProjectTitle,
  validateProjectDescription,
  calculateProjectProgress,
  isProjectCompleted,
  isProjectInProgress,
  formatProjectType,
  formatProjectStatus,
  getProjectStatusColor,
  isProjectOverdue,
  calculateDaysRemaining,
  formatDaysRemaining,
  sortProjectsByProgress,
  sortProjectsByDate,
  filterProjectsByStatus,
  formatProjectError,
} from './project.utils'
import type { Project, ProjectProgress } from '../types'

describe('project.utils', () => {
  describe('validateProjectTitle', () => {
    it('should validate correct title', () => {
      const result = validateProjectTitle('مشروع جديد')
      expect(result.valid).toBe(true)
    })

    it('should reject short title', () => {
      const result = validateProjectTitle('أب')
      expect(result.valid).toBe(false)
    })

    it('should reject long title', () => {
      const longTitle = 'أ'.repeat(201)
      const result = validateProjectTitle(longTitle)
      expect(result.valid).toBe(false)
    })
  })

  describe('validateProjectDescription', () => {
    it('should validate correct description', () => {
      const result = validateProjectDescription('وصف المشروع')
      expect(result.valid).toBe(true)
    })

    it('should reject long description', () => {
      const longDescription = 'أ'.repeat(2001)
      const result = validateProjectDescription(longDescription)
      expect(result.valid).toBe(false)
    })
  })

  describe('calculateProjectProgress', () => {
    it('should calculate progress correctly', () => {
      const progress: ProjectProgress = {
        project_id: '1',
        total_tasks: 10,
        completed_tasks: 5,
        progress_percentage: 50,
        milestones: [],
      }
      expect(calculateProjectProgress(progress)).toBe(50)
    })

    it('should return 0 for null progress', () => {
      expect(calculateProjectProgress(null)).toBe(0)
    })
  })

  describe('isProjectCompleted', () => {
    it('should return true for completed project', () => {
      const project: Project = {
        id: '1',
        title: 'مشروع',
        type: 'educational',
        status: 'completed',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      expect(isProjectCompleted(project)).toBe(true)
    })

    it('should return true for project with 100% progress', () => {
      const project: Project = {
        id: '1',
        title: 'مشروع',
        type: 'educational',
        status: 'in_progress',
        progress: 100,
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      expect(isProjectCompleted(project)).toBe(true)
    })
  })

  describe('isProjectInProgress', () => {
    it('should return true for in-progress project', () => {
      const project: Project = {
        id: '1',
        title: 'مشروع',
        type: 'educational',
        status: 'in_progress',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      expect(isProjectInProgress(project)).toBe(true)
    })
  })

  describe('formatProjectType', () => {
    it('should format type correctly', () => {
      expect(formatProjectType('educational')).toBe('تعليمي')
      expect(formatProjectType('research')).toBe('بحثي')
    })
  })

  describe('formatProjectStatus', () => {
    it('should format status correctly', () => {
      expect(formatProjectStatus('completed')).toBe('مكتمل')
      expect(formatProjectStatus('in_progress')).toBe('قيد التنفيذ')
    })
  })

  describe('getProjectStatusColor', () => {
    it('should return color for status', () => {
      expect(getProjectStatusColor('completed')).toBe('#22c55e')
      expect(getProjectStatusColor('in_progress')).toBe('#3b82f6')
    })
  })

  describe('isProjectOverdue', () => {
    it('should return true for overdue project', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      const project: Project = {
        id: '1',
        title: 'مشروع',
        type: 'educational',
        status: 'in_progress',
        due_date: pastDate.toISOString(),
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      expect(isProjectOverdue(project)).toBe(true)
    })

    it('should return false for project without due date', () => {
      const project: Project = {
        id: '1',
        title: 'مشروع',
        type: 'educational',
        status: 'in_progress',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      expect(isProjectOverdue(project)).toBe(false)
    })
  })

  describe('calculateDaysRemaining', () => {
    it('should calculate days remaining correctly', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 5)
      const project: Project = {
        id: '1',
        title: 'مشروع',
        type: 'educational',
        status: 'in_progress',
        due_date: futureDate.toISOString(),
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const days = calculateDaysRemaining(project)
      expect(days).toBe(5)
    })

    it('should return null for project without due date', () => {
      const project: Project = {
        id: '1',
        title: 'مشروع',
        type: 'educational',
        status: 'in_progress',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      expect(calculateDaysRemaining(project)).toBeNull()
    })
  })

  describe('formatDaysRemaining', () => {
    it('should format days remaining correctly', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 5)
      const project: Project = {
        id: '1',
        title: 'مشروع',
        type: 'educational',
        status: 'in_progress',
        due_date: futureDate.toISOString(),
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const formatted = formatDaysRemaining(project)
      expect(formatted).toContain('5')
      expect(formatted).toContain('أيام')
    })
  })

  describe('sortProjectsByProgress', () => {
    it('should sort projects by progress', () => {
      const projects: Project[] = [
        {
          id: '1',
          title: 'Low Progress',
          type: 'educational',
          status: 'in_progress',
          progress: 20,
          created_by: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'High Progress',
          type: 'educational',
          status: 'in_progress',
          progress: 80,
          created_by: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      const sorted = sortProjectsByProgress(projects)
      expect(sorted.length).toBe(2)
      const first = sorted[0]
      const second = sorted[1]
      expect(first).toBeDefined()
      expect(second).toBeDefined()
      if (first && second) {
        expect(first.progress).toBe(80)
        expect(second.progress).toBe(20)
      }
    })
  })

  describe('sortProjectsByDate', () => {
    it('should sort projects by date (newest first)', () => {
      const oldDate = new Date('2025-01-01')
      const newDate = new Date('2025-01-08')
      const projects: Project[] = [
        {
          id: '1',
          title: 'Old',
          type: 'educational',
          status: 'in_progress',
          created_by: 'user-1',
          created_at: oldDate.toISOString(),
          updated_at: oldDate.toISOString(),
        },
        {
          id: '2',
          title: 'New',
          type: 'educational',
          status: 'in_progress',
          created_by: 'user-1',
          created_at: newDate.toISOString(),
          updated_at: newDate.toISOString(),
        },
      ]

      const sorted = sortProjectsByDate(projects)
      expect(sorted.length).toBe(2)
      const first = sorted[0]
      const second = sorted[1]
      expect(first).toBeDefined()
      expect(second).toBeDefined()
      if (first && second) {
        expect(first.id).toBe('2')
        expect(second.id).toBe('1')
      }
    })
  })

  describe('filterProjectsByStatus', () => {
    it('should filter projects by status', () => {
      const projects: Project[] = [
        {
          id: '1',
          title: 'In Progress',
          type: 'educational',
          status: 'in_progress',
          created_by: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Completed',
          type: 'educational',
          status: 'completed',
          created_by: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      const filtered = filterProjectsByStatus(projects, 'in_progress')
      expect(filtered.length).toBe(1)
      const first = filtered[0]
      expect(first).toBeDefined()
      if (first) {
        expect(first.status).toBe('in_progress')
      }
    })
  })

  describe('formatProjectError', () => {
    it('should format Error object', () => {
      const error = new Error('Test error')
      expect(formatProjectError(error)).toBe('Test error')
    })

    it('should format string error', () => {
      expect(formatProjectError('String error')).toBe('String error')
    })
  })
})
