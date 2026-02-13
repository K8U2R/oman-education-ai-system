import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/features/user-authentication-management'
import { useUIStore } from '@/application/shared/store'
import { OptimizedImage } from '../../common'
import { getProfileMenuItems } from './constants/profile-menu.config'
import type { ProfileMenuProps } from './types'
import { cn } from '../../common/utils/classNames'
import styles from './ProfileMenu.module.scss'

/**
 * ProfileMenu Component (✅ Law 08 & 14 Compliant)
 * 
 * Visually completely refactored (T046) using Sovereign CSS Modules.
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
  const menuRef = useRef<HTMLDivElement>(null)

  const filteredGroups = React.useMemo(
    () => getProfileMenuItems(user),
    [user]
  )

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

  const getUserInitials = (): string => user?.initials || 'U'
  const getUserDisplayName = (): string => user?.fullName || 'مستخدم'

  const menuClasses = React.useMemo(() => cn(styles.container, className), [className])

  if (isLoadingUser && !user) {
    return (
      <div className={menuClasses}>
        <div className={styles['avatar-placeholder']} style={{ width: '40px', height: '40px' }}>
          <span style={{ fontSize: '14px' }}>...</span>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={menuClasses} ref={menuRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="قائمة المستخدم"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.avatarUrl ? (
          <OptimizedImage
            src={user.avatarUrl}
            alt={getUserDisplayName()}
            className={styles.avatar}
            loading="lazy"
            width={40}
            height={40}
            objectFit="cover"
            fallback="/logo.png"
          />
        ) : (
          <div className={styles['avatar-placeholder']}>{getUserInitials()}</div>
        )}
        <ChevronDown
          className={cn(styles.chevron, isOpen && styles['chevron--open'])}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.header}>
            {user.avatarUrl ? (
              <OptimizedImage
                src={user.avatarUrl}
                alt={getUserDisplayName()}
                className={styles['header-avatar']}
                loading="lazy"
                width={64}
                height={64}
                objectFit="cover"
                fallback="/logo.png"
              />
            ) : (
              <div className={styles['avatar-placeholder']}>{getUserInitials()}</div>
            )}
            <div className={styles['header-info']}>
              <p className={styles['header-name']}>{getUserDisplayName()}</p>
              <p className={styles['header-email']}>{user.email || 'لا يوجد بريد إلكتروني'}</p>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.groups}>
            {filteredGroups.map((group, groupIndex) => (
              <React.Fragment key={group.id}>
                {group.label && <div className={styles['group-label']}>{group.label}</div>}

                <div className={styles['group-items']}>
                  {group.items.map(item => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        className={cn(
                          styles.item,
                          item.isDangerous && styles['item--dangerous']
                        )}
                        onClick={() => handleItemClick(item.id, item.path, item.onClick)}
                        role="menuitem"
                      >
                        <Icon className={styles['item-icon']} />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>

                {groupIndex < filteredGroups.length - 1 && (
                  <div className={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className={styles.divider} />
          <button
            className={cn(styles.item, styles['item--dangerous'])}
            onClick={handleLogout}
            role="menuitem"
          >
            <LogOut className={styles['item-icon']} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  )
})

ProfileMenu.displayName = 'ProfileMenu'

export default ProfileMenu
