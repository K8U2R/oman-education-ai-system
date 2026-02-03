/**
 * Error Icon - أيقونة الخطأ
 *
 * مكون لإظهار أيقونات الأخطاء مع ألوان قابلة للتخصيص
 */

import React from 'react'
import { LucideIcon } from 'lucide-react'
import type { ErrorIconColor } from '../core/types'


interface ErrorIconProps {
  /** الأيقونة */
  icon: LucideIcon
  /** لون الأيقونة */
  color: ErrorIconColor
  /** حجم الأيقونة */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** className إضافي */
  className?: string
}

export const ErrorIcon: React.FC<ErrorIconProps> = ({
  icon: Icon,
  color,
  size = 'lg',
  className = '',
}) => {
  return (
    <div className={`error-icon error-icon--${color} error-icon--${size} ${className}`}>
      <Icon className="error-icon__svg" />
    </div>
  )
}
