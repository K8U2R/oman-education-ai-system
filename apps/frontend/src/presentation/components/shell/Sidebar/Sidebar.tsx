/**
 * Sidebar Navigation Component - شريط جانبي للتنقل
 *
 * شريط جانبي للتنقل مع مجموعات قابلة للطي
 * تم إعادة تصميمه بالكامل لتحسين التنظيم والوظائف
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Settings, User } from 'lucide-react'
import { LoadingState } from '@/presentation/pages/components'
import { usePageLoading } from '@/application/shared/hooks'
import { useSidebar } from './hooks'
import { SidebarGroup } from './components'
import { cn } from '../../common/utils/classNames'
import type { SidebarProps } from './types'
import { ROUTES } from '@/domain/constants/routes.constants'

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
  ({ isOpen = true, onClose, variant = 'default', isCollapsed = false, className }) => {
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
          shouldCollapse && 'sidebar--collapsed',
          className
        ),
      [isOpen, shouldCollapse, className]
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
          {/* Header: Logo */}
          <div className="sidebar__header">
            <div className="flex items-center gap-3 px-4 py-6">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              {!shouldCollapse && (
                <span className="font-bold text-lg tracking-tight">EduSystem</span>
              )}
            </div>
          </div>

          {/* Navigation: Links */}
          <div className="sidebar__nav scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
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
          </div>

          {/* Footer: User/Settings */}
          <div className="sidebar__footer border-t border-border-primary p-4 mt-auto">
            <Link to={ROUTES.PROFILE} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-foreground">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              {!shouldCollapse && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">{(user as any).fullName || (user as any).name || 'User'}</span>
                  <span className="text-xs text-muted-foreground truncate">{(user as any).email}</span>
                </div>
              )}
            </Link>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button className="flex items-center justify-center p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Settings">
                <Settings className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors" title="Log out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
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
