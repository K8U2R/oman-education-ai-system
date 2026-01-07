/**
 * RouteProvider - Provider للمسارات
 *
 * Context Provider لإدارة حالة المسارات
 */

import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useRouteMetadata } from './hooks/useRouteMetadata'
import { RouteMetadata } from './types'
import { routeAnalytics } from './analytics/RouteAnalytics'
import { routeHistory } from './history/RouteHistory'
import { useAuth } from '@/application'

interface RouteContextType {
  currentPath: string
  metadata: RouteMetadata | undefined
  updateTitle: () => void
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useRouteContext = () => {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error('useRouteContext must be used within RouteProvider')
  }
  return context
}

interface RouteProviderProps {
  children: React.ReactNode
}

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const location = useLocation()
  const metadata = useRouteMetadata()
  const { user } = useAuth()

  const updateTitle = useCallback(() => {
    if (metadata?.title) {
      document.title = metadata.title
    } else {
      document.title = 'Oman Education AI'
    }
  }, [metadata?.title])

  useEffect(() => {
    updateTitle()
  }, [metadata, location.pathname, updateTitle])

  // Update meta description
  useEffect(() => {
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

  // Track route view (only when pathname changes, not when user changes)
  useEffect(() => {
    routeHistory.addEntry(location.pathname, metadata?.title)
    routeAnalytics.trackRouteView(location.pathname, metadata, user?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]) // Only track on pathname change, not user change

  return (
    <RouteContext.Provider
      value={{
        currentPath: location.pathname,
        metadata,
        updateTitle,
      }}
    >
      {children}
    </RouteContext.Provider>
  )
}
