import React from 'react'
import { Card, Button } from '@/presentation/components/common'
import { Plus } from 'lucide-react'
import {
  AssessmentQuestion,
  QuestionType,
} from '@/presentation/features/interactive-learning-canvas'
import { QuestionEditor } from '@/presentation/pages/learning/AssessmentFormPage/components/QuestionEditor'

interface QuestionListProps {
  questions: AssessmentQuestion[]
  onAddQuestion: () => void
  onRemoveQuestion: (id: string) => void
  onMoveQuestion: (id: string, direction: 'up' | 'down') => void
  onQuestionChange: (
    id: string,
    field: keyof AssessmentQuestion,
    value: string | number | string[] | boolean | QuestionType
  ) => void
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onAddQuestion,
  onRemoveQuestion,
  onMoveQuestion,
  onQuestionChange,
}) => {
  return (
    <Card className="assessment-form-page__section">
      <div className="assessment-form-page__section-header">
        <h3 className="assessment-form-page__section-title">الأسئلة ({questions.length})</h3>
        <Button type="button" variant="primary" onClick={onAddQuestion} leftIcon={<Plus />}>
          إضافة سؤال
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="assessment-form-page__empty-questions">
          <p>لا توجد أسئلة. اضغط على "إضافة سؤال" لبدء إضافة الأسئلة.</p>
        </div>
      ) : (
        <div className="assessment-form-page__questions">
          {questions.map((question, index) => (
            <QuestionEditor
              key={question.id || index}
              question={question}
              index={index}
              isFirst={index === 0}
              isLast={index === questions.length - 1}
              onRemove={() => onRemoveQuestion(question.id)}
              onMove={(direction: 'up' | 'down') => onMoveQuestion(question.id, direction)}
              onChange={(
                field: keyof AssessmentQuestion,
                value: string | number | string[] | boolean | QuestionType
              ) => onQuestionChange(question.id, field, value)}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
