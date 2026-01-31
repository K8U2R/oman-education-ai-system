import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// ============================================================================
// Environment Validation (CRITICAL - Run before app initialization)
// ============================================================================
import { ENV } from '@/config/env'
console.log('🚀 Frontend initialized with environment:', ENV.IS_DEV ? 'development' : 'production')

import { ThemeProvider } from '@/presentation/providers/ThemeProvider'
import { RouteProvider } from '@/presentation/routing/providers/RouteProvider'
import { ToastProvider } from '@/presentation/providers/ToastProvider'
import { SentinelProvider } from '@/infrastructure/diagnostics'
import { serviceWorkerService } from '@/infrastructure/services/core/service-worker.service'
import { indexedDBService } from '@/infrastructure/services/storage/indexeddb.service'
import App from './App'
import './styles/main.scss'

// Initialize Service Worker
if (import.meta.env.PROD && serviceWorkerService.isSupported()) {
  serviceWorkerService.register().catch(error => {
    // Use logging service in production, console in development
    if (import.meta.env.PROD) {
      import('@/infrastructure/services').then(({ loggingService }) => {
        loggingService.error('Failed to register Service Worker', error as Error)
      })
    } else {
      console.error('Failed to register Service Worker:', error)
    }
  })
}

// Initialize IndexedDB
if (typeof window !== 'undefined') {
  indexedDBService.init().catch(error => {
    // Use logging service in production, console in development
    if (import.meta.env.PROD) {
      import('@/infrastructure/services').then(({ loggingService }) => {
        loggingService.error('Failed to initialize IndexedDB', error as Error)
      })
    } else {
      console.error('Failed to initialize IndexedDB:', error)
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        <RouteProvider>
          <ToastProvider>
            <SentinelProvider>
              <App />
            </SentinelProvider>
          </ToastProvider>
        </RouteProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
