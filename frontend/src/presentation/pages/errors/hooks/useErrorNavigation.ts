/**
 * useErrorNavigation Hook - Hook للتنقل
 *
 * Custom Hook للتنقل في صفحات الأخطاء
 */

import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { ROUTES } from '@/domain/constants/routes.constants'

interface UseErrorNavigationReturn {
  /** العودة للخلف */
  goBack: () => void
  /** الذهاب للصفحة الرئيسية */
  goHome: () => void
  /** الذهاب لصفحة تسجيل الدخول */
  goToLogin: (from?: string) => void
  /** الذهاب لصفحة معينة */
  navigate: (path: string, options?: { replace?: boolean; state?: unknown }) => void
  /** إعادة المحاولة (refresh) */
  retry: (attemptedPath?: string) => void
}

/**
 * Hook للتنقل في صفحات الأخطاء
 */
export function useErrorNavigation(): UseErrorNavigationReturn {
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const goHome = useCallback(() => {
    navigate(ROUTES.HOME, { replace: true })
  }, [navigate])

  const goToLogin = useCallback(
    (from?: string) => {
      navigate(ROUTES.LOGIN, {
        state: { from: from || window.location.pathname },
      })
    },
    [navigate]
  )

  const navigateTo = useCallback(
    (path: string, options?: { replace?: boolean; state?: unknown }) => {
      navigate(path, options)
    },
    [navigate]
  )

  const retry = useCallback(
    (attemptedPath?: string) => {
      if (attemptedPath && attemptedPath !== window.location.pathname) {
        navigate(attemptedPath, { replace: true })
      } else {
        window.location.reload()
      }
    },
    [navigate]
  )

  return {
    goBack,
    goHome,
    goToLogin,
    navigate: navigateTo,
    retry,
  }
}
