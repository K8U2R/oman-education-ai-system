import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  type Lesson,
  type LessonExplanation,
  type LessonExamples,
  type LessonVideos,
  type LessonMindMap,
} from '@/presentation/features/interactive-learning-canvas/types/learning.types'
import { learningAssistantService } from '@/presentation/features/interactive-learning-canvas'
import { apiClient } from '@/infrastructure/api/api-client'
import { API_ENDPOINTS } from '@/domain/constants'

export type ActiveTab = 'explanation' | 'examples' | 'videos' | 'mindmap'

export const useLessonDetailLogic = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState<Lesson | null>(null)

  // Tab Data States
  const [explanation, setExplanation] = useState<LessonExplanation | null>(null)
  const [examples, setExamples] = useState<LessonExamples | null>(null)
  const [videos, setVideos] = useState<LessonVideos | null>(null)
  const [mindMap, setMindMap] = useState<LessonMindMap | null>(null)

  // Loading States
  const [loading, setLoading] = useState(true)
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [loadingExamples, setLoadingExamples] = useState(false)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [loadingMindMap, setLoadingMindMap] = useState(false)

  // UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('explanation')
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

  const loadExplanation = useCallback(async () => {
    if (!lessonId) return

    try {
      setLoadingExplanation(true)
      const data = await learningAssistantService.getLessonExplanation(lessonId, 'ar', 'detailed')
      setExplanation(data)
      setActiveTab('explanation')
    } catch (_err) {
      // Error logging is handled by the error interceptor
    } finally {
      setLoadingExplanation(false)
    }
  }, [lessonId])

  const loadLesson = useCallback(async () => {
    if (!lessonId) return

    try {
      setLoading(true)
      const data = await learningAssistantService.getLesson(lessonId)
      setLesson(data)
      // Load explanation by default
      loadExplanation()
    } catch (_err) {
      // Error logging is handled by the error interceptor
    } finally {
      setLoading(false)
    }
  }, [lessonId, loadExplanation])

  useEffect(() => {
    if (lessonId) {
      loadLesson()
    }
  }, [lessonId, loadLesson])

  const loadExamples = async () => {
    if (!lessonId) return

    try {
      setLoadingExamples(true)
      const data = await learningAssistantService.getLessonExamples(lessonId, 5, 'medium', 'ar')
      setExamples(data)
      setActiveTab('examples')
    } catch (_err) {
      // Error logging is handled by the error interceptor
    } finally {
      setLoadingExamples(false)
    }
  }

  const loadVideos = async () => {
    if (!lessonId) return

    try {
      setLoadingVideos(true)
      const data = await learningAssistantService.getLessonVideos(lessonId)
      setVideos(data)
      setActiveTab('videos')
    } catch (_err) {
      // Error logging is handled by the error interceptor
    } finally {
      setLoadingVideos(false)
    }
  }

  const loadMindMap = async () => {
    if (!lessonId) return

    try {
      setLoadingMindMap(true)
      const data = await learningAssistantService.getLessonMindMap(lessonId, 'json', 'ar')
      setMindMap(data)
      setActiveTab('mindmap')
    } catch (_err) {
      // Error logging is handled by the error interceptor
    } finally {
      setLoadingMindMap(false)
    }
  }

  const handleAssistantMessage = async (message: string): Promise<string> => {
    if (!lessonId) {
      return 'الرجاء تحديد درس أولاً'
    }

    try {
      // استخدام Learning API للرد على أسئلة المستخدم
      const response = await apiClient.post<{ success: boolean; data: { answer: string } }>(
        `${API_ENDPOINTS.LEARNING.LESSON(lessonId)}/chat`,
        {
          message,
          context: {
            lesson_id: lessonId,
            lesson_title: lesson?.title,
          },
        }
      )

      if (response.success && response.data?.answer) {
        return response.data.answer
      }

      return 'عذراً، لم أتمكن من الإجابة على سؤالك. الرجاء المحاولة مرة أخرى.'
      return 'عذراً، لم أتمكن من الإجابة على سؤالك. الرجاء المحاولة مرة أخرى.'
    } catch (_error) {
      // Error logging is handled by the error interceptor
      return 'حدث خطأ في الاتصال.';
    }
  }

  /**
   * Streaming support for AI Assistant
   */
  const handleAssistantStream = async (message: string, onToken: (token: string) => void): Promise<void> => {
    if (!lessonId) return

    try {
      const token = localStorage.getItem('token'); // Simplistic token retreival for MVP

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:30000/api/v1'}/learning/lessons/${lessonId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          context: {
            lesson_id: lessonId,
            lesson_title: lesson?.title,
          }
        })
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6);
              if (jsonStr.trim() === "[DONE]") continue; // OpenAI sometimes sends [DONE]

              const data = JSON.parse(jsonStr);
              if (data.token) {
                onToken(data.token);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

    } catch (error) {
      console.error("Streaming error:", error);
      onToken("عذراً، انقطع الاتصال.");
    }
  }

  return {
    lessonId,
    navigate,
    lesson,
    explanation,
    examples,
    videos,
    mindMap,
    loading,
    loadingExplanation,
    loadingExamples,
    loadingVideos,
    loadingMindMap,
    activeTab,
    setActiveTab,
    isAssistantOpen,
    setIsAssistantOpen,
    loadExplanation,
    loadExamples,
    loadVideos,
    loadMindMap,
    handleAssistantMessage,
    handleAssistantStream // Export new function
  }
}

