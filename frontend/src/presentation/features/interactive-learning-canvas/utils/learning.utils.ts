/**
 * Learning Utils - دوال مساعدة للتعلم
 *
 * @description دوال مساعدة خاصة بميزة التعلم
 */

import type { AssessmentSubmission, QuestionType } from '../types/assessment.types'
import type { DifficultyLevel } from '../types/learning.types'
import { LEARNING_CONFIG, DIFFICULTY_LEVELS } from '../constants'

/**
 * التحقق من صحة عنوان الدرس
 */
export function validateLessonTitle(title: string): {
  valid: boolean
  error?: string
} {
  if (title.length < LEARNING_CONFIG.VALIDATION.LESSON_TITLE_MIN_LENGTH) {
    return {
      valid: false,
      error: `عنوان الدرس يجب أن يكون على الأقل ${LEARNING_CONFIG.VALIDATION.LESSON_TITLE_MIN_LENGTH} أحرف`,
    }
  }

  if (title.length > LEARNING_CONFIG.VALIDATION.LESSON_TITLE_MAX_LENGTH) {
    return {
      valid: false,
      error: `عنوان الدرس يجب أن يكون أقل من ${LEARNING_CONFIG.VALIDATION.LESSON_TITLE_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * التحقق من صحة عنوان التقييم
 */
export function validateAssessmentTitle(title: string): {
  valid: boolean
  error?: string
} {
  if (title.length < LEARNING_CONFIG.VALIDATION.ASSESSMENT_TITLE_MIN_LENGTH) {
    return {
      valid: false,
      error: `عنوان التقييم يجب أن يكون على الأقل ${LEARNING_CONFIG.VALIDATION.ASSESSMENT_TITLE_MIN_LENGTH} أحرف`,
    }
  }

  if (title.length > LEARNING_CONFIG.VALIDATION.ASSESSMENT_TITLE_MAX_LENGTH) {
    return {
      valid: false,
      error: `عنوان التقييم يجب أن يكون أقل من ${LEARNING_CONFIG.VALIDATION.ASSESSMENT_TITLE_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * التحقق من صحة السؤال
 */
export function validateQuestion(question: string): {
  valid: boolean
  error?: string
} {
  if (question.length < LEARNING_CONFIG.VALIDATION.QUESTION_MIN_LENGTH) {
    return {
      valid: false,
      error: `السؤال يجب أن يكون على الأقل ${LEARNING_CONFIG.VALIDATION.QUESTION_MIN_LENGTH} أحرف`,
    }
  }

  if (question.length > LEARNING_CONFIG.VALIDATION.QUESTION_MAX_LENGTH) {
    return {
      valid: false,
      error: `السؤال يجب أن يكون أقل من ${LEARNING_CONFIG.VALIDATION.QUESTION_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * التحقق من صحة الإجابة
 */
export function validateAnswer(answer: string): {
  valid: boolean
  error?: string
} {
  if (answer.length < LEARNING_CONFIG.VALIDATION.ANSWER_MIN_LENGTH) {
    return {
      valid: false,
      error: `الإجابة يجب أن تكون على الأقل ${LEARNING_CONFIG.VALIDATION.ANSWER_MIN_LENGTH} حرف`,
    }
  }

  if (answer.length > LEARNING_CONFIG.VALIDATION.ANSWER_MAX_LENGTH) {
    return {
      valid: false,
      error: `الإجابة يجب أن تكون أقل من ${LEARNING_CONFIG.VALIDATION.ANSWER_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * حساب النسبة المئوية للنتيجة
 */
export function calculateScorePercentage(score: number, totalPoints: number): number {
  if (totalPoints === 0) return 0
  return Math.round((score / totalPoints) * 100)
}

/**
 * التحقق من اجتياز التقييم
 */
export function isAssessmentPassed(
  score: number,
  totalPoints: number,
  passingScore: number
): boolean {
  const percentage = calculateScorePercentage(score, totalPoints)
  return percentage >= passingScore
}

/**
 * تنسيق الوقت المستغرق
 */
export function formatTimeSpent(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} ثانية`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes} دقيقة و ${remainingSeconds} ثانية`
      : `${minutes} دقيقة`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes > 0) {
    return `${hours} ساعة و ${remainingMinutes} دقيقة`
  }

  return `${hours} ساعة`
}

/**
 * تنسيق وقت التقييم
 */
export function formatTimeLimit(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} دقيقة`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes > 0) {
    return `${hours} ساعة و ${remainingMinutes} دقيقة`
  }

  return `${hours} ساعة`
}

/**
 * التحقق من انتهاء وقت التقييم
 */
export function isTimeLimitExceeded(startedAt: Date, timeLimitMinutes: number): boolean {
  const elapsedMinutes = (Date.now() - startedAt.getTime()) / (1000 * 60)
  return elapsedMinutes >= timeLimitMinutes
}

/**
 * حساب الوقت المتبقي
 */
export function calculateTimeRemaining(startedAt: Date, timeLimitMinutes: number): number {
  const elapsedMinutes = (Date.now() - startedAt.getTime()) / (1000 * 60)
  const remainingMinutes = timeLimitMinutes - elapsedMinutes
  return Math.max(0, Math.floor(remainingMinutes))
}

/**
 * تنسيق اسم نوع التقييم
 */
export function formatAssessmentType(type: string): string {
  const typeMap: Record<string, string> = {
    quiz: 'اختبار',
    assignment: 'واجب',
    exam: 'امتحان',
    project: 'مشروع',
  }
  return typeMap[type] || type
}

/**
 * تنسيق اسم حالة التقييم
 */
export function formatAssessmentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    draft: 'مسودة',
    published: 'منشور',
    archived: 'مؤرشف',
  }
  return statusMap[status] || status
}

/**
 * تنسيق اسم حالة التقديم
 */
export function formatSubmissionStatus(status: string): string {
  const statusMap: Record<string, string> = {
    not_started: 'لم يبدأ',
    in_progress: 'قيد التنفيذ',
    submitted: 'تم التقديم',
    graded: 'تم التقييم',
  }
  return statusMap[status] || status
}

/**
 * تنسيق اسم نوع السؤال
 */
export function formatQuestionType(type: QuestionType): string {
  const typeMap: Record<QuestionType, string> = {
    multiple_choice: 'اختيار متعدد',
    true_false: 'صح/خطأ',
    short_answer: 'إجابة قصيرة',
    essay: 'مقال',
    code: 'كود',
  } as Record<string, string>
  return typeMap[type] || type
}

/**
 * تنسيق مستوى الصعوبة
 */
export function formatDifficulty(difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
  }
  return difficultyMap[difficulty] || difficulty
}

/**
 * التحقق من إمكانية تقديم التقييم
 */
export function canSubmitAssessment(
  submission: AssessmentSubmission | null,
  timeLimit?: number,
  startedAt?: Date
): {
  canSubmit: boolean
  reason?: string
} {
  if (submission?.status === 'submitted' || submission?.status === 'graded') {
    return {
      canSubmit: false,
      reason: 'تم تقديم التقييم بالفعل',
    }
  }

  if (timeLimit && startedAt) {
    if (isTimeLimitExceeded(startedAt, timeLimit)) {
      return {
        canSubmit: false,
        reason: 'انتهى الوقت المحدد',
      }
    }
  }

  return { canSubmit: true }
}

/**
 * حساب التقدم في الدرس
 */
export function calculateLessonProgress(progress: number): {
  percentage: number
  isCompleted: boolean
} {
  const percentage = Math.min(100, Math.max(0, progress))
  const isCompleted = percentage >= LEARNING_CONFIG.PROGRESS.COMPLETION_THRESHOLD

  return {
    percentage,
    isCompleted,
  }
}

/**
 * تنسيق رسالة الخطأ
 */
export function formatLearningError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return LEARNING_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * التحقق من صحة مستوى الصعوبة
 */
export function isValidDifficulty(difficulty: string): difficulty is DifficultyLevel {
  return Object.values(DIFFICULTY_LEVELS).includes(difficulty as DifficultyLevel)
}

/**
 * تنسيق نسبة التقدم
 */
export function formatProgress(progress: number): string {
  const percentage = Math.max(0, Math.min(100, Math.round(progress)))
  return `${percentage}%`
}
