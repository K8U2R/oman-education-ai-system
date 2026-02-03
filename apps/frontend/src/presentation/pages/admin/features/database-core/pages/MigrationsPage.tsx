/**
 * Migrations Page - صفحة إدارة Migrations
 *
 * صفحة شاملة لإدارة Migrations
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { GitBranch, RefreshCw } from 'lucide-react'
import { useModal } from '@/application/shared/hooks'
import { loggingService } from '@/infrastructure/services'
import { Button } from '@/presentation/components/common'
import {
  BaseCard,
  MetricsCard,
  MigrationHistoryTable,
  RunMigrationDialog,
  RollbackMigrationDialog,
} from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useMigrationsPage } from '../hooks'
import { formatNumber } from '@/application/features/database-core/utils'
import type { Migration } from '@/application/features/database-core/types'


const MigrationsPage: React.FC = () => {
  const { canAccess, loading, error, migrations, refresh, runMigration, rollbackMigration } =
    useMigrationsPage()

  const runModal = useModal<Migration>()
  const rollbackModal = useModal<Migration>()

  const handleRun = (migrationId: string) => {
    const migration = migrations?.find(m => m.id === migrationId)
    if (migration) {
      runModal.openWith(migration)
    }
  }

  const handleConfirmRun = async (migrationId: string) => {
    try {
      await runMigration(migrationId)
      runModal.close()
    } catch (error) {
      loggingService.error('Failed to run migration', error as Error)
    }
  }

  const handleRollback = (migrationId: string) => {
    const migration = migrations?.find(m => m.id === migrationId)
    if (migration) {
      rollbackModal.openWith(migration)
    }
  }

  const handleConfirmRollback = async (migrationId: string) => {
    try {
      await rollbackMigration(migrationId)
      rollbackModal.close()
    } catch (error) {
      loggingService.error('Failed to rollback migration', error as Error)
    }
  }

  if (loading) {
    return <AdminLoadingState message="جاري تحميل Migrations..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  const completedMigrations = migrations?.filter(m => m.status === 'completed') || []
  const pendingMigrations = migrations?.filter(m => m.status === 'pending') || []
  const failedMigrations = migrations?.filter(m => m.status === 'failed') || []

  return (
    <AdminPageLayout
      title="Migration Management"
      description="إدارة Migrations لقاعدة البيانات"
      icon={<GitBranch size={28} />}
      actions={
        <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
          تحديث
        </Button>
      }
    >
      <div className="migrations-page">
        {/* Statistics */}
        {migrations && migrations.length > 0 && (
          <div className="migrations-page__metrics-grid">
            <MetricsCard
              title="Total Migrations"
              value={formatNumber(migrations.length)}
              icon={<GitBranch />}
              variant="default"
              loading={loading}
            />
            <MetricsCard
              title="Completed"
              value={formatNumber(completedMigrations.length)}
              icon={<GitBranch />}
              variant="success"
              loading={loading}
            />
            <MetricsCard
              title="Pending"
              value={formatNumber(pendingMigrations.length)}
              icon={<GitBranch />}
              variant="warning"
              loading={loading}
            />
            <MetricsCard
              title="Failed"
              value={formatNumber(failedMigrations.length)}
              icon={<GitBranch />}
              variant="danger"
              loading={loading}
            />
          </div>
        )}

        {/* Migration History */}
        <BaseCard title="Migration History" icon={<GitBranch />} loading={loading} error={error}>
          <MigrationHistoryTable
            migrations={migrations || []}
            onRun={handleRun}
            onRollback={handleRollback}
            loading={loading}
          />
        </BaseCard>
      </div>

      {/* Run Migration Dialog */}
      {runModal.selectedData && (
        <RunMigrationDialog
          open={runModal.isOpen}
          onClose={runModal.close}
          onConfirm={handleConfirmRun}
          migration={runModal.selectedData}
        />
      )}

      {/* Rollback Migration Dialog */}
      {rollbackModal.selectedData && (
        <RollbackMigrationDialog
          open={rollbackModal.isOpen}
          onClose={rollbackModal.close}
          onConfirm={handleConfirmRollback}
          migration={rollbackModal.selectedData}
        />
      )}
    </AdminPageLayout>
  )
}

export default MigrationsPage
