/**
 * useOffice Hook Tests - اختبارات Hook Office
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useOffice } from './useOffice'
import { officeService } from '../services/office.service'

// Mock dependencies
vi.mock('../services/office.service')

describe('useOffice', () => {
  const mockTemplates = [
    {
      id: '1',
      name: 'Template 1',
      type: 'excel' as const,
      description: 'Excel template',
    },
  ]

  const mockGenerationResponse = {
    file_id: 'file-1',
    file_name: 'generated.xlsx',
    file_type: 'excel' as const,
    file_size: 1024,
    download_url: 'https://download.url',
    preview_url: 'https://preview.url',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(officeService.getTemplates).mockResolvedValue(mockTemplates)
    vi.mocked(officeService.generateOffice).mockResolvedValue(mockGenerationResponse)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useOffice())

      expect(result.current.isGenerating).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.templates).toEqual([])
      expect(result.current.isLoadingTemplates).toBe(false)
    })
  })

  describe('generateOffice', () => {
    it('should generate office file successfully', async () => {
      const { result } = renderHook(() => useOffice())

      const response = await result.current.generateOffice({
        type: 'excel',
        description: 'Generate excel file',
      })

      expect(officeService.generateOffice).toHaveBeenCalledWith({
        type: 'excel',
        description: 'Generate excel file',
      })
      expect(response).toEqual(mockGenerationResponse)
    })

    it('should handle generation error', async () => {
      const error = new Error('Failed to generate')
      vi.mocked(officeService.generateOffice).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useOffice())

      await expect(
        result.current.generateOffice({
          type: 'excel',
          description: 'Generate excel file',
        })
      ).rejects.toThrow()

      expect(result.current.error).toBe('فشل إنشاء ملف Office')
    })
  })

  describe('loadTemplates', () => {
    it('should load templates successfully', async () => {
      const { result } = renderHook(() => useOffice())

      await result.current.loadTemplates('excel')

      await waitFor(() => {
        expect(result.current.templates).toEqual(mockTemplates)
        expect(result.current.isLoadingTemplates).toBe(false)
      })
    })

    it('should handle loading error', async () => {
      const error = new Error('Failed to load templates')
      vi.mocked(officeService.getTemplates).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useOffice())

      await result.current.loadTemplates()

      await waitFor(() => {
        expect(result.current.error).toBe('فشل تحميل القوالب')
        expect(result.current.isLoadingTemplates).toBe(false)
      })
    })
  })

  describe('clearError', () => {
    it('should clear error', () => {
      const { result } = renderHook(() => useOffice())

      result.current.clearError()

      expect(result.current.error).toBeNull()
    })
  })
})
