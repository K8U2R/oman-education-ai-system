/**
 * Progress Bar Component - مكون شريط التقدم
 *
 * مكون شريط تقدم قابلة لإعادة الاستخدام
 */

import React from 'react'
import { cn } from '../utils/classNames'
import './ProgressBar.scss'

export type ProgressBarVariant = 'default' | 'primary' | 'success' | 'warning' | 'error'
export type ProgressBarSize = 'sm' | 'md' | 'lg'

interface ProgressBarProps {
  value: number
  max?: number
  variant?: ProgressBarVariant
  size?: ProgressBarSize
  showLabel?: boolean
  label?: string
  animated?: boolean
  striped?: boolean
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label,
  animated = false,
  striped = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const displayLabel = label || `${Math.round(percentage)}%`

  return (
    <div className={cn('progress-bar', `progress-bar--${size}`, className)}>
      {showLabel && (
        <div className="progress-bar__label">
          <span>{displayLabel}</span>
        </div>
      )}
      <div className="progress-bar__track">
        <div
          className={cn(
            'progress-bar__fill',
            `progress-bar__fill--${variant}`,
            animated && 'progress-bar__fill--animated',
            striped && 'progress-bar__fill--striped'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
