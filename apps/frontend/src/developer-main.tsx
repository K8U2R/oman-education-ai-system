import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/presentation/providers/ThemeProvider'
import { ToastProvider } from '@/presentation/providers/ToastProvider'
import CockpitPage from '@/presentation/pages/developer/cockpit/CockpitPage'
import { SentinelRoute } from '@/presentation/pages/developer/sentinel/SentinelRoute'
import { SentinelProvider } from '@/infrastructure/diagnostics'
import './index.css'
import './styles/main.scss'

import { DeveloperLayout } from '@/presentation/layouts/developer/DeveloperLayout'

ReactDOM.createRoot(document.getElementById('dev-root')!).render(
    <React.StrictMode>
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <ThemeProvider>
                <ToastProvider>
                    <SentinelProvider>
                        <Routes>
                            <Route element={<DeveloperLayout />}>
                                <Route path="/dev/cockpit" element={<CockpitPage />} />
                                <Route path="/dev/sentinel" element={<SentinelRoute />} />
                                <Route path="*" element={<Navigate to="/dev/cockpit" replace />} />
                            </Route>
                        </Routes>
                    </SentinelProvider>
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
)
