/**
 * Projects Hooks - Hooks إدارة المشاريع
 *
 * @description
 * Custom Hooks لإدارة المشاريع التعليمية باستخدام TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from '../services/project.service'
import { queryKeys } from '@/application/shared/api'
import type {
  ProjectType,
  ProjectStatus,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../types/project.types'

/**
 * Hook لجلب قائمة المشاريع
 */
export const useProjects = (filters?: {
  type?: ProjectType
  status?: ProjectStatus
  subject?: string
}) => {
  return useQuery({
    queryKey: queryKeys.projects.list(filters),
    queryFn: () => projectService.getProjects(filters),
    staleTime: 1000 * 30, // 30 seconds
  })
}

/**
 * Hook لجلب تفاصيل مشروع محدد
 */
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => projectService.getProject(projectId),
    enabled: !!projectId, // only fetch if projectId exists
    staleTime: 1000 * 60, // 1 minute
  })
}

/**
 * Hook لجلب تقدم المشروع
 */
export const useProjectProgress = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.projects.progress(projectId),
    queryFn: () => projectService.getProjectProgress(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 15, // 15 seconds (more frequent updates)
  })
}

/**
 * Hook لإنشاء مشروع جديد
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectService.createProject(data),
    onSuccess: () => {
      // إبطال قائمة المشاريع لإعادة جلبها
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

/**
 * Hook لتحديث مشروع
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string
      data: UpdateProjectRequest
    }) => projectService.updateProject(projectId, data),
    onSuccess: (updatedProject, variables) => {
      // تحديث تفاصيل المشروع المحدد (Optimistic Update)
      queryClient.setQueryData(
        queryKeys.projects.detail(variables.projectId),
        updatedProject
      )
      // إبطال قائمة المشاريع
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

/**
 * Hook لحذف مشروع
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: () => {
      // إبطال قائمة المشاريع
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}
