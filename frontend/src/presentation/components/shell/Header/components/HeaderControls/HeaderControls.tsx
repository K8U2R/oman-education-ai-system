/**
 * HeaderControls Component - مكون Controls للـ Header
 *
 * مكون للتحكم في Sidebar و Mobile Menu
 */

import React from 'react'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import type { HeaderControlsProps } from '../../types'
import { cn } from '../../../../common/utils/classNames'

/**
 * HeaderControls Component
 *
 * @example
 * ```tsx
 * <HeaderControls
 *   onSidebarToggle={handleToggle}
 *   isSidebarCollapsed={isCollapsed}
 *   onMobileMenuOpen={handleMobileMenuOpen}
 * />
 * ```
 */
export const HeaderControls: React.FC<HeaderControlsProps> = React.memo(
  ({ onSidebarToggle, isSidebarCollapsed = false, onMobileMenuOpen, className }) => {
    const controlsClasses = React.useMemo(() => cn('header-controls', className), [className])

    return (
      <div className={controlsClasses}>
        {/* Mobile Menu Button - Shown only when onMobileMenuOpen is provided */}
        {onMobileMenuOpen && (
          <button
            className="header-controls__mobile-button"
            onClick={onMobileMenuOpen}
            aria-label="فتح القائمة"
          >
            <Menu className="header-controls__mobile-icon" />
          </button>
        )}

        {/* Sidebar Toggle Button - Desktop only */}
        {onSidebarToggle && (
          <button
            className="header-controls__sidebar-toggle"
            onClick={onSidebarToggle}
            aria-label={isSidebarCollapsed ? 'إظهار القائمة الجانبية' : 'إخفاء القائمة الجانبية'}
            title={isSidebarCollapsed ? 'إظهار القائمة الجانبية' : 'إخفاء القائمة الجانبية'}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="header-controls__sidebar-icon" />
            ) : (
              <PanelLeftClose className="header-controls__sidebar-icon" />
            )}
          </button>
        )}
      </div>
    )
  }
)

HeaderControls.displayName = 'HeaderControls'
