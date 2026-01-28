/**
 * Teacher Routes - مسارات المعلم
 *
 * مسارات خاصة بالمعلمين (Content Management, Tools)
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import DashboardLayout from '@/presentation/layouts/DashboardLayout'
import { ProtectedRoute } from '@/features/user-authentication-management'
import { teacherMetadata } from './teacher.metadata'
import { DefaultRouteLoader } from '@/presentation/components/common'

// Lazy load pages
const LessonsManagementPage = lazy(() => import('@/presentation/pages/content/LessonsManagementPage'))
const LessonFormPage = lazy(() => import('@/presentation/pages/content/LessonFormPage'))
const LearningPathsManagementPage = lazy(
  () => import('@/presentation/pages/content/LearningPathsManagementPage')
)
const CodeGeneratorPage = lazy(() => import('@/presentation/pages/tools/CodeGeneratorPage'))
const OfficeGeneratorPage = lazy(() => import('@/presentation/pages/tools/OfficeGeneratorPage'))

export const teacherRoutes: RouteConfig[] = [
  {
    path: ROUTES.LESSONS_MANAGEMENT,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.manage']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LessonsManagementPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.LESSONS_MANAGEMENT],
  },
  {
    path: ROUTES.LESSON_FORM,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.create', 'lessons.manage']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LessonFormPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.LESSON_FORM],
  },
  {
    path: ROUTES.LESSON_EDIT_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.update', 'lessons.manage']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LessonFormPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.LESSON_EDIT_PATTERN],
  },
  {
    path: ROUTES.LEARNING_PATHS_MANAGEMENT,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.manage']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LearningPathsManagementPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.LEARNING_PATHS_MANAGEMENT],
  },
  {
    path: ROUTES.CODE_GENERATOR,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.create', 'lessons.manage']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <CodeGeneratorPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.CODE_GENERATOR],
  },
  {
    path: ROUTES.OFFICE_GENERATOR,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.create', 'lessons.manage']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <OfficeGeneratorPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.OFFICE_GENERATOR],
  },
]
