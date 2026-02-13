/**
 * SidebarGroup Component - مكون مجموعة Sidebar
 *
 * مكون لعرض مجموعة في القائمة الجانبية مع إمكانية الطي/الفتح
 */

import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { ProtectedComponent } from '../../../../../features/user-authentication-management/components/ProtectedComponent'
import { cn } from '../../../../common/utils/classNames'
import { SidebarItem } from '../SidebarItem/SidebarItem.index'
import { getGroupState, setGroupState } from '../../core/Sidebar.utils'
import type { UserRole } from '@/domain/types/auth.types'
import { SidebarGroup as SidebarGroupType } from '../../core/Sidebar.types'
import { useTranslation } from 'react-i18next'
import styles from './SidebarGroup.module.scss'

interface SidebarGroupProps {
  /**
   * بيانات المجموعة
   */
  group: SidebarGroupType

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
 * SidebarGroup Component
 */
export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  group,
  isCollapsed = false,
  onClose,
}) => {
  const { t } = useTranslation();
  // تحميل الحالة من localStorage
  const [isOpen, setIsOpen] = useState(() => {
    return getGroupState(group.id, group.defaultOpen ?? false)
  })

  // حفظ الحالة في localStorage عند التغيير
  useEffect(() => {
    setGroupState(group.id, isOpen)
  }, [group.id, isOpen])

  // تحديث حالة الفتح عند تغيير defaultOpen (فقط عند التحميل الأول)
  useEffect(() => {
    if (group.defaultOpen !== undefined) {
      const saved = getGroupState(group.id, group.defaultOpen)
      if (saved !== isOpen && saved === group.defaultOpen) {
        setIsOpen(saved)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.id]) // فقط عند تغيير group.id

  const Icon = group.icon
  const collapsible = group.collapsible ?? true

  const handleToggle = () => {
    if (collapsible) {
      setIsOpen(prev => !prev)
    }
  }

  // إذا كان Sidebar مطوي، نعرض فقط الأيقونات (سيتم التعامل معها في CSS)
  // لكن حالياً نعرض null لأن المجموعات تحتاج نص
  if (isCollapsed) {
    return null
  }


  const groupContent = (
    <div className={styles.group}>
      <div
        className={cn(
          styles.header,
          collapsible && styles['header--clickable'],
          isOpen && styles['header--open']
        )}
        onClick={handleToggle}
        role={collapsible ? 'button' : 'presentation'}
        aria-expanded={collapsible ? isOpen : undefined}
        aria-controls={collapsible ? `sidebar-group-${group.id}` : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={e => {
          if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleToggle()
          }
        }}
      >
        {Icon && <Icon className={styles.icon} />}
        <span className={styles.label}>{t(group.label)}</span>
        {collapsible && (
          <ChevronDown
            className={cn(styles.toggle, isOpen && styles['toggle--open'])}
            aria-hidden="true"
          />
        )}
      </div>

      <div
        id={`sidebar-group-${group.id}`}
        className={cn(
          styles.items,
          isOpen ? styles['items--expanded'] : styles['items--collapsed']
        )}
        role="region"
      >
        {group.items.map(item => (
          <SidebarItem key={item.path} item={item} isCollapsed={isCollapsed} onClose={onClose} />
        ))}
      </div>
    </div>
  )

  // إذا كانت المجموعة تتطلب صلاحيات، نستخدم ProtectedComponent
  if (group.requiredRole || group.requiredPermissions) {
    let requiredRole: UserRole | undefined
    let requiredRoles: UserRole[] | undefined

    if (group.requiredRole) {
      if (Array.isArray(group.requiredRole)) {
        requiredRoles = group.requiredRole
      } else {
        requiredRole = group.requiredRole
      }
    }

    return (
      <ProtectedComponent
        requiredRole={requiredRole}
        requiredRoles={requiredRoles}
        requiredPermissions={group.requiredPermissions}
        fallback={null}
      >
        {groupContent}
      </ProtectedComponent>
    )
  }

  return groupContent
}
