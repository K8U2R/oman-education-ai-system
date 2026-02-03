/**
 * useOffice Hook
 * Hook لإدارة Office Generation
 */

import { useState, useCallback } from 'react'
import { officeService } from '../api/office.service'
import type {
  OfficeTemplate,
  OfficeGenerationRequest,
  OfficeGenerationResponse,
  OfficeFileType,
} from '../api/office.service'

export const useOffice = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [templates, setTemplates] = useState<OfficeTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)

  /**
   * Generate Office file
   */
  const generateOffice = useCallback(
    async (request: OfficeGenerationRequest): Promise<OfficeGenerationResponse> => {
      try {
        setIsGenerating(true)
        setError(null)
        const response = await officeService.generateOffice(request)
        return response
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل إنشاء ملف Office'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )

  /**
   * Load templates
   */
  const loadTemplates = useCallback(async (type?: OfficeFileType): Promise<void> => {
    try {
      setIsLoadingTemplates(true)
      setError(null)
      const templatesData = await officeService.getTemplates(type)
      setTemplates(templatesData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل تحميل القوالب'
      setError(errorMessage)
      console.error('Failed to load templates:', err)
    } finally {
      setIsLoadingTemplates(false)
    }
  }, [])

  return {
    isGenerating,
    error,
    templates,
    isLoadingTemplates,
    generateOffice,
    loadTemplates,
    clearError: () => setError(null),
  }
}
