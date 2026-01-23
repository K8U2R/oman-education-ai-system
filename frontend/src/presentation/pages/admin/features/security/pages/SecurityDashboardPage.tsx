/**
 * Security Dashboard Page - لوحة تحكم الأمان
 *
 * صفحة شاملة لإدارة ومراقبة الأمان في النظام
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { Shield, Activity, RefreshCw } from 'lucide-react'
import { Button } from '@/presentation/components/common'
import {
  SecurityStatCard,
  SecurityAlertsFeed,
  SessionsTable,
} from '@/presentation/components/security'
import { AdminPageLayout } from '@/presentation/pages/admin/core/components'
import { AdminLoadingState, AdminErrorState } from '@/presentation/pages/admin/shared/components'
import { useSecurityDashboard } from '../hooks'



const SecurityDashboardPage: React.FC = () => {
  const {
    canAccess,
    loading,
    error,
    stats,
    alerts,
    sessions,
    refresh,
    terminateSession,
    markAlertAsRead,
  } = useSecurityDashboard()

  if (loading) {
    return <AdminLoadingState message="جاري تحميل لوحة تحكم الأمان..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSession(sessionId)
      await refresh()
    } catch (_error) {
      // Error logging is handled by the error interceptor
    }
  }

  return (
    <AdminPageLayout
      title="لوحة تحكم الأمان"
      description="مراقبة وإدارة الأمان في النظام"
      icon={<Shield size={28} />}
      actions={
        <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
          تحديث
        </Button>
      }
    >
      <div className="security-dashboard-page">
        {/* Security Statistics */}
        {stats && (
          <div className="security-dashboard-page__stats-grid">
            <SecurityStatCard
              title="Active Sessions"
              value={stats.activeSessions || 0}
              icon={Activity}
              variant="default"
            />
            <SecurityStatCard
              title="Security Alerts"
              value={stats.securityAlerts || 0}
              icon={Shield}
              variant={stats.securityAlerts > 0 ? 'warning' : 'success'}
            />
            <SecurityStatCard
              title="Failed Login Attempts"
              value={stats.failedLoginAttempts || 0}
              icon={Shield}
              variant={stats.failedLoginAttempts > 5 ? 'danger' : 'default'}
            />
          </div>
        )}

        {/* Security Alerts */}
        {alerts && alerts.length > 0 && (
          <SecurityAlertsFeed
            alerts={alerts}
            onAcknowledge={markAlertAsRead}
            className="security-dashboard-page__alerts"
          />
        )}

        {/* Active Sessions */}
        {sessions && sessions.length > 0 && (
          <SessionsTable
            sessions={sessions}
            onTerminate={handleTerminateSession}
            className="security-dashboard-page__sessions"
          />
        )}
      </div>
    </AdminPageLayout>
  )
}

export default SecurityDashboardPage
