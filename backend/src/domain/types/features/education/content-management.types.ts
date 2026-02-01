/**
 * Content Management Types - أنواع إدارة المحتوى
 *
 * TypeScript types لإدارة المحتوى التعليمي
 */

/**
 * الدرس - لإدارة المحتوى
 *
 * يستخدم في نظام إدارة المحتوى (Content Management System)
 * يختلف عن LearningLesson المستخدم في مساعد التعلم
 */
export interface ContentLesson {
  id: string;
  subject_id: string;
  grade_level_id: string;
  title: string;
  content?: string;
  order: number;
  difficulty_level?: "beginner" | "intermediate" | "advanced";
  tags?: string[];
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/**
 * طلب إنشاء درس
 */
export interface CreateLessonRequest {
  subject_id: string;
  grade_level_id: string;
  title: string;
  content?: string;
  order?: number;
  difficulty_level?: "beginner" | "intermediate" | "advanced";
  tags?: string[];
  is_published?: boolean;
}

/**
 * طلب تحديث درس
 */
export interface UpdateLessonRequest {
  subject_id?: string;
  grade_level_id?: string;
  title?: string;
  content?: string;
  order?: number;
  difficulty_level?: "beginner" | "intermediate" | "advanced";
  tags?: string[];
  is_published?: boolean;
}

/**
 * المادة الدراسية
 */
export interface Subject {
  id: string;
  name: string;
  name_ar: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * المستوى الدراسي
 */
export interface GradeLevel {
  id: string;
  name: string;
  name_ar: string;
  level: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * المسار التعليمي
 */
export interface LearningPath {
  id: string;
  name: string;
  description?: string;
  subject_id: string;
  grade_level_id: string;
  lessons: string[]; // Array of lesson IDs
  order: number;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/**
 * طلب إنشاء مسار تعليمي
 */
export interface CreateLearningPathRequest {
  name: string;
  description?: string;
  subject_id: string;
  grade_level_id: string;
  lessons: string[];
  order?: number;
  is_published?: boolean;
}

/**
 * طلب تحديث مسار تعليمي
 */
export interface UpdateLearningPathRequest {
  name?: string;
  description?: string;
  subject_id?: string;
  grade_level_id?: string;
  lessons?: string[];
  order?: number;
  is_published?: boolean;
}
