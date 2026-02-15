/**
 * OAuthCallback - Sovereign Messenger
 * Sovereign Refactor: Localized and Decomposed
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingOverlay } from '@/presentation/routing/guards/components/LoadingOverlay'
import { ProfessionalErrorPanel } from '@/presentation/features/diagnostic-system-ads/components/ProfessionalErrorPanel/ProfessionalErrorPanel'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useTranslation } from 'react-i18next'
import { useOAuthCallback } from './hooks/useOAuthCallback'

const OAuthCallback: React.FC = () => {
  const { error, timeoutError, retry } = useOAuthCallback()
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (timeoutError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-app">
        <ProfessionalErrorPanel
          error={{
            code: 'SOVEREIGN_OAUTH_TIMEOUT',
            message: t('auth.oauth_callback.timeout_error'),
            technicalDetails: { service: 'Messenger/OAuth', file: 'OAuthCallback.tsx' }
          }}
          onRetry={retry}
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
            technicalDetails: { service: 'Sovereign Auth Engine', file: 'OAuthCallback.tsx' }
          }}
          onRetry={() => navigate(ROUTES.LOGIN)}
        />
      </div>
    )
  }

  return (
    <LoadingOverlay
      message={t('auth.oauth_callback.verifying_identity')}
      context="Sovereign OAuth Messenger"
    />
  )
}

export default OAuthCallback
