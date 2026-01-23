/**
 * Verification Status - حالة التحقق
 *
 * مكون لعرض حالة التحقق من البريد الإلكتروني
 */

import React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'


interface VerificationStatusProps {
  /** حالة التحقق */
  isVerified: boolean
  /** البريد الإلكتروني */
  email?: string
  /** حجم المكون (افتراضي: 'md') */
  size?: 'sm' | 'md' | 'lg'
  /** عرض البريد الإلكتروني (افتراضي: true) */
  showEmail?: boolean
  /** className إضافي */
  className?: string
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  isVerified,
  email,
  size = 'md',
  showEmail = true,
  className,
}) => {
  return (
    <div className={`verification-status verification-status--${size} ${className || ''}`}>
      {isVerified ? (
        <>
          <CheckCircle2 className="verification-status__icon verification-status__icon--verified" />
          <div className="verification-status__content">
            <span className="verification-status__label">البريد الإلكتروني موثق</span>
            {showEmail && email && <span className="verification-status__email">{email}</span>}
          </div>
        </>
      ) : (
        <>
          <XCircle className="verification-status__icon verification-status__icon--unverified" />
          <div className="verification-status__content">
            <span className="verification-status__label">البريد الإلكتروني غير موثق</span>
            {showEmail && email && <span className="verification-status__email">{email}</span>}
          </div>
        </>
      )}
    </div>
  )
}
