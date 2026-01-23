import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  type Lesson,
  learningAssistantService,
} from '@/presentation/features/interactive-learning-canvas'
import { loggingService } from '@/infrastructure/services'

export const useLessonsPageLogic = () => {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadLessons()
  }, [])

  const loadLessons = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await learningAssistantService.getLessons()
      setLessons(response.lessons || [])
    } catch (err: unknown) {
      loggingService.error(
        'Failed to load lessons',
        err instanceof Error ? err : new Error(String(err))
      )
      setError(err instanceof Error ? err.message : 'فشل تحميل الدروس. يرجى المحاولة مرة أخرى.')
      setLessons([])
    } finally {
      setLoading(false)
    }
  }

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return {
    navigate,
    lessons,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filteredLessons,
    loadLessons,
  }
}
