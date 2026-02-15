/**
 * Backups Page - صفحة إدارة النسخ الاحتياطي
 *
 * صفحة شاملة لإدارة النسخ الاحتياطي
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { Database, RefreshCw, Plus } from 'lucide-react'
import { useModal, useConfirmDialog } from '@/application/shared/hooks'
import { loggingService } from '@/infrastructure/services/core/logging.service'
import { Button } from '@/presentation/components/common'
import { ConfirmDialog } from '@/presentation/components/common'
import {
  BaseCard,
  MetricsCard,
  BackupListTable,
  BackupScheduleForm,
  RestoreDialog,
} from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useBackupsPage } from '@/presentation/pages/admin/features/database-core/hooks'
import { formatNumber, formatBytes } from '@/application/features/database-core/utils'
import type {
  Backup,
  RestoreOptions,
  BackupSchedule,
} from '@/application/features/database-core/types'


const BackupsPage: React.FC = () => {
  const { canAccess, loading, error, backups, refresh, createBackup, restoreBackup, deleteBackup } =
    useBackupsPage()

  const restoreModal = useModal<Backup>()
  const deleteConfirm = useConfirmDialog()

  const handleRestore = (backupId: string) => {
    const backup = backups?.find(b => b.id === backupId)
    if (backup) {
      restoreModal.openWith(backup)
    }
  }

  const handleConfirmRestore = async (options: RestoreOptions) => {
    try {
      await restoreBackup(options)
      restoreModal.close()
    } catch (error) {
      loggingService.error('Failed to restore backup', error as Error)
    }
  }

  const handleDelete = (backupId: string) => {
    const backup = backups?.find(b => b.id === backupId)
    deleteConfirm.open({
      title: 'تأكيد الحذف',
      message: `هل أنت متأكد من حذف النسخ الاحتياطي "${backup?.name || backupId}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      variant: 'danger',
      confirmText: 'حذف',
      cancelText: 'إلغاء',
      onConfirm: async () => {
        try {
          await deleteBackup(backupId)
          deleteConfirm.close()
        } catch (error) {
          loggingService.error('Failed to delete backup', error as Error)
        }
      },
    })
  }

  const handleDownload = (backupId: string) => {
    // TODO: Implement download functionality
    loggingService.info('Download backup requested', { backupId })
  }

  if (loading) {
    return <AdminLoadingState message="جاري تحميل النسخ الاحتياطية..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title="إدارة النسخ الاحتياطي"
      description="إدارة النسخ الاحتياطية لقاعدة البيانات"
      icon={<Database size={28} />}
      actions={
        <div className="backups-page__header-actions">
          <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
            تحديث
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => createBackup()}
            leftIcon={<Plus size={16} />}
          >
            إنشاء نسخة احتياطية
          </Button>
        </div>
      }
    >
      <div className="backups-page">
        {/* Backup Statistics */}
        {backups && backups.length > 0 && (
          <div className="backups-page__metrics-grid">
            <MetricsCard
              title="Total Backups"
              value={formatNumber(backups.length)}
              icon={<Database />}
              variant="default"
              loading={loading}
            />
            <MetricsCard
              title="Total Size"
              value={formatBytes(backups.reduce((sum, b) => sum + (b.size || 0), 0))}
              icon={<Database />}
              variant="default"
              loading={loading}
            />
          </div>
        )}

        {/* Backup Schedule */}
        <BaseCard title="Backup Schedule" icon={<Database />} loading={loading}>
          <BackupScheduleForm
            onSubmit={(schedule: BackupSchedule) => {
              // TODO: Implement schedule update
              loggingService.info('Backup schedule updated', { schedule })
            }}
          />
        </BaseCard>

        {/* Backups List */}
        <BaseCard title="النسخ الاحتياطية" icon={<Database />} loading={loading} error={error}>
          <BackupListTable
            backups={backups || []}
            onRestore={handleRestore}
            onDelete={handleDelete}
            onDownload={handleDownload}
            loading={loading}
          />
        </BaseCard>
      </div>

      {/* Restore Dialog */}
      {restoreModal.selectedData && (
        <RestoreDialog
          open={restoreModal.isOpen}
          onClose={restoreModal.close}
          onConfirm={handleConfirmRestore}
          backup={restoreModal.selectedData}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirm.options && (
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={deleteConfirm.close}
          onConfirm={deleteConfirm.options.onConfirm}
          title={deleteConfirm.options.title}
          message={deleteConfirm.options.message}
          variant={deleteConfirm.options.variant || 'danger'}
          confirmText={deleteConfirm.options.confirmText}
          cancelText={deleteConfirm.options.cancelText}
        />
      )}
    </AdminPageLayout>
  )
}

export default BackupsPage
