import React from 'react'
import { Card, Button, Input } from '../../../../components/common'
import { Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react'
import {
  AssessmentQuestion,
  QuestionType,
} from '@/presentation/features/interactive-learning-canvas'

interface QuestionEditorProps {
  question: AssessmentQuestion
  index: number
  isFirst: boolean
  isLast: boolean
  onRemove: () => void
  onMove: (direction: 'up' | 'down') => void
  onChange: (
    field: keyof AssessmentQuestion,
    value: string | number | string[] | boolean | QuestionType
  ) => void
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  index,
  isFirst,
  isLast,
  onRemove,
  onMove,
  onChange,
}) => {
  const handleTypeChange = (newType: QuestionType) => {
    onChange('type', newType)
    if (newType === 'multiple_choice' && (!question.options || question.options.length === 0)) {
      onChange('options', ['', '', '', ''])
    }
    if (newType === 'true_false') {
      onChange('options', ['صحيح', 'خطأ'])
    }
  }

  const handleOptionChange = (idx: number, val: string) => {
    const newOptions = [...(question.options || [])]
    newOptions[idx] = val
    onChange('options', newOptions)
  }

  const handleAddOption = () => {
    onChange('options', [...(question.options || []), ''])
  }

  const handleRemoveOption = (idx: number) => {
    const newOptions = [...(question.options || [])]
    newOptions.splice(idx, 1)
    onChange('options', newOptions)
  }

  return (
    <Card className="assessment-form-page__question-card">
      <div className="assessment-form-page__question-header">
        <div className="assessment-form-page__question-number">سؤال {index + 1}</div>
        <div className="assessment-form-page__question-actions">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onMove('up')}
            disabled={isFirst}
            leftIcon={<ArrowUp />}
          >
            أعلى
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onMove('down')}
            disabled={isLast}
            leftIcon={<ArrowDown />}
          >
            أسفل
          </Button>
          <Button type="button" variant="danger" size="sm" onClick={onRemove} leftIcon={<Trash2 />}>
            حذف
          </Button>
        </div>
      </div>

      <div className="assessment-form-page__question-content">
        <div className="assessment-form-page__row">
          <div className="assessment-form-page__field assessment-form-page__field--full">
            <label className="assessment-form-page__label">نص السؤال *</label>
            <textarea
              className="assessment-form-page__textarea"
              value={question.text}
              onChange={e => onChange('text', e.target.value)}
              rows={2}
              required
              placeholder="اكتب السؤال هنا..."
            />
          </div>
        </div>

        <div className="assessment-form-page__row">
          <div className="assessment-form-page__field">
            <label className="assessment-form-page__label">نوع السؤال *</label>
            <select
              className="assessment-form-page__select"
              value={question.type}
              onChange={e => handleTypeChange(e.target.value as QuestionType)}
              required
            >
              <option value="multiple_choice">اختيار متعدد</option>
              <option value="true_false">صح/خطأ</option>
              <option value="short_answer">إجابة قصيرة</option>
              <option value="essay">مقال</option>
              <option value="code">كود</option>
            </select>
          </div>

          <div className="assessment-form-page__field">
            <label className="assessment-form-page__label">النقاط *</label>
            <Input
              type="number"
              value={question.points}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange('points', parseInt(e.target.value) || 0)
              }
              required
              min={1}
            />
          </div>
        </div>

        {/* Question Options Logic */}
        {question.type === 'multiple_choice' && (
          <div className="assessment-form-page__field assessment-form-page__field--full">
            <label className="assessment-form-page__label">الخيارات *</label>
            <div className="assessment-form-page__options">
              {(question.options || []).map((option, optIndex) => (
                <div key={optIndex} className="assessment-form-page__option-row">
                  <Input
                    value={option}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleOptionChange(optIndex, e.target.value)
                    }
                    placeholder={`خيار ${optIndex + 1}`}
                    required={optIndex < 2}
                  />
                  {optIndex >= 2 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveOption(optIndex)}
                      leftIcon={<Trash2 />}
                    >
                      حذف
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddOption}
                leftIcon={<Plus />}
              >
                إضافة خيار
              </Button>
            </div>

            <div className="assessment-form-page__field">
              <label className="assessment-form-page__label">الإجابة الصحيحة *</label>
              <select
                className="assessment-form-page__select"
                value={(question.correctAnswer as string) || ''}
                onChange={e => onChange('correctAnswer', e.target.value)}
                required
              >
                <option value="">اختر الإجابة الصحيحة</option>
                {(question.options || [])
                  .filter(opt => opt.trim().length > 0)
                  .map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {question.type === 'true_false' && (
          <div className="assessment-form-page__field">
            <label className="assessment-form-page__label">الإجابة الصحيحة *</label>
            <select
              className="assessment-form-page__select"
              value={(question.correctAnswer as string) || ''}
              onChange={e => onChange('correctAnswer', e.target.value)}
              required
            >
              <option value="">اختر الإجابة الصحيحة</option>
              <option value="true">صحيح</option>
              <option value="false">خطأ</option>
            </select>
          </div>
        )}

        {/* Explanation */}
        <div className="assessment-form-page__field assessment-form-page__field--full">
          <label className="assessment-form-page__label">شرح الإجابة (اختياري)</label>
          <textarea
            className="assessment-form-page__textarea"
            value={question.explanation || ''}
            onChange={e => onChange('explanation', e.target.value)}
            rows={2}
            placeholder="شرح الإجابة الصحيحة..."
          />
        </div>
      </div>
    </Card>
  )
}
