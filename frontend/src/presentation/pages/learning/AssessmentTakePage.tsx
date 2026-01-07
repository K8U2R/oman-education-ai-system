/**
 * Assessment Take Page - صفحة حل التقييم
 *
 * صفحة حل التقييم التعليمي
 */

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ClipboardList, Clock, ArrowLeft, Send } from 'lucide-react'
import { useAssessment } from '@/application/features/learning/hooks/useAssessments'
import { assessmentService } from '@/application/features/learning/services/assessment.service'
import { Card, Button } from '../../components/common'
import { PageHeader, LoadingState, ErrorState } from '../components'
import { ROUTES } from '@/domain/constants'
import type { SubmitAssessmentRequest } from '@/application/features/learning/services/assessment.service'
import './AssessmentTakePage.scss'

const AssessmentTakePage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>()
  const navigate = useNavigate()
  const { assessment, isLoading, error, loadAssessment } = useAssessment(assessmentId || null)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (assessmentId) {
      loadAssessment()
    }
  }, [assessmentId, loadAssessment])

  const handleSubmit = useCallback(async () => {
    if (!assessmentId || isSubmitting) return

    try {
      setIsSubmitting(true)
      const submitRequest: SubmitAssessmentRequest = {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: questionId,
          answer: Array.isArray(answer) ? answer : [answer],
        })),
      }

      await assessmentService.submitAssessment(assessmentId, submitRequest)
      navigate(ROUTES.ASSESSMENT_RESULTS(assessmentId))
    } catch (err) {
      console.error('Failed to submit assessment:', err)
      alert('فشل تقديم التقييم')
    } finally {
      setIsSubmitting(false)
    }
  }, [assessmentId, answers, isSubmitting, navigate])

  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting) return
    await handleSubmit()
  }, [isSubmitting, handleSubmit])

  useEffect(() => {
    if (assessment?.time_limit) {
      const totalSeconds = assessment.time_limit * 60
      setTimeRemaining(totalSeconds)

      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval)
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
    return undefined
  }, [assessment?.time_limit, handleAutoSubmit])

  const questions = assessment
    ? typeof assessment.questions === 'string'
      ? JSON.parse(assessment.questions)
      : assessment.questions || []
    : []

  const currentQuestion = questions[currentQuestionIndex]

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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = (): number => {
    return questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0
  }

  if (isLoading) {
    return <LoadingState fullScreen message="جارٍ تحميل التقييم..." />
  }

  if (error || !assessment) {
    return (
      <ErrorState
        title="فشل تحميل التقييم"
        message={error || 'التقييم غير موجود'}
        onRetry={loadAssessment}
      />
    )
  }

  if (questions.length === 0) {
    return (
      <ErrorState
        title="لا توجد أسئلة"
        message="هذا التقييم لا يحتوي على أسئلة"
        onRetry={() => navigate(ROUTES.ASSESSMENTS)}
      />
    )
  }

  return (
    <div className="assessment-take">
      <PageHeader
        title={assessment.title}
        description="حل التقييم التعليمي"
        icon={<ClipboardList />}
        actions={
          <div className="assessment-take__header-actions">
            {timeRemaining !== null && (
              <div className="assessment-take__timer">
                <Clock className="assessment-take__timer-icon" />
                <span className="assessment-take__timer-text">{formatTime(timeRemaining)}</span>
              </div>
            )}
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.ASSESSMENT_DETAIL(assessmentId!))}
              leftIcon={<ArrowLeft />}
            >
              العودة
            </Button>
          </div>
        }
      />

      <div className="assessment-take__content">
        {/* Progress Bar */}
        <Card className="assessment-take__progress-card">
          <div className="assessment-take__progress-info">
            <span className="assessment-take__progress-text">
              سؤال {currentQuestionIndex + 1} من {questions.length}
            </span>
            <span className="assessment-take__progress-percentage">
              {Math.round(getProgress())}%
            </span>
          </div>
          <div className="assessment-take__progress-bar">
            <div
              className="assessment-take__progress-bar-fill"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </Card>

        {/* Question */}
        <Card className="assessment-take__question-card">
          <div className="assessment-take__question-header">
            <h3 className="assessment-take__question-title">السؤال {currentQuestionIndex + 1}</h3>
            <span className="assessment-take__question-points">{currentQuestion.points} نقطة</span>
          </div>

          <p className="assessment-take__question-text">{currentQuestion.question}</p>

          <div className="assessment-take__answer-section">
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <div className="assessment-take__options">
                {currentQuestion.options.map((option: string, index: number) => (
                  <label key={index} className="assessment-take__option">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={e => handleAnswerChange(currentQuestion.id, e.target.value)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'true_false' && (
              <div className="assessment-take__options">
                <label className="assessment-take__option">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value="true"
                    checked={answers[currentQuestion.id] === 'true'}
                    onChange={e => handleAnswerChange(currentQuestion.id, e.target.value)}
                  />
                  <span>صحيح</span>
                </label>
                <label className="assessment-take__option">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value="false"
                    checked={answers[currentQuestion.id] === 'false'}
                    onChange={e => handleAnswerChange(currentQuestion.id, e.target.value)}
                  />
                  <span>خطأ</span>
                </label>
              </div>
            )}

            {(currentQuestion.type === 'short_answer' ||
              currentQuestion.type === 'essay' ||
              currentQuestion.type === 'code') && (
              <textarea
                className="assessment-take__textarea"
                value={(answers[currentQuestion.id] as string) || ''}
                onChange={e => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="اكتب إجابتك هنا..."
                rows={
                  currentQuestion.type === 'essay' ? 10 : currentQuestion.type === 'code' ? 15 : 5
                }
              />
            )}
          </div>
        </Card>

        {/* Navigation */}
        <div className="assessment-take__navigation">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            السابق
          </Button>

          <div className="assessment-take__navigation-info">
            {Object.keys(answers).length} / {questions.length} إجابة
          </div>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button variant="primary" onClick={handleNext}>
              التالي
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              leftIcon={<Send />}
            >
              تقديم التقييم
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssessmentTakePage
