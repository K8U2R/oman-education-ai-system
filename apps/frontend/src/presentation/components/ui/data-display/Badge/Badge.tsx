/**
 * Badge Component - مكون الشارة
 *
 * مكون شارة قابلة لإعادة الاستخدام
 */

import React, { useMemo } from 'react'
import styles from './Badge.module.scss'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const badgeClass = useMemo(() => {
    return [
      styles.badge,
      styles[`badge--${variant}`],
      styles[`badge--${size}`],
      className
    ].filter(Boolean).join(' ')
  }, [variant, size, className])

  return (
    <span className={badgeClass}>
      {dot && <span className={styles.dot} />}
      <span className={styles.content}>{children}</span>
    </span>
  )
}
