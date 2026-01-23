import React from 'react'
import { Card } from '@/presentation/components/common'

interface AssessmentProgressProps {
  currentQuestionIndex: number
  totalQuestions: number
  progress: number
}

export const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentQuestionIndex,
  totalQuestions,
  progress,
}) => {
  return (
    <Card className="assessment-take__progress-card">
      <div className="assessment-take__progress-info">
        <span className="assessment-take__progress-text">
          سؤال {currentQuestionIndex + 1} من {totalQuestions}
        </span>
        <span className="assessment-take__progress-percentage">{Math.round(progress)}%</span>
      </div>
      <div className="assessment-take__progress-bar">
        <div className="assessment-take__progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </Card>
  )
}
