import React from 'react'
import { Button } from '@/presentation/components/common'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/domain/constants/routes.constants'

interface VerificationActionsProps {
    onResend?: () => void; isSending?: boolean; cooldownSeconds?: number
    sendSuccess?: boolean; sendError?: string | null; userEmail?: string | null
    showManualVerify?: boolean; onManualVerify?: (e: React.FormEvent<HTMLFormElement>) => void
    isLoading?: boolean; showBackToLogin?: boolean
}

export const VerificationActions: React.FC<VerificationActionsProps> = ({
    onResend, isSending, cooldownSeconds = 0, sendSuccess, sendError, userEmail,
    showManualVerify, onManualVerify, isLoading, showBackToLogin,
}) => {
    const { t } = useTranslation(); const navigate = useNavigate()

    return (
        <>
            {onResend && userEmail && (
                <div className="verify-email-page__resend">
                    <p className="verify-email-page__resend-text">{t('auth.verify.resend_prompt')}</p>
                    <Button
                        variant="outline" size="lg" onClick={onResend}
                        disabled={isSending || cooldownSeconds > 0} isLoading={isSending}
                        className="verify-email-page__resend-button"
                    >
                        {cooldownSeconds > 0 ? t('auth.verify.resend_button_timer', { seconds: cooldownSeconds }) : t('auth.verify.resend_button')}
                    </Button>
                    {sendSuccess && <p className="verify-email-page__success-message">{t('auth.verify.resend_success')}</p>}
                    {sendError && <p className="verify-email-page__error-message">{sendError}</p>}
                </div>
            )}
            {showManualVerify && onManualVerify && (
                <div className="verify-email-page__manual-verify">
                    <p className="verify-email-page__manual-text">{t('auth.verify.manual_prompt')}</p>
                    <form onSubmit={onManualVerify} className="verify-email-page__form">
                        <input type="text" name="token" placeholder={t('auth.verify.token_placeholder')} className="verify-email-page__input" disabled={isLoading} />
                        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="verify-email-page__button">
                            {t('auth.verify.verify_button')}
                        </Button>
                    </form>
                </div>
            )}
            {showBackToLogin && (
                <Button variant="outline" size="lg" onClick={() => navigate(ROUTES.LOGIN)} className="verify-email-page__button">
                    {t('auth.verify.back_to_login')}
                </Button>
            )}
        </>
    )
}
