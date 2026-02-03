/**
 * Error Dashboard Page - صفحة لوحة تحكم الأخطاء
 *
 * عرض شامل للأخطاء وإحصائياتها
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react'
import { AdminStatsCard } from '../../../core/components'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useErrorDashboard } from '../hooks'
import { formatAdminNumber as formatNumber } from '../../../core/utils/formatting.util'


const ErrorDashboardPage: React.FC = () => {
  const { canAccess, loading, error, stats, errors, refresh, resolveError } = useErrorDashboard()

  if (loading) {
    return <AdminLoadingState message="جارٍ تحميل البيانات..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="فشل تحميل البيانات" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  if (!stats) {
    return null
  }

  return (
    <AdminPageLayout
      title="لوحة تحكم الأخطاء"
      description="عرض شامل للأخطاء وإحصائياتها"
      icon={<AlertTriangle size={28} />}
    >
      <div className="error-dashboard-page">
        {/* Statistics */}
        <div className="error-dashboard-page__stats-grid">
          <AdminStatsCard
            title="Total Errors"
            value={formatNumber(stats.total)}
            icon={<AlertTriangle />}
            variant="danger"
          />
          <AdminStatsCard
            title="Resolved"
            value={formatNumber(stats.total - stats.unresolved)}
            icon={<CheckCircle />}
            variant="success"
          />
          <AdminStatsCard
            title="Pending"
            value={formatNumber(stats.unresolved)}
            icon={<Clock />}
            variant="warning"
          />
          <AdminStatsCard
            title="Critical"
            value={formatNumber(
              Array.isArray(stats.critical) ? stats.critical.length : stats.critical || 0
            )}
            icon={<Activity />}
            variant="danger"
          />
        </div>

        {/* Errors List */}
        {errors.length > 0 && (
          <div className="error-dashboard-page__errors-list">
            {errors.map(errorEntry => (
              <div key={errorEntry.id} className="error-dashboard-page__error-item">
                <h4>{errorEntry.message}</h4>
                <p>{errorEntry.stack}</p>
                <button onClick={() => resolveError(errorEntry.id)}>Resolve</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  )
}

export default ErrorDashboardPage
