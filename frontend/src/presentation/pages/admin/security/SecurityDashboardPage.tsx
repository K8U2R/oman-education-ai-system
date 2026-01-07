/**
 * Security Dashboard Page - لوحة تحكم الأمان
 *
 * صفحة شاملة لإدارة ومراقبة الأمان في النظام (للمسؤولين فقط)
 */

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  Activity,
  AlertTriangle,
  Lock,
  Users,
  RefreshCw,
  Globe,
  Settings,
  FileText,
} from 'lucide-react'
import { Button } from '../../../components/common'
import { SecurityStatCard, SecurityAlertsFeed, SessionsTable } from '../../../components/security'
import { useSecurity, useSessions } from '@/application/features/security'
import { useAuth, useRole } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState } from '../../components'
import type { Session } from '@/application/features/security/types'
import './SecurityDashboardPage.scss'

const SecurityDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { isAdmin } = useRole()
  const {
    stats,
    alerts,
    loading: securityLoading,
    error: securityError,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refresh: _refresh,
    refreshStats,
    refreshAlerts,
    markAlertAsRead,
  } = useSecurity()
  const {
    sessions,
    loading: sessionsLoading,
    loadSessions,
    terminateSession,
    loadSessionDetails,
  } = useSessions()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN)
    } else if (!authLoading && !isAdmin) {
      navigate(ROUTES.FORBIDDEN)
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate])

  const handleRefresh = async () => {
    await Promise.all([refreshStats(), refreshAlerts(), loadSessions()])
  }

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSession(sessionId)
      await loadSessions()
    } catch (error) {
      // Error logging is handled by the error interceptor
    }
  }

  const handleViewSessionDetails = (session: Session) => {
    loadSessionDetails(session.id)
    // TODO: Open modal or navigate to details page
  }

  if (authLoading || securityLoading) {
    return <LoadingState fullScreen message="جاري تحميل لوحة تحكم الأمان..." />
  }

  if (!user || !isAdmin) {
    return null
  }

  const getHealthVariant = (health: string): 'success' | 'warning' | 'danger' => {
    switch (health) {
      case 'healthy':
        return 'success'
      case 'warning':
        return 'warning'
      case 'error':
        return 'danger'
      default:
        return 'success'
    }
  }

  const getHealthLabel = (health: string): string => {
    switch (health) {
      case 'healthy':
        return 'سليم'
      case 'warning':
        return 'تحذير'
      case 'error':
        return 'خطأ'
      default:
        return 'غير معروف'
    }
  }

  return (
    <div className="security-dashboard-page">
      <PageHeader
        title="لوحة تحكم الأمان"
        description="مراقبة وإدارة الأمان في النظام"
        icon={<Shield className="security-dashboard-page__header-icon" />}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            leftIcon={<RefreshCw />}
            disabled={securityLoading || sessionsLoading}
          >
            تحديث
          </Button>
        }
      />

      {securityError && (
        <div className="security-dashboard-page__error">
          <AlertTriangle className="security-dashboard-page__error-icon" />
          <span>{securityError}</span>
        </div>
      )}

      {/* Security Stats Cards */}
      <div className="security-dashboard-page__stats">
        <SecurityStatCard
          title="الجلسات النشطة"
          value={stats?.activeSessions || 0}
          change={stats?.activeSessionsChange}
          changeLabel="من الأمس"
          icon={Users}
          variant="success"
        />
        <SecurityStatCard
          title="محاولات الدخول الفاشلة"
          value={stats?.failedLoginAttempts24h || 0}
          change={stats?.failedLoginAttemptsChange}
          changeLabel="آخر 24 ساعة"
          icon={AlertTriangle}
          variant="warning"
        />
        <SecurityStatCard
          title="تنبيهات الأمان"
          value={stats?.securityAlerts || 0}
          change={stats?.securityAlertsChange}
          changeLabel="جديدة"
          icon={Lock}
          variant="danger"
        />
        <SecurityStatCard
          title="حالة النظام"
          value={getHealthLabel(stats?.systemHealth || 'healthy')}
          icon={Activity}
          variant={getHealthVariant(stats?.systemHealth || 'healthy')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="security-dashboard-page__content">
        {/* Left Column - Sessions */}
        <div className="security-dashboard-page__sessions">
          <SessionsTable
            sessions={sessions}
            onTerminate={handleTerminateSession}
            onViewDetails={handleViewSessionDetails}
          />
        </div>

        {/* Right Column - Alerts */}
        <div className="security-dashboard-page__alerts">
          <SecurityAlertsFeed
            alerts={alerts}
            onAcknowledge={markAlertAsRead}
            onViewAll={() => navigate(ROUTES.ADMIN_SECURITY_LOGS)}
            maxItems={10}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="security-dashboard-page__quick-actions">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.ADMIN_SECURITY_SESSIONS)}
          leftIcon={<Users />}
        >
          إدارة الجلسات
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.ADMIN_SECURITY_LOGS)}
          leftIcon={<FileText />}
        >
          سجلات الأمان
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.ADMIN_SECURITY_SETTINGS)}
          leftIcon={<Settings />}
        >
          إعدادات الأمان
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.ADMIN_SECURITY_ROUTES)}
          leftIcon={<Globe />}
        >
          حماية المسارات
        </Button>
      </div>
    </div>
  )
}

export default SecurityDashboardPage
