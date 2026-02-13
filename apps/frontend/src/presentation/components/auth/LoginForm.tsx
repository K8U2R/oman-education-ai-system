import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'
import { ValidationService, ErrorBoundaryService } from '@/application'
import { authService } from '@/features/user-authentication-management'
import { Button, Input } from '../common'
import { OAuthButtons } from '@/features/user-authentication-management/components/OAuthButtons'
import { LoadingOverlay } from '@/presentation/routing/guards/components/LoadingOverlay'
import { useTranslation } from 'react-i18next'
import styles from './LoginForm.module.scss'

interface LoginFormProps {
    onSuccess?: () => void
    isModal?: boolean
    onForgotPassword?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, isModal = false, onForgotPassword }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Handle OAuth errors from URL if present
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const oauthError = urlParams.get('error_description')
        if (oauthError) {
            const decodedError = decodeURIComponent(oauthError.replace(/\+/g, ' '))
            setError(`${t('auth.login_failed')}: ${decodedError}`)
        }

        const state = location.state as { message?: string } | null
        if (state?.message) {
            setSuccess(state.message)
        }
    }, [location, t])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        if (!email || !password) {
            setError(t('auth.validation.enter_email_password'))
            setIsLoading(false)
            return
        }

        if (!ValidationService.validateEmail(email)) {
            setError(t('auth.validation.email_invalid'))
            setIsLoading(false)
            return
        }

        try {
            await authService.login({ email, password })
            if (onSuccess) {
                onSuccess()
            } else {
                const returnUrl = (location.state as { from?: string } | null)?.from || '/dashboard'
                navigate(returnUrl, { replace: true })
            }
        } catch (err: unknown) {
            const errorMessage = ErrorBoundaryService.handleApiError(err)
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={!isModal ? styles.container : ""}>
            {isLoading && <LoadingOverlay message={t('auth.loading_login')} context="Auth" />}
            {!isModal && (
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <LogIn className={styles.icon} />
                    </div>
                    <h1 className={styles.title}>{t('auth.login_title')}</h1>
                    <p className={styles.description}>{t('auth.login_subtitle')}</p>
                </div>
            )}

            {error && (
                <div className={styles.error}>
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className={styles.success}>
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    type="email"
                    label={t('auth.email_label')}
                    placeholder={t('auth.email_placeholder')}
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={isLoading}
                />

                <Input
                    type="password"
                    label={t('auth.password_label')}
                    placeholder={t('auth.password_placeholder')}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                />

                <div className={styles.options}>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-border-primary text-primary-600 focus:ring-primary-500" />
                        <span>{t('auth.remember_me')}</span>
                    </label>
                    {onForgotPassword ? (
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className={styles.forgotPassword}
                        >
                            {t('auth.forgot_password')}
                        </button>
                    ) : (
                        <Link to="/forgot-password" className={styles.forgotPassword}>
                            {t('auth.forgot_password')}
                        </Link>
                    )}
                </div>

                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} fullWidth>
                    {t('auth.sign_in')}
                </Button>
            </form>

            <div className={styles.oauth}>
                <div className={styles.divider}>
                    <span>{t('auth.or')}</span>
                </div>
                <OAuthButtons isLoading={isLoading} />
            </div>

            {!isModal && (
                <p className={styles.footer}>
                    {t('auth.no_account')}{' '}
                    <Link to="/register">
                        {t('auth.create_account')}
                    </Link>
                </p>
            )}
        </div>
    )
}
