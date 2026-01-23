import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// Removed legacy useAssessment import
// Removed unused SubmitAssessmentRequest import
import { assessmentService } from '@/presentation/features/interactive-learning-canvas'
import { ROUTES } from '@/domain/constants'
import { AssessmentQuestion, Assessment } from '@/presentation/features/interactive-learning-canvas'

export const useAssessmentTakeLogic = (assessmentId?: string) => {
  const navigate = useNavigate()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAssessment = useCallback(async () => {
    if (!assessmentId) return
    setIsLoading(true)
    try {
      const data = await assessmentService.getAssessment(assessmentId)
      setAssessment(data)
    } catch {
      setError('Failed to load assessment')
    } finally {
      setIsLoading(false)
    }
  }, [assessmentId])

  useEffect(() => {
    if (assessmentId) loadAssessment()
  }, [assessmentId, loadAssessment])

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Parse questions safely
  const questions: AssessmentQuestion[] = assessment
    ? typeof assessment.questions === 'string'
      ? JSON.parse(assessment.questions)
      : assessment.questions || []
    : []

  const handleSubmit = useCallback(async () => {
    if (!assessmentId || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const formattedAnswers = Object.entries(answers).reduce(
        (acc, [key, value]) => {
          acc[key] = value
          return acc
        },
        {} as Record<string, string | string[]>
      )

      await assessmentService.submitAssessment(assessmentId, {
        answers: formattedAnswers,
      })

      navigate(ROUTES.ASSESSMENT_RESULTS(assessmentId))
    } catch {
      setError('فشل تسليم التقييم. حاول مرة أخرى.')
      setIsSubmitting(false)
    }
  }, [assessmentId, answers, isSubmitting, navigate])

  const handleAutoSubmit = useCallback(() => {
    handleSubmit()
  }, [handleSubmit])

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining <= 0 && assessment?.durationMinutes) {
      handleAutoSubmit()
    }
  }, [timeRemaining, assessment?.durationMinutes, handleAutoSubmit])

  const getAssessmentDuration = useCallback(() => {
    if (assessment?.durationMinutes) {
      const totalSeconds = assessment.durationMinutes * 60
      return totalSeconds
    }
    return 0
  }, [assessment?.durationMinutes])

  // Timer Logic
  useEffect(() => {
    const totalSeconds = getAssessmentDuration()
    if (totalSeconds > 0) {
      setTimeRemaining(totalSeconds)

      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null) return null
          if (prev <= 0) {
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
    return undefined
  }, [getAssessmentDuration])

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const getProgress = (): number => {
    return questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0
  }

  const currentQuestion = questions[currentQuestionIndex]

  return {
    assessment,
    isLoading,
    error,
    currentQuestion,
    currentQuestionIndex,
    questions,
    answers,
    timeRemaining,
    isSubmitting,
    handleAnswerChange,
    handleNext,
    handlePrevious,
    handleSubmit,
    getProgress,
  }
}
