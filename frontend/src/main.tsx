import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/presentation/providers/ThemeProvider'
import { RouteProvider } from '@/presentation/routing/RouteProvider'
import { ToastProvider } from '@/presentation/providers/ToastProvider'
import { serviceWorkerService } from '@/infrastructure/services/service-worker.service'
import { indexedDBService } from '@/infrastructure/storage/indexeddb.service'
import App from './App'
import './index.css'
import './styles/main.scss'

// Initialize Service Worker
if (import.meta.env.PROD && serviceWorkerService.isSupported()) {
  serviceWorkerService.register().catch(error => {
    // Use logging service in production, console in development
    if (import.meta.env.PROD) {
      import('@/infrastructure/services/logging.service').then(({ loggingService }) => {
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
      import('@/infrastructure/services/logging.service').then(({ loggingService }) => {
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
            <App />
          </ToastProvider>
        </RouteProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
