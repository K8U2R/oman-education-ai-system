import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../../components/common'
import { ROUTES } from '@/domain/constants/routes.constants'

export const DashboardActions: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className="admin-dashboard-page__section">
            <h2 className="admin-dashboard-page__section-title">{t('admin.dashboard.actions.title')}</h2>
            <div className="admin-dashboard-page__quick-actions">
                <Card
                    className="admin-dashboard-page__action-card"
                    onClick={() => navigate(ROUTES.ADMIN_USERS)}
                    hoverable
                >
                    <Users className="admin-dashboard-page__action-icon" />
                    <h3 className="admin-dashboard-page__action-title">{t('admin.dashboard.actions.manage_users')}</h3>
                    <p className="admin-dashboard-page__action-description">
                        {t('admin.dashboard.actions.manage_users_desc')}
                    </p>
                </Card>

                <Card
                    className="admin-dashboard-page__action-card"
                    onClick={() => navigate('/content/lessons')}
                    hoverable
                >
                    <FileText className="admin-dashboard-page__action-icon" />
                    <h3 className="admin-dashboard-page__action-title">{t('admin.dashboard.actions.manage_content')}</h3>
                    <p className="admin-dashboard-page__action-description">
                        {t('admin.dashboard.actions.manage_content_desc')}
                    </p>
                </Card>

                <Card
                    className="admin-dashboard-page__action-card"
                    onClick={() => {
                        // Analytics
                    }}
                    hoverable
                >
                    <BarChart3 className="admin-dashboard-page__action-icon" />
                    <h3 className="admin-dashboard-page__action-title">{t('admin.dashboard.actions.analytics')}</h3>
                    <p className="admin-dashboard-page__action-description">
                        {t('admin.dashboard.actions.analytics_desc')}
                    </p>
                </Card>
            </div>
        </div>
    )
}
