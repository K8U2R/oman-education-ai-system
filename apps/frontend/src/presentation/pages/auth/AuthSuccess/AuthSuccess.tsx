/**
 * Auth Success Page
 * 
 * This page handles the landing after a successful OAuth redirect from the backend.
 * Sovereign Refactor: Logic moved to core/AuthSuccess.hooks.ts
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/domain/constants/routes.constants'
import { DefaultRouteLoader } from '@/presentation/components/common'
import { useModalStore } from '@/stores/useModalStore'
import { useTranslation } from 'react-i18next'
import { useAuthSuccess } from './core/AuthSuccess.hooks'
import styles from './AuthSuccess.module.scss'

const AuthSuccessPage: React.FC = () => {
    const { debugInfo } = useAuthSuccess()
    const navigate = useNavigate()
    const openModal = useModalStore(state => state.open)
    const { t } = useTranslation()

    const handleRetry = () => {
        navigate(ROUTES.HOME)
        setTimeout(() => openModal('login'), 50)
    }

    return (
        <div className={styles.container}>
            <DefaultRouteLoader />
            <div className={styles.content}>
                <p className={styles.message}>
                    {t('auth.success_page.initializing')}
                </p>

                {debugInfo && (
                    <div className={styles.debugInfo}>
                        <p className={styles.debugTitle}>{t('auth.success_page.debug_info')}</p>
                        <pre className={styles.debugPre}>
                            {debugInfo}
                        </pre>
                        <button
                            onClick={handleRetry}
                            className={styles.retryButton}
                        >
                            {t('auth.success_page.back_to_home')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AuthSuccessPage
