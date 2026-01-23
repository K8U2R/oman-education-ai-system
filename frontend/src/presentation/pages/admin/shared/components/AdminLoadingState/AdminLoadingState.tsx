/**
 * AdminLoadingState Component - Loading State موحد لصفحات Admin
 *
 * Component موحد لعرض حالة التحميل في صفحات Admin
 */

import React from 'react'
import { LoadingState } from '@/presentation/pages/components'


export interface AdminLoadingStateProps {
  /**
   * رسالة التحميل
   */
  message?: string

  /**
   * هل التحميل full screen؟
   */
  fullScreen?: boolean

  /**
   * className إضافي
   */
  className?: string
}

/**
 * AdminLoadingState Component
 *
 * Loading State موحد لصفحات Admin
 *
 * @example
 * ```tsx
 * <AdminLoadingState message="جاري تحميل البيانات..." fullScreen />
 * ```
 */
export const AdminLoadingState: React.FC<AdminLoadingStateProps> = ({
  message = 'جاري التحميل...',
  fullScreen = true,
  className = '',
}) => {
  return (
    <div className={`admin-loading-state ${className}`}>
      <LoadingState message={message} fullScreen={fullScreen} />
    </div>
  )
}
