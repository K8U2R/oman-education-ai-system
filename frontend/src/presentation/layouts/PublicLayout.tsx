import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/shell/Header/Header'
import Footer from '../components/shell/Footer'
import { LayoutContainer } from '../components/shell/LayoutContainer/LayoutContainer'
import { ModalManager } from '../components/common/Modal/ModalManager'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { PWAInstallPrompt } from '../components/common/PWAInstallPrompt/PWAInstallPrompt'

interface PublicLayoutProps {
    children?: React.ReactNode
    useContainer?: boolean
}

/**
 * PublicLayout - التخطيط للصفحات العامة
 * 
 * Includes Navbar (with no sidebar toggle) and Footer.
 * Used for /, /login, /register, etc.
 */
export const PublicLayout: React.FC<PublicLayoutProps> = ({ children, useContainer = true }) => {
    return (
        <div className="layout-public min-h-screen flex flex-col">
            {/* Global Diagnostic Layer */}
            <ProfessionalErrorPanel error={null} />

            <Header variant="default" showControls={false} />

            <main className="layout-public__main flex-grow">
                {useContainer ? (
                    <LayoutContainer>
                        {children || <Outlet />}
                    </LayoutContainer>
                ) : (
                    children || <Outlet />
                )}
            </main>

            <Footer />
            <ModalManager />
            <PWAInstallPrompt />
        </div>
    )
}

export default PublicLayout
