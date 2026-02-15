import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/presentation/components/common'
import { ROUTES } from '@/domain/constants/routes.constants'
import styles from './AdminQuickActions.module.scss'

const AdminQuickActions: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className={styles['admin-quick-actions']}>
            <h2 className={styles['admin-quick-actions__title']}>{t('admin.dashboard.actions.title')}</h2>
            <div className={styles['admin-quick-actions__grid']}>
                <Card
                    className={styles['admin-quick-actions__card']}
                    onClick={() => navigate(ROUTES.ADMIN_USERS)}
                    hoverable
                >
                    <Users className={styles['admin-quick-actions__icon']} />
                    <h3 className={styles['admin-quick-actions__card-title']}>{t('admin.dashboard.actions.manage_users')}</h3>
                    <p className={styles['admin-quick-actions__description']}>
                        {t('admin.dashboard.actions.manage_users_desc')}
                    </p>
                </Card>

                <Card
                    className={styles['admin-quick-actions__card']}
                    onClick={() => navigate('/content/lessons')}
                    hoverable
                >
                    <FileText className={styles['admin-quick-actions__icon']} />
                    <h3 className={styles['admin-quick-actions__card-title']}>{t('admin.dashboard.actions.manage_content')}</h3>
                    <p className={styles['admin-quick-actions__description']}>
                        {t('admin.dashboard.actions.manage_content_desc')}
                    </p>
                </Card>

                <Card
                    className={styles['admin-quick-actions__card']}
                    onClick={() => {
                        // Analytics
                    }}
                    hoverable
                >
                    <BarChart3 className={styles['admin-quick-actions__icon']} />
                    <h3 className={styles['admin-quick-actions__card-title']}>{t('admin.dashboard.actions.analytics')}</h3>
                    <p className={styles['admin-quick-actions__description']}>
                        {t('admin.dashboard.actions.analytics_desc')}
                    </p>
                </Card>
            </div>
        </div>
    )
}

export default AdminQuickActions
