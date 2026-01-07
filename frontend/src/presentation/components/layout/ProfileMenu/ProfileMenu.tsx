import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User as UserIcon,
  Settings,
  LogOut,
  CreditCard,
  Shield,
  ChevronDown,
  Code,
} from 'lucide-react'
import { useAuth, useRole } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { OptimizedImage } from '../../common'
import './ProfileMenu.scss'

const ProfileMenu: React.FC = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading: isLoadingUser, logout } = useAuth()
  const { isAdmin, isDeveloper } = useRole()
  const menuRef = useRef<HTMLDivElement>(null)

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

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsOpen(false)
  }

  // Show loading state or fallback
  if (isLoadingUser && !user) {
    return (
      <div className="profile-menu">
        <div className="profile-menu__avatar-placeholder" style={{ width: '40px', height: '40px' }}>
          <span style={{ fontSize: '14px' }}>...</span>
        </div>
      </div>
    )
  }

  if (!user) return null

  // استخدام User Entity methods
  const getUserInitials = () => user?.initials || 'U'
  const getUserDisplayName = () => user?.fullName || 'مستخدم'

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        className="profile-menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="قائمة المستخدم"
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
          className={`profile-menu__chevron ${isOpen ? 'profile-menu__chevron--open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="profile-menu__dropdown">
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

          <div className="profile-menu__items">
            <button
              className="profile-menu__item"
              onClick={() => {
                navigate(ROUTES.PROFILE)
                setIsOpen(false)
              }}
            >
              <UserIcon className="profile-menu__item-icon" />
              <span>الملف الشخصي</span>
            </button>

            <button
              className="profile-menu__item"
              onClick={() => {
                navigate(ROUTES.SETTINGS)
                setIsOpen(false)
              }}
            >
              <Settings className="profile-menu__item-icon" />
              <span>الإعدادات</span>
            </button>

            <button
              className="profile-menu__item"
              onClick={() => {
                navigate(ROUTES.USER_SECURITY_SETTINGS)
                setIsOpen(false)
              }}
            >
              <Shield className="profile-menu__item-icon" />
              <span>إعدادات الأمان</span>
            </button>

            {isAdmin && (
              <>
                <button
                  className="profile-menu__item"
                  onClick={() => {
                    navigate(ROUTES.ADMIN_DASHBOARD)
                    setIsOpen(false)
                  }}
                >
                  <Shield className="profile-menu__item-icon" />
                  <span>لوحة تحكم المسؤول</span>
                </button>
                <button
                  className="profile-menu__item"
                  onClick={() => {
                    navigate(ROUTES.ADMIN_SECURITY_DASHBOARD)
                    setIsOpen(false)
                  }}
                >
                  <Shield className="profile-menu__item-icon" />
                  <span>أمان النظام</span>
                </button>
              </>
            )}

            {isDeveloper && (
              <button
                className="profile-menu__item"
                onClick={() => {
                  navigate(ROUTES.DEVELOPER_DASHBOARD)
                  setIsOpen(false)
                }}
              >
                <Code className="profile-menu__item-icon" />
                <span>لوحة تحكم المطور</span>
              </button>
            )}

            <button
              className="profile-menu__item"
              onClick={() => {
                navigate(ROUTES.SUBSCRIPTION)
                setIsOpen(false)
              }}
            >
              <CreditCard className="profile-menu__item-icon" />
              <span>الاشتراك والباقات</span>
            </button>

            <button
              className="profile-menu__item"
              onClick={() => {
                navigate(ROUTES.PRIVACY)
                setIsOpen(false)
              }}
            >
              <Shield className="profile-menu__item-icon" />
              <span>الخصوصية</span>
            </button>
          </div>

          <div className="profile-menu__divider" />

          <button className="profile-menu__item profile-menu__item--logout" onClick={handleLogout}>
            <LogOut className="profile-menu__item-icon" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
