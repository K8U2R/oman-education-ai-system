/**
 * useLessons Hook - Hook للدروس
 *
 * Custom Hook لإدارة الدروس
 */

import { useState, useCallback, useEffect } from 'react'
import { type Lesson, learningAssistantService } from '../api/learning-assistant.service'
// import { Lesson } from '@/domain/entities/Lesson' already imported as type below or similar conflict resolution

interface UseLessonsOptions {
  subjectId?: string
  gradeLevelId?: string
  autoLoad?: boolean
}

interface UseLessonsReturn {
  lessons: Lesson[]
  total: number
  isLoading: boolean
  error: string | null
  loadLessons: (options?: UseLessonsOptions) => Promise<void>
  getLesson: (lessonId: string) => Promise<Lesson | null>
}

export const useLessons = (options?: UseLessonsOptions): UseLessonsReturn => {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * تحميل الدروس
   */
  const loadLessons = useCallback(
    async (loadOptions?: UseLessonsOptions) => {
      const opts = loadOptions || options
      try {
        setIsLoading(true)
        setError(null)
        const lessonsData = await learningAssistantService.getLessons(
          opts?.subjectId,
          opts?.gradeLevelId
        )
        const lessonEntities = lessonsData.lessons
        setLessons(lessonEntities)
        setTotal(lessonsData.total)
      } catch (err) {
        console.error('Failed to load lessons:', err)
        setError('فشل تحميل الدروس')
        setLessons([])
      } finally {
        setIsLoading(false)
      }
    },
    [options]
  )

  /**
   * الحصول على درس محدد
   */
  const getLesson = useCallback(async (lessonId: string): Promise<Lesson | null> => {
    try {
      setIsLoading(true)
      setError(null)
      const lessonData = await learningAssistantService.getLesson(lessonId)
      return lessonData
    } catch (err) {
      console.error('Failed to load lesson:', err)
      setError('فشل تحميل الدرس')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * تحميل الدروس تلقائياً عند التحميل الأولي
   */
  useEffect(() => {
    if (options?.autoLoad !== false) {
      loadLessons()
    }
  }, [loadLessons, options?.autoLoad])

  return {
    lessons,
    total,
    isLoading,
    error,
    loadLessons,
    getLesson,
  }
}
