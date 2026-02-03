/**
 * PageLayout Component - مكون تخطيط الصفحة الموحد
 *
 * مكون موحد لتخطيط الصفحات يقلل التكرار في هيكل الصفحات
 * يوفر PageHeader، LoadingState، ErrorState، و EmptyState بشكل موحد
 */

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/presentation/pages/components'
import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import type { UsePageAuthOptions } from '@/application/shared/hooks/usePageAuth'
import type { UsePageLoadingOptions } from '@/application/shared/hooks/usePageLoading'

export interface PageLayoutProps {
  /**
   * عنوان الصفحة
   */
  title: string

  /**
   * وصف الصفحة
   */
  description?: string

  /**
   * أيقونة الصفحة
   */
  icon?: React.ReactNode | LucideIcon

  /**
   * إجراءات إضافية في رأس الصفحة
   */
  actions?: React.ReactNode

  /**
   * خيارات المصادقة
   */
  authOptions?: UsePageAuthOptions

  /**
   * خيارات التحميل
   */
  loadingOptions?: UsePageLoadingOptions

  /**
   * محتوى الصفحة
   * يمكن أن يكون ReactNode أو دالة تأخذ user وتعيد ReactNode
   */
  children: React.ReactNode | ((user: ReturnType<typeof usePageAuth>['user']) => React.ReactNode)

  /**
   * رسالة الخطأ
   */
  error?: string | Error | null

  /**
   * عنوان الحالة الفارغة
   */
  emptyTitle?: string

  /**
   * وصف الحالة الفارغة
   */
  emptyDescription?: string

  /**
   * أيقونة الحالة الفارغة
   */
  emptyIcon?: React.ReactNode

  /**
   * هل الصفحة فارغة؟
   */
  isEmpty?: boolean

  /**
   * دالة إعادة المحاولة عند الخطأ
   */
  onRetry?: () => void

  /**
   * className إضافي
   */
  className?: string
}

/**
 * PageLayout Component
 *
 * مكون موحد لتخطيط الصفحات
 *
 * @example
 * ```tsx
 * <PageLayout
 *   title="إدارة المستخدمين"
 *   description="إدارة المستخدمين و"
 *   icon={<Users />}
 *   authOptions={{ requireAuth: true, requiredRole: 'admin' }}
 * >
 *   <UsersTable />
 * </PageLayout>
 * ```
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  icon,
  actions,
  authOptions,
  loadingOptions,
  children,
  error,
  emptyTitle = 'لا توجد بيانات',
  emptyDescription,
  emptyIcon,
  isEmpty = false,
  onRetry,
  className,
}) => {
  const {
    canAccess,
    user,
    loadingState: authLoadingState,
  } = usePageAuth(authOptions || { requireAuth: false })

  const pageLoadingState = usePageLoading({
    ...loadingOptions,
    isLoading: loadingOptions?.isLoading ?? (!canAccess && authOptions?.requireAuth),
  })

  // استخدام loadingState من usePageAuth أو pageLoadingState
  const { shouldShowLoading, loadingMessage } = authLoadingState.shouldShowLoading
    ? authLoadingState
    : pageLoadingState

  // حالة التحميل
  if (shouldShowLoading || !canAccess) {
    return <LoadingState fullScreen message={loadingMessage} />
  }

  // حالة الخطأ
  if (error) {
    const errorMessage = error instanceof Error ? error.message : error
    return (
      <div className={`page-layout ${className || ''}`}>
        <PageHeader
          title={title}
          description={description}
          icon={icon as React.ReactNode}
          actions={actions}
        />
        <ErrorState title="حدث خطأ" message={errorMessage} onRetry={onRetry} />
      </div>
    )
  }

  // حالة فارغة
  if (isEmpty) {
    return (
      <div className={`page-layout ${className || ''}`}>
        <PageHeader
          title={title}
          description={description}
          icon={icon as React.ReactNode}
          actions={actions}
        />
        <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
      </div>
    )
  }

  // المحتوى العادي
  const content =
    typeof children === 'function'
      ? (children as (user: ReturnType<typeof usePageAuth>['user']) => React.ReactNode)(user)
      : children

  return (
    <div className={`page-layout ${className || ''}`}>
      <PageHeader
        title={title}
        description={description}
        icon={icon as React.ReactNode}
        actions={actions}
      />
      <div className="page-layout__content">{content}</div>
    </div>
  )
}
