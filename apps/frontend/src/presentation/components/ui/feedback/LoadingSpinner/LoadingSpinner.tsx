/**
 * LoadingSpinner Component - مكون دوار التحميل
 *
 * مكون دوار تحميل قابلة لإعادة الاستخدام
 */

import React, { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import styles from './LoadingSpinner.module.scss'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'secondary' | 'white'
  className?: string
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
  text,
}) => {
  const spinnerClass = useMemo(() => {
    return [
      styles.spinner,
      styles[`spinner--${size}`],
      styles[`spinner--${variant}`]
    ].filter(Boolean).join(' ')
  }, [size, variant])

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Loader2
        className={spinnerClass}
      />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  )
}
