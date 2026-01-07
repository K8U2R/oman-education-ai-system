/**
 * Sessions Management Page - صفحة إدارة الجلسات
 *
 * صفحة لإدارة جميع الجلسات النشطة (للمسؤولين فقط)
 */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, RefreshCw, Search, XCircle } from 'lucide-react'
import { Button, Input, Modal } from '../../../components/common'
import { SessionsTable } from '../../../components/security'
import { useSessions } from '@/application/features/security'
import { useAuth, useRole } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState } from '../../components'
import type { Session } from '@/application/features/security/types'
import './SessionsManagementPage.scss'

const SessionsManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { isAdmin } = useRole()
  const {
    sessions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedSession: _selectedSession,
    loading,
    error,
    loadSessions,
    terminateSession,
    terminateAllSessions,
    loadSessionDetails,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearSelectedSession: _clearSelectedSession,
  } = useSessions()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showTerminateAllModal, setShowTerminateAllModal] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN)
    } else if (!authLoading && !isAdmin) {
      navigate(ROUTES.FORBIDDEN)
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate])

  useEffect(() => {
    if (isAdmin) {
      loadSessions()
    }
  }, [isAdmin, loadSessions])

  const handleTerminate = async (sessionId: string) => {
    try {
      await terminateSession(sessionId)
      await loadSessions()
    } catch (error) {
      console.error('Failed to terminate session:', error)
    }
  }

  const handleTerminateAll = async () => {
    if (!user?.id) {
      console.error('User ID not available')
      return
    }
    try {
      await terminateAllSessions(user.id)
      setShowTerminateAllModal(false)
      await loadSessions()
    } catch (error) {
      console.error('Failed to terminate all sessions:', error)
    }
  }

  const handleViewDetails = (session: Session) => {
    loadSessionDetails(session.id)
  }

  const filteredSessions = sessions.filter(session => {
    const matchesSearch =
      (session.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.ipAddress?.includes(searchQuery)) ??
      false

    const matchesStatus = statusFilter === 'all' || session.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const activeSessionsCount = sessions.filter(s => s.status === 'active').length
  const highRiskSessionsCount = sessions.filter(s => s.riskLevel === 'high').length

  if (authLoading || loading) {
    return <LoadingState fullScreen message="جاري تحميل الجلسات..." />
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="sessions-management-page">
      <PageHeader
        title="إدارة الجلسات"
        description="عرض وإدارة جميع الجلسات النشطة"
        icon={<Users className="sessions-management-page__header-icon" />}
        actions={
          <div className="sessions-management-page__header-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadSessions()}
              leftIcon={<RefreshCw />}
              disabled={loading}
            >
              تحديث
            </Button>
            {sessions.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowTerminateAllModal(true)}
                leftIcon={<XCircle />}
              >
                إنهاء الكل
              </Button>
            )}
          </div>
        }
      />

      {error && (
        <div className="sessions-management-page__error">
          <span>{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="sessions-management-page__filters">
        <div className="sessions-management-page__search">
          <Input
            placeholder="بحث بالاسم، البريد، أو IP..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search />}
            fullWidth
          />
        </div>
        <div className="sessions-management-page__filter-select">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="sessions-management-page__select"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="idle">خامل</option>
            <option value="expired">منتهي</option>
            <option value="frozen">مجمد</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="sessions-management-page__stats">
        <div className="sessions-management-page__stat-item">
          <span className="sessions-management-page__stat-label">إجمالي الجلسات</span>
          <span className="sessions-management-page__stat-value">{sessions.length}</span>
        </div>
        <div className="sessions-management-page__stat-item">
          <span className="sessions-management-page__stat-label">الجلسات النشطة</span>
          <span className="sessions-management-page__stat-value sessions-management-page__stat-value--success">
            {activeSessionsCount}
          </span>
        </div>
        <div className="sessions-management-page__stat-item">
          <span className="sessions-management-page__stat-label">جلسات عالية الخطورة</span>
          <span className="sessions-management-page__stat-value sessions-management-page__stat-value--danger">
            {highRiskSessionsCount}
          </span>
        </div>
      </div>

      {/* Sessions Table */}
      <SessionsTable
        sessions={filteredSessions}
        onTerminate={handleTerminate}
        onViewDetails={handleViewDetails}
      />

      {/* Terminate All Modal */}
      <Modal
        isOpen={showTerminateAllModal}
        onClose={() => setShowTerminateAllModal(false)}
        title="إنهاء جميع الجلسات"
      >
        <div className="sessions-management-page__modal-content">
          <p>هل أنت متأكد من إنهاء جميع الجلسات النشطة؟</p>
          <p className="sessions-management-page__modal-warning">
            سيتم تسجيل خروج جميع المستخدمين من جميع الأجهزة.
          </p>
          <div className="sessions-management-page__modal-actions">
            <Button variant="outline" onClick={() => setShowTerminateAllModal(false)}>
              إلغاء
            </Button>
            <Button variant="danger" onClick={handleTerminateAll}>
              إنهاء الكل
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SessionsManagementPage
