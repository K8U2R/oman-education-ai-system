/**
 * AdminPageWrapper Component - مكون wrapper للصفحات الإدارية
 *
 * مكون موحد للصفحات الإدارية
 * يوفر authentication و authorization checks تلقائياً
 */

import React from 'react'
import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import { LoadingState } from '@/presentation/pages/components'
import type { UserRole, Permission } from '@/domain/types/auth.types'

export interface AdminPageWrapperProps {
  /**
   *  المطلوبة
   */
  requiredPermissions?: Permission[]

  /**
   * الدور المطلوب
   */
  requiredRole?: UserRole

  /**
   * رسالة التحميل
   */
  loadingMessage?: string

  /**
   * مسار إعادة التوجيه عند عدم وجود صلاحيات
   */
  redirectTo?: string

  /**
   * محتوى الصفحة
   */
  children: React.ReactNode

  /**
   * className إضافي
   */
  className?: string
}

/**
 * AdminPageWrapper Component
 *
 * مكون wrapper للصفحات الإدارية
 *
 * @example
 * ```tsx
 * <AdminPageWrapper
 *   requiredPermissions={['lessons.manage']}
 *   loadingMessage="جاري تحميل الصفحة..."
 * >
 *   <LessonsManagementPage />
 * </AdminPageWrapper>
 * ```
 */
export const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({
  requiredPermissions,
  requiredRole,
  loadingMessage = 'جاري تحميل الصفحة...',
  children,
  className,
}) => {
  const { canAccess, user, loadingState } = usePageAuth({
    requireAuth: true,
    requiredPermissions,
    requiredRole,
    autoRedirect: true,
  })

  const pageLoadingState = usePageLoading({
    isLoading: !canAccess,
    message: loadingMessage,
  })

  // استخدام loadingState من usePageAuth أو pageLoadingState
  const { shouldShowLoading, loadingMessage: finalLoadingMessage } = loadingState.shouldShowLoading
    ? loadingState
    : pageLoadingState

  if (!canAccess || shouldShowLoading) {
    return <LoadingState fullScreen message={finalLoadingMessage} />
  }

  if (!user) {
    return null
  }

  return <div className={`admin-page-wrapper ${className || ''}`}>{children}</div>
}
