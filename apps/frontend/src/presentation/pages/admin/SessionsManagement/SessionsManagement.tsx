/**
 * Sessions Management Page - صفحة إدارة الجلسات
 *
 * صفحة لإدارة جميع الجلسات النشطة
 * تم نقلها إلى الهيكل الجديد
 */

import React, { useState, useEffect } from 'react'
import { Users, RefreshCw, XCircle } from 'lucide-react'
import { useConfirmDialog } from '@/application/shared/hooks'
import { loggingService } from '@/infrastructure/services/core/logging.service'
import { Button, Input, ConfirmDialog } from '@/presentation/components/common'
import { SessionsTable } from '@/presentation/components/security'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useSessionsManagement } from '@/presentation/pages/admin/features/security/hooks'



const SessionsManagementPage: React.FC = () => {
  const {
    canAccess,
    loading,
    error,
    sessions,
    loadSessions,
    terminateSession,
    terminateAllSessions,
  } = useSessionsManagement()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter] = useState<string>('all')
  const terminateAllConfirm = useConfirmDialog()

  useEffect(() => {
    if (canAccess) {
      loadSessions()
    }
  }, [canAccess, loadSessions])

  const handleTerminate = async (sessionId: string) => {
    try {
      await terminateSession(sessionId)
      await loadSessions()
    } catch (error) {
      loggingService.error('Failed to terminate session', error as Error)
    }
  }

  const handleTerminateAll = () => {
    terminateAllConfirm.open({
      title: 'تأكيد إنهاء جميع الجلسات',
      message: 'هل أنت متأكد من إنهاء جميع الجلسات النشطة؟ سيتم تسجيل خروج جميع المستخدمين.',
      variant: 'danger',
      confirmText: 'إنهاء الكل',
      cancelText: 'إلغاء',
      onConfirm: async () => {
        try {
          // TODO: Get current user ID
          await terminateAllSessions('current-user-id')
          terminateAllConfirm.close()
          await loadSessions()
        } catch (error) {
          loggingService.error('Failed to terminate all sessions', error as Error)
        }
      },
    })
  }

  if (loading) {
    return <AdminLoadingState message="جاري تحميل الجلسات..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={loadSessions} />
  }

  if (!canAccess) {
    return null
  }

  const filteredSessions =
    sessions?.filter(session => {
      const matchesSearch =
        !searchQuery || session.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter
      return matchesSearch && matchesStatus
    }) || []

  return (
    <AdminPageLayout
      title="إدارة الجلسات"
      description="إدارة ومراقبة جميع الجلسات النشطة"
      icon={<Users size={28} />}
      actions={
        <div className="sessions-management-page__header-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadSessions()}
            leftIcon={<RefreshCw size={16} />}
          >
            تحديث
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleTerminateAll}
            leftIcon={<XCircle size={16} />}
          >
            إنهاء الكل
          </Button>
        </div>
      }
    >
      <div className="sessions-management-page">
        {/* Filters */}
        <div className="sessions-management-page__filters">
          <Input
            type="text"
            placeholder="بحث في الجلسات..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="sessions-management-page__search"
          />
        </div>

        {/* Sessions Table */}
        <SessionsTable sessions={filteredSessions} onTerminate={handleTerminate} />
      </div>
      {terminateAllConfirm.options && (
        <ConfirmDialog
          isOpen={terminateAllConfirm.isOpen}
          onClose={terminateAllConfirm.close}
          onConfirm={terminateAllConfirm.options.onConfirm}
          title={terminateAllConfirm.options.title}
          message={terminateAllConfirm.options.message}
          variant={terminateAllConfirm.options.variant || 'danger'}
        />
      )}
    </AdminPageLayout>
  )
}

export default SessionsManagementPage
