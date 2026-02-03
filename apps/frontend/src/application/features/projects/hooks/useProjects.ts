/**
 * useProjects Hook
 * Hook لإدارة المشاريع التعليمية
 */

import { useState, useEffect, useCallback } from 'react'
import { projectService } from '../services/project.service'
import type {
  Project,
  ProjectProgress,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectType,
  ProjectStatus,
} from '../services/project.service'

export const useProjects = (filters?: {
  type?: ProjectType
  status?: ProjectStatus
  subject?: string
}) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [totalPages, setTotalPages] = useState(0)

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await projectService.getProjects({
        ...filters,
        page,
        per_page: perPage,
      })
      setProjects(response.projects)
      setTotal(response.total)
      setPage(response.page)
      setPerPage(response.per_page)
      setTotalPages(response.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل المشاريع')
    } finally {
      setIsLoading(false)
    }
  }, [filters, page, perPage])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const createProject = useCallback(
    async (request: CreateProjectRequest): Promise<Project> => {
      try {
        setIsLoading(true)
        setError(null)
        const project = await projectService.createProject(request)
        await loadProjects()
        return project
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل إنشاء المشروع'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [loadProjects]
  )

  const updateProject = useCallback(
    async (projectId: string, request: UpdateProjectRequest): Promise<Project> => {
      try {
        setIsLoading(true)
        setError(null)
        const project = await projectService.updateProject(projectId, request)
        await loadProjects()
        return project
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل تحديث المشروع'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [loadProjects]
  )

  const deleteProject = useCallback(
    async (projectId: string): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)
        await projectService.deleteProject(projectId)
        await loadProjects()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل حذف المشروع'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [loadProjects]
  )

  return {
    projects,
    isLoading,
    error,
    total,
    page,
    perPage,
    totalPages,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    setPage,
    setPerPage,
  }
}

export const useProject = (projectId: string | null) => {
  const [project, setProject] = useState<Project | null>(null)
  const [progress, setProgress] = useState<ProjectProgress | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProject = useCallback(async () => {
    if (!projectId) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await projectService.getProject(projectId)
      setProject(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل المشروع')
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  const loadProgress = useCallback(async () => {
    if (!projectId) return

    try {
      const data = await projectService.getProjectProgress(projectId)
      setProgress(data)
    } catch (err) {
      console.error('Failed to load project progress:', err)
    }
  }, [projectId])

  useEffect(() => {
    loadProject()
    loadProgress()
  }, [loadProject, loadProgress])

  return {
    project,
    progress,
    isLoading,
    error,
    loadProject,
    loadProgress,
  }
}
