/**
 * Security Analytics Page - صفحة تحليلات الأمان
 *
 * صفحة متقدمة لتحليل الأمان (للمطورين والإدارة فقط)
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, Download, RefreshCw, TrendingUp, Activity } from 'lucide-react'
import { Button, Card, Badge } from '../../../components/common'
import { useAnalytics } from '@/features/system-administration-portal'
import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import { LoadingState } from '@/presentation/pages/components'
import { loggingService } from '@/infrastructure/services'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader } from '../../components'
import type { AnalyticsPeriod } from '@/features/system-administration-portal'


const SecurityAnalyticsPage: React.FC = () => {
  const { t } = useTranslation()
  const { user, canAccess, getShouldRedirect, loadingState } = usePageAuth({
    requireAuth: true,
    requiredRole: 'developer',
    redirectTo: ROUTES.FORBIDDEN,
  })
  const { shouldShowLoading: pageShouldShowLoading, loadingMessage: pageLoadingMessage } =
    usePageLoading({
      isLoading: !canAccess,
      message: t('system.security.analytics.loading_page') || 'Loading Security Analytics Page...',
    })

  const {
    metrics,
    loginActivity,
    eventsTimeline,
    topIPs,
    topUsers,
    loading,
    error,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    exportReport,
    refresh,
  } = useAnalytics('7d')

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      await exportReport(format)
    } catch (err) {
      loggingService.error('Failed to export report', err as Error)
    }
  }

  const { shouldShowLoading: analyticsShouldShowLoading, loadingMessage: analyticsLoadingMessage } =
    usePageLoading({
      isLoading: loading && !metrics,
      message: t('system.security.analytics.loading_data') || 'Loading Security Analytics...',
    })

  if (getShouldRedirect()) {
    return null
  }

  if (!canAccess || pageShouldShowLoading || loadingState.shouldShowLoading) {
    return <LoadingState fullScreen message={pageLoadingMessage || loadingState.loadingMessage} />
  }

  if (analyticsShouldShowLoading) {
    return <LoadingState fullScreen message={analyticsLoadingMessage} />
  }

  if (!user) {
    return null
  }

  return (
    <div className="security-analytics-page">
      <PageHeader
        title={t('system.security.analytics.title')}
        description={t('system.security.analytics.description')}
        icon={<BarChart3 className="security-analytics-page__header-icon" />}
        actions={
          <div className="security-analytics-page__header-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              leftIcon={<Download />}
              disabled={loading}
            >
              {t('system.security.analytics.export_csv')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
              leftIcon={<Download />}
              disabled={loading}
            >
              {t('system.security.analytics.export_excel')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              leftIcon={<RefreshCw />}
              disabled={loading}
            >
              {t('admin.whitelist.actions.refresh')}
            </Button>
          </div>
        }
      />

      {error && (
        <div className="security-analytics-page__error">
          <span>{error}</span>
        </div>
      )}

      {/* Period Selector */}
      <Card className="security-analytics-page__period-selector">
        <div className="security-analytics-page__period-group">
          <label className="security-analytics-page__period-label">{t('system.security.analytics.period.label')}</label>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as AnalyticsPeriod)}
            className="security-analytics-page__period-select"
          >
            <option value="1h">{t('system.security.analytics.period.1h')}</option>
            <option value="24h">{t('system.security.analytics.period.24h')}</option>
            <option value="7d">{t('system.security.analytics.period.7d')}</option>
            <option value="30d">{t('system.security.analytics.period.30d')}</option>
            <option value="90d">{t('system.security.analytics.period.90d')}</option>
            <option value="custom">{t('system.security.analytics.period.custom')}</option>
          </select>
          {period === 'custom' && (
            <div className="security-analytics-page__custom-dates">
              <input
                type="date"
                value={startDate || ''}
                onChange={e => setStartDate(e.target.value)}
                className="security-analytics-page__date-input"
              />
              <span>{t('system.security.analytics.period.to')}</span>
              <input
                type="date"
                value={endDate || ''}
                onChange={e => setEndDate(e.target.value)}
                className="security-analytics-page__date-input"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Metrics Overview */}
      {metrics && (
        <div className="security-analytics-page__metrics">
          <Card className="security-analytics-page__metric-card">
            <TrendingUp className="security-analytics-page__metric-icon" />
            <div>
              <div className="security-analytics-page__metric-label">{t('system.security.analytics.metrics.login_success')}</div>
              <div className="security-analytics-page__metric-value">
                {metrics.loginSuccessRate.toFixed(1)}%
              </div>
            </div>
          </Card>
          <Card className="security-analytics-page__metric-card">
            <Activity className="security-analytics-page__metric-icon" />
            <div>
              <div className="security-analytics-page__metric-label">{t('system.security.analytics.metrics.total_events')}</div>
              <div className="security-analytics-page__metric-value">{metrics.totalEvents}</div>
            </div>
          </Card>
          <Card className="security-analytics-page__metric-card">
            <BarChart3 className="security-analytics-page__metric-icon" />
            <div>
              <div className="security-analytics-page__metric-label">{t('system.security.analytics.metrics.critical_events')}</div>
              <div className="security-analytics-page__metric-value security-analytics-page__metric-value--danger">
                {metrics.criticalEvents}
              </div>
            </div>
          </Card>
          <Card className="security-analytics-page__metric-card">
            <Activity className="security-analytics-page__metric-icon" />
            <div>
              <div className="security-analytics-page__metric-label">{t('system.security.analytics.metrics.unique_ips')}</div>
              <div className="security-analytics-page__metric-value">{metrics.uniqueIPs}</div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="security-analytics-page__charts">
        <Card className="security-analytics-page__chart-card">
          <h3 className="security-analytics-page__chart-title">{t('system.security.analytics.charts.login_activity')}</h3>
          <div className="security-analytics-page__chart-placeholder">
            {/* TODO: Add LoginActivityChart Component */}
            <p>Login activity chart will appear here</p>
            <pre>{JSON.stringify(loginActivity.slice(0, 5), null, 2)}</pre>
          </div>
        </Card>

        <Card className="security-analytics-page__chart-card">
          <h3 className="security-analytics-page__chart-title">{t('system.security.analytics.charts.events_timeline')}</h3>
          <div className="security-analytics-page__chart-placeholder">
            {/* TODO: Add EventsTimelineChart Component */}
            <p>Events timeline chart will appear here</p>
            <pre>{JSON.stringify(eventsTimeline.slice(0, 5), null, 2)}</pre>
          </div>
        </Card>
      </div>

      {/* Top IPs & Users */}
      <div className="security-analytics-page__analysis">
        <Card className="security-analytics-page__analysis-card">
          <h3 className="security-analytics-page__analysis-title">{t('system.security.analytics.charts.top_ips')}</h3>
          <div className="security-analytics-page__analysis-list">
            {topIPs.length === 0 ? (
              <p className="security-analytics-page__empty">{t('admin.whitelist.messages.load_success', { count: 0 })}</p> // Using generic empty or load success 0
            ) : (
              topIPs.slice(0, 10).map(ip => (
                <div key={ip.ipAddress} className="security-analytics-page__analysis-item">
                  <div>
                    <code className="security-analytics-page__ip-address">{ip.ipAddress}</code>
                    {ip.country && (
                      <span className="security-analytics-page__ip-location">{ip.country}</span>
                    )}
                  </div>
                  <div className="security-analytics-page__ip-stats">
                    <span>{t('system.security.analytics.charts.requests')}: {ip.totalRequests}</span>
                    <Badge
                      variant={
                        ip.riskLevel === 'high'
                          ? 'error'
                          : ip.riskLevel === 'medium'
                            ? 'warning'
                            : 'success'
                      }
                      size="sm"
                    >
                      {ip.riskLevel === 'high'
                        ? t('system.security.analytics.charts.risk.high')
                        : ip.riskLevel === 'medium'
                          ? t('system.security.analytics.charts.risk.medium')
                          : t('system.security.analytics.charts.risk.low')}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="security-analytics-page__analysis-card">
          <h3 className="security-analytics-page__analysis-title">{t('system.security.analytics.charts.top_users')}</h3>
          <div className="security-analytics-page__analysis-list">
            {topUsers.length === 0 ? (
              <p className="security-analytics-page__empty">{t('admin.whitelist.messages.load_success', { count: 0 })}</p>
            ) : (
              topUsers.slice(0, 10).map(user => (
                <div key={user.userId} className="security-analytics-page__analysis-item">
                  <div>
                    <div className="security-analytics-page__user-name">{user.userName}</div>
                    <div className="security-analytics-page__user-email">{user.userEmail}</div>
                  </div>
                  <div className="security-analytics-page__user-stats">
                    <span>{t('system.security.analytics.charts.sessions')}: {user.totalSessions}</span>
                    <Badge
                      variant={
                        user.riskLevel === 'high'
                          ? 'error'
                          : user.riskLevel === 'medium'
                            ? 'warning'
                            : 'success'
                      }
                      size="sm"
                    >
                      {user.riskLevel === 'high'
                        ? t('system.security.analytics.charts.risk.high')
                        : user.riskLevel === 'medium'
                          ? t('system.security.analytics.charts.risk.medium')
                          : t('system.security.analytics.charts.risk.low')}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SecurityAnalyticsPage
