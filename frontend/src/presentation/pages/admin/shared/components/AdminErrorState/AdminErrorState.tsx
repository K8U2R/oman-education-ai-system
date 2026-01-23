/**
 * AdminErrorState Component - Error State موحد لصفحات Admin
 *
 * Component موحد لعرض حالة الخطأ في صفحات Admin
 */

import React from 'react'
import { ErrorState } from '@/presentation/pages/components'


export interface AdminErrorStateProps {
  /**
   * عنوان الخطأ
   */
  title?: string

  /**
   * رسالة الخطأ
   */
  message?: string

  /**
   * دالة إعادة المحاولة
   */
  onRetry?: () => void

  /**
   * className إضافي
   */
  className?: string
}

/**
 * AdminErrorState Component
 *
 * Error State موحد لصفحات Admin
 *
 * @example
 * ```tsx
 * <AdminErrorState
 *   title="حدث خطأ"
 *   message="فشل تحميل البيانات"
 *   onRetry={handleRetry}
 * />
 * ```
 */
export const AdminErrorState: React.FC<AdminErrorStateProps> = ({
  title = 'حدث خطأ',
  message = 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`admin-error-state ${className}`}>
      <ErrorState title={title} message={message} onRetry={onRetry} />
    </div>
  )
}
