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

    return (
      <>
        <header className={cn(
          'sticky top-0 z-[1020] h-[var(--header-height)] w-full transition-all duration-300',
          'bg-bg-surface/80 backdrop-blur-md border-b border-border-secondary',
          variant && `header--${variant}`,
          className
        )}>
          <div className="h-full max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding)]">
            <div className="h-full flex items-center justify-between gap-4">
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
              <nav className="flex items-center gap-4 flex-1 justify-end">
                {isAuthenticated ? (
                  <>
                    {/* Search Bar */}
                    <div className="hidden md:block flex-1 max-w-md mx-4">
                      <HeaderSearch />
                    </div>

                    {/* Actions (AIStatusIndicator, Notifications, ProfileMenu) */}
                    <HeaderActions />
                  </>
                ) : (
                  <HeaderNavigation items={UNAUTHENTICATED_NAV_ITEMS} isAuthenticated={false} className="hidden md:flex" />
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
