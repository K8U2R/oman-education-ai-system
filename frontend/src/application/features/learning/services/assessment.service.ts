/**
 * Assessment Service
 * خدمة التقييمات
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/api'

export type AssessmentType = 'quiz' | 'assignment' | 'exam' | 'project'
export type AssessmentStatus = 'draft' | 'published' | 'archived'
export type SubmissionStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded'
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'code'

export interface AssessmentQuestion {
  id: string
  question: string
  type: QuestionType
  points: number
  options?: string[]
  correct_answer?: string | string[]
  explanation?: string
  order: number
}

export interface Assessment {
  id: string
  lesson_id?: string
  learning_path_id?: string
  title: string
  description?: string
  type: AssessmentType
  status: AssessmentStatus
  total_points: number
  passing_score: number
  time_limit?: number
  questions: AssessmentQuestion[] | string
  created_by: string
  created_at: string
  updated_at: string
  due_date?: string
}

export interface AssessmentSubmission {
  id: string
  assessment_id: string
  user_id: string
  status: SubmissionStatus
  answers:
    | Array<{
        question_id: string
        answer: string | string[]
        is_correct?: boolean
        points_earned?: number
      }>
    | string
  total_score: number
  percentage: number
  started_at: string
  submitted_at?: string
  graded_at?: string
  graded_by?: string
  feedback?: string
}

export interface CreateAssessmentRequest {
  lesson_id?: string
  learning_path_id?: string
  title: string
  description?: string
  type: AssessmentType
  status?: AssessmentStatus
  total_points: number
  passing_score: number
  time_limit?: number
  questions: AssessmentQuestion[]
  due_date?: string
}

export interface UpdateAssessmentRequest {
  title?: string
  description?: string
  type?: AssessmentType
  status?: AssessmentStatus
  total_points?: number
  passing_score?: number
  time_limit?: number
  questions?: AssessmentQuestion[]
  due_date?: string
}

export interface SubmitAssessmentRequest {
  answers: Array<{
    question_id: string
    answer: string | string[]
  }>
}

export interface AssessmentStats {
  total_assessments: number
  published_assessments: number
  total_submissions: number
  average_score: number
  completion_rate: number
}

export interface GetAssessmentsFilters {
  lesson_id?: string
  learning_path_id?: string
  type?: AssessmentType
  status?: AssessmentStatus
  created_by?: string
  page?: number
  per_page?: number
}

export interface GetAssessmentsResponse {
  assessments: Assessment[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

class AssessmentService {
  /**
   * Get all assessments
   */
  async getAssessments(filters?: GetAssessmentsFilters): Promise<GetAssessmentsResponse> {
    const params: Record<string, string> = {}
    if (filters?.lesson_id) params.lesson_id = filters.lesson_id
    if (filters?.learning_path_id) params.learning_path_id = filters.learning_path_id
    if (filters?.type) params.type = filters.type
    if (filters?.status) params.status = filters.status
    if (filters?.created_by) params.created_by = filters.created_by
    if (filters?.page) params.page = filters.page.toString()
    if (filters?.per_page) params.per_page = filters.per_page.toString()

    const response = await apiClient.get<{ data: GetAssessmentsResponse }>('/assessments', {
      params,
    })
    return response.data
  }

  /**
   * Get assessment by ID
   */
  async getAssessment(assessmentId: string): Promise<Assessment> {
    const response = await apiClient.get<{ data: Assessment }>(`/assessments/${assessmentId}`)
    return response.data
  }

  /**
   * Get assessment statistics
   */
  async getAssessmentStats(): Promise<AssessmentStats> {
    const response = await apiClient.get<{ data: AssessmentStats }>('/assessments/stats')
    return response.data
  }

  /**
   * Create assessment
   */
  async createAssessment(request: CreateAssessmentRequest): Promise<Assessment> {
    const response = await apiClient.post<{ data: Assessment }>('/assessments', request)
    return response.data
  }

  /**
   * Update assessment
   */
  async updateAssessment(
    assessmentId: string,
    request: UpdateAssessmentRequest
  ): Promise<Assessment> {
    const response = await apiClient.put<{ data: Assessment }>(
      `/assessments/${assessmentId}`,
      request
    )
    return response.data
  }

  /**
   * Delete assessment
   */
  async deleteAssessment(assessmentId: string): Promise<void> {
    await apiClient.delete(`/assessments/${assessmentId}`)
  }

  /**
   * Submit assessment answers
   */
  async submitAssessment(
    assessmentId: string,
    request: SubmitAssessmentRequest
  ): Promise<AssessmentSubmission> {
    const response = await apiClient.post<{ data: AssessmentSubmission }>(
      `/assessments/${assessmentId}/submit`,
      request
    )
    return response.data
  }

  /**
   * Get user's submission for an assessment
   */
  async getSubmission(assessmentId: string): Promise<AssessmentSubmission | null> {
    try {
      const response = await apiClient.get<{ data: AssessmentSubmission }>(
        `/assessments/${assessmentId}/submission`
      )
      return response.data
    } catch (error: unknown) {
      interface ErrorWithResponse extends Error {
        response?: {
          status?: number
        }
      }
      const apiError = error as ErrorWithResponse
      if (apiError?.response?.status === 404) {
        return null
      }
      throw error
    }
  }
}

export const assessmentService = new AssessmentService()
