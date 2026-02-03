/**
 * useProjects Hook Tests - اختبارات Hook المشاريع
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useProjects, useProject } from './useProjects'
import { projectService, type Project } from '../services/project.service'

// Mock dependencies
vi.mock('../services/project.service')

describe('useProjects', () => {
  const mockProjects = [
    {
      id: '1',
      title: 'مشروع تجريبي',
      description: 'وصف المشروع',
      type: 'educational' as const,
      status: 'in_progress' as const,
      created_by: 'user-1',
      created_at: '2025-01-08T10:00:00Z',
      updated_at: '2025-01-08T10:00:00Z',
    },
  ]

  const mockResponse = {
    projects: mockProjects,
    total: 10,
    page: 1,
    per_page: 20,
    total_pages: 1,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(projectService.getProjects).mockResolvedValue(mockResponse)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useProjects())

      expect(result.current.projects).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.total).toBe(0)
      expect(result.current.page).toBe(1)
      expect(result.current.perPage).toBe(20)
    })
  })

  describe('loadProjects', () => {
    it('should load projects successfully', async () => {
      const { result } = renderHook(() => useProjects())

      await waitFor(() => {
        expect(result.current.projects).toEqual(mockProjects)
        expect(result.current.total).toBe(10)
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should handle loading error', async () => {
      const error = new Error('Failed to load projects')
      vi.mocked(projectService.getProjects).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useProjects())

      await waitFor(() => {
        expect(result.current.error).toBe('فشل تحميل المشاريع')
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('createProject', () => {
    it('should create project successfully', async () => {
      const newProject = {
        id: '2',
        title: 'مشروع جديد',
        type: 'educational' as const,
        status: 'draft' as const,
        created_by: 'user-1',
        created_at: '2025-01-08T11:00:00Z',
        updated_at: '2025-01-08T11:00:00Z',
      }

      vi.mocked(projectService.createProject).mockResolvedValueOnce(newProject)

      const { result } = renderHook(() => useProjects())

      await result.current.createProject({
        title: 'مشروع جديد',
        type: 'educational',
      })

      expect(projectService.createProject).toHaveBeenCalledWith({
        title: 'مشروع جديد',
        type: 'educational',
      })
    })
  })

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      const baseProject = mockProjects[0]
      if (!baseProject) {
        throw new Error('Mock project not found')
      }
      const updatedProject: Project = {
        id: '1',
        title: 'عنوان محدث',
        description: baseProject.description,
        type: baseProject.type,
        status: baseProject.status,
        created_by: baseProject.created_by,
        created_at: baseProject.created_at,
        updated_at: baseProject.updated_at,
      }

      vi.mocked(projectService.updateProject).mockResolvedValueOnce(updatedProject)

      const { result } = renderHook(() => useProjects())

      await result.current.updateProject('1', {
        title: 'عنوان محدث',
      })

      expect(projectService.updateProject).toHaveBeenCalledWith('1', {
        title: 'عنوان محدث',
      })
    })
  })

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      vi.mocked(projectService.deleteProject).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useProjects())

      await result.current.deleteProject('1')

      expect(projectService.deleteProject).toHaveBeenCalledWith('1')
    })
  })
})

describe('useProject', () => {
  const mockProject = {
    id: '1',
    title: 'مشروع تجريبي',
    type: 'educational' as const,
    status: 'in_progress' as const,
    created_by: 'user-1',
    created_at: '2025-01-08T10:00:00Z',
    updated_at: '2025-01-08T10:00:00Z',
  }

  const mockProgress = {
    project_id: '1',
    total_tasks: 10,
    completed_tasks: 5,
    progress_percentage: 50,
    milestones: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(projectService.getProject).mockResolvedValue(mockProject)
    vi.mocked(projectService.getProjectProgress).mockResolvedValue(mockProgress)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useProject(null))

      expect(result.current.project).toBeNull()
      expect(result.current.progress).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('loadProject', () => {
    it('should load project successfully', async () => {
      const { result } = renderHook(() => useProject('1'))

      await waitFor(() => {
        expect(result.current.project).toEqual(mockProject)
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should not load when projectId is null', async () => {
      const { result } = renderHook(() => useProject(null))

      await waitFor(() => {
        expect(projectService.getProject).not.toHaveBeenCalled()
        expect(result.current.project).toBeNull()
      })
    })
  })

  describe('loadProgress', () => {
    it('should load progress successfully', async () => {
      const { result } = renderHook(() => useProject('1'))

      await waitFor(() => {
        expect(result.current.progress).toEqual(mockProgress)
      })
    })
  })
})
