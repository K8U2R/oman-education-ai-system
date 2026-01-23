import React from 'react'
import { Button } from '@/presentation/components/common'
import { Send } from 'lucide-react'

interface AssessmentNavigationProps {
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
  hasPrevious: boolean
  hasNext: boolean
  answeredCount: number
  totalCount: number
}

export const AssessmentNavigation: React.FC<AssessmentNavigationProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  hasPrevious,
  hasNext,
  answeredCount,
  totalCount,
}) => {
  return (
    <div className="assessment-take__navigation">
      <Button variant="secondary" onClick={onPrevious} disabled={!hasPrevious}>
        السابق
      </Button>

      <div className="assessment-take__navigation-info">
        {answeredCount} / {totalCount} إجابة
      </div>

      {hasNext ? (
        <Button variant="primary" onClick={onNext}>
          التالي
        </Button>
      ) : (
        <Button variant="primary" onClick={onSubmit} isLoading={isSubmitting} leftIcon={<Send />}>
          تقديم التقييم
        </Button>
      )}
    </div>
  )
}
