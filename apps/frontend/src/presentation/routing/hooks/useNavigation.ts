/**
 * useNavigation Hook - Hook للتنقل
 *
 * Custom Hook للتنقل مع Tracking
 */

import { useNavigate, useLocation } from 'react-router-dom'
import { useCallback } from 'react'
import {
  navigateWithTracking,
  navigateBack,
  navigateToHome,
  navigateToDashboard,
  navigateToLogin,
  canNavigate,
} from '../utils/navigation'
import { useAuth } from '@/features/user-authentication-management'

export const useNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  const navigateTo = useCallback(
    (path: string, options?: { replace?: boolean; state?: unknown }) => {
      navigateWithTracking(navigate, path, options)
    },
    [navigate]
  )

  const goBack = useCallback(() => {
    navigateBack(navigate)
  }, [navigate])

  const goHome = useCallback(() => {
    navigateToHome(navigate)
  }, [navigate])

  const goToDashboard = useCallback(() => {
    navigateToDashboard(navigate)
  }, [navigate])

  const goToLogin = useCallback(
    (returnPath?: string) => {
      navigateToLogin(navigate, returnPath)
    },
    [navigate]
  )

  const canGoTo = useCallback(
    (path: string) => {
      return canNavigate(path, isAuthenticated)
    },
    [isAuthenticated]
  )

  return {
    navigate: navigateTo,
    goBack,
    goHome,
    goToDashboard,
    goToLogin,
    canGoTo,
    currentPath: location.pathname,
  }
}
