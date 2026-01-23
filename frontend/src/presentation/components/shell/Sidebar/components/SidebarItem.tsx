/**
 * SidebarItem Component - مكون عنصر Sidebar
 *
 * مكون لعرض عنصر في القائمة الجانبية
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../../common/utils/classNames'
import type { SidebarItem as SidebarItemType } from '../types'

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
export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isCollapsed = false, onClose }) => {
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

  if (item.external) {
    return (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('sidebar-item', isActive && 'sidebar-item--active')}
        onClick={handleClick}
        data-label={isCollapsed ? item.label : undefined}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon className="sidebar-item__icon" />
        {!isCollapsed && (
          <>
            <span className="sidebar-item__label">{item.label}</span>
            {item.badge && <span className="sidebar-item__badge">{item.badge}</span>}
          </>
        )}
      </a>
    )
  }

  return (
    <Link
      to={item.path}
      className={cn('sidebar-item', isActive && 'sidebar-item--active')}
      onClick={handleClick}
      data-label={isCollapsed ? item.label : undefined}
      title={isCollapsed ? item.label : undefined}
    >
      <Icon className="sidebar-item__icon" />
      {!isCollapsed && (
        <>
          <span className="sidebar-item__label">{item.label}</span>
          {item.badge && <span className="sidebar-item__badge">{item.badge}</span>}
        </>
      )}
    </Link>
  )
}
