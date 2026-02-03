import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  type Assessment,
  type AssessmentType,
  type AssessmentStatus,
  assessmentService,
} from '@/presentation/features/interactive-learning-canvas'
import { ROUTES } from '@/domain/constants'

export const useAssessmentDetailLogic = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>()
  const navigate = useNavigate()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
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

  useEffect(() => {
    if (assessmentId) {
      loadAssessment()
    }
  }, [assessmentId, loadAssessment])

  const handleStartAssessment = () => {
    if (assessmentId) {
      navigate(ROUTES.ASSESSMENT_TAKE(assessmentId))
    }
  }

  const getTypeLabel = (type: AssessmentType): string => {
    const labels: Record<string, string> = {
      quiz: 'اختبار قصير',
      assignment: 'واجب',
      exam: 'امتحان',
      project: 'مشروع',
    }
    return labels[type] || type
  }

  const getStatusLabel = (status: AssessmentStatus): string => {
    const labels: Record<AssessmentStatus, string> = {
      draft: 'مسودة',
      published: 'منشور',
      archived: 'مؤرشف',
    }
    return labels[status]
  }

  const formatTimeLimit = (minutes?: number): string => {
    if (!minutes) return 'غير محدد'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours} ساعة و ${mins} دقيقة`
    }
    return `${mins} دقيقة`
  }

  const formatQuestionType = (type: string): string => {
    const types: Record<string, string> = {
      multiple_choice: 'اختيار متعدد',
      true_false: 'صح/خطأ',
      short_answer: 'إجابة قصيرة',
      essay: 'مقال',
      code: 'كود',
    }
    return types[type] || type
  }

  return {
    assessmentId,
    navigate,
    assessment,
    isLoading,
    error,
    loadAssessment,
    handleStartAssessment,
    getTypeLabel,
    getStatusLabel,
    formatTimeLimit,
    formatQuestionType,
  }
}
