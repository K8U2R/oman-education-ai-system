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
import { useSessions } from '@/application/features/security'
import { useAuth, useRole } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState } from '../../components'
import type { Session } from '@/application/features/security/types'
import './UserSupportPage.scss'

const UserSupportPage: React.FC = () => {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { isAdmin, hasRole } = useRole()
  const isModerator = hasRole('moderator')
  const { sessions, loading, loadSessions, terminateSession, terminateAllSessions } = useSessions()
  const [userSessions, setUserSessions] = useState<Session[]>([])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN)
    } else if (!authLoading && !isAdmin && !isModerator) {
      navigate(ROUTES.FORBIDDEN)
    }
  }, [authLoading, isAuthenticated, isAdmin, isModerator, navigate])

  useEffect(() => {
    if ((isAdmin || isModerator) && userId) {
      loadSessions({ userId })
    }
  }, [isAdmin, isModerator, userId, loadSessions])

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
      console.error('Failed to terminate session:', error)
    }
  }

  const handleTerminateAll = async () => {
    if (!userId) {
      console.error('User ID not available')
      return
    }
    try {
      await terminateAllSessions(userId)
      await loadSessions()
    } catch (error) {
      console.error('Failed to terminate all sessions:', error)
    }
  }

  const handleViewDetails = (_session: Session) => {
    // TODO: Open session details modal
    // Session details view handler
  }

  if (authLoading || loading) {
    return <LoadingState fullScreen message="جاري تحميل معلومات المستخدم..." />
  }

  if (!user || (!isAdmin && !isModerator)) {
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
