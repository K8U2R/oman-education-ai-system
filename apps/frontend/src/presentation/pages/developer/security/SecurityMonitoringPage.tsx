/**
 * Security Monitoring Page - صفحة مراقبة الأمان
 *
 * صفحة لمراقبة النظام في الوقت الفعلي (للمطورين فقط)
 */

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Activity,
  RefreshCw,
  Settings,
  AlertTriangle,
  Server,
  Database,
  Wifi,
  Shield,
} from 'lucide-react'
import { Button, Card, Badge } from '../../../components/common'
import { useMonitoring } from '@/features/system-administration-portal'
import { useAuth, useRole } from '@/features/user-authentication-management'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState } from '../../components'




const SecurityMonitoringPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { isDeveloper } = useRole()
  const {
    systemHealth,
    realTimeMetrics,
    alertThresholds,
    loading,
    error,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    refresh,
  } = useMonitoring(true, 5)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN)
    } else if (!authLoading && !isDeveloper) {
      navigate(ROUTES.FORBIDDEN)
    }
  }, [authLoading, isAuthenticated, isDeveloper, navigate])

  const getHealthVariant = (status: string): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'healthy': return 'success'
      case 'warning': return 'warning'
      case 'error':
      case 'critical': return 'error'
      default: return 'success'
    }
  }

  const getHealthLabel = (status: string): string => {
    switch (status) {
      case 'healthy': return t('admin.dashboard.stats.healthy')
      case 'warning': return t('admin.dashboard.stats.warning')
      case 'error': return t('admin.dashboard.stats.error')
      case 'critical': return t('system.security.monitoring.metrics.critical')
      default: return t('admin.dashboard.stats.unknown') || status
    }
  }

  if (authLoading || loading) {
    return <LoadingState fullScreen message={t('system.security.monitoring.loading_title') || "Loading Security Monitoring..."} />
  }

  if (!user || !isDeveloper) {
    return null
  }

  return (
    <div className="security-monitoring-page">
      <PageHeader
        title={t('system.security.monitoring.title')}
        description={t('system.security.monitoring.description')}
        icon={<Activity className="w-6 h-6 text-primary" />}
        actions={
          <div className="security-monitoring-page__header-actions">
            <div className="security-monitoring-page__auto-refresh">
              <label className="security-monitoring-page__auto-refresh-label">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={e => setAutoRefresh(e.target.checked)}
                />
                <span>{t('system.security.monitoring.auto_refresh')}</span>
              </label>
              {autoRefresh && (
                <select
                  value={refreshInterval}
                  onChange={e => setRefreshInterval(parseInt(e.target.value, 10))}
                  className="security-monitoring-page__interval-select"
                >
                  <option value={5}>{t('system.security.monitoring.refresh_interval.5s')}</option>
                  <option value={10}>{t('system.security.monitoring.refresh_interval.10s')}</option>
                  <option value={30}>{t('system.security.monitoring.refresh_interval.30s')}</option>
                  <option value={60}>{t('system.security.monitoring.refresh_interval.1m')}</option>
                </select>
              )}
            </div>
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
        <div className="security-monitoring-page__error">
          <AlertTriangle className="security-monitoring-page__error-icon" />
          <span>{error}</span>
        </div>
      )}

      {/* System Health Overview */}
      {systemHealth && (
        <Card className="security-monitoring-page__health-card">
          <div className="security-monitoring-page__health-header">
            <div>
              <h3 className="security-monitoring-page__health-title">{t('system.security.monitoring.health.title')}</h3>
              <p className="security-monitoring-page__health-description">{t('system.security.monitoring.health.desc')}</p>
            </div>
            <div className="security-monitoring-page__health-score">
              <div className="security-monitoring-page__health-score-value">{systemHealth.score}</div>
              <div className="security-monitoring-page__health-score-label">{t('system.security.monitoring.health.score_label')}</div>
            </div>
          </div>
          <div className="security-monitoring-page__health-status">
            <Badge variant={getHealthVariant(systemHealth.overall)} size="lg">
              {getHealthLabel(systemHealth.overall)}
            </Badge>
          </div>
          <div className="security-monitoring-page__components">
            {Object.entries(systemHealth.components).map(([key, component]) => (
              <div key={key} className="security-monitoring-page__component">
                <div className="security-monitoring-page__component-header">
                  <div className="security-monitoring-page__component-name">
                    {key === 'authentication' && <Shield className="security-monitoring-page__component-icon" />}
                    {key === 'sessions' && <Activity className="security-monitoring-page__component-icon" />}
                    {key === 'database' && <Database className="security-monitoring-page__component-icon" />}
                    {key === 'cache' && <Server className="security-monitoring-page__component-icon" />}
                    {key === 'api' && <Wifi className="security-monitoring-page__component-icon" />}
                    {key === 'websocket' && <Wifi className="security-monitoring-page__component-icon" />}
                    <span>{key}</span>
                  </div>
                  <Badge variant={getHealthVariant(component.status)} size="sm">
                    {getHealthLabel(component.status)}
                  </Badge>
                </div>
                <div className="security-monitoring-page__component-metrics">
                  <div className="security-monitoring-page__component-metric">
                    <span className="security-monitoring-page__component-metric-label">
                      {t('system.security.monitoring.health.uptime')}:
                    </span>
                    <span className="security-monitoring-page__component-metric-value">
                      {Math.floor(component.uptime / 3600)}h{' '}
                      {Math.floor((component.uptime % 3600) / 60)}m
                    </span>
                  </div>
                  <div className="security-monitoring-page__component-metric">
                    <span className="security-monitoring-page__component-metric-label">
                      {t('system.security.monitoring.health.response_time')}:
                    </span>
                    <span className="security-monitoring-page__component-metric-value">
                      {component.responseTime}ms
                    </span>
                  </div>
                  <div className="security-monitoring-page__component-metric">
                    <span className="security-monitoring-page__component-metric-label">
                      {t('system.security.monitoring.health.error_rate')}:
                    </span>
                    <span className="security-monitoring-page__component-metric-value">
                      {component.errorRate.toFixed(2)}%
                    </span>
                  </div>
                </div>
                {component.lastError && (
                  <div className="security-monitoring-page__component-error">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span>{component.lastError}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Real-time Metrics */}
      {realTimeMetrics && (
        <div className="security-monitoring-page__metrics">
          <Card className="security-monitoring-page__metric-card">
            <Activity className="security-monitoring-page__metric-icon" />
            <div className="security-monitoring-page__metric-content">
              <div className="security-monitoring-page__metric-label">{t('system.security.monitoring.metrics.active_sessions')}</div>
              <div className="security-monitoring-page__metric-value">{realTimeMetrics.activeSessions}</div>
              <div className="security-monitoring-page__metric-change">
                {realTimeMetrics.activeSessionsChange > 0 ? '+' : ''}
                {realTimeMetrics.activeSessionsChange}
              </div>
            </div>
          </Card>
          <Card className="security-monitoring-page__metric-card">
            <Shield className="security-monitoring-page__metric-icon" />
            <div className="security-monitoring-page__metric-content">
              <div className="security-monitoring-page__metric-label">{t('system.security.monitoring.metrics.logins')}</div>
              <div className="security-monitoring-page__metric-value">{realTimeMetrics.loginsLastMinute}</div>
              <div className="security-monitoring-page__metric-change">
                {t('system.security.monitoring.metrics.success_rate')}: {realTimeMetrics.loginSuccessRate.toFixed(1)}%
              </div>
            </div>
          </Card>
          <Card className="security-monitoring-page__metric-card">
            <AlertTriangle className="security-monitoring-page__metric-icon" />
            <div className="security-monitoring-page__metric-content">
              <div className="security-monitoring-page__metric-label">{t('system.security.monitoring.metrics.events')}</div>
              <div className="security-monitoring-page__metric-value">{realTimeMetrics.eventsLastMinute}</div>
              <div className="security-monitoring-page__metric-change">
                {t('system.security.monitoring.metrics.critical')}: {realTimeMetrics.criticalEventsLastMinute}
              </div>
            </div>
          </Card>
          <Card className="security-monitoring-page__metric-card">
            <Server className="security-monitoring-page__metric-icon" />
            <div className="security-monitoring-page__metric-content">
              <div className="security-monitoring-page__metric-label">{t('system.security.monitoring.metrics.requests')}</div>
              <div className="security-monitoring-page__metric-value">{realTimeMetrics.requestsLastMinute}</div>
              <div className="security-monitoring-page__metric-change">
                {t('system.security.monitoring.metrics.avg_time')}: {realTimeMetrics.averageResponseTime}ms
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Alert Thresholds */}
      <Card className="security-monitoring-page__thresholds-card">
        <div className="security-monitoring-page__thresholds-header">
          <div>
            <h3 className="security-monitoring-page__thresholds-title">{t('system.security.monitoring.thresholds.title')}</h3>
            <p className="security-monitoring-page__thresholds-description">
              {t('system.security.monitoring.thresholds.desc')}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Open create threshold modal
            }}
            leftIcon={<Settings />}
          >
            {t('system.security.monitoring.thresholds.manage')}
          </Button>
        </div>
        <div className="security-monitoring-page__thresholds-list">
          {alertThresholds.length === 0 ? (
            <p className="security-monitoring-page__empty">{t('system.security.monitoring.thresholds.empty')}</p>
          ) : (
            alertThresholds.map(threshold => (
              <div key={threshold.id} className="security-monitoring-page__threshold-item">
                <div className="security-monitoring-page__threshold-info">
                  <div className="security-monitoring-page__threshold-name">{threshold.name}</div>
                  <div className="security-monitoring-page__threshold-metric">
                    {threshold.metric} {threshold.operator} {threshold.value}
                  </div>
                </div>
                <div className="security-monitoring-page__threshold-status">
                  <Badge variant={threshold.enabled ? 'success' : 'default'} size="sm">
                    {threshold.enabled ? t('admin.users.status.active') : t('admin.users.status.inactive')}
                  </Badge>
                  <Badge
                    variant={
                      threshold.severity === 'critical'
                        ? 'error'
                        : threshold.severity === 'warning'
                          ? 'warning'
                          : 'info'
                    }
                    size="sm"
                  >
                    {threshold.severity === 'critical'
                      ? t('system.security.monitoring.metrics.critical')
                      : threshold.severity === 'warning'
                        ? t('admin.dashboard.stats.warning')
                        : 'Info'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

export default SecurityMonitoringPage
