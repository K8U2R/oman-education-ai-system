/**
 * LoadingSpinner Component - مكون دوار التحميل
 *
 * مكون دوار تحميل قابلة لإعادة الاستخدام
 */

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/classNames'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'secondary' | 'white'
  className?: string
  text?: string
}

const sizeClasses = {
  xs: 'loading-spinner--xs',
  sm: 'loading-spinner--sm',
  md: 'loading-spinner--md',
  lg: 'loading-spinner--lg',
  xl: 'loading-spinner--xl',
}

const variantClasses = {
  default: 'loading-spinner--default',
  primary: 'loading-spinner--primary',
  secondary: 'loading-spinner--secondary',
  white: 'loading-spinner--white',
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
  text,
}) => {
  return (
    <div className={cn('loading-spinner-wrapper', className)}>
      <Loader2
        className={cn('loading-spinner', sizeClasses[size], variantClasses[variant])}
        aria-label="جاري التحميل"
      />
      {text && <p className="loading-spinner__text">{text}</p>}
    </div>
  )
}
