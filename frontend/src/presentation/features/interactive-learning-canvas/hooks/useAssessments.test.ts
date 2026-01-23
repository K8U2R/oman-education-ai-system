/**
 * useAssessments Hook Tests - اختبارات Hook التقييمات
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAssessments, useAssessment } from './useAssessments'
import { assessmentService, type Assessment } from '../services'

// Mock dependencies
vi.mock('../services')

describe('useAssessments', () => {
  const mockAssessments = [
    {
      id: '1',
      title: 'تقييم تجريبي',
      description: 'وصف التقييم',
      lesson_id: 'lesson-1',
      created_at: '2025-01-08T10:00:00Z',
      updated_at: '2025-01-08T10:00:00Z',
      type: 'quiz' as const,
      status: 'published' as const,
      gradeLevelId: 'grade-1',
      passingScore: 75,
      questions: [],
      lessons_count: 5, // Optional property in some types but adding minimal required fields
    } as unknown as Assessment, // Force cast to avoid strict legacy type mismatch during mock setup
  ]

  const mockResponse = {
    assessments: mockAssessments,
    total: 10,
    page: 1,
    per_page: 20,
    total_pages: 1,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(assessmentService.getAssessments).mockResolvedValue(mockResponse)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useAssessments())

      expect(result.current.assessments).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('loadAssessments', () => {
    it('should load assessments successfully', async () => {
      const { result } = renderHook(() => useAssessments())

      await result.current.loadAssessments()

      await waitFor(() => {
        expect(result.current.assessments).toEqual(mockAssessments)
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should handle loading error', async () => {
      const error = new Error('Failed to load assessments')
      vi.mocked(assessmentService.getAssessments).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useAssessments())

      await result.current.loadAssessments()

      await waitFor(() => {
        expect(result.current.error).toBeDefined()
        expect(result.current.isLoading).toBe(false)
      })
    })
  })
})

describe('useAssessment', () => {
  const mockAssessment = {
    id: '1',
    title: 'تقييم تجريبي',
    description: 'وصف التقييم',
    lesson_id: 'lesson-1',
    created_at: '2025-01-08T10:00:00Z',
    updated_at: '2025-01-08T10:00:00Z',
    type: 'quiz' as const,
    status: 'published' as const,
    gradeLevelId: 'grade-1',
    passingScore: 60,
    questions: [],
    createdBy: 'user-1',
    subjectId: 'subject-1',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(assessmentService.getAssessment).mockResolvedValue(mockAssessment)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useAssessment(null))

      expect(result.current.assessment).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('loadAssessment', () => {
    it('should load assessment successfully', async () => {
      const { result } = renderHook(() => useAssessment('1'))

      await waitFor(() => {
        expect(result.current.assessment).toEqual(mockAssessment)
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should not load when assessmentId is null', async () => {
      const { result } = renderHook(() => useAssessment(null))

      await waitFor(() => {
        expect(assessmentService.getAssessment).not.toHaveBeenCalled()
        expect(result.current.assessment).toBeNull()
      })
    })
  })
})
