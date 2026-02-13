/**
 * SidebarItem Component - مكون عنصر Sidebar
 *
 * مكون لعرض عنصر في القائمة الجانبية
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../../../common/utils/classNames'
import { SidebarItem as SidebarItemType } from '../../core/Sidebar.types'

interface SidebarItemProps {
  /**
   * بيانات العنصر
   */
  item: SidebarItemType

  /**
   * هل Sidebar مطوي؟
   */
  isCollapsed?: boolean

  /**
   * دالة الإغلاق (للموبايل)
   */
  onClose?: () => void
}

/**
 * SidebarItem Component
 */
import { useTranslation } from 'react-i18next'

import styles from './SidebarItem.module.scss'

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isCollapsed = false, onClose }) => {
  const { t } = useTranslation()
  const location = useLocation()

  // التحقق من أن المسار نشط
  const isActive = React.useMemo(() => {
    if (item.path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(item.path)
  }, [location.pathname, item.path])

  const Icon = item.icon

  const handleClick = () => {
    if (onClose) {
      onClose()
    }
  }

  const commonProps = {
    className: cn(styles.item, isActive && styles['item--active']),
    onClick: handleClick,
    'data-label': isCollapsed ? t(item.label) : undefined,
    title: isCollapsed ? t(item.label) : undefined,
  }

  const content = (
    <>
      <Icon className={styles.item__icon} />
      {!isCollapsed && (
        <>
          <span className={styles.item__label}>{t(item.label)}</span>
          {item.badge && <span className={styles.item__badge}>{item.badge}</span>}
        </>
      )}
    </>
  )

  if (item.external) {
    return (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        {...commonProps}
      >
        {content}
      </a>
    )
  }

  return (
    <Link to={item.path} {...commonProps}>
      {content}
    </Link>
  )
}
