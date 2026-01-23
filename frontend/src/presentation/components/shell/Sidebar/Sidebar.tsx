/**
 * Sidebar Navigation Component - شريط جانبي للتنقل
 *
 * شريط جانبي للتنقل مع مجموعات قابلة للطي
 * تم إعادة تصميمه بالكامل لتحسين التنظيم والوظائف
 */

import React from 'react'
import { LoadingState } from '@/presentation/pages/components'
import { usePageLoading } from '@/application/shared/hooks'
import { useSidebar } from './hooks'
import { SidebarGroup } from './components'
import { cn } from '../../common/utils/classNames'
import type { SidebarProps } from './types'

/**
 * Sidebar Overlay - Overlay للموبايل
 */
const SidebarOverlay: React.FC<{ isVisible: boolean; onClose?: () => void }> = ({
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null

  return (
    <div
      className={cn('sidebar-overlay', isVisible && 'sidebar-overlay--visible')}
      onClick={onClose}
      aria-hidden="true"
    />
  )
}

/**
 * Sidebar Component
 *
 * مكون القائمة الجانبية مع مجموعات قابلة للطي
 */
export const Sidebar: React.FC<SidebarProps> = React.memo(
  ({ isOpen = true, onClose, variant = 'default', isCollapsed = false }) => {
    // استخدام useSidebar hook للحصول على البيانات المفلترة
    const { user, canAccess, isLoading, groups } = useSidebar({
      requireAuth: true,
    })

    // استخدام usePageLoading لإدارة حالة التحميل
    const { shouldShowLoading, loadingMessage } = usePageLoading({
      isLoading: isLoading || !canAccess,
      message: 'جاري تحميل القائمة...',
    })

    // Use isCollapsed prop if provided, otherwise use variant
    const shouldCollapse = React.useMemo(
      () => isCollapsed || variant === 'collapsed',
      [isCollapsed, variant]
    )

    const sidebarClasses = React.useMemo(
      () =>
        cn(
          'sidebar',
          !isOpen && 'sidebar--closed',
          isOpen && 'sidebar--open',
          shouldCollapse && 'sidebar--collapsed'
        ),
      [isOpen, shouldCollapse]
    )

    // إظهار حالة التحميل
    if (shouldShowLoading) {
      return (
        <aside className={sidebarClasses}>
          <div className="sidebar__loading">
            <LoadingState message={loadingMessage} />
          </div>
        </aside>
      )
    }

    // إذا لم يكن يمكن الوصول، لا نعرض Sidebar
    if (!canAccess || !user) {
      return null
    }

    return (
      <>
        {/* Overlay للموبايل */}
        {isOpen && <SidebarOverlay isVisible={isOpen} onClose={onClose} />}

        <aside className={sidebarClasses}>
          <nav className="sidebar__nav">
            {groups.length === 0 ? (
              <div className="sidebar__empty">
                <p className="sidebar__empty-message">لا توجد عناصر متاحة</p>
              </div>
            ) : (
              groups.map(group => (
                <SidebarGroup
                  key={group.id}
                  group={group}
                  isCollapsed={shouldCollapse}
                  onClose={onClose}
                />
              ))
            )}
          </nav>
        </aside>
      </>
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    return (
      prevProps.isOpen === nextProps.isOpen &&
      prevProps.variant === nextProps.variant &&
      prevProps.isCollapsed === nextProps.isCollapsed &&
      prevProps.onClose === nextProps.onClose
    )
  }
)

Sidebar.displayName = 'Sidebar'
