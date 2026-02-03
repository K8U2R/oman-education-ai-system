
import { lazy } from 'react';
import { RouteConfig } from '../../types';
// Import layouts if needed, or just standard objects

const LearningDashboard = lazy(() => import('@/features/learning/pages/LearningDashboard').then(module => ({ default: module.LearningDashboard })));
const CourseView = lazy(() => import('@/features/learning/pages/CourseView').then(module => ({ default: module.CourseView })));
const LessonView = lazy(() => import('@/features/learning/pages/LessonView').then(module => ({ default: module.LessonView })));

export const learningRoutes: RouteConfig[] = [
    {
        path: '/learning',
        element: <LearningDashboard />,
        metadata: {
            title: 'Learning Dashboard',
            requiresAuth: true
        }
    },
    {
        path: '/learning/courses/:courseId',
        element: <CourseView />,
        metadata: {
            title: 'Course Details',
            requiresAuth: true
        }
    },
    {
        path: '/learning/lessons/:id',
        element: <LessonView />,
        metadata: {
            title: 'Lesson View',
            requiresAuth: true
        }
    }
];
