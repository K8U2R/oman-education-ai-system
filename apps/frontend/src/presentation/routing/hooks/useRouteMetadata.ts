/**
 * useRouteMetadata Hook - Hook لـ Route Metadata
 *
 * Custom Hook للحصول على Route Metadata
 */

import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { routeMetadata } from '../index'
import { RouteMetadata } from '../types'

export const useRouteMetadata = (): RouteMetadata | undefined => {
  const location = useLocation()

  return useMemo(() => {
    // Try exact match first
    let metadata = routeMetadata[location.pathname]

    // If not found, try pattern matching
    if (!metadata) {
      const matchingKey = Object.keys(routeMetadata).find(key => {
        if (key === location.pathname) return true

        // Pattern matching for dynamic routes
        const patternParts = key.split('/')
        const pathParts = location.pathname.split('/')

        if (patternParts.length !== pathParts.length) return false

        return patternParts.every((part, index) => {
          if (part.startsWith(':')) return true
          return part === pathParts[index]
        })
      })

      if (matchingKey) {
        metadata = routeMetadata[matchingKey]
      }
    }

    return metadata
  }, [location.pathname])
}
