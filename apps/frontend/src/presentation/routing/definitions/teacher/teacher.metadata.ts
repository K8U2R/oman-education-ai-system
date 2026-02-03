/**
 * Teacher Routes Metadata - بيانات مسارات المعلم
 *
 * Metadata للمسارات الخاصة بالمعلمين (Content Management, Tools)
 */

import { RouteMetadata } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import { BookOpen, Code, FileText } from 'lucide-react'

export const teacherMetadata: Record<string, RouteMetadata> = {
  [ROUTES.LESSONS_MANAGEMENT]: {
    title: 'إدارة الدروس',
    description: 'إدارة وإنشاء وتعديل الدروس',
    requiresAuth: true,
    requiredPermissions: ['lessons.manage'],
    breadcrumb: 'إدارة الدروس',
    icon: BookOpen,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Content',
      action: 'View Lessons Management',
    },
  },
  [ROUTES.LESSON_FORM]: {
    title: 'إنشاء درس جديد',
    description: 'إنشاء درس جديد',
    requiresAuth: true,
    requiredPermissions: ['lessons.create', 'lessons.manage'],
    breadcrumb: 'إنشاء درس',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.LESSON_EDIT_PATTERN]: {
    title: 'تعديل الدرس',
    description: 'تعديل درس موجود',
    requiresAuth: true,
    requiredPermissions: ['lessons.update', 'lessons.manage'],
    breadcrumb: 'تعديل الدرس',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.LEARNING_PATHS_MANAGEMENT]: {
    title: 'إدارة مسارات التعلم',
    description: 'إدارة وإنشاء وتعديل مسارات التعلم',
    requiresAuth: true,
    requiredPermissions: ['lessons.manage'],
    breadcrumb: 'إدارة مسارات التعلم',
    icon: BookOpen,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Content',
      action: 'View Learning Paths Management',
    },
  },
  [ROUTES.CODE_GENERATOR]: {
    title: 'مولد الكود الذكي',
    description: 'إنشاء كود برمجي باستخدام الذكاء الاصطناعي',
    requiresAuth: true,
    requiredPermissions: ['lessons.create', 'lessons.manage'],
    breadcrumb: 'مولد الكود',
    icon: Code,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Tools',
      action: 'View Code Generator',
    },
  },
  [ROUTES.OFFICE_GENERATOR]: {
    title: 'مولد ملفات Office',
    description: 'إنشاء ملفات Excel و Word و PowerPoint باستخدام الذكاء الاصطناعي',
    requiresAuth: true,
    requiredPermissions: ['lessons.create', 'lessons.manage'],
    breadcrumb: 'مولد ملفات Office',
    icon: FileText,
    layout: 'main',
    showInNav: false,
    analytics: {
      category: 'Tools',
      action: 'View Office Generator',
    },
  },
}
