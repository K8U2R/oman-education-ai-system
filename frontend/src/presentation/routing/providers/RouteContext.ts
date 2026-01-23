import { createContext, useContext } from 'react'
import { RouteMetadata } from '../types'

export interface RouteContextType {
  currentPath: string
  metadata: RouteMetadata | undefined
  updateTitle: () => void
}

export const RouteContext = createContext<RouteContextType | undefined>(undefined)

export const useRouteContext = () => {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error('useRouteContext must be used within RouteProvider')
  }
  return context
}
