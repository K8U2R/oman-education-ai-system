/**
 * Assessment Take Page - صفحة حل التقييم
 *
 * صفحة حل التقييم التعليمي
 */

import React from 'react'
import { ClipboardList, ArrowLeft } from 'lucide-react'
import { Button } from '@/presentation/components/common'
import { PageHeader } from '../../components'
import { LoadingState } from '@/presentation/components/ui/feedback/LoadingState'
import { ErrorState } from '@/presentation/components/ui/feedback/ErrorState'
import { ROUTES } from '@/domain/constants'
import { useNavigate } from 'react-router-dom'
import { useAssessmentTakeLogic } from './hooks/useAssessmentTakeLogic'
import { AssessmentTimer } from './components/AssessmentTimer'
import { AssessmentProgress } from './components/AssessmentProgress'
import { QuestionRenderer } from './components/QuestionRenderer'
import { AssessmentNavigation } from './components/AssessmentNavigation'

const AssessmentTakePage: React.FC = () => {
  const navigate = useNavigate()
  const {
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
  } = useAssessmentTakeLogic()

  if (isLoading) {
    return <LoadingState fullScreen message="جارٍ تحميل التقييم..." />
  }

  if (error || !assessment) {
    return (
      <ErrorState
        title="فشل تحميل التقييم"
        message={error || 'التقييم غير موجود'}
        onRetry={() => window.location.reload()}
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
            <AssessmentTimer timeRemaining={timeRemaining} />
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.ASSESSMENT_DETAIL(assessment.id))}
              leftIcon={<ArrowLeft />}
            >
              العودة
            </Button>
          </div>
        }
      />

      <div className="assessment-take__content">
        <AssessmentProgress
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          progress={getProgress()}
        />

        {currentQuestion && (
          <QuestionRenderer
            question={currentQuestion}
            index={currentQuestionIndex}
            userAnswer={(answers[currentQuestion.id] as string | string[]) || ''}
            onAnswerChange={val => handleAnswerChange(currentQuestion.id, val)}
          />
        )}

        <AssessmentNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          hasPrevious={currentQuestionIndex > 0}
          hasNext={currentQuestionIndex < questions.length - 1}
          answeredCount={Object.keys(answers).length}
          totalCount={questions.length}
        />
      </div>
    </div>
  )
}

export default AssessmentTakePage
