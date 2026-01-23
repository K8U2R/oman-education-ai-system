import React from 'react'
import {
  type Assessment,
  type AssessmentQuestion,
} from '@/presentation/features/interactive-learning-canvas'
import { useAssessmentDetailLogic } from '../hooks/useAssessmentDetailLogic'

interface QuestionsPreviewProps {
  assessment: Assessment
}

export const QuestionsPreview: React.FC<QuestionsPreviewProps> = ({ assessment }) => {
  const { formatQuestionType } = useAssessmentDetailLogic()

  const questions: AssessmentQuestion[] =
    typeof assessment.questions === 'string'
      ? JSON.parse(assessment.questions)
      : assessment.questions || []

  return (
    <div className="questions-preview">
      <h3 className="questions-preview__title">الأسئلة ({questions.length})</h3>
      <div className="questions-preview__list">
        {questions.map((question, index: number) => (
          <div key={question.id || index} className="questions-preview__item">
            <div className="questions-preview__item-header">
              <span className="questions-preview__item-number">سؤال {index + 1}</span>
              <span className="questions-preview__item-type">
                {formatQuestionType(question.type)}
              </span>
              <span className="questions-preview__item-points">{question.points} نقاط</span>
            </div>
            <p className="questions-preview__item-text">{question.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
