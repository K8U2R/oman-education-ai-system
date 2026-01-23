/**
 * AdminPageLayout Component - Layout موحد لصفحات Admin
 *
 * Layout موحد يوفر:
 * - PageHeader موحد
 * - Actions bar
 * - Breadcrumbs (اختياري)
 * - Responsive design
 * - RTL support
 */

import React from 'react'
import { PageHeader } from '@/presentation/pages/components'
import type { LucideIcon } from 'lucide-react'


export interface BreadcrumbItem {
  label: string
  path?: string
  icon?: React.ReactNode
}

export interface AdminPageLayoutProps {
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
   * Breadcrumbs
   */
  breadcrumbs?: BreadcrumbItem[]

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
 * AdminPageLayout Component
 *
 * Layout موحد لصفحات Admin
 *
 * @example
 * ```tsx
 * <AdminPageLayout
 *   title="لوحة تحكم المسؤول"
 *   description="إدارة شاملة للنظام"
 *   icon={<Shield />}
 *   actions={<Button>تحديث</Button>}
 * >
 *   <AdminStatsCard title="المستخدمين" value={100} />
 * </AdminPageLayout>
 * ```
 */
export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  description,
  icon,
  actions,
  breadcrumbs,
  children,
  className = '',
}) => {
  // تحويل breadcrumbs إلى React nodes
  const breadcrumbsNode = breadcrumbs ? (
    <nav className="admin-page-layout__breadcrumbs" aria-label="Breadcrumb">
      <ol className="admin-page-layout__breadcrumbs-list">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="admin-page-layout__breadcrumbs-item">
            {item.icon && <span className="admin-page-layout__breadcrumbs-icon">{item.icon}</span>}
            {item.path ? (
              <a href={item.path} className="admin-page-layout__breadcrumbs-link">
                {item.label}
              </a>
            ) : (
              <span className="admin-page-layout__breadcrumbs-label">{item.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="admin-page-layout__breadcrumbs-separator">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  ) : null

  return (
    <div className={`admin-page-layout ${className}`}>
      <PageHeader
        title={title}
        description={description}
        icon={icon as React.ReactNode}
        actions={actions}
        breadcrumbs={breadcrumbsNode}
      />
      <div className="admin-page-layout__content">{children}</div>
    </div>
  )
}
