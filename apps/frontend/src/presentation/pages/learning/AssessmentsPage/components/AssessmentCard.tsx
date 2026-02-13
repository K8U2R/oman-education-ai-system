import React from 'react'
import { Calendar } from 'lucide-react'
import { Assessment } from '@/presentation/features/interactive-learning-canvas'


interface AssessmentCardProps {
  assessment: Assessment
  onClick: (id: string) => void
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onClick }) => {
  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      quiz: 'اختبار',
      assignment: 'واجب',
      exam: 'امتحان',
      project: 'مشروع',
    }
    return labels[type] || type
  }

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      draft: 'مسودة',
      published: 'منشور',
      archived: 'مؤرشف',
    }
    return labels[status] || status
  }

  return (
    <div className="assessment-card" onClick={() => onClick(assessment.id)}>
      <div className="assessment-card__header">
        <h3 className="assessment-card__title">{assessment.title}</h3>
        <div className="assessment-card__badges">
          <span className={`assessment-card__badge assessment-card__badge--${assessment.type}`}>{getTypeLabel(assessment.type)}</span>
          <span className={`assessment-card__badge assessment-card__badge--${assessment.status}`}>
            {getStatusLabel(assessment.status)}
          </span>
        </div>
      </div>
      {assessment.description && (
        <p className="assessment-card__description">{assessment.description}</p>
      )}
      <div className="assessment-card__footer">
        <div className="assessment-card__meta">
          <span>{assessment.questions?.reduce((sum, q) => sum + q.points, 0) || 0} نقطة</span>
          {assessment.durationMinutes && <span>{assessment.durationMinutes} دقيقة</span>}
          {(assessment as unknown as { dueDate?: string }).dueDate && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              الموعد النهائي:{' '}
              {new Date(
                (assessment as unknown as { dueDate?: string }).dueDate!
              ).toLocaleDateString('ar-SA')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
