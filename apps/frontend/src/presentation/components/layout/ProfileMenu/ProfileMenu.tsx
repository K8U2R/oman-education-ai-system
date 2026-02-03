/**
 * ProfileMenu Component - قائمة الملف الشخصي
 *
 * قائمة منسدلة محسّنة مع تجميع العناصر حسب الفئات
 * تم إعادة تصميمها بالكامل لتحسين التنظيم والوظائف
 */

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ChevronDown } from 'lucide-react'
import { useAuth, useRole } from '@/features/user-authentication-management'
import { useUIStore } from '@/application/shared/store'
import { OptimizedImage } from '../../common'
import { PROFILE_MENU_GROUPS } from './constants'
import { filterProfileMenuGroups } from './utils'
import type { ProfileMenuProps } from './types'
import { cn } from '../../common/utils/classNames'

/**
 * ProfileMenu Component
 *
 * @example
 * ```tsx
 * <ProfileMenu />
 * ```
 */
export const ProfileMenu: React.FC<ProfileMenuProps> = React.memo(({ className }) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading: isLoadingUser, logout } = useAuth()
  const { userRole } = useRole()
  const menuRef = useRef<HTMLDivElement>(null)

  // فلترة المجموعات حسب الدور
  const filteredGroups = React.useMemo(
    () => filterProfileMenuGroups(PROFILE_MENU_GROUPS, userRole),
    [userRole]
  )

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // إغلاق القائمة عند الضغط على Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const { openSettings } = useUIStore()

  const handleLogout = async (): Promise<void> => {
    await logout()
    navigate('/')
    setIsOpen(false)
  }

  const handleItemClick = (id: string, path: string, onClick?: () => void): void => {
    // التحقق مما إذا كان العنصر هو الإعدادات أو الملف الشخصي لفتح المودال بدلاً من الصفحة
    if (id === 'settings' || id === 'profile' || id === 'security') {
      const sectionMap: Record<string, string> = {
        profile: 'profile',
        settings: 'profile',
        security: 'security',
      }
      openSettings(sectionMap[id] || 'profile')
      setIsOpen(false)
      return
    }

    if (onClick) {
      onClick()
    } else {
      navigate(path)
    }
    setIsOpen(false)
  }

  // استخدام User Entity methods
  const getUserInitials = (): string => user?.initials || 'U'
  const getUserDisplayName = (): string => user?.fullName || 'مستخدم'

  // يجب استدعاء useMemo قبل أي early returns (قواعد React Hooks)
  const menuClasses = React.useMemo(() => cn('profile-menu', className), [className])

  // Show loading state or fallback
  if (isLoadingUser && !user) {
    return (
      <div className={menuClasses}>
        <div className="profile-menu__avatar-placeholder" style={{ width: '40px', height: '40px' }}>
          <span style={{ fontSize: '14px' }}>...</span>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={menuClasses} ref={menuRef}>
      <button
        className="profile-menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="قائمة المستخدم"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.avatarUrl ? (
          <OptimizedImage
            src={user.avatarUrl}
            alt={getUserDisplayName()}
            className="profile-menu__avatar"
            loading="lazy"
            width={40}
            height={40}
            objectFit="cover"
            fallback="/logo.png"
          />
        ) : (
          <div className="profile-menu__avatar-placeholder">{getUserInitials()}</div>
        )}
        <ChevronDown
          className={cn('profile-menu__chevron', isOpen && 'profile-menu__chevron--open')}
        />
      </button>

      {isOpen && (
        <div className="profile-menu__dropdown" role="menu">
          {/* Header */}
          <div className="profile-menu__header">
            {user.avatarUrl ? (
              <OptimizedImage
                src={user.avatarUrl}
                alt={getUserDisplayName()}
                className="profile-menu__header-avatar"
                loading="lazy"
                width={64}
                height={64}
                objectFit="cover"
                fallback="/logo.png"
              />
            ) : (
              <div className="profile-menu__header-avatar-placeholder">{getUserInitials()}</div>
            )}
            <div className="profile-menu__header-info">
              <p className="profile-menu__header-name">{getUserDisplayName()}</p>
              <p className="profile-menu__header-email">{user.email || 'لا يوجد بريد إلكتروني'}</p>
            </div>
          </div>

          <div className="profile-menu__divider" />

          {/* Groups */}
          <div className="profile-menu__groups">
            {filteredGroups.map((group, groupIndex) => (
              <React.Fragment key={group.id}>
                {/* Group Label */}
                {group.label && <div className="profile-menu__group-label">{group.label}</div>}

                {/* Group Items */}
                <div className="profile-menu__group-items">
                  {group.items.map(item => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        className={cn(
                          'profile-menu__item',
                          item.isDangerous && 'profile-menu__item--dangerous'
                        )}
                        onClick={() => handleItemClick(item.id, item.path, item.onClick)}
                        role="menuitem"
                      >
                        <Icon className="profile-menu__item-icon" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Divider between groups (except last group) */}
                {groupIndex < filteredGroups.length - 1 && (
                  <div className="profile-menu__divider" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Logout */}
          <div className="profile-menu__divider" />
          <button
            className="profile-menu__item profile-menu__item--logout"
            onClick={handleLogout}
            role="menuitem"
          >
            <LogOut className="profile-menu__item-icon" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  )
})

ProfileMenu.displayName = 'ProfileMenu'

export default ProfileMenu
