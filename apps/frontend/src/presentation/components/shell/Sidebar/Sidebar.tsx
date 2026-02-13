/**
 * Sidebar Navigation Component - شريط جانبي للتنقل
 *
 * شريط جانبي للتنقل مع مجموعات قابلة للطي
 * تم إعادة تصميمه بالكامل لتحسين التنظيم والوظائف
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingState } from '@/presentation/pages/components'
import { usePageLoading } from '@/application/shared/hooks'
import { SidebarProps } from './core/Sidebar.types'
import { cn } from '../../common/utils/classNames'
import { useSidebar } from './core/Sidebar.hooks'
import { SidebarGroup } from './components/SidebarGroup/SidebarGroup.index'
import styles from './Sidebar.module.scss'

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
      className={cn(styles.overlay, isVisible && styles['overlay--visible'])}
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
    const { t } = useTranslation(); // Added hook

    // استخدام useSidebar hook للحصول على البيانات المفلترة
    const { user, canAccess, isLoading, groups } = useSidebar({
      requireAuth: true,
    })

    // استخدام usePageLoading لإدارة حالة التحميل
    const { shouldShowLoading, loadingMessage } = usePageLoading({
      isLoading: isLoading || !canAccess,
      message: t('sidebar_loading'), // Localized
    })

    // Use isCollapsed prop if provided, otherwise use variant
    const shouldCollapse = React.useMemo(
      () => isCollapsed || variant === 'collapsed',
      [isCollapsed, variant]
    )

    const sidebarClasses = React.useMemo(
      () =>
        cn(
          styles.sidebar,
          !isOpen && styles['sidebar--closed'],
          isOpen && styles['sidebar--open'],
          shouldCollapse && styles['sidebar--collapsed'],
          className
        ),
      [isOpen, shouldCollapse, className]
    )

    // إظهار حالة التحميل
    if (shouldShowLoading) {
      return (
        <aside className={sidebarClasses}>
          <div className={styles.loading}>
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
          <div className={styles.header}>
            <div className={styles.brand}>
              <div className={styles.logo}>
                {t('brand_initial')}
              </div>
              {!shouldCollapse && (
                <span className={styles.title}>{t('brand_short')}</span>
              )}
            </div>
          </div>

          {/* Navigation: Links */}
          <div className={styles.nav}>
            {groups.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyMessage}>{t('no_items')}</p>
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
