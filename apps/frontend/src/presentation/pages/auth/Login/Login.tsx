import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { LogIn, AlertTriangle } from 'lucide-react'
import { Card } from '../../../components/common'
import { LoginForm } from '../../../components/auth/LoginForm'
import { useTranslation } from 'react-i18next'

import styles from '../../shared/components/AuthLayout/AuthLayout.module.scss'

/**
 * LoginPage
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
                    <div className={styles['error-banner']}>
                        <div className={styles['error-banner__icon-wrapper']}>
                            <AlertTriangle className={styles['error-banner__icon']} />
                        </div>
                        <div className={styles['error-banner__content']}>
                            <h3 className={styles['error-banner__title']}>
                                {t('auth.login_failed')}
                            </h3>
                            <p className={styles['error-banner__message']}>
                                {error === 'oauth_failed' ? t('auth.oauth_failed') : t('auth.unexpected_error')}
                            </p>
                            {reason && (
                                <code className={styles['error-banner__code']}>
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
