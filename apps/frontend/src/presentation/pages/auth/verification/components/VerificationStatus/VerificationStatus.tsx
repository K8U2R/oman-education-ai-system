/**
 * Verification Status
 * Sovereign Refactor: Localized and Cleaned
 */
import React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface VerificationStatusProps {
  isVerified: boolean
  email?: string
  size?: 'sm' | 'md' | 'lg'
  showEmail?: boolean
  className?: string
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  isVerified,
  email,
  size = 'md',
  showEmail = true,
  className,
}) => {
  const { t } = useTranslation()

  return (
    <div className={`verification-status verification-status--${size} ${className || ''}`}>
      {isVerified ? (
        <>
          <CheckCircle2 className="verification-status__icon verification-status__icon--verified" />
          <div className="verification-status__content">
            <span className="verification-status__label">{t('auth.verify.status_verified')}</span>
            {showEmail && email && <span className="verification-status__email">{email}</span>}
          </div>
        </>
      ) : (
        <>
          <XCircle className="verification-status__icon verification-status__icon--unverified" />
          <div className="verification-status__content">
            <span className="verification-status__label">{t('auth.verify.status_unverified')}</span>
            {showEmail && email && <span className="verification-status__email">{email}</span>}
          </div>
        </>
      )}
    </div>
  )
}
