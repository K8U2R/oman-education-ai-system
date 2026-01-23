/**
 * Learning Assistant Service
 * خدمة مساعد التعلم
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'

export interface Lesson {
  id: string
  subject_id: string
  grade_level_id: string
  title: string
  content?: string
  order: number
  difficulty_level?: string
  tags?: string[]
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

class LearningAssistantService {
  /**
   * Get lesson explanation
   */
  async getLessonExplanation(
    lessonId: string,
    language: string = 'ar',
    style: string = 'simple'
  ): Promise<LessonExplanation> {
    return apiClient.get<LessonExplanation>(`/learning/lessons/${lessonId}/explanation`, {
      params: { language, style },
    })
  }

  /**
   * Get lesson examples
   */
  async getLessonExamples(
    lessonId: string,
    count: number = 5,
    difficulty?: string,
    language: string = 'ar'
  ): Promise<LessonExamples> {
    const params: Record<string, string | number> = { count, language }
    if (difficulty) {
      params.difficulty = difficulty
    }
    return apiClient.get<LessonExamples>(`/learning/lessons/${lessonId}/examples`, { params })
  }

  /**
   * Get lesson videos
   */
  async getLessonVideos(
    lessonId: string,
    platform?: string,
    maxResults: number = 10
  ): Promise<LessonVideos> {
    const params: Record<string, string | number> = { max_results: maxResults }
    if (platform) {
      params.platform = platform
    }
    return apiClient.get<LessonVideos>(`/learning/lessons/${lessonId}/videos`, { params })
  }

  /**
   * Get lesson mind map
   */
  async getLessonMindMap(
    lessonId: string,
    format: string = 'json',
    language: string = 'ar'
  ): Promise<LessonMindMap> {
    return apiClient.get<LessonMindMap>(`/learning/lessons/${lessonId}/mind-map`, {
      params: { format, language },
    })
  }

  /**
   * Get all lessons
   */
  async getLessons(
    subjectId?: string,
    gradeLevelId?: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<{
    lessons: Lesson[]
    total: number
    page: number
    per_page: number
    total_pages: number
  }> {
    const params: Record<string, string | number> = {
      page,
      per_page: perPage,
    }
    if (subjectId) params.subject_id = subjectId
    if (gradeLevelId) params.grade_level_id = gradeLevelId

    try {
      const response = await apiClient.get<{
        lessons: Lesson[]
        total: number
        page: number
        per_page: number
        total_pages: number
      }>('/learning/lessons', { params })
      return response
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch lessons'
      throw new Error(errorMessage)
    }
  }

  /**
   * Get lesson by ID
   */
  async getLesson(lessonId: string): Promise<Lesson> {
    try {
      const response = await apiClient.get<Lesson>(`/learning/lessons/${lessonId}`)
      return response
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : `Failed to fetch lesson ${lessonId}`
      throw new Error(errorMessage)
    }
  }
}

export const learningAssistantService = new LearningAssistantService()
