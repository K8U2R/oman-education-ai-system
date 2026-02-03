/**
 * LoadingWrapper Component - مكون wrapper للتحميل
 *
 * مكون موحد لعرض حالة التحميل
 * يقلل التكرار في كود loading states
 */

import React from 'react'
import { LoadingState } from '@/presentation/pages/components'

export interface LoadingWrapperProps {
  /**
   * هل البيانات قيد التحميل؟
   */
  isLoading: boolean

  /**
   * رسالة التحميل
   */
  message?: string

  /**
   * هل التحميل fullscreen؟
   */
  fullScreen?: boolean

  /**
   * المحتوى الذي سيظهر بعد التحميل
   */
  children: React.ReactNode

  /**
   * مكون بديل للتحميل
   */
  loadingComponent?: React.ReactNode

  /**
   * className إضافي
   */
  className?: string
}

/**
 * LoadingWrapper Component
 *
 * مكون wrapper لعرض حالة التحميل
 *
 * @example
 * ```tsx
 * <LoadingWrapper isLoading={loading} message="جاري التحميل...">
 *   <DataTable data={data} />
 * </LoadingWrapper>
 * ```
 */
export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  message = 'جاري التحميل...',
  fullScreen = false,
  children,
  loadingComponent,
  className,
}) => {
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }
    return <LoadingState fullScreen={fullScreen} message={message} className={className} />
  }

  return <>{children}</>
}
