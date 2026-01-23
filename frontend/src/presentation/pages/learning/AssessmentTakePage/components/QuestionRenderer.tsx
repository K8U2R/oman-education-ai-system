import React from 'react'
import { Card } from '@/presentation/components/common'
import { AssessmentQuestion } from '@/presentation/features/interactive-learning-canvas'

interface QuestionRendererProps {
  question: AssessmentQuestion
  index: number
  userAnswer: string | string[]
  onAnswerChange: (answer: string | string[]) => void
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  index,
  userAnswer,
  onAnswerChange,
}) => {
  return (
    <Card className="assessment-take__question-card">
      <div className="assessment-take__question-header">
        <h3 className="assessment-take__question-title">السؤال {index + 1}</h3>
        <span className="assessment-take__question-points">{question.points} نقطة</span>
      </div>

      <p className="assessment-take__question-text">{question.text}</p>

      <div className="assessment-take__answer-section">
        {question.type === 'multiple_choice' && question.options && (
          <div className="assessment-take__options">
            {question.options.map((option: string, i: number) => (
              <label key={i} className="assessment-take__option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={userAnswer === option}
                  onChange={e => onAnswerChange(e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'true_false' && (
          <div className="assessment-take__options">
            <label className="assessment-take__option">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="true"
                checked={userAnswer === 'true'}
                onChange={e => onAnswerChange(e.target.value)}
              />
              <span>صحيح</span>
            </label>
            <label className="assessment-take__option">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="false"
                checked={userAnswer === 'false'}
                onChange={e => onAnswerChange(e.target.value)}
              />
              <span>خطأ</span>
            </label>
          </div>
        )}

        {(question.type === 'short_answer' || question.type === 'essay') && (
          <textarea
            className="assessment-take__textarea"
            value={(userAnswer as string) || ''}
            onChange={e => onAnswerChange(e.target.value)}
            placeholder="اكتب إجابتك هنا..."
            rows={question.type === 'essay' ? 10 : 5}
          />
        )}
      </div>
    </Card>
  )
}
