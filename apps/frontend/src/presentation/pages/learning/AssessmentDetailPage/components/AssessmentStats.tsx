import React from 'react'
import { Target, CheckCircle2, Clock, Calendar } from 'lucide-react'
import { type Assessment } from '@/presentation/features/interactive-learning-canvas'
import { useAssessmentDetailLogic } from '../hooks/useAssessmentDetailLogic'

interface AssessmentStatsProps {
  assessment: Assessment
}

export const AssessmentStats: React.FC<AssessmentStatsProps> = ({ assessment }) => {
  const { formatTimeLimit } = useAssessmentDetailLogic()

  return (
    <div className="assessment-stats">
      <div className="assessment-stats__item">
        <Target className="assessment-stats__icon" />
        <div className="assessment-stats__content">
          <span className="assessment-stats__label">النقاط الإجمالية</span>
          <span className="assessment-stats__value">
            {assessment.questions?.reduce((sum, q) => sum + q.points, 0) || 0} نقطة
          </span>
        </div>
      </div>

      <div className="assessment-stats__item">
        <CheckCircle2 className="assessment-stats__icon" />
        <div className="assessment-stats__content">
          <span className="assessment-stats__label">نقاط النجاح</span>
          <span className="assessment-stats__value">{assessment.passingScore}%</span>
        </div>
      </div>

      <div className="assessment-stats__item">
        <Clock className="assessment-stats__icon" />
        <div className="assessment-stats__content">
          <span className="assessment-stats__label">المدة الزمنية</span>
          <span className="assessment-stats__value">
            {assessment.durationMinutes ? formatTimeLimit(assessment.durationMinutes) : 'مفتوح'}
          </span>
        </div>
      </div>

      <div className="assessment-stats__item">
        <Calendar className="assessment-stats__icon" />
        <div className="assessment-stats__content">
          <span className="assessment-stats__label">تاريخ الاستحقاق</span>
          <span className="assessment-stats__value">
            {(assessment as unknown as { dueDate?: string }).dueDate
              ? new Date(
                  (assessment as unknown as { dueDate?: string }).dueDate!
                ).toLocaleDateString('ar-SA')
              : 'غير محدد'}
          </span>
        </div>
      </div>
    </div>
  )
}
