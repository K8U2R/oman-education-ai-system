import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../../components/common'

export const SystemHealth: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className="admin-dashboard-page__section">
            <h2 className="admin-dashboard-page__section-title">{t('admin.dashboard.health.title')}</h2>
            <Card className="admin-dashboard-page__health-card">
                <div className="admin-dashboard-page__health-status">
                    <div className="admin-dashboard-page__health-indicator admin-dashboard-page__health-indicator--healthy"></div>
                    <span className="admin-dashboard-page__health-text">{t('admin.dashboard.health.status_ok')}</span>
                </div>
                <div className="admin-dashboard-page__health-details">
                    <div className="admin-dashboard-page__health-item">
                        <span className="admin-dashboard-page__health-label">{t('admin.dashboard.health.db')}:</span>
                        <span className="admin-dashboard-page__health-value admin-dashboard-page__health-value--healthy">
                            {t('admin.dashboard.health.connected')}
                        </span>
                    </div>
                    <div className="admin-dashboard-page__health-item">
                        <span className="admin-dashboard-page__health-label">{t('admin.dashboard.health.server')}:</span>
                        <span className="admin-dashboard-page__health-value admin-dashboard-page__health-value--healthy">
                            {t('admin.dashboard.health.active')}
                        </span>
                    </div>
                    <div className="admin-dashboard-page__health-item">
                        <span className="admin-dashboard-page__health-label">{t('admin.dashboard.health.memory')}:</span>
                        <span className="admin-dashboard-page__health-value">75%</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
