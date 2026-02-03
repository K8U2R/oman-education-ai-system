import React from 'react'
import { type Assessment } from '@/presentation/features/interactive-learning-canvas'
import { useAssessmentDetailLogic } from '../hooks/useAssessmentDetailLogic'

interface AssessmentInfoProps {
  assessment: Assessment
}

export const AssessmentInfo: React.FC<AssessmentInfoProps> = ({ assessment }) => {
  const { getTypeLabel, getStatusLabel } = useAssessmentDetailLogic()

  return (
    <React.Fragment>
      <div className="assessment-detail__header">
        <div className="assessment-detail__title-section">
          <h2 className="assessment-detail__title">{assessment.title}</h2>
          <div className="assessment-detail__meta">
            <span className="assessment-detail__type">{getTypeLabel(assessment.type)}</span>
            <span className="assessment-detail__divider">•</span>
            <span className="assessment-detail__status">{getStatusLabel(assessment.status)}</span>
          </div>
        </div>
      </div>

      <div className="assessment-detail__description">
        <h3>عن التقييم</h3>
        <p>{assessment.description || 'لا يوجد وصف'}</p>
      </div>
    </React.Fragment>
  )
}
