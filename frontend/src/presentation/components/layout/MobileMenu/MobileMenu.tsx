/**
 * Mobile Menu Component - قائمة الجوال
 *
 * قائمة منبثقة للجوال مع التنقل
 */

import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  X,
  Home,
  LayoutDashboard,
  BookOpen,
  Cloud,
  User,
  Settings,
  Shield,
  Code,
  Activity,
  BarChart3,
  Zap,
} from 'lucide-react'
import { useAuth, useRole } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { cn } from '../../common/utils/classNames'
import SearchBar from '../SearchBar'
import './MobileMenu.scss'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth()
  const { isAdmin, isDeveloper, hasRole } = useRole()
  const location = useLocation()

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close menu on route change
  useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME
    }
    return location.pathname.startsWith(path)
  }

  const navLinks = isAuthenticated
    ? [
        { path: ROUTES.HOME, label: 'الرئيسية', icon: Home },
        { path: ROUTES.DASHBOARD, label: 'لوحة التحكم', icon: LayoutDashboard },
        { path: ROUTES.LESSONS, label: 'الدروس', icon: BookOpen },
        { path: ROUTES.STORAGE, label: 'التخزين', icon: Cloud },
        ...(isAdmin
          ? [
              { path: ROUTES.ADMIN_DASHBOARD, label: 'لوحة المسؤول', icon: Shield },
              { path: ROUTES.ADMIN_SECURITY_DASHBOARD, label: 'أمان النظام', icon: Shield },
            ]
          : []),
        ...(isDeveloper
          ? [
              { path: ROUTES.DEVELOPER_DASHBOARD, label: 'لوحة المطور', icon: Code },
              {
                path: ROUTES.DEVELOPER_SECURITY_ANALYTICS,
                label: 'تحليلات الأمان',
                icon: BarChart3,
              },
              {
                path: ROUTES.DEVELOPER_SECURITY_MONITORING,
                label: 'مراقبة الأمان',
                icon: Activity,
              },
            ]
          : []),
        ...(hasRole('moderator')
          ? [{ path: ROUTES.SUPPORT_SECURITY_QUICK_ACTIONS, label: 'إجراءات سريعة', icon: Zap }]
          : []),
        { path: ROUTES.PROFILE, label: 'الملف الشخصي', icon: User },
        { path: ROUTES.SETTINGS, label: 'الإعدادات', icon: Settings },
        { path: ROUTES.USER_SECURITY_SETTINGS, label: 'إعدادات الأمان', icon: Shield },
      ]
    : [
        { path: ROUTES.HOME, label: 'الرئيسية', icon: Home },
        { path: ROUTES.LOGIN, label: 'تسجيل الدخول', icon: User },
      ]

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="mobile-menu__overlay" onClick={onClose} />}

      {/* Menu */}
      <div className={cn('mobile-menu', isOpen && 'mobile-menu--open')}>
        <div className="mobile-menu__header">
          <div className="mobile-menu__header-content">
            {isAuthenticated && user && (
              <div className="mobile-menu__user">
                <div className="mobile-menu__user-avatar">{user.initials}</div>
                <div className="mobile-menu__user-info">
                  <p className="mobile-menu__user-name">{user.fullName}</p>
                  <p className="mobile-menu__user-email">{user.email}</p>
                </div>
              </div>
            )}
          </div>
          <button className="mobile-menu__close" onClick={onClose} aria-label="إغلاق القائمة">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar in Mobile Menu */}
        {isAuthenticated && (
          <div className="mobile-menu__search">
            <SearchBar />
          </div>
        )}

        <nav className="mobile-menu__nav">
          {navLinks.map(link => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'mobile-menu__link',
                  isActive(link.path) && 'mobile-menu__link--active'
                )}
                onClick={onClose}
              >
                <Icon className="mobile-menu__link-icon" />
                <span className="mobile-menu__link-label">{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
