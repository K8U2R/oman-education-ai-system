/**
 * User Support Page - صفحة دعم المستخدم
 *
 * صفحة لعرض وإدارة معلومات المستخدم وجلساته (للدعم الفني والمسؤولين)
 */

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { User, XCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { Card, Button, Badge, Avatar } from '../../../components/common'
import { SessionsTable } from '../../../components/security'
import { useSessions } from '@/features/system-administration-portal'
import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import { LoadingState } from '@/presentation/pages/components'
import { loggingService } from '@/infrastructure/services'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader } from '../../components'
import type { Session } from '@/features/system-administration-portal'


const UserSupportPage: React.FC = () => {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const { user, canAccess, getShouldRedirect, loadingState } = usePageAuth({
    requireAuth: true,
    requiredPermissions: ['admin.users', 'users.manage'],
    redirectTo: ROUTES.FORBIDDEN,
  })
  const { shouldShowLoading: pageShouldShowLoading, loadingMessage: pageLoadingMessage } =
    usePageLoading({
      isLoading: !canAccess,
      message: 'جاري تحميل صفحة دعم المستخدم...',
    })

  const { sessions, loading, loadSessions, terminateSession, terminateAllSessions } = useSessions()
  const [userSessions, setUserSessions] = useState<Session[]>([])

  useEffect(() => {
    if (canAccess && userId) {
      loadSessions({ userId })
    }
  }, [canAccess, userId, loadSessions])

  useEffect(() => {
    if (userId) {
      const filtered = sessions.filter(s => s.userId === userId)
      setUserSessions(filtered)
    } else {
      setUserSessions(sessions)
    }
  }, [sessions, userId])

  const handleTerminate = async (sessionId: string) => {
    try {
      await terminateSession(sessionId)
      await loadSessions()
    } catch (error) {
      loggingService.error('Failed to terminate session', error as Error)
    }
  }

  const handleTerminateAll = async () => {
    if (!userId) {
      loggingService.error('User ID not available', new Error('User ID is required'))
      return
    }
    try {
      await terminateAllSessions(userId)
      await loadSessions()
    } catch (error) {
      loggingService.error('Failed to terminate all sessions', error as Error)
    }
  }

  const handleViewDetails = (_session: Session) => {
    // TODO: Open session details modal
    // Session details view handler
  }

  const { shouldShowLoading: sessionsShouldShowLoading, loadingMessage: sessionsLoadingMessage } =
    usePageLoading({
      isLoading: loading && userSessions.length === 0,
      message: 'جاري تحميل معلومات المستخدم...',
    })

  if (getShouldRedirect()) {
    return null
  }

  if (!canAccess || pageShouldShowLoading || loadingState.shouldShowLoading) {
    return <LoadingState fullScreen message={pageLoadingMessage || loadingState.loadingMessage} />
  }

  if (sessionsShouldShowLoading) {
    return <LoadingState fullScreen message={sessionsLoadingMessage} />
  }

  if (!user) {
    return null
  }

  const currentUser = userSessions[0]
  const activeSessions = userSessions.filter(s => s.status === 'active')
  const highRiskSessions = userSessions.filter(s => s.riskLevel === 'high')

  return (
    <div className="user-support-page">
      <PageHeader
        title={
          currentUser
            ? `دعم المستخدم: ${currentUser.userName || currentUser.userEmail}`
            : 'دعم المستخدم'
        }
        description="عرض وإدارة معلومات المستخدم وجلساته"
        icon={<User className="user-support-page__header-icon" />}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.USER_SECURITY)}
            leftIcon={<ArrowRight />}
          >
            العودة
          </Button>
        }
      />

      {currentUser && (
        <div className="user-support-page__user-info">
          <Card className="user-support-page__user-card">
            <div className="user-support-page__user-header">
              <Avatar
                src={currentUser.userAvatar}
                alt={currentUser.userName || currentUser.userEmail || 'User'}
                name={currentUser.userName || currentUser.userEmail || 'User'}
                size="lg"
              />
              <div className="user-support-page__user-details">
                <h3 className="user-support-page__user-name">
                  {currentUser.userName || currentUser.userEmail || 'مستخدم غير معروف'}
                </h3>
                <p className="user-support-page__user-email">{currentUser.userEmail}</p>
                {currentUser.userRole && (
                  <Badge variant="info" size="sm" className="user-support-page__user-role">
                    {currentUser.userRole}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Stats */}
      <div className="user-support-page__stats">
        <Card className="user-support-page__stat-card">
          <div className="user-support-page__stat-label">إجمالي الجلسات</div>
          <div className="user-support-page__stat-value">{userSessions.length}</div>
        </Card>
        <Card className="user-support-page__stat-card">
          <div className="user-support-page__stat-label">الجلسات النشطة</div>
          <div className="user-support-page__stat-value user-support-page__stat-value--success">
            {activeSessions.length}
          </div>
        </Card>
        <Card className="user-support-page__stat-card">
          <div className="user-support-page__stat-label">جلسات عالية الخطورة</div>
          <div className="user-support-page__stat-value user-support-page__stat-value--danger">
            {highRiskSessions.length}
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card className="user-support-page__actions-card">
        <div className="user-support-page__actions-header">
          <h3 className="user-support-page__actions-title">إجراءات سريعة</h3>
        </div>
        <div className="user-support-page__actions-list">
          <Button
            variant="outline"
            onClick={() => loadSessions(userId ? { userId } : undefined)}
            leftIcon={<RefreshCw />}
          >
            تحديث الجلسات
          </Button>
          {userSessions.length > 0 && (
            <Button variant="danger" onClick={handleTerminateAll} leftIcon={<XCircle />}>
              إنهاء جميع الجلسات
            </Button>
          )}
        </div>
      </Card>

      {/* Sessions Table */}
      <SessionsTable
        sessions={userSessions}
        onTerminate={handleTerminate}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}

export default UserSupportPage
