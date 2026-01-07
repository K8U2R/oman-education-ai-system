import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header, Sidebar } from '../components/layout'
import { Breadcrumbs } from '../routing/components/Breadcrumbs'
import { useRouteMetadata } from '../routing/hooks/useRouteMetadata'
import { LayoutContainer } from './components/LayoutContainer'
import { PWAInstallPrompt } from '../components/common'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useAuth } from '@/application'
import './MainLayout.scss'

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const metadata = useRouteMetadata()
  const { isAuthenticated } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      setIsSidebarCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(prev => !prev)
  }

  // Update document title and meta description
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

  // Don't use LayoutContainer for home page (full-width sections)
  // Use LayoutContainer for other pages (content pages)
  const useContainer = location.pathname !== ROUTES.HOME

  const content = (
    <>
      <Breadcrumbs />
      <div className="main-layout__content">
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
      className={`main-layout ${isAuthenticated ? 'main-layout--has-sidebar' : ''} ${isSidebarCollapsed ? 'main-layout--sidebar-collapsed' : ''}`}
    >
      <Header
        onSidebarToggle={isAuthenticated ? handleSidebarToggle : undefined}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <div className="main-layout__body">
        {isAuthenticated && <Sidebar isOpen={true} isCollapsed={isSidebarCollapsed} />}
        <main className="main-layout__main">
          {useContainer ? <LayoutContainer>{content}</LayoutContainer> : content}
        </main>
      </div>
      <PWAInstallPrompt />
    </div>
  )
}

export default MainLayout
