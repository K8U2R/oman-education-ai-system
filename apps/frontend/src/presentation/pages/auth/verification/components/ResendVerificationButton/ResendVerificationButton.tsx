/**
 * Resend Verification Button
 * Sovereign Refactor: Localized and Cleaned
 */
import React from 'react'
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/presentation/components/common'
import { useSendVerificationEmail } from '@/features/user-authentication-management'
import { useTranslation } from 'react-i18next'

interface ResendVerificationButtonProps {
  email: string
  cooldownSeconds?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'outline' | 'ghost'
  showSuccessMessage?: boolean
  showErrorMessage?: boolean
  className?: string
}

export const ResendVerificationButton: React.FC<ResendVerificationButtonProps> = ({
  email,
  cooldownSeconds = 60,
  size = 'md',
  variant = 'outline',
  showSuccessMessage = true,
  showErrorMessage = true,
  className,
}) => {
  const { t } = useTranslation()
  const {
    isLoading,
    error,
    isSuccess,
    sendVerificationEmail,
    cooldownSeconds: remainingCooldown,
  } = useSendVerificationEmail(cooldownSeconds)

  const handleResend = async (): Promise<void> => {
    if (remainingCooldown > 0) return
    try {
      await sendVerificationEmail(email)
    } catch (_err) {
      // Error handled by hook
    }
  }

  return (
    <div className={`resend-verification-button ${className || ''}`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleResend}
        disabled={isLoading || remainingCooldown > 0}
        isLoading={isLoading}
        leftIcon={<Mail className="resend-verification-button__icon" />}
        className="resend-verification-button__button"
      >
        {remainingCooldown > 0
          ? t('auth.verify.resend_button_timer', { seconds: remainingCooldown })
          : t('auth.verify.resend_button')}
      </Button>

      {showSuccessMessage && isSuccess && (
        <div className="resend-verification-button__message resend-verification-button__message--success">
          <CheckCircle2 className="resend-verification-button__message-icon" />
          <span>{t('auth.verify.resend_success')}</span>
        </div>
      )}

      {showErrorMessage && error && (
        <div className="resend-verification-button__message resend-verification-button__message--error">
          <AlertCircle className="resend-verification-button__message-icon" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
