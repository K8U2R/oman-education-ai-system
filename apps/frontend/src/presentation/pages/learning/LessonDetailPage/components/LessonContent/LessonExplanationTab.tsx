import React from 'react'
import { Loader2 } from 'lucide-react'
import { Lesson } from '@/presentation/features/interactive-learning-canvas/types/learning.types'

interface LessonExplanationTabProps {
  loading: boolean
  explanation: LessonExplanation | null
}

export const LessonExplanationTab: React.FC<LessonExplanationTabProps> = ({
  loading,
  explanation,
}) => {
  if (loading) {
    return (
      <div className="lesson-detail-page__content-loading">
        <Loader2 className="lesson-detail-page__content-spinner" />
        <p className="lesson-detail-page__content-text">جارٍ توليد الشرح...</p>
      </div>
    )
  }

  if (explanation) {
    return (
      <div className="lesson-explanation">
        <div className="lesson-explanation__text">{explanation.explanation}</div>
      </div>
    )
  }

  return (
    <div className="lesson-detail-page__content-loading">
      <p className="lesson-detail-page__content-text">اضغط على "الشرح" لتحميل المحتوى</p>
    </div>
  )
}
