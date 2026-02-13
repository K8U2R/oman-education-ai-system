import { apiClient } from '@/infrastructure/api/api-client'
import type {
  Assessment,
  AssessmentSubmission,
  AssessmentStats,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  SubmitAssessmentRequest,
  GetAssessmentsFilters,
  GetAssessmentsResponse,
} from '../types/assessment.types'

// Assuming API_ENDPOINTS is defined elsewhere, e.g., in a constants file
// For the purpose of this edit, I'll define a placeholder for API_ENDPOINTS
// In a real application, this would be imported.
const API_ENDPOINTS = {
  ASSESSMENT: {
    BASE: '/assessments',
    LIST: '/assessments',
    BY_ID: (id: string) => `/assessments/${id}`,
    SUBMIT: (id: string) => `/assessments/${id}/submit`,
    STATS: '/assessments/stats',
  },
  // ... other endpoints
}

class AssessmentService {
  // The baseUrl property is no longer strictly needed if using API_ENDPOINTS directly
  // private readonly baseUrl = '/assessments'

  async getAssessments(filters?: GetAssessmentsFilters): Promise<GetAssessmentsResponse> {
    const response = await apiClient.get<GetAssessmentsResponse>(API_ENDPOINTS.ASSESSMENT.LIST, {
      params: filters,
    })
    return response
  }

  async getAssessment(id: string): Promise<Assessment> {
    const response = await apiClient.get<Assessment>(API_ENDPOINTS.ASSESSMENT.BY_ID(id))
    return response
  }

  async createAssessment(data: CreateAssessmentRequest): Promise<Assessment> {
    const response = await apiClient.post<Assessment>(API_ENDPOINTS.ASSESSMENT.BASE, data)
    return response
  }

  async updateAssessment(id: string, data: UpdateAssessmentRequest): Promise<Assessment> {
    const response = await apiClient.put<Assessment>(API_ENDPOINTS.ASSESSMENT.BY_ID(id), data)
    return response
  }

  async deleteAssessment(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.ASSESSMENT.BY_ID(id))
  }

  async submitAssessment(id: string, data: SubmitAssessmentRequest): Promise<AssessmentSubmission> {
    const response = await apiClient.post<AssessmentSubmission>(
      API_ENDPOINTS.ASSESSMENT.SUBMIT(id),
      data
    )
    return response
  }

  async getSubmission(id: string): Promise<AssessmentSubmission> {
    const response = await apiClient.get<AssessmentSubmission>(
      // Assuming there's an endpoint for getting a submission by ID
      `/assessments/${id}/results`
    )
    return response
  }

  async getStats(teacherId?: string): Promise<AssessmentStats> {
    const response = await apiClient.get<AssessmentStats>(API_ENDPOINTS.ASSESSMENT.STATS, {
      params: { teacherId },
    })
    return response
  }
}

export const assessmentService = new AssessmentService()
