import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/shell/Header/Header'
import { Sidebar } from '../components/shell/Sidebar/Sidebar'
import Footer from '../components/shell/Footer'
import { LayoutContainer } from '../components/shell/LayoutContainer/LayoutContainer'
import { ModalManager } from '../components/common/Modal/ModalManager'
import { SettingsModal } from '../components/layout/SettingsModal'
import { useUIStore } from '@/application/shared/store/uiStore'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { PWAInstallPrompt } from '../components/common/PWAInstallPrompt/PWAInstallPrompt'

interface DashboardLayoutProps {
    children?: React.ReactNode
}

/**
 * DashboardLayout - التخطيط لوحة التحكم المحمية
 * 
 * Includes Sidebar, Header (with toggle), and Footer.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { isSettingsModalOpen, settingsSection, closeSettings } = useUIStore()

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

    const handleSidebarToggle = () => {
        setIsSidebarCollapsed(prev => !prev)
    }

    const content = (
        <>
            <Breadcrumbs />
            <div className="layout-dashboard__content-inner">
                {children || <Outlet />}
            </div>
        </>
    )

    return (
        <div className={`layout-dashboard ${isSidebarCollapsed ? 'layout-dashboard--collapsed' : ''}`}>
            <ProfessionalErrorPanel error={null} />

            <Header
                showControls={true}
                onSidebarToggle={handleSidebarToggle}
                isSidebarCollapsed={isSidebarCollapsed}
                onMenuClick={() => setIsMobileMenuOpen(true)}
            />

            <div className="layout-dashboard__container">
                <Sidebar
                    isOpen={true}
                    isCollapsed={isSidebarCollapsed}
                    onClose={() => setIsMobileMenuOpen(false)}
                    className={`layout-dashboard__sidebar ${isMobileMenuOpen ? 'is-open' : ''}`}
                />

                <main className="layout-dashboard__main">
                    <LayoutContainer>{content}</LayoutContainer>
                </main>
            </div>

            <Footer />
            <ModalManager />
            <PWAInstallPrompt />

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={closeSettings}
                initialSection={settingsSection}
            />

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="layout-dashboard__overlay" onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </div>
    )
}

export default DashboardLayout
