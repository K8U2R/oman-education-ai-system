/**
 * Lesson Types - أنواع الدروس
 *
 * هذا الملف يحتوي على جميع Types المتعلقة بالدروس
 */

export interface Lesson {
  id: string
  subject_id: string
  grade_level_id: string
  title: string
  content?: string
  order: number
  difficulty_level?: string
  tags?: string[]
  is_published?: boolean
}

export interface LessonExplanation {
  lesson_id: string
  explanation: string
  language: string
  style: string
}

export interface LessonExample {
  id: number
  question: string
  solution: string
  explanation: string
  difficulty: string
}

export interface LessonExamples {
  lesson_id: string
  examples: LessonExample[]
  count: number
}

export interface LessonVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  url: string
  platform: 'youtube' | 'vimeo'
  channel?: string
  duration?: number
  view_count?: number
}

export interface LessonVideos {
  lesson_id: string
  videos: LessonVideo[]
  count: number
  source: string
}

export interface MindMapNode {
  id: string
  label: string
  type: 'root' | 'concept' | 'subconcept'
}

export interface MindMapEdge {
  from: string
  to: string
}

export interface LessonMindMap {
  lesson_id: string
  nodes: MindMapNode[]
  edges: MindMapEdge[]
  format: 'json' | 'image' | 'svg'
}

/**
 * LessonType - نوع الدرس (alias for Lesson for backward compatibility)
 * 
 * @deprecated استخدم Lesson مباشرة بدلاً من LessonType
 * سيتم حذف هذا الـ type في v2.0.0
 * 
 * @example
 * // ❌ القديم (Deprecated)
 * const lesson: LessonType = {...}
 * 
 * // ✅ الجديد (Recommended)
 * const lesson: Lesson = {...}
 */
export type LessonType = Lesson
