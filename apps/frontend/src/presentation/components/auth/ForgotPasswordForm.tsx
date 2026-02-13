import React, { useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import { authService } from '@/presentation/features/user-authentication-management/api/auth.service'
import { Button, Input } from '../common'
import { useModalStore } from '@/stores/useModalStore'
import { ValidationService } from '@/application'
import { useTranslation } from 'react-i18next'
import styles from './ForgotPasswordForm.module.scss'

interface ForgotPasswordFormProps {
    onSuccess?: () => void
    isModal?: boolean
    onBackToLogin?: () => void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess, isModal = false, onBackToLogin }) => {
    const { t } = useTranslation()
    const openModal = useModalStore(state => state.open)
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!email) {
            setError(t('auth.validation.email_required'))
            return
        }

        if (!ValidationService.validateEmail(email)) {
            setError(t('auth.validation.email_invalid'))
            return
        }

        setIsLoading(true)

        try {
            await authService.forgotPassword(email)
            setSuccess(true)
            if (onSuccess) onSuccess()
        } catch (err: unknown) {
            // Handle error gracefully
            setError(t('auth.errors.reset_failed'))
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className={styles.successWrapper}>
                <div className={styles.successIconContainer}>
                    <CheckCircle2 className={styles.successIcon} />
                </div>
                <h3 className={styles.successTitle}>{t('auth.success.reset_sent_title')}</h3>
                <p className={styles.successMessage}>
                    {t('auth.success.reset_sent_msg')} <strong>{email}</strong>
                </p>
                <div className={styles.successActions}>
                    <Button variant="outline" onClick={() => window.open('https://mail.google.com', '_blank')}>
                        {t('auth.success.open_email')}
                    </Button>
                    {onBackToLogin && (
                        <button onClick={onBackToLogin} className={styles.backButton}>
                            {t('auth.actions.back_to_login')}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={!isModal ? styles.container : ""}>
            {!isModal && (
                <div className={styles.headingWrapper}>
                    <div className={styles.iconContainer}>
                        <Mail className={styles.headingIcon} />
                    </div>
                    <h1 className={styles.title}>{t('auth.forgot_password')}</h1>
                    <p className={styles.subtitle}>{t('auth.forgot_password_subtitle')}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && (
                    <div className={styles.error}>
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <Input
                    label={t('auth.email_label')}
                    type="email"
                    placeholder={t('auth.email_placeholder')}
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                />

                <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
                    {t('auth.actions.send_reset_link')}
                </Button>

                <div className={styles.buttonWrapper}>
                    {onBackToLogin ? (
                        <button type="button" onClick={onBackToLogin} className={styles.backButton}>
                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                            {t('auth.actions.back_to_login')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => openModal('login')}
                            className={styles.backButton}
                        >
                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                            {t('auth.actions.back_to_login')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
