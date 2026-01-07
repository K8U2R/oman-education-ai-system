/**
 * Security Monitoring Page - صفحة مراقبة الأمان
 *
 * صفحة لمراقبة النظام في الوقت الفعلي (للمطورين فقط)
 */

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { useMonitoring } from '@/application/features/security'
import { useAuth, useRole } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState } from '../../components'
import './SecurityMonitoringPage.scss'

const SecurityMonitoringPage: React.FC = () => {
  const navigate = useNavigate()
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
      case 'healthy':
        return 'success'
      case 'warning':
        return 'warning'
      case 'error':
      case 'critical':
        return 'error'
      default:
        return 'success'
    }
  }

  const getHealthLabel = (status: string): string => {
    switch (status) {
      case 'healthy':
        return 'سليم'
      case 'warning':
        return 'تحذير'
      case 'error':
        return 'خطأ'
      case 'critical':
        return 'حرج'
      default:
        return 'غير معروف'
    }
  }

  if (authLoading || loading) {
    return <LoadingState fullScreen message="جاري تحميل مراقبة الأمان..." />
  }

  if (!user || !isDeveloper) {
    return null
  }

  return (
    <div className="security-monitoring-page">
      <PageHeader
        title="مراقبة الأمان"
        description="مراقبة النظام في الوقت الفعلي"
        icon={<Activity className="security-monitoring-page__header-icon" />}
        actions={
          <div className="security-monitoring-page__header-actions">
            <div className="security-monitoring-page__auto-refresh">
              <label className="security-monitoring-page__auto-refresh-label">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={e => setAutoRefresh(e.target.checked)}
                />
                <span>تحديث تلقائي</span>
              </label>
              {autoRefresh && (
                <select
                  value={refreshInterval}
                  onChange={e => setRefreshInterval(parseInt(e.target.value, 10))}
                  className="security-monitoring-page__interval-select"
                >
                  <option value={5}>كل 5 ثوان</option>
                  <option value={10}>كل 10 ثوان</option>
                  <option value={30}>كل 30 ثانية</option>
                  <option value={60}>كل دقيقة</option>
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
              تحديث
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
              <h3 className="security-monitoring-page__health-title">صحة النظام</h3>
              <p className="security-monitoring-page__health-description">حالة المكونات الأساسية</p>
            </div>
            <div className="security-monitoring-page__health-score">
              <div className="security-monitoring-page__health-score-value">
                {systemHealth.score}
              </div>
              <div className="security-monitoring-page__health-score-label">من 100</div>
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
                    {key === 'authentication' && (
                      <Shield className="security-monitoring-page__component-icon" />
                    )}
                    {key === 'sessions' && (
                      <Activity className="security-monitoring-page__component-icon" />
                    )}
                    {key === 'database' && (
                      <Database className="security-monitoring-page__component-icon" />
                    )}
                    {key === 'cache' && (
                      <Server className="security-monitoring-page__component-icon" />
                    )}
                    {key === 'api' && <Wifi className="security-monitoring-page__component-icon" />}
                    {key === 'websocket' && (
                      <Wifi className="security-monitoring-page__component-icon" />
                    )}
                    <span>{key}</span>
                  </div>
                  <Badge variant={getHealthVariant(component.status)} size="sm">
                    {getHealthLabel(component.status)}
                  </Badge>
                </div>
                <div className="security-monitoring-page__component-metrics">
                  <div className="security-monitoring-page__component-metric">
                    <span className="security-monitoring-page__component-metric-label">
                      Uptime:
                    </span>
                    <span className="security-monitoring-page__component-metric-value">
                      {Math.floor(component.uptime / 3600)}h{' '}
                      {Math.floor((component.uptime % 3600) / 60)}m
                    </span>
                  </div>
                  <div className="security-monitoring-page__component-metric">
                    <span className="security-monitoring-page__component-metric-label">
                      Response Time:
                    </span>
                    <span className="security-monitoring-page__component-metric-value">
                      {component.responseTime}ms
                    </span>
                  </div>
                  <div className="security-monitoring-page__component-metric">
                    <span className="security-monitoring-page__component-metric-label">
                      Error Rate:
                    </span>
                    <span className="security-monitoring-page__component-metric-value">
                      {component.errorRate.toFixed(2)}%
                    </span>
                  </div>
                </div>
                {component.lastError && (
                  <div className="security-monitoring-page__component-error">
                    <AlertTriangle className="security-monitoring-page__component-error-icon" />
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
            <div>
              <div className="security-monitoring-page__metric-label">الجلسات النشطة</div>
              <div className="security-monitoring-page__metric-value">
                {realTimeMetrics.activeSessions}
              </div>
              <div className="security-monitoring-page__metric-change">
                {realTimeMetrics.activeSessionsChange > 0 ? '+' : ''}
                {realTimeMetrics.activeSessionsChange}
              </div>
            </div>
          </Card>
          <Card className="security-monitoring-page__metric-card">
            <Shield className="security-monitoring-page__metric-icon" />
            <div>
              <div className="security-monitoring-page__metric-label">
                تسجيلات الدخول (آخر دقيقة)
              </div>
              <div className="security-monitoring-page__metric-value">
                {realTimeMetrics.loginsLastMinute}
              </div>
              <div className="security-monitoring-page__metric-change">
                نجاح: {realTimeMetrics.loginSuccessRate.toFixed(1)}%
              </div>
            </div>
          </Card>
          <Card className="security-monitoring-page__metric-card">
            <AlertTriangle className="security-monitoring-page__metric-icon" />
            <div>
              <div className="security-monitoring-page__metric-label">الأحداث (آخر دقيقة)</div>
              <div className="security-monitoring-page__metric-value">
                {realTimeMetrics.eventsLastMinute}
              </div>
              <div className="security-monitoring-page__metric-change">
                حرجة: {realTimeMetrics.criticalEventsLastMinute}
              </div>
            </div>
          </Card>
          <Card className="security-monitoring-page__metric-card">
            <Server className="security-monitoring-page__metric-icon" />
            <div>
              <div className="security-monitoring-page__metric-label">الطلبات (آخر دقيقة)</div>
              <div className="security-monitoring-page__metric-value">
                {realTimeMetrics.requestsLastMinute}
              </div>
              <div className="security-monitoring-page__metric-change">
                متوسط: {realTimeMetrics.averageResponseTime}ms
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Alert Thresholds */}
      <Card className="security-monitoring-page__thresholds-card">
        <div className="security-monitoring-page__thresholds-header">
          <div>
            <h3 className="security-monitoring-page__thresholds-title">عتبات التنبيه</h3>
            <p className="security-monitoring-page__thresholds-description">
              إدارة عتبات التنبيه الأمنية
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
            إدارة العتبات
          </Button>
        </div>
        <div className="security-monitoring-page__thresholds-list">
          {alertThresholds.length === 0 ? (
            <p className="security-monitoring-page__empty">لا توجد عتبات تنبيه</p>
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
                    {threshold.enabled ? 'مفعل' : 'معطل'}
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
                      ? 'حرج'
                      : threshold.severity === 'warning'
                        ? 'تحذير'
                        : 'معلومة'}
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
