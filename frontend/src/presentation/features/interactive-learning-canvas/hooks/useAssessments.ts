/**
 * useAssessments Hook
 * Hook لإدارة التقييمات
 */

import { useState, useEffect, useCallback } from 'react'
import { assessmentService } from '../api/assessment.service'
import type {
  Assessment,
  AssessmentStats,
  GetAssessmentsFilters,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  SubmitAssessmentRequest,
  AssessmentSubmission,
} from '../types/assessment.types'

export const useAssessments = (filters?: GetAssessmentsFilters) => {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [stats, setStats] = useState<AssessmentStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(filters?.page || 1)
  const [perPage, setPerPage] = useState(filters?.per_page || 20)
  const [totalPages, setTotalPages] = useState(0)

  const loadAssessments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await assessmentService.getAssessments({
        ...filters,
        page,
        per_page: perPage,
      })
      setAssessments(response.assessments)
      setTotal(response.total)
      setPage(response.page)
      setPerPage(response.per_page)
      setTotalPages(response.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل التقييمات')
    } finally {
      setIsLoading(false)
    }
  }, [filters, page, perPage])

  const loadStats = useCallback(async () => {
    try {
      const statsData = await assessmentService.getStats()
      setStats(statsData)
    } catch (err) {
      console.error('Failed to load assessment stats:', err)
    }
  }, [])

  useEffect(() => {
    loadAssessments()
  }, [loadAssessments])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const createAssessment = useCallback(
    async (request: CreateAssessmentRequest): Promise<Assessment> => {
      try {
        setIsLoading(true)
        setError(null)
        const assessment = await assessmentService.createAssessment(request)
        await loadAssessments()
        return assessment
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل إنشاء التقييم'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [loadAssessments]
  )

  const updateAssessment = useCallback(
    async (assessmentId: string, request: UpdateAssessmentRequest): Promise<Assessment> => {
      try {
        setIsLoading(true)
        setError(null)
        const assessment = await assessmentService.updateAssessment(assessmentId, request)
        await loadAssessments()
        return assessment
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل تحديث التقييم'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [loadAssessments]
  )

  const deleteAssessment = useCallback(
    async (assessmentId: string): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)
        await assessmentService.deleteAssessment(assessmentId)
        await loadAssessments()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل حذف التقييم'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [loadAssessments]
  )

  const submitAssessment = useCallback(
    async (
      assessmentId: string,
      request: SubmitAssessmentRequest
    ): Promise<AssessmentSubmission> => {
      try {
        setIsLoading(true)
        setError(null)
        const submission = await assessmentService.submitAssessment(assessmentId, request)
        return submission
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'فشل تقديم التقييم'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    assessments,
    stats,
    isLoading,
    error,
    total,
    page,
    perPage,
    totalPages,
    loadAssessments,
    loadStats,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    submitAssessment,
    setPage,
    setPerPage,
  }
}

export const useAssessment = (assessmentId: string | null) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [submission, setSubmission] = useState<AssessmentSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAssessment = useCallback(async () => {
    if (!assessmentId) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await assessmentService.getAssessment(assessmentId)
      setAssessment(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل التقييم')
    } finally {
      setIsLoading(false)
    }
  }, [assessmentId])

  const loadSubmission = useCallback(async () => {
    if (!assessmentId) return

    try {
      const data = await assessmentService.getSubmission(assessmentId)
      setSubmission(data)
    } catch (_err) {
      // Submission might not exist, which is OK
      setSubmission(null)
    }
  }, [assessmentId])

  useEffect(() => {
    loadAssessment()
    loadSubmission()
  }, [loadAssessment, loadSubmission])

  return {
    assessment,
    submission,
    isLoading,
    error,
    loadAssessment,
    loadSubmission,
  }
}
