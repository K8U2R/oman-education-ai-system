import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/presentation/components/common'
import styles from './AdminSystemHealth.module.scss'

const AdminSystemHealth: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className={styles['admin-system-health']}>
            <h2 className={styles['admin-system-health__title']}>{t('admin.dashboard.health.title')}</h2>
            <Card className={styles['admin-system-health__card']}>
                <div className={styles['admin-system-health__status']}>
                    <div className={`${styles['admin-system-health__indicator']} ${styles['admin-system-health__indicator--healthy']}`}></div>
                    <span className={styles['admin-system-health__text']}>{t('admin.dashboard.health.status_ok')}</span>
                </div>
                <div className={styles['admin-system-health__details']}>
                    <div className={styles['admin-system-health__item']}>
                        <span className={styles['admin-system-health__label']}>{t('admin.dashboard.health.db')}:</span>
                        <span className={`${styles['admin-system-health__value']} ${styles['admin-system-health__value--healthy']}`}>
                            {t('admin.dashboard.health.connected')}
                        </span>
                    </div>
                    <div className={styles['admin-system-health__item']}>
                        <span className={styles['admin-system-health__label']}>{t('admin.dashboard.health.server')}:</span>
                        <span className={`${styles['admin-system-health__value']} ${styles['admin-system-health__value--healthy']}`}>
                            {t('admin.dashboard.health.active')}
                        </span>
                    </div>
                    <div className={styles['admin-system-health__item']}>
                        <span className={styles['admin-system-health__label']}>{t('admin.dashboard.health.memory')}:</span>
                        <span className={styles['admin-system-health__value']}>75%</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default AdminSystemHealth
