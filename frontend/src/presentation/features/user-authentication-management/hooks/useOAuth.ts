/**
 * useOAuth Hook - Hook لـ OAuth
 *
 * Custom Hook لإدارة OAuth Authentication
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../api/auth.service'
import { useAuthStore } from '../store/authStore'
import { User } from '@/domain/entities/User'
import type { OAuthProvider, OAuthCallbackResult } from '@/domain/types/auth.types'
import { ROUTES } from '@/domain/constants/routes.constants'

interface UseOAuthReturn {
  isLoading: boolean
  error: string | null
  initiateOAuth: (provider: OAuthProvider) => void
  handleCallback: () => Promise<OAuthCallbackResult | null>
  clearError: () => void
}

export const useOAuth = (): UseOAuthReturn => {
  const navigate = useNavigate()
  const { login: loginStore } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * بدء عملية OAuth
   */
  const initiateOAuth = useCallback((provider: OAuthProvider, redirectTo?: string) => {
    try {
      setError(null)
      const redirectUrl = redirectTo || `${window.location.origin}${ROUTES.OAUTH_CALLBACK}`
      const oauthUrl = authService.getOAuthUrl(provider, redirectUrl)

      // 🔍 DIAGNOSTIC LOG
      console.log('🚀 [useOAuth] Initiating OAuth:', { provider, redirectUrl, oauthUrl })

      window.location.href = oauthUrl
    } catch (err) {
      console.error('Failed to initiate OAuth:', err)
      setError('فشل بدء عملية تسجيل الدخول')
    }
  }, [])

  /**
   * معالجة OAuth Callback
   */
  const handleCallback = useCallback(async (): Promise<OAuthCallbackResult | null> => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await authService.handleOAuthCallback()

      if (result.success && result.data) {
        let user = User.fromData(result.data.user)

        // التحقق من وجود الأدوار - إذا كانت مفقودة، جلب البروفايل بالكامل
        if (!user.role || (user.permissions && user.permissions.length === 0)) {
          try {
            const freshUser = await authService.getCurrentUser()
            user = freshUser
          } catch {
            // Ignore fetch error, continue with callback data
          }
        }

        // تحديث المتجر مباشرة بعد نجاح OAuth
        loginStore(user, result.data.tokens)

        // نجحت العملية، التوجيه إلى Dashboard
        navigate(ROUTES.DASHBOARD, { replace: true })
        return result.data
      } else if (result.error) {
        // فشلت العملية
        setError(result.error)
        // التوجيه إلى Login بعد 3 ثواني
        setTimeout(() => {
          navigate(ROUTES.LOGIN, {
            replace: true,
            state: { oauthError: result.error },
          })
        }, 3000)
      }

      return null
    } catch (err) {
      console.error('Failed to handle OAuth callback:', err)
      const errorMessage = 'فشل معالجة تسجيل الدخول'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [navigate, loginStore])

  /**
   * مسح الخطأ
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    initiateOAuth,
    handleCallback,
    clearError,
  }
}
