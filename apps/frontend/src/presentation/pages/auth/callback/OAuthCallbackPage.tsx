/**
 * OAuthCallback - Sovereign Messenger
 * 
 * Extracts OAuth code/state and delegates to backend for sovereign processing.
 * Strictly enforces 10s timeout and OKLCH-based X-Ray diagnostics.
 */

import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoadingOverlay } from '@/presentation/routing/guards/components/LoadingOverlay'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { ROUTES } from '@/domain/constants/routes.constants'
import { apiClient } from '@/infrastructure/api/api-client'

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeoutError, setTimeoutError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const providerError = searchParams.get('error')

    if (providerError) {
      setError(`Google OAuth Error: ${providerError}`)
      setIsLoading(false)
      return
    }

    if (!code) {
      setError('Missing OAuth code from provider')
      setIsLoading(false)
      return
    }

    // 10-second Sovereign Timeout
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setTimeoutError(true)
        setIsLoading(false)
      }
    }, 10000)

    const completeOAuth = async () => {
      try {
        // Messenger: Pass code to Backend for sovereign secret processing
        const response = await apiClient.post<any>('/auth/oauth/exchange-code', {
          code,
          state,
          provider: 'google'
        })

        if (response.success) {
          navigate(ROUTES.DASHBOARD, { replace: true })
        } else {
          throw new Error(response.message || 'Authentication failed on backend')
        }
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Backend communication fatal error')
      } finally {
        setIsLoading(false)
        clearTimeout(timeoutId)
      }
    }

    completeOAuth()

    return () => clearTimeout(timeoutId)
  }, [searchParams, navigate])

  // X-Ray Diagnostic Views
  if (timeoutError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-app">
        <ProfessionalErrorPanel
          error={{
            code: 'SOVEREIGN_OAUTH_TIMEOUT',
            message: 'انتهت مهلة المزامنة الأمنية (10 ثوانٍ)',
            technicalDetails: {
              service: 'Messenger/OAuth',
              file: 'OAuthCallback.tsx',
              functionName: 'completeOAuth',
              context: {
                timeout: '10000ms',
                state: 'waiting_for_backend_secret_exchange',
                diagnostics: 'Check backend latency and Google API connectivity'
              }
            }
          }}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-app">
        <ProfessionalErrorPanel
          error={{
            code: 'OAUTH_MESSENGER_FAILURE',
            message: error,
            technicalDetails: {
              service: 'Sovereign Auth Engine',
              file: 'OAuthCallback.tsx',
              functionName: 'handleOAuthCallback',
              context: {
                error,
                hint: 'Check TECHNICAL_DEBT_LOG.md in backend for known OAuth issues'
              }
            }
          }}
          onRetry={() => navigate(ROUTES.LOGIN)}
        />
      </div>
    )
  }

  return (
    <LoadingOverlay
      message="جارٍ التحقق من الهوية سيادياً..."
      context="Sovereign OAuth Messenger"
      debugInfo={{ step: 'exchange_code_with_backend', timeout: '10s' }}
    />
  )
}

export default OAuthCallback
