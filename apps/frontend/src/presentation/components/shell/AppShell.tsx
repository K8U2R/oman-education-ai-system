import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar/Sidebar.index'
import { useAdsSystemHalt } from '@/application/core/services/system/diagnostics/ads-halt.service'
import { appMetadataService } from '@/application/core/services/system/metadata/app-metadata.service'

import { LayoutContainer } from './LayoutContainer/LayoutContainer'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { Breadcrumbs } from '@/presentation/components/layout/Breadcrumbs'
import { useRouteContext } from '@/presentation/routing/providers/RouteContext'
import { PWAInstallPrompt } from '@/presentation/components/common/PWAInstallPrompt/PWAInstallPrompt'
import { SettingsModal } from '@/presentation/components/layout/SettingsModal'
import { useAuth } from '@/features/user-authentication-management'
import { useUIStore } from '@/application/shared/store/uiStore'
import { BottomNav } from '@/presentation/layouts/BottomNav'
import { ROUTES } from '@/domain/constants/routes.constants'
import { cn } from '../common/utils/classNames'
import styles from './AppShell.module.scss'

interface AppShellProps {
  children?: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { metadata } = useRouteContext()
  const { isAuthenticated } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ADS System Halt Listener (Sovereign Service)
  const adsSystemHalt = useAdsSystemHalt()

  // Head Management (Title/Meta) (Sovereign Service)
  useEffect(() => {
    appMetadataService.updateMetadata(metadata)
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
      <div className={styles.contentInner}>
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
      className={cn(
        styles.appShell,
        isAuthenticated && styles['appShell--authenticated'],
        isSidebarCollapsed && styles['appShell--collapsed']
      )}
    >
      {/* Global Diagnostic Layer (ADS) */}
      <ProfessionalErrorPanel error={adsSystemHalt} />

      <Header
        onSidebarToggle={isAuthenticated ? handleSidebarToggle : undefined}
        isSidebarCollapsed={isSidebarCollapsed}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      <div className={styles.layout}>
        {isAuthenticated && (
          <aside className={cn(styles.sidebar, isMobileMenuOpen && styles['sidebar--open'])}>
            <Sidebar
              isOpen={true}
              isCollapsed={isSidebarCollapsed}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </aside>
        )}

        <main className={styles.main}>
          {useContainer ? <LayoutContainer>{content}</LayoutContainer> : content}
        </main>
      </div>

      <BottomNav />
      <PWAInstallPrompt />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettings}
        initialSection={settingsSection}
      />

      {/* Mobile Overlay */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  )
}
