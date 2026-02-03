/**
 * PageHeader Component - مكون رأس الصفحة
 *
 * مكون مشترك لعرض رأس الصفحة مع العنوان والوصف والإجراءات
 */

import React, { useMemo } from 'react'
import { Card } from '@/presentation/components/common'


interface PageHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  breadcrumbs?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = React.memo(
  ({ title, description, icon, actions, breadcrumbs, className = '' }) => {
    const headerClasses = useMemo(() => `page-header ${className}`.trim(), [className])

    return (
      <div className={headerClasses}>
        {breadcrumbs && <div className="page-header__breadcrumbs">{breadcrumbs}</div>}

        <Card padding="lg" className="page-header__card">
          <div className="page-header__content">
            <div className="page-header__main">
              {icon && <div className="page-header__icon">{icon}</div>}
              <div className="page-header__text">
                <h1 className="page-header__title">{title}</h1>
                {description && <p className="page-header__description">{description}</p>}
              </div>
            </div>

            {actions && <div className="page-header__actions">{actions}</div>}
          </div>
        </Card>
      </div>
    )
  }
)

PageHeader.displayName = 'PageHeader'
