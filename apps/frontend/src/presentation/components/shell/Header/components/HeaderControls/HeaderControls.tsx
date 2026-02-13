/**
 * HeaderControls Component - مكون Controls للـ Header
 *
 * مكون للتحكم في Sidebar و Mobile Menu
 */

import React from 'react'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import type { HeaderControlsProps } from '../../types'
import { cn } from '../../../../common/utils/classNames'

import styles from './HeaderControls.module.scss'

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
    return (
      <div className={cn(styles.controls, className)}>
        {/* Mobile Menu Button - Shown only when onMobileMenuOpen is provided */}
        {onMobileMenuOpen && (
          <button
            className={cn(styles.button, styles['button--mobile'])}
            onClick={onMobileMenuOpen}
            aria-label="فتح القائمة"
          >
            <Menu className={styles.icon} />
          </button>
        )}

        {/* Sidebar Toggle Button - Desktop only */}
        {onSidebarToggle && (
          <button
            className={cn(styles.button, styles['button--sidebar'])}
            onClick={onSidebarToggle}
            aria-label={isSidebarCollapsed ? 'إظهار القائمة الجانبية' : 'إخفاء القائمة الجانبية'}
            title={isSidebarCollapsed ? 'إظهار القائمة الجانبية' : 'إخفاء القائمة الجانبية'}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className={styles.icon} />
            ) : (
              <PanelLeftClose className={styles.icon} />
            )}
          </button>
        )}
      </div>
    )
  }
)

HeaderControls.displayName = 'HeaderControls'
