/**
 * Teacher Routes - مسارات المعلم
 *
 * مسارات خاصة بالمعلمين (Content Management, Tools)
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import MainLayout from '../../../layouts/MainLayout'
import { ProtectedRoute } from '../../guards'
import { teacherMetadata } from './metadata/teacher.metadata'
import { DefaultRouteLoader } from '../../../components/common'

// Lazy load pages
const LessonsManagementPage = lazy(() => import('../../../pages/content/LessonsManagementPage'))
const LessonFormPage = lazy(() => import('../../../pages/content/LessonFormPage'))
const LearningPathsManagementPage = lazy(
  () => import('../../../pages/content/LearningPathsManagementPage')
)
const CodeGeneratorPage = lazy(() => import('../../../pages/tools/CodeGeneratorPage'))
const OfficeGeneratorPage = lazy(() => import('../../../pages/tools/OfficeGeneratorPage'))

export const teacherRoutes: RouteConfig[] = [
  {
    path: ROUTES.LESSONS_MANAGEMENT,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.manage']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LessonsManagementPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.LESSONS_MANAGEMENT],
  },
  {
    path: ROUTES.LESSON_FORM,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.create', 'lessons.manage']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LessonFormPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.LESSON_FORM],
  },
  {
    path: ROUTES.LESSON_EDIT_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.update', 'lessons.manage']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LessonFormPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.LESSON_EDIT_PATTERN],
  },
  {
    path: ROUTES.LEARNING_PATHS_MANAGEMENT,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.manage']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LearningPathsManagementPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.LEARNING_PATHS_MANAGEMENT],
  },
  {
    path: ROUTES.CODE_GENERATOR,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.create', 'lessons.manage']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <CodeGeneratorPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.CODE_GENERATOR],
  },
  {
    path: ROUTES.OFFICE_GENERATOR,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.create', 'lessons.manage']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <OfficeGeneratorPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: teacherMetadata[ROUTES.OFFICE_GENERATOR],
  },
]
