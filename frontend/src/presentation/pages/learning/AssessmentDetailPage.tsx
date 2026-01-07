/**
 * Assessment Detail Page - صفحة تفاصيل التقييم
 *
 * صفحة عرض تفاصيل تقييم تعليمي
 */

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  Calendar,
  Clock,
  Target,
  ArrowLeft,
  Play,
  FileText,
  CheckCircle2,
  Edit,
} from 'lucide-react'
import { assessmentService } from '@/application/features/learning/services/assessment.service'
import { Card, Button } from '../../components/common'
import { ProtectedButton } from '../../components/auth'
import { PageHeader, LoadingState, ErrorState } from '../components'
import { ROUTES } from '@/domain/constants'
import type {
  Assessment,
  AssessmentType,
  AssessmentStatus,
  AssessmentQuestion,
} from '@/application/features/learning/services/assessment.service'
import './AssessmentDetailPage.scss'

const AssessmentDetailPage: React.FC = () => {
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

  const getTypeLabel = (type: AssessmentType): string => {
    const labels: Record<AssessmentType, string> = {
      quiz: 'اختبار قصير',
      assignment: 'واجب',
      exam: 'امتحان',
      project: 'مشروع',
    }
    return labels[type]
  }

  const getStatusLabel = (status: AssessmentStatus): string => {
    const labels: Record<AssessmentStatus, string> = {
      draft: 'مسودة',
      published: 'منشور',
      archived: 'مؤرشف',
    }
    return labels[status]
  }

  const handleStartAssessment = () => {
    if (assessmentId) {
      navigate(ROUTES.ASSESSMENT_TAKE(assessmentId))
    }
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

  const questions =
    typeof assessment.questions === 'string'
      ? JSON.parse(assessment.questions)
      : assessment.questions || []

  return (
    <div className="assessment-detail">
      <PageHeader
        title={assessment.title}
        description={assessment.description || 'تفاصيل التقييم التعليمي'}
        icon={<ClipboardList />}
        actions={
          <div className="assessment-detail__actions">
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

      <div className="assessment-detail__content">
        {/* Assessment Info */}
        <Card className="assessment-detail__info-card">
          <div className="assessment-detail__header">
            <div className="assessment-detail__title-section">
              <h2 className="assessment-detail__title">{assessment.title}</h2>
              <div className="assessment-detail__meta">
                <span className="assessment-detail__type">{getTypeLabel(assessment.type)}</span>
                <span className="assessment-detail__divider">•</span>
                <span className="assessment-detail__status">
                  {getStatusLabel(assessment.status)}
                </span>
              </div>
            </div>
          </div>

          {assessment.description && (
            <div className="assessment-detail__description">
              <p>{assessment.description}</p>
            </div>
          )}

          <div className="assessment-detail__details">
            <div className="assessment-detail__detail-item">
              <Target className="assessment-detail__detail-icon" />
              <div className="assessment-detail__detail-content">
                <span className="assessment-detail__detail-label">النقاط الإجمالية</span>
                <span className="assessment-detail__detail-value">
                  {assessment.total_points} نقطة
                </span>
              </div>
            </div>

            <div className="assessment-detail__detail-item">
              <CheckCircle2 className="assessment-detail__detail-icon" />
              <div className="assessment-detail__detail-content">
                <span className="assessment-detail__detail-label">نقاط النجاح</span>
                <span className="assessment-detail__detail-value">
                  {assessment.passing_score} نقطة
                </span>
              </div>
            </div>

            <div className="assessment-detail__detail-item">
              <Clock className="assessment-detail__detail-icon" />
              <div className="assessment-detail__detail-content">
                <span className="assessment-detail__detail-label">الوقت المحدد</span>
                <span className="assessment-detail__detail-value">
                  {formatTimeLimit(assessment.time_limit)}
                </span>
              </div>
            </div>

            {assessment.due_date && (
              <div className="assessment-detail__detail-item">
                <Calendar className="assessment-detail__detail-icon" />
                <div className="assessment-detail__detail-content">
                  <span className="assessment-detail__detail-label">تاريخ الاستحقاق</span>
                  <span className="assessment-detail__detail-value">
                    {new Date(assessment.due_date).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            )}

            <div className="assessment-detail__detail-item">
              <FileText className="assessment-detail__detail-icon" />
              <div className="assessment-detail__detail-content">
                <span className="assessment-detail__detail-label">عدد الأسئلة</span>
                <span className="assessment-detail__detail-value">{questions.length} سؤال</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Questions Preview */}
        {questions.length > 0 && (
          <Card className="assessment-detail__questions-card">
            <h3 className="assessment-detail__questions-title">معاينة الأسئلة</h3>
            <div className="assessment-detail__questions-list">
              {questions.map((question: AssessmentQuestion, index: number) => (
                <div key={question.id || index} className="assessment-detail__question-item">
                  <div className="assessment-detail__question-header">
                    <span className="assessment-detail__question-number">سؤال {index + 1}</span>
                    <span className="assessment-detail__question-points">
                      {question.points} نقطة
                    </span>
                  </div>
                  <p className="assessment-detail__question-text">{question.question}</p>
                  {question.type && (
                    <span className="assessment-detail__question-type">
                      نوع السؤال:{' '}
                      {question.type === 'multiple_choice'
                        ? 'اختيار متعدد'
                        : question.type === 'true_false'
                          ? 'صح/خطأ'
                          : question.type === 'short_answer'
                            ? 'إجابة قصيرة'
                            : question.type === 'essay'
                              ? 'مقال'
                              : question.type === 'code'
                                ? 'كود'
                                : question.type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AssessmentDetailPage
