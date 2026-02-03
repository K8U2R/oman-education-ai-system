import React from 'react'
import { Clock } from 'lucide-react'

interface AssessmentTimerProps {
  timeRemaining: number | null
}

export const AssessmentTimer: React.FC<AssessmentTimerProps> = ({ timeRemaining }) => {
  if (timeRemaining === null) return null

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="assessment-take__timer">
      <Clock className="assessment-take__timer-icon" />
      <span className="assessment-take__timer-text">{formatTime(timeRemaining)}</span>
    </div>
  )
}
