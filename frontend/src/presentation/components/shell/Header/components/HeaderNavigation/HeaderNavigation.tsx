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
    // const navigationClasses = React.useMemo(...) // Removed unused

    // إذا كان المستخدم مسجل دخول، لا نعرض Navigation
    if (isAuthenticated) {
      return null
    }

    return (
      <nav className={cn('flex items-center gap-4', className)}>
        {items.map(item => {
          const Icon = item.icon
          const isActive = isActivePath(location.pathname, item.path)

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </Link>
          )
        })}

        <div className="h-6 w-px bg-border-secondary mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => openModal('login')}
          className="text-text-secondary hover:text-text-primary"
        >
          تسجيل الدخول
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => openModal('register')}
          className="shadow-lg shadow-primary-500/20"
        >
          إنشاء حساب
        </Button>
      </nav>
    )
  }
)

HeaderNavigation.displayName = 'HeaderNavigation'
