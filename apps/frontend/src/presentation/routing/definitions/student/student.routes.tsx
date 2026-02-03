/**
 * Student Routes - مسارات الطالب
 *
 * مسارات خاصة بالطلاب (Dashboard, Lessons, Assessments, Projects, Storage)
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import DashboardLayout from '@/presentation/layouts/DashboardLayout'
import { ProtectedRoute } from '@/features/user-authentication-management'
import { studentMetadata } from './student.metadata'
import { DefaultRouteLoader } from '@/presentation/components/common'

// Lazy load pages
const DashboardPage = lazy(() => import('@/presentation/pages/user/dashboard/DashboardPage'))
import { AICanvasPage } from '@/features/interactive-learning-canvas'
const LessonsPage = lazy(() => import('@/presentation/pages/learning/LessonsPage'))
const LessonDetailPage = lazy(() => import('@/presentation/pages/learning/LessonDetailPage'))
const AssessmentsPage = lazy(() => import('@/presentation/pages/learning/AssessmentsPage'))
const AssessmentDetailPage = lazy(() => import('@/presentation/pages/learning/AssessmentDetailPage'))
const AssessmentTakePage = lazy(() => import('@/presentation/pages/learning/AssessmentTakePage'))
const AssessmentResultsPage = lazy(() => import('@/presentation/pages/learning/AssessmentResultsPage'))
const AssessmentFormPage = lazy(() => import('@/presentation/pages/learning/AssessmentFormPage'))
const ProjectsPage = lazy(() => import('@/presentation/pages/projects/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@/presentation/pages/projects/ProjectDetailPage'))
const ProjectFormPage = lazy(() => import('@/presentation/pages/projects/ProjectFormPage'))
const StoragePage = lazy(() => import('@/presentation/pages/tools/StoragePage'))
const StorageBrowserPage = lazy(() => import('@/presentation/pages/tools/StorageBrowserPage'))

export const studentRoutes: RouteConfig[] = [
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <DashboardPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.DASHBOARD],
  },
  {
    path: ROUTES.LEARN,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AICanvasPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: {
      title: 'المعلم الذكي',
      description: 'مساحة العمل التفاعلية مع الذكاء الاصطناعي',
    },
  },
  {
    path: ROUTES.LESSONS,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LessonsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.LESSONS],
  },
  {
    path: ROUTES.LESSON_DETAIL_PATTERN,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LessonDetailPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.LESSON_DETAIL_PATTERN],
  },
  {
    path: ROUTES.ASSESSMENTS,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENTS],
  },
  {
    path: ROUTES.ASSESSMENT_DETAIL_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentDetailPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENT_DETAIL_PATTERN],
  },
  {
    path: ROUTES.ASSESSMENT_TAKE_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentTakePage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENT_TAKE_PATTERN],
  },
  {
    path: ROUTES.ASSESSMENT_RESULTS_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentResultsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENT_RESULTS_PATTERN],
  },
  {
    path: ROUTES.ASSESSMENT_NEW,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.create']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentFormPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENT_NEW],
  },
  {
    path: ROUTES.ASSESSMENT_FORM_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.update']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentFormPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENT_FORM_PATTERN],
  },
  {
    path: ROUTES.PROJECTS,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ProjectsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.PROJECTS],
  },
  {
    path: ROUTES.PROJECT_DETAIL_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ProjectDetailPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.PROJECT_DETAIL_PATTERN],
  },
  {
    path: ROUTES.PROJECT_NEW,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.create']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ProjectFormPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.PROJECT_NEW],
  },
  {
    path: ROUTES.PROJECT_FORM_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.update']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ProjectFormPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.PROJECT_FORM_PATTERN],
  },
  {
    path: ROUTES.STORAGE,
    element: (
      <ProtectedRoute requiredPermissions={['storage.view']}>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <StoragePage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.STORAGE],
  },
  {
    path: ROUTES.STORAGE_BROWSER_PATTERN,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <StorageBrowserPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.STORAGE_BROWSER_PATTERN],
  },
]
