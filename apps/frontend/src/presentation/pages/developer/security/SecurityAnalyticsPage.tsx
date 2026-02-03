/**
 * Security Analytics Page - صفحة تحليلات الأمان
 *
 * صفحة متقدمة لتحليل الأمان (للمطورين والإدارة فقط)
 */

import React from 'react'
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
  const { user, canAccess, getShouldRedirect, loadingState } = usePageAuth({
    requireAuth: true,
    requiredRole: 'developer',
    redirectTo: ROUTES.FORBIDDEN,
  })
  const { shouldShowLoading: pageShouldShowLoading, loadingMessage: pageLoadingMessage } =
    usePageLoading({
      isLoading: !canAccess,
      message: 'جاري تحميل صفحة تحليلات الأمان...',
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
      message: 'جاري تحميل تحليلات الأمان...',
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
        title="تحليلات الأمان"
        description="تحليل متقدم للأمان والأنماط"
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
              تصدير CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
              leftIcon={<Download />}
              disabled={loading}
            >
              تصدير Excel
            </Button>
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
        <div className="security-analytics-page__error">
          <span>{error}</span>
        </div>
      )}

      {/* Period Selector */}
      <Card className="security-analytics-page__period-selector">
        <div className="security-analytics-page__period-group">
          <label className="security-analytics-page__period-label">الفترة الزمنية:</label>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as AnalyticsPeriod)}
            className="security-analytics-page__period-select"
          >
            <option value="1h">آخر ساعة</option>
            <option value="24h">آخر 24 ساعة</option>
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 90 يوم</option>
            <option value="custom">مخصص</option>
          </select>
          {period === 'custom' && (
            <div className="security-analytics-page__custom-dates">
              <input
                type="date"
                value={startDate || ''}
                onChange={e => setStartDate(e.target.value)}
                className="security-analytics-page__date-input"
              />
              <span>إلى</span>
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
              <div className="security-analytics-page__metric-label">معدل نجاح تسجيل الدخول</div>
              <div className="security-analytics-page__metric-value">
                {metrics.loginSuccessRate.toFixed(1)}%
              </div>
            </div>
          </Card>
          <Card className="security-analytics-page__metric-card">
            <Activity className="security-analytics-page__metric-icon" />
            <div>
              <div className="security-analytics-page__metric-label">إجمالي الأحداث</div>
              <div className="security-analytics-page__metric-value">{metrics.totalEvents}</div>
            </div>
          </Card>
          <Card className="security-analytics-page__metric-card">
            <BarChart3 className="security-analytics-page__metric-icon" />
            <div>
              <div className="security-analytics-page__metric-label">الأحداث الحرجة</div>
              <div className="security-analytics-page__metric-value security-analytics-page__metric-value--danger">
                {metrics.criticalEvents}
              </div>
            </div>
          </Card>
          <Card className="security-analytics-page__metric-card">
            <Activity className="security-analytics-page__metric-icon" />
            <div>
              <div className="security-analytics-page__metric-label">عناوين IP فريدة</div>
              <div className="security-analytics-page__metric-value">{metrics.uniqueIPs}</div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="security-analytics-page__charts">
        <Card className="security-analytics-page__chart-card">
          <h3 className="security-analytics-page__chart-title">نشاط تسجيل الدخول</h3>
          <div className="security-analytics-page__chart-placeholder">
            {/* TODO: إضافة LoginActivityChart Component */}
            <p>مخطط نشاط تسجيل الدخول سيظهر هنا</p>
            <pre>{JSON.stringify(loginActivity.slice(0, 5), null, 2)}</pre>
          </div>
        </Card>

        <Card className="security-analytics-page__chart-card">
          <h3 className="security-analytics-page__chart-title">خط زمني الأحداث</h3>
          <div className="security-analytics-page__chart-placeholder">
            {/* TODO: إضافة EventsTimelineChart Component */}
            <p>مخطط خط زمني الأحداث سيظهر هنا</p>
            <pre>{JSON.stringify(eventsTimeline.slice(0, 5), null, 2)}</pre>
          </div>
        </Card>
      </div>

      {/* Top IPs & Users */}
      <div className="security-analytics-page__analysis">
        <Card className="security-analytics-page__analysis-card">
          <h3 className="security-analytics-page__analysis-title">أهم عناوين IP</h3>
          <div className="security-analytics-page__analysis-list">
            {topIPs.length === 0 ? (
              <p className="security-analytics-page__empty">لا توجد بيانات</p>
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
                    <span>طلبات: {ip.totalRequests}</span>
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
                        ? 'عالي'
                        : ip.riskLevel === 'medium'
                          ? 'متوسط'
                          : 'منخفض'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="security-analytics-page__analysis-card">
          <h3 className="security-analytics-page__analysis-title">أهم المستخدمين</h3>
          <div className="security-analytics-page__analysis-list">
            {topUsers.length === 0 ? (
              <p className="security-analytics-page__empty">لا توجد بيانات</p>
            ) : (
              topUsers.slice(0, 10).map(user => (
                <div key={user.userId} className="security-analytics-page__analysis-item">
                  <div>
                    <div className="security-analytics-page__user-name">{user.userName}</div>
                    <div className="security-analytics-page__user-email">{user.userEmail}</div>
                  </div>
                  <div className="security-analytics-page__user-stats">
                    <span>جلسات: {user.totalSessions}</span>
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
                        ? 'عالي'
                        : user.riskLevel === 'medium'
                          ? 'متوسط'
                          : 'منخفض'}
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
