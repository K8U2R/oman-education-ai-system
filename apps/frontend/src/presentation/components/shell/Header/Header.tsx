/**
 * Header Component - مكون الهيدر الرئيسي
 *
 * يربط جميع مكونات الهيدر (Brand, Nav, Search, Actions, Controls)
 */

import React from 'react'
import { MobileMenu } from '../MobileMenu'
import { HeaderNavigation } from './components/HeaderNavigation/HeaderNavigation'
import { HeaderBrand } from './components/HeaderBrand/HeaderBrand'
import { HeaderActions } from './components/HeaderActions/HeaderActions'
import { HeaderSearch } from './components/HeaderSearch/HeaderSearch'
import { HeaderControls } from './components/HeaderControls/HeaderControls'
import { useHeader } from './hooks/useHeader'
import type { HeaderProps } from './types'
import { UNAUTHENTICATED_NAV_ITEMS } from './constants'
import { cn } from '@/presentation/components/ui/utils/classNames'
import styles from './Header.module.scss'

/**
 * Header Component
 *
 * @example
 * ```tsx
 * <Header
 *   onSidebarToggle={handleToggle}
 *   isSidebarCollapsed={false}
 *   variant="default"
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
          styles.header,
          variant && styles[`header--${variant}`],
          className
        )}>
          <div className={styles.container}>
            <div className={styles.content}>
              {/* Controls (Mobile Menu + Sidebar Toggle) - Shown only if showControls is true */}
              {showControls && (
                <div className={styles.controls}>
                  <HeaderControls
                    onSidebarToggle={handleSidebarToggle}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onMobileMenuOpen={onMenuClick || handleMobileMenuToggle}
                  />
                </div>
              )}

              {/* Brand (Logo + Text + Flag) */}
              <div className={styles.brand}>
                <HeaderBrand
                  showText={variant !== 'minimal'}
                  showFlag={variant !== 'minimal'}
                  size={variant === 'compact' ? 'sm' : variant === 'minimal' ? 'sm' : 'md'}
                />
              </div>

              {/* Navigation */}
              <nav className={styles.nav}>
                {isAuthenticated ? (
                  <>
                    {/* Search Bar */}
                    <div className={cn(styles.search, 'hidden md:block')}>
                      <HeaderSearch />
                    </div>

                    {/* Actions (AIStatusIndicator, Notifications, ProfileMenu) */}
                    <div className={styles.actions}>
                      <HeaderActions />
                    </div>
                  </>
                ) : (
                  <>
                    <HeaderNavigation
                      items={UNAUTHENTICATED_NAV_ITEMS}
                      isAuthenticated={false}
                      className="hidden md:flex"
                    />
                    <div className={styles.actions}>
                      <HeaderActions showNotifications={false} showAIStatus={false} showProfile={false} />
                    </div>
                  </>
                )}
              </nav>
            </div>
          </div>
        </header >

        {/* Mobile Menu - Only render if controls are enabled */}
        {
          showControls && (
            <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMobileMenuToggle} />
          )
        }
      </>
    )
  }
)

Header.displayName = 'Header'
