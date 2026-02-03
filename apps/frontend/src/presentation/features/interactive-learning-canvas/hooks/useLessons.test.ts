/**
 * useLessons Hook Tests - اختبارات Hook الدروس
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useLessons } from './useLessons'
import { learningAssistantService } from '../services'

// Mock dependencies
vi.mock('../services')

describe('useLessons', () => {
  const mockLessons = [
    {
      id: '1',
      title: 'درس تجريبي',
      description: 'وصف الدرس',
      subject: 'الرياضيات',
      grade_level: 'الصف العاشر',
      subject_id: 'sub-1',
      grade_level_id: 'grade-10',
      order: 1,
      created_at: '2025-01-08T10:00:00Z',
      updated_at: '2025-01-08T10:00:00Z',
    },
  ]

  const mockResponse = {
    lessons: mockLessons,
    total: 10,
    page: 1,
    per_page: 20,
    total_pages: 1,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(learningAssistantService.getLessons).mockResolvedValue(mockResponse)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useLessons())

      expect(result.current.lessons).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.total).toBe(0)
    })
  })

  describe('loadLessons', () => {
    it('should load lessons successfully', async () => {
      const { result } = renderHook(() => useLessons())

      await result.current.loadLessons()

      await waitFor(() => {
        expect(result.current.lessons).toEqual(mockLessons)
        expect(result.current.total).toBe(10)
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should handle loading error', async () => {
      const error = new Error('Failed to load lessons')
      vi.mocked(learningAssistantService.getLessons).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useLessons())

      await result.current.loadLessons()

      await waitFor(() => {
        expect(result.current.error).toBe('فشل تحميل الدروس')
        expect(result.current.isLoading).toBe(false)
      })
    })
  })
})
