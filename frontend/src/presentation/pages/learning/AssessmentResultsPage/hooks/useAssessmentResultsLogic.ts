import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  AssessmentQuestion,
  Assessment,
  AssessmentSubmission,
} from '@/presentation/features/interactive-learning-canvas/types/assessment.types'

export interface SubmissionAnswer {
  question_id: string
  answer: string | string[]
  is_correct?: boolean
  points_earned?: number
}

export const useAssessmentResultsLogic = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>()
  // Removed unused imports and cleaned up legacy hooks usage
  const [answers, setAnswers] = useState<Record<string, SubmissionAnswer>>({})

  useEffect(() => {
    if (assessmentId) {
      // We need to load specific assessment and submission
      // Legacy useAssessments might not support single load well,
      // but assuming the previous code worked, we'll try to replicate logic or use service directly if needed.
      // Re-reading legacy code: useAssessment(assessmentId) was used.
      // But invalid import path in legacy code: import { useAssessments } from ... then useAssessment(id).
      // Let's check `useAssessments` hook export.
      // If it doesn't have loadAssessment(id), we might need to fetch directly or assume useAssessments(id) exists.
      // Actually, let's use the service directly for cleaner logic if hooks are messy,
      // OR rely on the hook if it's correct.
      // The legacy file `AssessmentResultsPage.tsx` imported: `import { useAssessments } from ...`
      // BUT called `useAssessment(assessmentId)`. This implies a mismatch or a refined hook exists.
      // We will assume `assessmentService` usage is safer for a logic hook.
    }
  }, [assessmentId])

  // Re-implementing logic using service for reliability or existing hook if verified.
  // Legacy: const { assessment, submission, ... } = useAssessment(assessmentId)
  // Let's assume we need to fetch data.

  // To ensure 0 errors, let's just use the props/logic pattern from previous file
  // but fixed imports.
  // If `useAssessment` exists in `interactive-learning-canvas`, use it.
  // The previous legacy file imported `useAssessments` but used `useAssessment`.
  // This suggests we should use `useAssessment` if available, or `assessmentService`.

  // Wait, the previous file had: `import { useAssessments } from ...` but line 37: `useAssessment(assessmentId || null)`.
  // This was an error in the legacy file! TS2304: Cannot find name 'useAssessment'.
  // We MUST fix this. We should use `assessmentService` directly in this hook to be clean.

  const [localAssessment, setAssessment] = useState<Assessment | null>(null)
  const [localSubmission, setSubmission] = useState<
    (AssessmentSubmission & { percentage?: number; total_score?: number }) | null
  >(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!assessmentId) return
      setLoading(true)
      try {
        // Fetch Assessment
        // We intentionally use service directly to avoid broken hooks
        const assessmentData =
          await import('@/presentation/features/interactive-learning-canvas').then(m =>
            m.assessmentService.getAssessment(assessmentId)
          )
        setAssessment(assessmentData)

        // Fetch Submission
        const submissionData =
          await import('@/presentation/features/interactive-learning-canvas').then(m =>
            m.assessmentService.getSubmission(assessmentId)
          )
        setSubmission(submissionData)

        if (submissionData?.answers) {
          const parsedAnswers =
            typeof submissionData.answers === 'string'
              ? JSON.parse(submissionData.answers)
              : submissionData.answers

          const answersMap: Record<string, SubmissionAnswer> = {}
          // Normalize answers
          if (Array.isArray(parsedAnswers)) {
            parsedAnswers.forEach((a: SubmissionAnswer) => (answersMap[a.question_id] = a))
          } else {
            // fallback if object
            Object.assign(answersMap, parsedAnswers)
          }
          setAnswers(answersMap)
        }
      } catch (err) {
        console.error(err)
        setLoadError('فشل تحميل النتائج')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [assessmentId])

  const questions: AssessmentQuestion[] = localAssessment
    ? typeof localAssessment.questions === 'string'
      ? JSON.parse(localAssessment.questions)
      : localAssessment.questions || []
    : []

  const isPassed =
    localSubmission && localAssessment
      ? (localSubmission.percentage || 0) >=
        (localAssessment.passingScore
          ? (localAssessment.passingScore /
              (localAssessment.questions.reduce((sum, q) => sum + q.points, 0) || 100)) *
            100
          : 50)
      : // Fallback logic for passing score calculation if fields missing
        false

  return {
    assessment: localAssessment,
    submission: localSubmission,
    answers,
    questions,
    isLoading: loading,
    error: loadError,
    isPassed,
  }
}
