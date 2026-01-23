/**
 * HeaderNavigation Component - مكون التنقل للـ Header
 *
 * مكون لعرض روابط التنقل (لغير المسجلين)
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '../../../../common'
import type { HeaderNavigationProps } from '../../types'
import { cn } from '../../../../common/utils/classNames'
import { isActivePath } from '../../utils'
import { useModalStore } from '@/stores/useModalStore'

/**
 * HeaderNavigation Component
 *
 * @example
 * ```tsx
 * <HeaderNavigation items={navigationItems} isAuthenticated={false} />
 * ```
 */
export const HeaderNavigation: React.FC<HeaderNavigationProps> = React.memo(
  ({ items, isAuthenticated, className }) => {
    const location = useLocation()
    const openModal = useModalStore(state => state.open)

    // يجب استدعاء useMemo قبل أي early returns (قواعد React Hooks)
    const navigationClasses = React.useMemo(() => cn('header-navigation', className), [className])

    // إذا كان المستخدم مسجل دخول، لا نعرض Navigation
    if (isAuthenticated) {
      return null
    }

    return (
      <nav className={navigationClasses}>
        {items.map(item => {
          const Icon = item.icon
          const isActive = isActivePath(location.pathname, item.path)

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'header-navigation__link',
                isActive && 'header-navigation__link--active'
              )}
            >
              {Icon && <Icon className="header-navigation__icon" />}
              <span>{item.label}</span>
            </Link>
          )
        })}

        <Button variant="ghost" size="sm" onClick={() => openModal('login')}>
          تسجيل الدخول
        </Button>

        <Button variant="primary" size="sm" onClick={() => openModal('register')}>
          إنشاء حساب
        </Button>
      </nav>
    )
  }
)

HeaderNavigation.displayName = 'HeaderNavigation'
