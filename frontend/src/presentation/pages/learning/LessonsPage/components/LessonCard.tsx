import React from 'react'
import { BookOpen } from 'lucide-react'
import { Card, Button } from '@/presentation/components/common'
import { type Lesson } from '@/presentation/features/interactive-learning-canvas'

interface LessonCardProps {
  lesson: Lesson
  onClick: () => void
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => {
  return (
    <Card onClick={onClick}>
      <div className="lesson-card">
        <div className="lesson-card__header">
          <div className="lesson-card__icon">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="lesson-card__info">
            <h3 className="lesson-card__title">{lesson.title}</h3>
            {lesson.difficulty_level && (
              <span className="lesson-card__difficulty">{lesson.difficulty_level}</span>
            )}
          </div>
        </div>

        {lesson.content && (
          <p className="lesson-card__content">{lesson.content.substring(0, 100)}...</p>
        )}

        <div className="lesson-card__actions">
          <Button
            variant="primary"
            size="sm"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation()
              onClick()
            }}
          >
            عرض الدرس
          </Button>
        </div>
      </div>
    </Card>
  )
}
