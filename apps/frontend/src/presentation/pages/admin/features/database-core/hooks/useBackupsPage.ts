/**
 * useBackupsPage Hook - Hook لصفحة Backups
 */

import { useDatabaseCorePage } from './useDatabaseCorePage'
import { useBackupManagement } from '@/application/features/database-core'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'

export interface UseBackupsPageReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  backups: ReturnType<typeof useBackupManagement>['backups']
  refresh: () => Promise<void>
  createBackup: ReturnType<typeof useBackupManagement>['createBackup']
  restoreBackup: ReturnType<typeof useBackupManagement>['restoreBackup']
  deleteBackup: ReturnType<typeof useBackupManagement>['deleteBackup']
}

export function useBackupsPage(): UseBackupsPageReturn {
  const { canAccess, loading: authLoading } = useDatabaseCorePage('database-core.backups.manage')
  const {
    backups,
    loading: backupsLoading,
    error: backupsError,
    refresh,
    createBackup,
    restoreBackup,
    deleteBackup,
  } = useBackupManagement({
    interval: ADMIN_REFRESH_INTERVALS.DATABASE_CORE,
  })

  return {
    canAccess,
    loading: authLoading || backupsLoading,
    error: backupsError?.message || null,
    backups,
    refresh,
    createBackup,
    restoreBackup,
    deleteBackup,
  }
}
