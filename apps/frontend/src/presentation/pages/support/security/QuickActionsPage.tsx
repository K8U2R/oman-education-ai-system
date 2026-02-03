/**
 * Quick Actions Page - صفحة الإجراءات السريعة
 *
 * صفحة للإجراءات السريعة لحل المشاكل (للدعم الفني والمسؤولين)
 */

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, User, Shield, AlertTriangle, Activity, XCircle, Search } from 'lucide-react'
import { Card, Button, Input, Badge } from '../../../components/common'
import { useSecurity, useSessions } from '@/features/system-administration-portal'
import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import { LoadingState } from '@/presentation/pages/components'
import { loggingService } from '@/infrastructure/services'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader } from '../../components'


const QuickActionsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, canAccess, getShouldRedirect, loadingState } = usePageAuth({
    requireAuth: true,
    requiredPermissions: ['admin.users', 'users.manage'],
    redirectTo: ROUTES.FORBIDDEN,
  })
  const { shouldShowLoading: pageShouldShowLoading, loadingMessage: pageLoadingMessage } =
    usePageLoading({
      isLoading: !canAccess,
      message: 'جاري تحميل صفحة الإجراءات السريعة...',
    })

  const { stats, loading: securityLoading, refreshStats } = useSecurity()
  const { sessions, loading: sessionsLoading, loadSessions, terminateSession } = useSessions()

  useEffect(() => {
    if (canAccess) {
      refreshStats()
      loadSessions()
    }
  }, [canAccess, refreshStats, loadSessions])

  const handleTerminateUserSessions = async (userId: string) => {
    try {
      const userSessions = sessions.filter(s => s.userId === userId)
      for (const session of userSessions) {
        await terminateSession(session.id)
      }
      await loadSessions()
    } catch (error) {
      loggingService.error('Failed to terminate user sessions', error as Error)
    }
  }

  const handleViewUserDetails = (userId: string) => {
    // TODO: Navigate to user details page or open modal
    navigate(`${ROUTES.USER_SECURITY}/${userId}`)
  }

  interface UniqueUser {
    id: string
    email?: string
    name?: string
  }

  const uniqueUsers: UniqueUser[] = Array.from(
    new Set(sessions.map(s => ({ id: s.userId, email: s.userEmail, name: s.userName })))
  )

  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredUsers = React.useMemo(() => {
    if (!searchTerm) return uniqueUsers
    const term = searchTerm.toLowerCase()
    return uniqueUsers.filter(
      u => u.email?.toLowerCase().includes(term) || u.name?.toLowerCase().includes(term) || false
    )
  }, [uniqueUsers, searchTerm])

  const { shouldShowLoading: dataShouldShowLoading, loadingMessage: dataLoadingMessage } =
    usePageLoading({
      isLoading: (securityLoading || sessionsLoading) && uniqueUsers.length === 0,
      message: 'جاري تحميل الإجراءات السريعة...',
    })

  if (getShouldRedirect()) {
    return null
  }

  if (!canAccess || pageShouldShowLoading || loadingState.shouldShowLoading) {
    return <LoadingState fullScreen message={pageLoadingMessage || loadingState.loadingMessage} />
  }

  if (dataShouldShowLoading) {
    return <LoadingState fullScreen message={dataLoadingMessage} />
  }

  if (!user) {
    return null
  }

  return (
    <div className="quick-actions-page">
      <PageHeader
        title="الإجراءات السريعة"
        description="أدوات سريعة لحل المشاكل وإدارة المستخدمين"
        icon={<Zap className="quick-actions-page__header-icon" />}
      />

      {/* Quick Stats */}
      <div className="quick-actions-page__stats">
        <Card className="quick-actions-page__stat-card">
          <Activity className="quick-actions-page__stat-icon" />
          <div>
            <div className="quick-actions-page__stat-label">الجلسات النشطة</div>
            <div className="quick-actions-page__stat-value">{stats?.activeSessions || 0}</div>
          </div>
        </Card>
        <Card className="quick-actions-page__stat-card">
          <AlertTriangle className="quick-actions-page__stat-icon" />
          <div>
            <div className="quick-actions-page__stat-label">تنبيهات الأمان</div>
            <div className="quick-actions-page__stat-value">{stats?.securityAlerts || 0}</div>
          </div>
        </Card>
        <Card className="quick-actions-page__stat-card">
          <Shield className="quick-actions-page__stat-icon" />
          <div>
            <div className="quick-actions-page__stat-label">حالة النظام</div>
            <div className="quick-actions-page__stat-value">
              {stats?.systemHealth === 'healthy' ? 'سليم' : 'تحذير'}
            </div>
          </div>
        </Card>
      </div>

      {/* User Search */}
      <Card className="quick-actions-page__search-card">
        <div className="quick-actions-page__search-header">
          <h3 className="quick-actions-page__search-title">بحث عن مستخدم</h3>
        </div>
        <Input
          placeholder="ابحث بالبريد الإلكتروني أو الاسم..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon={<Search />}
          fullWidth
        />
      </Card>

      {/* Users List */}
      <Card className="quick-actions-page__users-card">
        <div className="quick-actions-page__users-header">
          <h3 className="quick-actions-page__users-title">المستخدمون النشطون</h3>
          <Badge variant="default" size="sm">
            {filteredUsers.length} مستخدم
          </Badge>
        </div>
        <div className="quick-actions-page__users-list">
          {filteredUsers.length === 0 ? (
            <div className="quick-actions-page__empty">لا توجد نتائج</div>
          ) : (
            filteredUsers.map(user => {
              const userSessions = sessions.filter(s => s.userId === user.id)
              return (
                <div key={user.id} className="quick-actions-page__user-item">
                  <div className="quick-actions-page__user-info">
                    <div className="quick-actions-page__user-name">{user.name || user.email}</div>
                    <div className="quick-actions-page__user-email">{user.email}</div>
                    <div className="quick-actions-page__user-sessions">
                      {userSessions.length} جلسة نشطة
                    </div>
                  </div>
                  <div className="quick-actions-page__user-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewUserDetails(user.id)}
                      leftIcon={<User />}
                    >
                      عرض التفاصيل
                    </Button>
                    {userSessions.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTerminateUserSessions(user.id)}
                        leftIcon={<XCircle />}
                        className="quick-actions-page__terminate-btn"
                      >
                        إنهاء الجلسات
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}

export default QuickActionsPage
