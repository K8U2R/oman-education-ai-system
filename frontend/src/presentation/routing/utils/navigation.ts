/**
 * Navigation Utilities - أدوات التنقل
 *
 * وظائف مساعدة للتنقل بين المسارات
 */

import { NavigateFunction } from 'react-router-dom'
import { ROUTES } from '@/domain/constants/routes.constants'
import { routeHistory } from '../history/RouteHistory'
import { routeAnalytics } from '../analytics/RouteAnalytics'
import { findRouteByPath } from './route-utils'
import { allRoutes } from '../index'

/**
 * Navigate with analytics and history tracking
 */
export const navigateWithTracking = (
  navigate: NavigateFunction,
  path: string,
  options?: { replace?: boolean; state?: unknown }
): void => {
  const currentPath = window.location.pathname
  const route = findRouteByPath(path, allRoutes)

  // Track navigation
  routeHistory.addEntry(path, route?.metadata?.title, currentPath)
  routeAnalytics.trackNavigation(currentPath, path, route?.metadata)

  // Navigate
  navigate(path, options)
}

/**
 * Navigate back with history
 */
export const navigateBack = (navigate: NavigateFunction): void => {
  const previousPath = routeHistory.getPreviousPath()
  if (previousPath) {
    navigateWithTracking(navigate, previousPath, { replace: true })
  } else {
    navigate(ROUTES.HOME, { replace: true })
  }
}

/**
 * Navigate to home
 */
export const navigateToHome = (navigate: NavigateFunction): void => {
  navigateWithTracking(navigate, ROUTES.HOME)
}

/**
 * Navigate to dashboard
 */
export const navigateToDashboard = (navigate: NavigateFunction): void => {
  navigateWithTracking(navigate, ROUTES.DASHBOARD)
}

/**
 * Navigate to login with return path
 */
export const navigateToLogin = (navigate: NavigateFunction, returnPath?: string): void => {
  navigateWithTracking(navigate, ROUTES.LOGIN, {
    state: { from: returnPath || window.location.pathname },
  })
}

/**
 * Check if navigation is allowed
 */
export const canNavigate = (path: string, isAuthenticated: boolean): boolean => {
  const route = findRouteByPath(path, allRoutes)
  if (!route) {
    return false
  }

  if (route.metadata?.requiresAuth && !isAuthenticated) {
    return false
  }

  return true
}
