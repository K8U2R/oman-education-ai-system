import React from 'react'
import { ClipboardList, ArrowLeft, Play, Edit } from 'lucide-react'
import { Card, Button } from '@/presentation/components/common'
import { ProtectedButton } from '@/presentation/components/auth'
import { PageHeader, LoadingState, ErrorState } from '../../components'
import { ROUTES } from '@/domain/constants'
import { useAssessmentDetailLogic } from './hooks/useAssessmentDetailLogic'
import { AssessmentInfo } from './components/AssessmentInfo'
import { AssessmentStats } from './components/AssessmentStats'
import { QuestionsPreview } from './components/QuestionsPreview'

const AssessmentDetailPage: React.FC = () => {
  const {
    assessmentId,
    navigate,
    assessment,
    isLoading,
    error,
    loadAssessment,
    handleStartAssessment,
  } = useAssessmentDetailLogic()

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

  return (
    <div className="assessment-detail-page">
      <PageHeader
        title={assessment.title}
        description={assessment.description || 'تفاصيل التقييم التعليمي'}
        icon={<ClipboardList />}
        actions={
          <div className="assessment-detail-page__actions">
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.ASSESSMENTS)}
              leftIcon={<ArrowLeft />}
            >
              العودة
            </Button>
            <ProtectedButton
              variant="secondary"
              onClick={() => navigate(ROUTES.ASSESSMENT_FORM(assessmentId!))}
              leftIcon={<Edit />}
              requiredPermissions={['lessons.update']}
            >
              تعديل
            </ProtectedButton>
            {assessment.status === 'published' && (
              <Button variant="primary" onClick={handleStartAssessment} leftIcon={<Play />}>
                بدء التقييم
              </Button>
            )}
          </div>
        }
      />

      <div className="assessment-detail-page__content">
        <Card className="assessment-detail-page__info-card">
          <AssessmentInfo assessment={assessment} />
          <AssessmentStats assessment={assessment} />
          <QuestionsPreview assessment={assessment} />
        </Card>
      </div>
    </div>
  )
}

export default AssessmentDetailPage
