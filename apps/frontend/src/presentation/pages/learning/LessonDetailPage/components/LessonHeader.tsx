import React from 'react'
import { ArrowRight, Edit, Trash2, Bot } from 'lucide-react'
import { Button } from '@/presentation/components/common'
import { ProtectedButton } from '@/presentation/components/auth'
import { type Lesson } from '@/presentation/features/interactive-learning-canvas/types/learning.types'

interface LessonHeaderProps {
  lesson: Lesson
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  onAssistantOpen: () => void
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lesson,
  onBack,
  onEdit,
  onDelete,
  onAssistantOpen,
}) => {
  return (
    <div className="lesson-detail-page__header">
      <div className="lesson-detail-page__header-top">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="lesson-detail-page__back-button"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة إلى الدروس
        </Button>
        <div className="lesson-detail-page__header-actions">
          <ProtectedButton
            variant="outline"
            size="sm"
            onClick={onEdit}
            leftIcon={<Edit />}
            requiredPermissions={['lessons.update', 'lessons.manage']}
            className="lesson-detail-page__edit-button"
          >
            تعديل
          </ProtectedButton>
          <ProtectedButton
            variant="outline"
            size="sm"
            onClick={onDelete}
            leftIcon={<Trash2 />}
            requiredPermissions={['lessons.delete', 'lessons.manage']}
            className="lesson-detail-page__delete-button"
          >
            حذف
          </ProtectedButton>
          <Button
            variant="primary"
            size="sm"
            onClick={onAssistantOpen}
            leftIcon={<Bot />}
            className="lesson-detail-page__assistant-button"
          >
            المساعد الذكي
          </Button>
        </div>
      </div>
      <h1 className="lesson-detail-page__title">{lesson.title}</h1>
      {lesson.content && (
        <p className="lesson-detail-page__description">{lesson.content.substring(0, 200)}...</p>
      )}
    </div>
  )
}
