/**
 * Header Component - مكون رأس الصفحة
 *
 * مكون رأس الصفحة الرئيسي مع التنقل والمصادقة
 */

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useAuth } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Button, OptimizedImage } from '../../common'
import ProfileMenu from '../ProfileMenu'
import Notifications from '../Notifications'
import SearchBar from '../SearchBar'
import AIStatusIndicator from '../AIStatusIndicator'
import { MobileMenu } from '../MobileMenu'
import Logo from '/logo.png'
import FlagOfOman from '/Flag_of_Oman.svg.png'
import './Header.scss'

interface HeaderProps {
  onSidebarToggle?: () => void
  isSidebarCollapsed?: boolean
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle, isSidebarCollapsed = false }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__content">
            {/* Mobile Menu Button */}
            <button
              className="header__mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="فتح القائمة"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to={ROUTES.HOME} className="header__logo">
              <div className="header__logo-icon">
                <OptimizedImage
                  src={Logo}
                  alt="Oman Education AI Logo"
                  className="header__logo-image"
                  loading="eager"
                  width={40}
                  height={40}
                  objectFit="contain"
                />
              </div>
              <div className="header__logo-text">
                <h1 className="header__logo-title">Oman Education AI</h1>
                <p className="header__logo-subtitle">نظام التعليم الذكي</p>
              </div>
              {/* Oman Flag Icon */}
              <div className="header__flag-icon" title="سلطنة عمان">
                <OptimizedImage
                  src={FlagOfOman}
                  alt="علم سلطنة عمان"
                  className="header__flag-image"
                  loading="lazy"
                  width={24}
                  height={16}
                  objectFit="contain"
                />
              </div>
            </Link>

            {/* Navigation */}
            <nav className="header__nav">
              {isAuthenticated ? (
                <>
                  {/* Sidebar Toggle Button - Desktop only */}
                  {onSidebarToggle && (
                    <button
                      className="header__sidebar-toggle"
                      onClick={onSidebarToggle}
                      aria-label={
                        isSidebarCollapsed ? 'إظهار القائمة الجانبية' : 'إخفاء القائمة الجانبية'
                      }
                      title={
                        isSidebarCollapsed ? 'إظهار القائمة الجانبية' : 'إخفاء القائمة الجانبية'
                      }
                    >
                      {isSidebarCollapsed ? (
                        <PanelLeftOpen className="header__sidebar-toggle-icon" />
                      ) : (
                        <PanelLeftClose className="header__sidebar-toggle-icon" />
                      )}
                    </button>
                  )}

                  {/* Search Bar - Expandable on mobile */}
                  <div className="header__search-wrapper">
                    <SearchBar />
                  </div>

                  {/* Actions */}
                  <div className="header__actions">
                    <AIStatusIndicator />
                    <Notifications />
                    <ProfileMenu />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.HOME}
                    className={`header__nav-link ${isActive(ROUTES.HOME) ? 'header__nav-link--active' : ''}`}
                  >
                    <Home className="header__nav-icon" />
                    <span>الرئيسية</span>
                  </Link>
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm">
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link to={ROUTES.REGISTER}>
                    <Button variant="primary" size="sm">
                      إنشاء حساب
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}

export default Header
