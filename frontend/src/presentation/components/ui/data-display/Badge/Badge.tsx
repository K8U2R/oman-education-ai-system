/**
 * Badge Component - مكون الشارة
 *
 * مكون شارة قابلة لإعادة الاستخدام
 */

import React from 'react'
import { cn } from '../../utils/classNames'

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
  return (
    <span
      className={cn('badge', `badge--${variant}`, `badge--${size}`, dot && 'badge--dot', className)}
    >
      {dot && <span className="badge__dot" />}
      <span className="badge__content">{children}</span>
    </span>
  )
}
