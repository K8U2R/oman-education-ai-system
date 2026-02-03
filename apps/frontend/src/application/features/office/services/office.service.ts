/**
 * Office Service
 * خدمة إنشاء ملفات Office
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'

export type OfficeFileType = 'excel' | 'word' | 'powerpoint' | 'pdf'
export type OfficeStyle = 'simple' | 'professional' | 'academic' | 'business'
export type OfficeLanguage = 'ar' | 'en'

export interface OfficeTemplate {
  id: string
  name: string
  type: OfficeFileType
  description?: string
  thumbnail?: string
}

export interface OfficeGenerationRequest {
  type: OfficeFileType
  template_id?: string
  data?: Record<string, unknown>
  options?: {
    title?: string
    author?: string
    subject?: string
    language?: OfficeLanguage
    style?: OfficeStyle
    include_charts?: boolean
    include_images?: boolean
  }
  user_specialization?: string
  description?: string
}

export interface OfficeGenerationResponse {
  file_id: string
  file_name: string
  file_type: OfficeFileType
  file_size: number
  download_url: string
  preview_url?: string
  metadata?: {
    created_at: string
  }
}

class OfficeService {
  /**
   * Generate Office file
   */
  async generateOffice(request: OfficeGenerationRequest): Promise<OfficeGenerationResponse> {
    const response = await apiClient.post<{ data: OfficeGenerationResponse }>(
      '/office/generate',
      request
    )
    return response.data
  }

  /**
   * Get available templates
   */
  async getTemplates(type?: OfficeFileType): Promise<OfficeTemplate[]> {
    const params: Record<string, string> = {}
    if (type) params.type = type

    const response = await apiClient.get<{ data: { templates: OfficeTemplate[] } }>(
      '/office/templates',
      params ? { params } : undefined
    )
    return response.data.templates || []
  }
}

export const officeService = new OfficeService()
