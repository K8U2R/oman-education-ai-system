/**
 * Breadcrumbs Component - مكون Breadcrumbs
 *
 * مكون لعرض Breadcrumbs للمسار الحالي
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, Home } from 'lucide-react'
import { useBreadcrumbs } from '@/presentation/routing/hooks/useBreadcrumbs'
import { ROUTES } from '@/domain/constants/routes.constants'

export const Breadcrumbs: React.FC = () => {
  const location = useLocation()
  const breadcrumbs = useBreadcrumbs()

  // Don't show breadcrumbs on home page
  if (location.pathname === ROUTES.HOME) {
    return null
  }

  // Don't show if only one breadcrumb
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1
          const Icon = item.icon || (index === 0 ? Home : undefined)

          return (
            <li key={item.path} className="breadcrumbs__item">
              {isLast ? (
                <span className="breadcrumbs__current">
                  {Icon && <Icon className="breadcrumbs__icon" />}
                  <span className="breadcrumbs__label">{item.label}</span>
                </span>
              ) : (
                <>
                  <Link to={item.path} className="breadcrumbs__link">
                    {Icon && <Icon className="breadcrumbs__icon" />}
                    <span className="breadcrumbs__label">{item.label}</span>
                  </Link>
                  <ChevronLeft className="breadcrumbs__separator" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
