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
import { useAuth, useRole } from '@/features/user-authentication-management'
import { useUIStore } from '@/application/shared/store'
import { ROUTES } from '@/domain/constants/routes.constants'
import { cn } from '@/presentation/components/ui/utils/classNames'
import SearchBar from '@/presentation/components/layout/SearchBar/SearchBar'
import styles from './MobileMenu.module.scss'

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
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
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
  const { openSettings } = useUIStore()

  const handleLinkClick = (link: { path: string; label: string; id?: string }) => {
    if (link.id === 'settings' || link.id === 'profile' || link.id === 'security') {
      const sectionMap: Record<string, string> = {
        profile: 'profile',
        settings: 'profile',
        security: 'security',
      }
      openSettings(sectionMap[link.id] || 'profile')
      onClose()
      return
    }
    onClose()
  }

  const navLinks = isAuthenticated
    ? [
      { id: 'home', path: ROUTES.HOME, label: 'الرئيسية', icon: Home },
      { id: 'dashboard', path: ROUTES.DASHBOARD, label: 'لوحة التحكم', icon: LayoutDashboard },
      { id: 'lessons', path: ROUTES.LESSONS, label: 'الدروس', icon: BookOpen },
      ...(isAdmin || isDeveloper
        ? [{ id: 'storage', path: ROUTES.STORAGE, label: 'التخزين', icon: Cloud }]
        : []),
      ...(isAdmin
        ? [
          {
            id: 'admin-dashboard',
            path: ROUTES.ADMIN_DASHBOARD,
            label: 'لوحة المسؤول',
            icon: Shield,
          },
          {
            id: 'admin-security',
            path: ROUTES.ADMIN_SECURITY_DASHBOARD,
            label: 'أمان النظام',
            icon: Shield,
          },
        ]
        : []),
      ...(isDeveloper
        ? [
          {
            id: 'developer-dashboard',
            path: ROUTES.DEVELOPER_DASHBOARD,
            label: 'لوحة المطور',
            icon: Code,
          },
          {
            id: 'developer-security-analytics',
            path: ROUTES.DEVELOPER_SECURITY_ANALYTICS,
            label: 'تحليلات الأمان',
            icon: BarChart3,
          },
          {
            id: 'developer-security-monitoring',
            path: ROUTES.DEVELOPER_SECURITY_MONITORING,
            label: 'مراقبة الأمان',
            icon: Activity,
          },
        ]
        : []),
      ...(hasRole('moderator')
        ? [
          {
            id: 'quick-actions',
            path: ROUTES.SUPPORT_SECURITY_QUICK_ACTIONS,
            label: 'إجراءات سريعة',
            icon: Zap,
          },
        ]
        : []),
      { id: 'profile', path: ROUTES.PROFILE, label: 'الملف الشخصي', icon: User },
      { id: 'settings', path: ROUTES.SETTINGS, label: 'الإعدادات', icon: Settings },
      {
        id: 'security',
        path: ROUTES.USER_SECURITY_SETTINGS,
        label: 'إعدادات الأمان',
        icon: Shield,
      },
    ]
    : [
      { id: 'home', path: ROUTES.HOME, label: 'الرئيسية', icon: Home },
      { id: 'login', path: ROUTES.LOGIN, label: 'تسجيل الدخول', icon: User },
    ]

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      {/* Menu */}
      <div className={cn(styles.menu, isOpen && styles['menu--open'])}>
        <div className={styles.header}>
          <div className={styles['header-content']}>
            {isAuthenticated && user && (
              <div className={styles.user}>
                <div className={styles['user-avatar']}>{user.initials}</div>
                <div className={styles['user-info']}>
                  <p className={styles['user-name']}>{user.fullName}</p>
                  <p className={styles['user-email']}>{user.email}</p>
                </div>
              </div>
            )}
          </div>
          <button className={styles.close} onClick={onClose} aria-label="إغلاق القائمة">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar in Mobile Menu */}
        {isAuthenticated && (
          <div className={styles.search}>
            <SearchBar />
          </div>
        )}

        <nav className={styles.nav}>
          {navLinks.map(link => {
            const Icon = link.icon
            const isModalTrigger =
              link.id === 'settings' || link.id === 'profile' || link.id === 'security'

            if (isModalTrigger) {
              return (
                <button
                  key={link.id}
                  className={styles.link}
                  onClick={() => handleLinkClick(link)}
                >
                  <Icon className={styles['link-icon']} />
                  <span className={styles['link-label']}>{link.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={link.id}
                to={link.path}
                className={cn(
                  styles.link,
                  isActive(link.path) && styles['link--active']
                )}
                onClick={() => handleLinkClick(link)}
              >
                <Icon className={styles['link-icon']} />
                <span className={styles['link-label']}>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
