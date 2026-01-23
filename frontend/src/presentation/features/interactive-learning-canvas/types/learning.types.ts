/**
 * Learning Types - أنواع التعلم
 *
 * @description أنواع TypeScript الخاصة بميزة التعلم
 * تجميع جميع الأنواع من Services
 */

// Re-export Lesson Types from Service
import type {
  Lesson,
  LessonExplanation,
  LessonExample,
  LessonExamples,
  LessonVideo,
  LessonVideos,
  MindMapNode,
  MindMapEdge,
  LessonMindMap,
} from '../services/learning-assistant.service'

export type {
  Lesson,
  LessonExplanation,
  LessonExample,
  LessonExamples,
  LessonVideo,
  LessonVideos,
  MindMapNode,
  MindMapEdge,
  LessonMindMap,
}

// Re-export Assessment Types from Service
import type {
  AssessmentType,
  AssessmentStatus,
  SubmissionStatus,
  QuestionType,
  AssessmentQuestion,
  Assessment,
  AssessmentSubmission,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  SubmitAssessmentRequest,
  AssessmentStats,
  GetAssessmentsFilters,
  GetAssessmentsResponse,
} from '@/presentation/features/interactive-learning-canvas/types/assessment.types'

export type {
  AssessmentType,
  AssessmentStatus,
  SubmissionStatus,
  QuestionType,
  AssessmentQuestion,
  Assessment,
  AssessmentSubmission,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  SubmitAssessmentRequest,
  AssessmentStats,
  GetAssessmentsFilters,
  GetAssessmentsResponse,
}

// Application-specific Types

/**
 * حالة تحميل الدروس
 */
export type LessonsLoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * حالة تحميل التقييمات
 */
export type AssessmentsLoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * مستوى الصعوبة
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

/**
 * خيارات تحميل الدروس
 */
export interface LoadLessonsOptions {
  subjectId?: string
  gradeLevelId?: string
  page?: number
  perPage?: number
  search?: string
  difficulty?: string
  tags?: string[]
}

/**
 * نتيجة تحميل الدروس
 */
export interface LoadLessonsResult {
  lessons: Lesson[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

/**
 * خيارات تحميل درس واحد
 */
export interface LoadLessonOptions {
  includeExplanation?: boolean
  includeExamples?: boolean
  includeVideos?: boolean
  includeMindMap?: boolean
  language?: string
}

/**
 * بيانات درس كاملة
 */
export interface LessonFullData extends Lesson {
  explanation?: LessonExplanation
  examples?: LessonExamples
  videos?: LessonVideos
  mindMap?: LessonMindMap
}

/**
 * حالة التقدم في الدرس
 */
export interface LessonProgress {
  lessonId: string
  userId: string
  completed: boolean
  progress: number // 0-100
  lastAccessedAt: Date
  timeSpent: number // بالثواني
  notes?: string
}

/**
 * حالة التقدم في التقييم
 */
export interface AssessmentProgress {
  assessmentId: string
  userId: string
  status: SubmissionStatus
  score?: number
  percentage?: number
  startedAt?: Date
  submittedAt?: Date
  timeSpent?: number // بالثواني
}

/**
 * إحصائيات التعلم
 */
export interface LearningStats {
  totalLessons: number
  completedLessons: number
  inProgressLessons: number
  totalAssessments: number
  completedAssessments: number
  averageScore: number
  totalTimeSpent: number // بالثواني
}

/**
 * فلتر الدروس
 */
export interface LessonFilter {
  subjectId?: string
  gradeLevelId?: string
  difficulty?: string
  tags?: string[]
  search?: string
  page?: number
  perPage?: number
}

/**
 * ترتيب الدروس
 */
export type LessonSort = {
  field: 'title' | 'order' | 'difficulty' | 'createdAt'
  order: 'asc' | 'desc'
}

/**
 * خطأ التعلم
 */
export interface LearningError {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}
