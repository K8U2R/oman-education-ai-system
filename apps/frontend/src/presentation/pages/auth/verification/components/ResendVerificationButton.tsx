/**
 * Resend Verification Button - زر إعادة إرسال بريد التحقق
 *
 * مكون قابل لإعادة الاستخدام لإعادة إرسال بريد التحقق من البريد الإلكتروني
 */

import React from 'react'
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '../../../../components/common'
import { useSendVerificationEmail } from '@/features/user-authentication-management'


interface ResendVerificationButtonProps {
  /** البريد الإلكتروني المراد إرسال بريد التحقق إليه */
  email: string
  /** Cooldown بالثواني قبل إمكانية إعادة الإرسال (افتراضي: 60) */
  cooldownSeconds?: number
  /** حجم الزر (افتراضي: 'md') */
  size?: 'sm' | 'md' | 'lg'
  /** نوع الزر (افتراضي: 'outline') */
  variant?: 'primary' | 'outline' | 'ghost'
  /** عرض رسالة النجاح (افتراضي: true) */
  showSuccessMessage?: boolean
  /** عرض رسالة الخطأ (افتراضي: true) */
  showErrorMessage?: boolean
  /** className إضافي */
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
  const {
    isLoading,
    error,
    isSuccess,
    sendVerificationEmail,
    cooldownSeconds: remainingCooldown,
  } = useSendVerificationEmail(cooldownSeconds)

  const handleResend = async (): Promise<void> => {
    if (remainingCooldown > 0) {
      return
    }

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
          ? `إعادة الإرسال (${remainingCooldown}ث)`
          : 'إعادة إرسال بريد التحقق'}
      </Button>

      {showSuccessMessage && isSuccess && (
        <div className="resend-verification-button__message resend-verification-button__message--success">
          <CheckCircle2 className="resend-verification-button__message-icon" />
          <span>تم إرسال بريد التحقق بنجاح. يرجى التحقق من بريدك الإلكتروني</span>
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
