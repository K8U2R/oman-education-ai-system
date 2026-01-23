/**
 * Header Component - مكون رأس الصفحة
 *
 * مكون رأس الصفحة الرئيسي مع التنقل والمصادقة
 * تم إعادة هيكلته بالكامل لتحسين التنظيم والوظائف
 */

import React from 'react'
import { Home } from 'lucide-react'
import { ROUTES } from '@/domain/constants/routes.constants'
import { MobileMenu } from '../MobileMenu'
import { useHeader } from './hooks'
import {
  HeaderBrand,
  HeaderNavigation,
  HeaderSearch,
  HeaderActions,
  HeaderControls,
} from './components'
import type { HeaderProps, NavigationItem } from './types'
import { cn } from '../../common/utils/classNames'

/**
 * عناصر التنقل للمستخدمين غير المسجلين
 */
const UNAUTHENTICATED_NAV_ITEMS: NavigationItem[] = [
  {
    id: 'home',
    label: 'الرئيسية',
    path: ROUTES.HOME,
    icon: Home,
  },
]

/**
 * Header Component
 *
 * @example
 * ```tsx
 * <Header
 *   onSidebarToggle={handleToggle}
 *   isSidebarCollapsed={isCollapsed}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = React.memo(
  ({ onSidebarToggle, isSidebarCollapsed = false, variant = 'default', className }) => {
    const { isAuthenticated, isMobileMenuOpen, handleSidebarToggle, handleMobileMenuToggle } =
      useHeader({
        onSidebarToggle,
        isSidebarCollapsed,
      })

    const headerClasses = React.useMemo(
      () => cn('header', variant && `header--${variant}`, className),
      [variant, className]
    )

    return (
      <>
        <header className={headerClasses}>
          <div className="header__container">
            <div className="header__content">
              {/* Controls (Mobile Menu + Sidebar Toggle) */}
              <HeaderControls
                onSidebarToggle={handleSidebarToggle}
                isSidebarCollapsed={isSidebarCollapsed}
                onMobileMenuOpen={handleMobileMenuToggle}
              />

              {/* Brand (Logo + Text + Flag) */}
              <HeaderBrand
                showText={variant !== 'minimal'}
                showFlag={variant !== 'minimal'}
                size={variant === 'compact' ? 'sm' : variant === 'minimal' ? 'sm' : 'md'}
              />

              {/* Navigation */}
              <nav className="header__nav">
                {isAuthenticated ? (
                  <>
                    {/* Search Bar */}
                    <HeaderSearch />

                    {/* Actions (AIStatusIndicator, Notifications, ProfileMenu) */}
                    <HeaderActions />
                  </>
                ) : (
                  <HeaderNavigation items={UNAUTHENTICATED_NAV_ITEMS} isAuthenticated={false} />
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMobileMenuToggle} />
      </>
    )
  }
)

Header.displayName = 'Header'

export default Header
