/**
 * Performance Dashboard Page - صفحة لوحة تحكم الأداء
 *
 * عرض شامل لمقاييس الأداء وإحصائياتها
 */

import React, { useEffect, useState, useCallback } from 'react'
import { Activity, TrendingUp, Clock, Zap, Server, Gauge } from 'lucide-react'
import {
  monitoringService,
  performanceService,
  type PerformanceStats,
  type WebVitals,
  type PerformanceMetrics,
} from '@/infrastructure/services'
import { Card } from '@/presentation/components/common'
import { LoadingState, ErrorState } from '../../components'
import './PerformanceDashboardPage.scss'

const PerformanceDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [webVitals, setWebVitals] = useState<WebVitals | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsData, webVitalsData, metricsData] = await Promise.all([
        monitoringService.getPerformanceStats(),
        Promise.resolve(performanceService.getWebVitals()),
        Promise.resolve(performanceService.getPerformanceMetrics()),
      ])

      setStats(statsData)
      setWebVitals(webVitalsData)
      setMetrics(metricsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    // Auto-refresh every 30 seconds
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(() => {
        loadData()
      }, 30000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, loadData])

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getPerformanceColor = (
    value: number,
    thresholds: { good: number; poor: number }
  ): string => {
    if (value <= thresholds.good) return 'good'
    if (value <= thresholds.poor) return 'warning'
    return 'poor'
  }

  if (loading && !stats) {
    return <LoadingState fullScreen message="جارٍ تحميل البيانات..." />
  }

  if (error && !stats) {
    return <ErrorState title="فشل تحميل البيانات" message={error} onRetry={loadData} />
  }

  if (!stats) {
    return null
  }

  return (
    <div className="performance-dashboard-page">
      <div className="performance-dashboard-page__header">
        <h1 className="performance-dashboard-page__title">
          <Activity className="performance-dashboard-page__title-icon" />
          لوحة تحكم الأداء
        </h1>
        <div className="performance-dashboard-page__controls">
          <label className="performance-dashboard-page__refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={e => setAutoRefresh(e.target.checked)}
            />
            <span>تحديث تلقائي</span>
          </label>
          <button
            className="performance-dashboard-page__refresh-btn"
            onClick={loadData}
            disabled={loading}
          >
            تحديث
          </button>
        </div>
      </div>

      {/* Web Vitals Section */}
      {webVitals && (
        <div className="performance-dashboard-page__web-vitals">
          <h2 className="performance-dashboard-page__section-title">Web Vitals</h2>
          <div className="performance-dashboard-page__vitals-grid">
            <Card className="performance-dashboard-page__vital-card">
              <div className="performance-dashboard-page__vital-header">
                <Gauge className="performance-dashboard-page__vital-icon" />
                <h3 className="performance-dashboard-page__vital-label">LCP</h3>
              </div>
              <p
                className={`performance-dashboard-page__vital-value performance-dashboard-page__vital-value--${getPerformanceColor(webVitals.lcp || 0, { good: 2500, poor: 4000 })}`}
              >
                {webVitals.lcp ? formatDuration(webVitals.lcp) : 'N/A'}
              </p>
              <p className="performance-dashboard-page__vital-desc">Largest Contentful Paint</p>
            </Card>

            <Card className="performance-dashboard-page__vital-card">
              <div className="performance-dashboard-page__vital-header">
                <Zap className="performance-dashboard-page__vital-icon" />
                <h3 className="performance-dashboard-page__vital-label">FID</h3>
              </div>
              <p
                className={`performance-dashboard-page__vital-value performance-dashboard-page__vital-value--${getPerformanceColor(webVitals.fid || 0, { good: 100, poor: 300 })}`}
              >
                {webVitals.fid ? formatDuration(webVitals.fid) : 'N/A'}
              </p>
              <p className="performance-dashboard-page__vital-desc">First Input Delay</p>
            </Card>

            <Card className="performance-dashboard-page__vital-card">
              <div className="performance-dashboard-page__vital-header">
                <TrendingUp className="performance-dashboard-page__vital-icon" />
                <h3 className="performance-dashboard-page__vital-label">CLS</h3>
              </div>
              <p
                className={`performance-dashboard-page__vital-value performance-dashboard-page__vital-value--${getPerformanceColor(webVitals.cls || 0, { good: 0.1, poor: 0.25 })}`}
              >
                {webVitals.cls ? webVitals.cls.toFixed(3) : 'N/A'}
              </p>
              <p className="performance-dashboard-page__vital-desc">Cumulative Layout Shift</p>
            </Card>

            <Card className="performance-dashboard-page__vital-card">
              <div className="performance-dashboard-page__vital-header">
                <Clock className="performance-dashboard-page__vital-icon" />
                <h3 className="performance-dashboard-page__vital-label">TTFB</h3>
              </div>
              <p
                className={`performance-dashboard-page__vital-value performance-dashboard-page__vital-value--${getPerformanceColor(webVitals.ttfb || 0, { good: 800, poor: 1800 })}`}
              >
                {webVitals.ttfb ? formatDuration(webVitals.ttfb) : 'N/A'}
              </p>
              <p className="performance-dashboard-page__vital-desc">Time to First Byte</p>
            </Card>

            {webVitals.fcp && (
              <Card className="performance-dashboard-page__vital-card">
                <div className="performance-dashboard-page__vital-header">
                  <Activity className="performance-dashboard-page__vital-icon" />
                  <h3 className="performance-dashboard-page__vital-label">FCP</h3>
                </div>
                <p
                  className={`performance-dashboard-page__vital-value performance-dashboard-page__vital-value--${getPerformanceColor(webVitals.fcp, { good: 1800, poor: 3000 })}`}
                >
                  {formatDuration(webVitals.fcp)}
                </p>
                <p className="performance-dashboard-page__vital-desc">First Contentful Paint</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Performance Statistics */}
      <div className="performance-dashboard-page__stats">
        <h2 className="performance-dashboard-page__section-title">إحصائيات API</h2>
        <div className="performance-dashboard-page__stats-grid">
          <Card className="performance-dashboard-page__stat-card">
            <div className="performance-dashboard-page__stat-content">
              <div className="performance-dashboard-page__stat-icon performance-dashboard-page__stat-icon--total">
                <Server />
              </div>
              <div className="performance-dashboard-page__stat-info">
                <h3 className="performance-dashboard-page__stat-label">إجمالي الطلبات</h3>
                <p className="performance-dashboard-page__stat-value">
                  {stats.totalRequests.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="performance-dashboard-page__stat-card">
            <div className="performance-dashboard-page__stat-content">
              <div className="performance-dashboard-page__stat-icon performance-dashboard-page__stat-icon--avg">
                <Clock />
              </div>
              <div className="performance-dashboard-page__stat-info">
                <h3 className="performance-dashboard-page__stat-label">متوسط وقت الاستجابة</h3>
                <p className="performance-dashboard-page__stat-value">
                  {formatDuration(stats.averageResponseTime)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="performance-dashboard-page__stat-card">
            <div className="performance-dashboard-page__stat-content">
              <div className="performance-dashboard-page__stat-icon performance-dashboard-page__stat-icon--p95">
                <TrendingUp />
              </div>
              <div className="performance-dashboard-page__stat-info">
                <h3 className="performance-dashboard-page__stat-label">P95 (95th Percentile)</h3>
                <p className="performance-dashboard-page__stat-value">
                  {formatDuration(stats.p95)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="performance-dashboard-page__stat-card">
            <div className="performance-dashboard-page__stat-content">
              <div className="performance-dashboard-page__stat-icon performance-dashboard-page__stat-icon--cache">
                <Zap />
              </div>
              <div className="performance-dashboard-page__stat-info">
                <h3 className="performance-dashboard-page__stat-label">معدل Cache Hit</h3>
                <p className="performance-dashboard-page__stat-value">
                  {stats.cacheHitRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Performance Metrics */}
      {metrics && metrics.memory && (
        <div className="performance-dashboard-page__metrics">
          <h2 className="performance-dashboard-page__section-title">مقاييس المتصفح</h2>
          <div className="performance-dashboard-page__metrics-grid">
            <Card className="performance-dashboard-page__metric-card">
              <h3 className="performance-dashboard-page__metric-title">استخدام الذاكرة</h3>
              <div className="performance-dashboard-page__metric-content">
                <div className="performance-dashboard-page__metric-item">
                  <span className="performance-dashboard-page__metric-label">المستخدمة:</span>
                  <span className="performance-dashboard-page__metric-value">
                    {formatBytes(metrics.memory.usedJSHeapSize)}
                  </span>
                </div>
                <div className="performance-dashboard-page__metric-item">
                  <span className="performance-dashboard-page__metric-label">الإجمالي:</span>
                  <span className="performance-dashboard-page__metric-value">
                    {formatBytes(metrics.memory.totalJSHeapSize)}
                  </span>
                </div>
                <div className="performance-dashboard-page__metric-item">
                  <span className="performance-dashboard-page__metric-label">الحد الأقصى:</span>
                  <span className="performance-dashboard-page__metric-value">
                    {formatBytes(metrics.memory.jsHeapSizeLimit)}
                  </span>
                </div>
              </div>
            </Card>

            {metrics.timing && (
              <Card className="performance-dashboard-page__metric-card">
                <h3 className="performance-dashboard-page__metric-title">أوقات التحميل</h3>
                <div className="performance-dashboard-page__metric-content">
                  <div className="performance-dashboard-page__metric-item">
                    <span className="performance-dashboard-page__metric-label">
                      DOM Content Loaded:
                    </span>
                    <span className="performance-dashboard-page__metric-value">
                      {formatDuration(metrics.timing.domContentLoaded)}
                    </span>
                  </div>
                  <div className="performance-dashboard-page__metric-item">
                    <span className="performance-dashboard-page__metric-label">Load Complete:</span>
                    <span className="performance-dashboard-page__metric-value">
                      {formatDuration(metrics.timing.loadComplete)}
                    </span>
                  </div>
                  {metrics.timing.firstPaint > 0 && (
                    <div className="performance-dashboard-page__metric-item">
                      <span className="performance-dashboard-page__metric-label">First Paint:</span>
                      <span className="performance-dashboard-page__metric-value">
                        {formatDuration(metrics.timing.firstPaint)}
                      </span>
                    </div>
                  )}
                  {metrics.timing.firstContentfulPaint > 0 && (
                    <div className="performance-dashboard-page__metric-item">
                      <span className="performance-dashboard-page__metric-label">
                        First Contentful Paint:
                      </span>
                      <span className="performance-dashboard-page__metric-value">
                        {formatDuration(metrics.timing.firstContentfulPaint)}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Slow Endpoints */}
      {stats.slowEndpoints.length > 0 && (
        <Card className="performance-dashboard-page__slow-endpoints">
          <h2 className="performance-dashboard-page__section-title">Endpoints البطيئة</h2>
          <div className="performance-dashboard-page__endpoints-list">
            {stats.slowEndpoints.map((endpoint, index) => (
              <div key={index} className="performance-dashboard-page__endpoint-item">
                <div className="performance-dashboard-page__endpoint-info">
                  <h3 className="performance-dashboard-page__endpoint-method">{endpoint.method}</h3>
                  <p className="performance-dashboard-page__endpoint-path">{endpoint.endpoint}</p>
                  <span className="performance-dashboard-page__endpoint-count">
                    {endpoint.count} طلب
                  </span>
                </div>
                <div className="performance-dashboard-page__endpoint-performance">
                  <p className="performance-dashboard-page__endpoint-duration">
                    {formatDuration(endpoint.averageDuration)}
                  </p>
                  <p className="performance-dashboard-page__endpoint-label">متوسط</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Trends */}
      <Card className="performance-dashboard-page__trends">
        <h2 className="performance-dashboard-page__section-title">الاتجاهات</h2>
        <div className="performance-dashboard-page__trends-grid">
          <div className="performance-dashboard-page__trend-item">
            <h3 className="performance-dashboard-page__trend-label">آخر ساعة</h3>
            <p className="performance-dashboard-page__trend-value">
              {stats.trend.last1h.toLocaleString()}
            </p>
          </div>
          <div className="performance-dashboard-page__trend-item">
            <h3 className="performance-dashboard-page__trend-label">آخر 24 ساعة</h3>
            <p className="performance-dashboard-page__trend-value">
              {stats.trend.last24h.toLocaleString()}
            </p>
          </div>
          <div className="performance-dashboard-page__trend-item">
            <h3 className="performance-dashboard-page__trend-label">آخر 7 أيام</h3>
            <p className="performance-dashboard-page__trend-value">
              {stats.trend.last7d.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PerformanceDashboardPage
