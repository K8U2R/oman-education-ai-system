/**
 * Verify Email Page - Sovereign Refactor
 * Follows Rule 13 (Decomposition) & Rule 8 (Linguistic Sovereignty)
 */
import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, useEmailVerification, useSendVerificationEmail } from '@/features/user-authentication-management'
import { loggingService } from '@/infrastructure/services'
import { ROUTES } from '@/domain/constants/routes.constants'
import {
  VerificationStatus,
  VerificationActions,
  VerificationInput
} from './components'

const VerifyEmailPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, refreshUser } = useAuth()
  const { isLoading, error, verifiedUser, verifyEmail, clearError } = useEmailVerification()
  const { isLoading: isSending, error: sendError, isSuccess: sendSuccess, sendVerificationEmail, cooldownSeconds } = useSendVerificationEmail(60)

  const [token, setToken] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')

  const handleVerify = useCallback(async (vToken: string) => {
    try {
      clearError()
      setStatus('verifying')
      await verifyEmail(vToken)
      setStatus('success')
      await refreshUser()
      setTimeout(() => navigate(ROUTES.DASHBOARD, { replace: true }), 3000)
    } catch {
      setStatus('error')
    }
  }, [verifyEmail, clearError, refreshUser, navigate])

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (urlToken) {
      const decoded = decodeURIComponent(urlToken)
      if (decoded.length < 32) {
        loggingService.warn('Invalid token format', { length: decoded.length })
        setStatus('error')
        return
      }
      setToken(decoded)
      handleVerify(decoded)
    }
  }, [searchParams, handleVerify])

  const handleManualVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const inputToken = (new FormData(e.currentTarget).get('token') as string)?.trim()
    if (!inputToken || inputToken.length < 32) return
    handleVerify(inputToken)
  }

  const handleResend = async () => {
    if (user?.email) await sendVerificationEmail(user.email)
  }

  // Derived State Logic
  const isAlreadyVerified = user?.isVerified && !token
  const finalStatus = isAlreadyVerified ? 'already_verified' : (verifiedUser ? 'success' : status)

  if (isLoading && status !== 'verifying') return <VerificationStatus status="verifying" />

  return (
    <VerificationStatus status={finalStatus} error={error} email={user?.email}>
      {finalStatus === 'already_verified' && (
        <VerificationActions showBackToLogin={false} isLoading={false} />
        /* Assuming we adapt Actions or just use simple button here, but Actions is safer */
      )}

      {(finalStatus === 'idle' || finalStatus === 'error') && (
        <>
          <VerificationActions
            onResend={handleResend}
            isSending={isSending}
            cooldownSeconds={cooldownSeconds}
            sendSuccess={sendSuccess}
            sendError={sendError}
            userEmail={user?.email}
            isLoading={isLoading}
          />
          <VerificationInput onSubmit={handleManualVerify} isLoading={isLoading} />
          <VerificationActions showBackToLogin={true} />
        </>
      )}
    </VerificationStatus>
  )
}

export default VerifyEmailPage
