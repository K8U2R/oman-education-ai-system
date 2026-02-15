import React from 'react'
import { Button } from '@/presentation/components/common'
import { useTranslation } from 'react-i18next'

interface VerificationInputProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isLoading?: boolean
}

export const VerificationInput: React.FC<VerificationInputProps> = ({
    onSubmit,
    isLoading,
}) => {
    const { t } = useTranslation()

    return (
        <div className="verify-email-page__manual-verify">
            <p className="verify-email-page__manual-text">
                {t('auth.verify.manual_prompt')}
            </p>
            <form onSubmit={onSubmit} className="verify-email-page__form">
                <input
                    type="text"
                    name="token"
                    placeholder={t('auth.verify.token_placeholder')}
                    className="verify-email-page__input"
                    disabled={isLoading}
                />
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="verify-email-page__button"
                >
                    {t('auth.verify.verify_button')}
                </Button>
            </form>
        </div>
    )
}
