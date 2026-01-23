/**
 * Assessment Results Page - صفحة نتائج التقييم
 *
 * صفحة عرض نتائج التقييم التعليمي
 */

import React from 'react'
import { ClipboardList, ArrowLeft } from 'lucide-react'
import { Button } from '@/presentation/components/common'
import { PageHeader, LoadingState, ErrorState } from '@/presentation/components'
import { ROUTES } from '@/domain/constants'
import { useNavigate } from 'react-router-dom'
import { useAssessmentResultsLogic } from './hooks/useAssessmentResultsLogic'
import { SummaryCard } from './components/SummaryCard'
import { QuestionsReview } from './components/QuestionsReview'

const AssessmentResultsPage: React.FC = () => {
  const navigate = useNavigate()
  const { assessment, submission, answers, questions, isLoading, error, isPassed } =
    useAssessmentResultsLogic()

  if (isLoading) {
    return <LoadingState fullScreen message="جارٍ تحميل النتائج..." />
  }

  if (error || !assessment) {
    return (
      <ErrorState
        title="فشل تحميل النتائج"
        message={error || 'التقييم غير موجود'}
        onRetry={() => window.location.reload()}
      />
    )
  }

  if (!submission) {
    return (
      <ErrorState
        title="لا توجد نتائج"
        message="لم يتم تقديم هذا التقييم بعد"
        onRetry={() => navigate(ROUTES.ASSESSMENT_DETAIL(assessment.id))}
      />
    )
  }

  return (
    <div className="assessment-results">
      <PageHeader
        title="نتائج التقييم"
        description={assessment.title}
        icon={<ClipboardList />}
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.ASSESSMENT_DETAIL(assessment.id))}
            leftIcon={<ArrowLeft />}
          >
            العودة
          </Button>
        }
      />

      <div className="assessment-results__content">
        <SummaryCard assessment={assessment} submission={submission} isPassed={isPassed} />

        {questions.length > 0 && <QuestionsReview questions={questions} answers={answers} />}
      </div>
    </div>
  )
}

export default AssessmentResultsPage
