import React from 'react'
import { Loader2 } from 'lucide-react'
import { Lesson } from '@/presentation/features/interactive-learning-canvas/types/learning.types'

interface LessonExamplesTabProps {
  loading: boolean
  examples: LessonExamples | null
}

export const LessonExamplesTab: React.FC<LessonExamplesTabProps> = ({ loading, examples }) => {
  if (loading) {
    return (
      <div className="lesson-detail-page__content-loading">
        <Loader2 className="lesson-detail-page__content-spinner" />
        <p className="lesson-detail-page__content-text">جارٍ توليد الأمثلة...</p>
      </div>
    )
  }

  if (examples && examples.examples.length > 0) {
    return (
      <div className="lesson-examples">
        <div className="lesson-examples__list">
          {examples.examples.map((example, index) => (
            <div key={index} className="lesson-examples__item">
              <div className="lesson-examples__item-header">
                <h3 className="lesson-examples__item-title">مثال {index + 1}</h3>
                <p className="lesson-examples__item-question">{example.question}</p>
              </div>
              <div className="lesson-examples__item-solution">
                <p className="lesson-examples__item-solution-label">الحل:</p>
                <p className="lesson-examples__item-solution-text">{example.solution}</p>
              </div>
              <div className="lesson-examples__item-explanation">
                <p className="lesson-examples__item-explanation-label">الشرح:</p>
                <p className="lesson-examples__item-explanation-text">{example.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-detail-page__content-loading">
      <p className="lesson-detail-page__content-text">اضغط على "الأمثلة" لتحميل المحتوى</p>
    </div>
  )
}
