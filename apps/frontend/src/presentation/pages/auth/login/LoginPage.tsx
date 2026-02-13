import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { LogIn, AlertTriangle } from 'lucide-react'
import { Card } from '../../../components/common'
import { LoginForm } from '../../../components/auth/LoginForm'
import { useTranslation } from 'react-i18next'

import styles from '../AuthLayout.module.scss'

/**
 * LoginPage - صفحة تسجيل الدخول
 * 
 * Standard page view for user authentication.
 */
const LoginPage: React.FC = () => {
    const { t } = useTranslation()
    // Law 08: Visual Error Handling
    const [searchParams] = useSearchParams()
    const error = searchParams.get('error')
    const reason = searchParams.get('reason')

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                {error && (
                    <div
                        className="mb-6 p-4 rounded-xl border flex items-start gap-3 shadow-sm transition-all duration-300 bg-surface border-error text-text-primary"
                        dir="ltr"
                        style={{ borderColor: 'var(--error-500)', backgroundColor: 'color-mix(in srgb, var(--error-500), transparent 95%)' }}
                    >
                        <div className="p-1 rounded-full bg-error/10">
                            <AlertTriangle className="w-5 h-5 text-error" style={{ color: 'var(--error-500)' }} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-error" style={{ color: 'var(--error-700)' }}>
                                {t('auth.login_failed')}
                            </h3>
                            <p className="text-xs mt-1 text-text-secondary">
                                {error === 'oauth_failed' ? t('auth.oauth_failed') : t('auth.unexpected_error')}
                            </p>
                            {reason && (
                                <code className="block mt-2 text-[10px] px-2 py-1 rounded font-mono border bg-error/5 border-error/10 text-error">
                                    {reason}
                                </code>
                            )}
                        </div>
                    </div>
                )}
                <div className={styles.header}>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className={styles.title}>{t('auth.login_title')}</h1>
                    <p className={styles.subtitle}>{t('auth.login_subtitle')}</p>
                </div>

                <div className={styles.formWrapper}>
                    <LoginForm />
                </div>
            </Card>
        </div>
    )
}

export default LoginPage
