/**
 * Student Routes - مسارات الطالب
 *
 * مسارات خاصة بالطلاب (Dashboard, Lessons, Assessments, Projects, Storage)
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import MainLayout from '../../../layouts/MainLayout'
import { ProtectedRoute } from '../../guards'
import { studentMetadata } from './metadata/student.metadata'
import { DefaultRouteLoader } from '../../../components/common'

// Lazy load pages
const DashboardPage = lazy(() => import('../../../pages/user/DashboardPage'))
const LessonsPage = lazy(() => import('../../../pages/learning/LessonsPage'))
const LessonDetailPage = lazy(() => import('../../../pages/learning/LessonDetailPage'))
const AssessmentsPage = lazy(() => import('../../../pages/learning/AssessmentsPage'))
const AssessmentDetailPage = lazy(() => import('../../../pages/learning/AssessmentDetailPage'))
const AssessmentTakePage = lazy(() => import('../../../pages/learning/AssessmentTakePage'))
const AssessmentResultsPage = lazy(() => import('../../../pages/learning/AssessmentResultsPage'))
const AssessmentFormPage = lazy(() => import('../../../pages/learning/AssessmentFormPage'))
const ProjectsPage = lazy(() => import('../../../pages/projects/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('../../../pages/projects/ProjectDetailPage'))
const ProjectFormPage = lazy(() => import('../../../pages/projects/ProjectFormPage'))
const StoragePage = lazy(() => import('../../../pages/tools/StoragePage'))
const StorageBrowserPage = lazy(() => import('../../../pages/tools/StorageBrowserPage'))

export const studentRoutes: RouteConfig[] = [
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <DashboardPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.DASHBOARD],
  },
  {
    path: ROUTES.LESSONS,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LessonsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.LESSONS],
  },
  {
    path: ROUTES.LESSON_DETAIL_PATTERN,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LessonDetailPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.LESSON_DETAIL_PATTERN],
  },
  {
    path: ROUTES.ASSESSMENTS,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENTS],
  },
  {
    path: ROUTES.ASSESSMENT_DETAIL_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentDetailPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENT_DETAIL_PATTERN],
  },
  {
    path: ROUTES.ASSESSMENT_TAKE_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentTakePage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENT_TAKE_PATTERN],
  },
  {
    path: ROUTES.ASSESSMENT_RESULTS_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentResultsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENT_RESULTS_PATTERN],
  },
  {
    path: ROUTES.ASSESSMENT_NEW,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.create']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentFormPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENT_NEW],
  },
  {
    path: ROUTES.ASSESSMENT_FORM_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.update']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AssessmentFormPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.ASSESSMENT_FORM_PATTERN],
  },
  {
    path: ROUTES.PROJECTS,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ProjectsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.PROJECTS],
  },
  {
    path: ROUTES.PROJECT_DETAIL_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ProjectDetailPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.PROJECT_DETAIL_PATTERN],
  },
  {
    path: ROUTES.PROJECT_NEW,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.create']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ProjectFormPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.PROJECT_NEW],
  },
  {
    path: ROUTES.PROJECT_FORM_PATTERN,
    element: (
      <ProtectedRoute requiredPermissions={['lessons.update']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ProjectFormPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.PROJECT_FORM_PATTERN],
  },
  {
    path: ROUTES.STORAGE,
    element: (
      <ProtectedRoute requiredPermissions={['storage.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <StoragePage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.STORAGE],
  },
  {
    path: ROUTES.STORAGE_BROWSER_PATTERN,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <StorageBrowserPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: studentMetadata[ROUTES.STORAGE_BROWSER_PATTERN],
  },
]
