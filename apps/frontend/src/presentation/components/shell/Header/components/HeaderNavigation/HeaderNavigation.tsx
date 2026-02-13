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
import styles from './HeaderNavigation.module.scss'

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

    // إذا كان المستخدم مسجل دخول، لا نعرض Navigation
    if (isAuthenticated) {
      return null
    }

    return (
      <nav className={cn(styles.navigation, className)}>
        {items.map(item => {
          const Icon = item.icon
          const isActive = isActivePath(location.pathname, item.path)

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                styles.navLink,
                isActive && styles['navLink--active']
              )}
            >
              {Icon && <Icon className={styles.icon} />}
              <span>{item.label}</span>
            </Link>
          )
        })}

        <div className={styles.divider} />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => openModal('login')}
          className={styles['button--login']}
        >
          تسجيل الدخول
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => openModal('register')}
          className={styles['button--register']}
        >
          إنشاء حساب
        </Button>
      </nav>
    )
  }
)

HeaderNavigation.displayName = 'HeaderNavigation'
