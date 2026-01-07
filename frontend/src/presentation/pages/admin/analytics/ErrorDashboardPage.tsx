/**
 * Error Dashboard Page - صفحة لوحة تحكم الأخطاء
 *
 * عرض شامل للأخطاء وإحصائياتها
 */

import React, { useEffect, useState, useCallback } from 'react'
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Activity } from 'lucide-react'
import {
  monitoringService,
  type ErrorEntry,
  type ErrorStats,
} from '@/infrastructure/services/monitoring.service'
import { Card } from '@/presentation/components/common'
import { LoadingState, ErrorState } from '../../components'
import './ErrorDashboardPage.scss'

const ErrorDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<ErrorStats | null>(null)
  const [errors, setErrors] = useState<ErrorEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter] = useState<{
    category?: string
    severity?: string
    resolved?: boolean
  }>({})

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsData, errorsData] = await Promise.all([
        monitoringService.getErrorStats(),
        monitoringService.getErrors({ ...filter, limit: 20 }),
      ])

      setStats(statsData)
      setErrors(errorsData.errors)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleResolveError = async (errorId: string) => {
    try {
      await monitoringService.resolveError(errorId)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل حل الخطأ')
    }
  }

  if (loading) {
    return <LoadingState fullScreen message="جارٍ تحميل البيانات..." />
  }

  if (error && !stats) {
    return <ErrorState title="فشل تحميل البيانات" message={error} onRetry={loadData} />
  }

  if (!stats) {
    return null
  }

  return (
    <div className="error-dashboard-page">
      <div className="error-dashboard-page__header">
        <h1 className="error-dashboard-page__title">
          <AlertTriangle className="error-dashboard-page__title-icon" />
          لوحة تحكم الأخطاء
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="error-dashboard-page__stats">
        <Card className="error-dashboard-page__stat-card">
          <div className="error-dashboard-page__stat-content">
            <div className="error-dashboard-page__stat-icon error-dashboard-page__stat-icon--total">
              <Activity />
            </div>
            <div className="error-dashboard-page__stat-info">
              <h3 className="error-dashboard-page__stat-label">إجمالي الأخطاء</h3>
              <p className="error-dashboard-page__stat-value">{stats.total.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="error-dashboard-page__stat-card">
          <div className="error-dashboard-page__stat-content">
            <div className="error-dashboard-page__stat-icon error-dashboard-page__stat-icon--unresolved">
              <AlertTriangle />
            </div>
            <div className="error-dashboard-page__stat-info">
              <h3 className="error-dashboard-page__stat-label">أخطاء غير محلولة</h3>
              <p className="error-dashboard-page__stat-value">
                {stats.unresolved.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="error-dashboard-page__stat-card">
          <div className="error-dashboard-page__stat-content">
            <div className="error-dashboard-page__stat-icon error-dashboard-page__stat-icon--critical">
              <AlertTriangle />
            </div>
            <div className="error-dashboard-page__stat-info">
              <h3 className="error-dashboard-page__stat-label">أخطاء حرجة</h3>
              <p className="error-dashboard-page__stat-value">{stats.critical.length}</p>
            </div>
          </div>
        </Card>

        <Card className="error-dashboard-page__stat-card">
          <div className="error-dashboard-page__stat-content">
            <div className="error-dashboard-page__stat-icon error-dashboard-page__stat-icon--trend">
              <TrendingUp />
            </div>
            <div className="error-dashboard-page__stat-info">
              <h3 className="error-dashboard-page__stat-label">آخر 24 ساعة</h3>
              <p className="error-dashboard-page__stat-value">
                {stats.trend.last24h.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="error-dashboard-page__charts">
        <Card className="error-dashboard-page__chart-card">
          <h2 className="error-dashboard-page__chart-title">الأخطاء حسب الفئة</h2>
          <div className="error-dashboard-page__chart-content">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="error-dashboard-page__chart-item">
                <div className="error-dashboard-page__chart-label">{category}</div>
                <div className="error-dashboard-page__chart-bar">
                  <div
                    className="error-dashboard-page__chart-bar-fill"
                    style={{
                      width: `${(count / stats.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="error-dashboard-page__chart-value">{count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="error-dashboard-page__chart-card">
          <h2 className="error-dashboard-page__chart-title">الأخطاء حسب الخطورة</h2>
          <div className="error-dashboard-page__chart-content">
            {Object.entries(stats.bySeverity).map(([severity, count]) => (
              <div key={severity} className="error-dashboard-page__chart-item">
                <div className="error-dashboard-page__chart-label">{severity}</div>
                <div className="error-dashboard-page__chart-bar">
                  <div
                    className="error-dashboard-page__chart-bar-fill"
                    style={{
                      width: `${(count / stats.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="error-dashboard-page__chart-value">{count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Errors */}
      <Card className="error-dashboard-page__errors-card">
        <h2 className="error-dashboard-page__errors-title">الأخطاء الأخيرة</h2>
        <div className="error-dashboard-page__errors-list">
          {errors.length === 0 ? (
            <div className="error-dashboard-page__empty">
              <CheckCircle className="error-dashboard-page__empty-icon" />
              <p>لا توجد أخطاء</p>
            </div>
          ) : (
            errors.map(error => (
              <div
                key={error.id}
                className={`error-dashboard-page__error-item error-dashboard-page__error-item--${error.severity}`}
              >
                <div className="error-dashboard-page__error-header">
                  <div className="error-dashboard-page__error-info">
                    <h3 className="error-dashboard-page__error-message">{error.message}</h3>
                    <div className="error-dashboard-page__error-meta">
                      <span className="error-dashboard-page__error-category">{error.category}</span>
                      <span className="error-dashboard-page__error-severity">{error.severity}</span>
                      <span className="error-dashboard-page__error-occurrences">
                        {error.occurrences} مرة
                      </span>
                      <span className="error-dashboard-page__error-time">
                        <Clock className="error-dashboard-page__error-time-icon" />
                        {new Date(error.lastOccurrence).toLocaleString('ar-SA')}
                      </span>
                    </div>
                  </div>
                  {!error.resolved && (
                    <button
                      className="error-dashboard-page__error-resolve"
                      onClick={() => handleResolveError(error.id)}
                    >
                      <CheckCircle />
                      حل
                    </button>
                  )}
                </div>
                {error.stack && (
                  <details className="error-dashboard-page__error-details">
                    <summary>تفاصيل الخطأ</summary>
                    <pre className="error-dashboard-page__error-stack">{error.stack}</pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

export default ErrorDashboardPage
