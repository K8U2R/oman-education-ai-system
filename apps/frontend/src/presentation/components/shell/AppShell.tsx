import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import Footer from './Footer'

import { LayoutContainer } from './LayoutContainer/LayoutContainer'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { Breadcrumbs } from '@/presentation/components/layout/Breadcrumbs'
import { useRouteContext } from '@/presentation/routing/providers/RouteContext'
import { PWAInstallPrompt } from '@/presentation/components/common/PWAInstallPrompt/PWAInstallPrompt'
import { SettingsModal } from '@/presentation/components/layout/SettingsModal'
import { useAuth } from '@/features/user-authentication-management'
import { useUIStore } from '@/application/shared/store/uiStore'
import { ROUTES } from '@/domain/constants/routes.constants'

interface AppShellProps {
  children?: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { metadata } = useRouteContext()
  const { isAuthenticated } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Sidebar persistence
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      setIsSidebarCollapsed(JSON.parse(savedState))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  // Head Management (Title/Meta)
  useEffect(() => {
    if (metadata?.title) {
      document.title = `${metadata.title} - Oman Education AI System`
    }
    if (metadata?.description) {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', metadata.description)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = metadata.description
        document.head.appendChild(meta)
      }
    }
  }, [metadata])

  const location = useLocation()
  // Determine if we should wrap content in LayoutContainer
  const useContainer = location.pathname !== ROUTES.HOME

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(prev => !prev)
  }

  // Settings are global, managed by UI Store
  const { isSettingsModalOpen, settingsSection, closeSettings } = useUIStore()

  // Content Logic
  const content = (
    <>
      <Breadcrumbs />
      <div className="app-shell__content-inner">
        {children ? (
          <React.Suspense fallback={<div>Loading page...</div>}>{children}</React.Suspense>
        ) : (
          <React.Suspense fallback={<div>Loading page...</div>}>
            <Outlet />
          </React.Suspense>
        )}
      </div>
    </>
  )

  return (
    <div
      className={`app-shell ${isAuthenticated ? 'app-shell--authenticated' : ''} ${isSidebarCollapsed ? 'app-shell--collapsed' : ''}`}
    >
      {/* Global Diagnostic Layer (ADS) */}
      <ProfessionalErrorPanel error={null} />

      <Header
        onSidebarToggle={isAuthenticated ? handleSidebarToggle : undefined}
        isSidebarCollapsed={isSidebarCollapsed}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      <div className="app-shell__layout">
        {isAuthenticated && (
          <aside className={`app-shell__sidebar ${isMobileMenuOpen ? 'is-open' : ''}`}>
            <Sidebar
              isOpen={true}
              isCollapsed={isSidebarCollapsed}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </aside>
        )}

        <main className="app-shell__main">
          {useContainer ? <LayoutContainer>{content}</LayoutContainer> : content}
        </main>
      </div>

      <Footer />
      <PWAInstallPrompt />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettings}
        initialSection={settingsSection}
      />

      {/* Mobile Overlay */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="app-shell__overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  )
}
