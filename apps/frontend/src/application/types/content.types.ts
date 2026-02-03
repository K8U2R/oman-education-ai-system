/**
 * Content Types - أنواع المحتوى التعليمي
 *
 * تعريفات موحدة للأنواع المستخدمة في صفحات المحتوى التعليمي
 * يقلل التكرار ويوحد التعريفات عبر المشروع
 */

/**
 * Lesson - الدرس التعليمي
 */
export interface Lesson {
  id: string
  title: string
  subject_id: string
  grade_level_id: string
  content?: string
  order: number
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

/**
 * Subject - المادة الدراسية
 */
export interface Subject {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  order?: number
  created_at?: string
  updated_at?: string
}

/**
 * GradeLevel - المرحلة الدراسية
 */
export interface GradeLevel {
  id: string
  name: string
  description?: string
  order?: number
  created_at?: string
  updated_at?: string
}

/**
 * LearningPath - المسار التعليمي
 */
export interface LearningPath {
  id: string
  name: string
  description?: string
  subject_id: string
  grade_level_id: string
  lessons: string[]
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

/**
 * LessonFormData - بيانات نموذج الدرس
 */
export interface LessonFormData {
  subject_id: string
  grade_level_id: string
  title: string
  content: string
  order: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  is_published: boolean
}

/**
 * LearningPathFormData - بيانات نموذج المسار التعليمي
 */
export interface LearningPathFormData {
  name: string
  description?: string
  subject_id: string
  grade_level_id: string
  lessons: string[]
  order: number
  is_published: boolean
}
