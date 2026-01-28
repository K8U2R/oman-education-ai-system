/**
 * Header Component - مكون رأس الصفحة
 *
 * مكون رأس الصفحة الرئيسي مع التنقل والمصادقة
 * تم إعادة هيكلته بالكامل لتحسين التنظيم والوظائف
 */

import React from 'react'
import { Home, Menu, Search } from 'lucide-react'
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
  ({ onSidebarToggle, onMenuClick, isSidebarCollapsed = false, variant = 'default', showControls = true, className }) => {
    const { isAuthenticated, isMobileMenuOpen, handleSidebarToggle, handleMobileMenuToggle } =
      useHeader({
        onSidebarToggle,
        isSidebarCollapsed,
        showControls,
      })

    return (
      <>
        <header className={cn(
          'header',
          variant && `header--${variant}`,
          className
        )}>
          <div className="header__container">
            <div className="header__content">
              {/* Controls (Mobile Menu + Sidebar Toggle) - Shown only if showControls is true */}
              {showControls && (
                <div className="header__controls">
                  <HeaderControls
                    onSidebarToggle={handleSidebarToggle}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onMobileMenuOpen={onMenuClick || handleMobileMenuToggle}
                  />
                </div>
              )}

              {/* Brand (Logo + Text + Flag) */}
              <div className="header__brand">
                <HeaderBrand
                  showText={variant !== 'minimal'}
                  showFlag={variant !== 'minimal'}
                  size={variant === 'compact' ? 'sm' : variant === 'minimal' ? 'sm' : 'md'}
                />
              </div>

              {/* Navigation */}
              <nav className="header__nav">
                {isAuthenticated ? (
                  <>
                    {/* Search Bar */}
                    <div className="header__search hidden md:block">
                      <HeaderSearch />
                    </div>

                    {/* Actions (AIStatusIndicator, Notifications, ProfileMenu) */}
                    <div className="header__actions">
                      <HeaderActions />
                    </div>
                  </>
                ) : (
                  <HeaderNavigation items={UNAUTHENTICATED_NAV_ITEMS} isAuthenticated={false} className="hidden md:flex" />
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Mobile Menu - Only render if controls are enabled */}
        {showControls && (
          <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMobileMenuToggle} />
        )}
      </>
    )
  }
)

Header.displayName = 'Header'

export default Header
