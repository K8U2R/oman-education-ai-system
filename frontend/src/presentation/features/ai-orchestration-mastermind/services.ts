import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { API_ENDPOINTS } from '@/domain/constants/api.constants'

export interface AIInteractionResponse {
  explanation: string
  examples: string[]
  interactiveQuestion: {
    question: string
    options?: string[]
    answerHint?: string
  }
  mediaRecommendation: 'video' | 'image' | 'diagram' | 'none'
  relatedConcepts: string[]
}

export interface AIInteractionRequest {
  message: string
  userId: string
  sessionId?: string
  context?: {
    currentSubject?: string
    proficiencyLevel?: number
  }
}

class AIService {
  /**
   * Interact with the AI Kernel
   * @param data Request data including message and context
   */
  async interact(data: AIInteractionRequest): Promise<AIInteractionResponse> {
    const response = await apiClient.post<{ data: AIInteractionResponse }>(
      API_ENDPOINTS.AI.INTERACT,
      data
    )
    return response.data
  }
}

export const aiService = new AIService()
