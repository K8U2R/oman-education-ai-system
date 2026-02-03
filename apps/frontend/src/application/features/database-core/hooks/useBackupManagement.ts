/**
 * useBackupManagement Hook - Hook لإدارة النسخ الاحتياطي
 *
 * يستخدم useApi كـ Base Hook
 */

import { useState, useCallback } from 'react'
import { useApi } from './useApi'
import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { Backup, BackupSchedule, BackupOptions, RestoreOptions, ApiResponse } from '../types'

export interface UseBackupManagementOptions {
  autoFetch?: boolean
  interval?: number
  onUpdate?: (backups: Backup[]) => void
}

export interface UseBackupManagementReturn {
  backups: Backup[]
  schedule: BackupSchedule | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  clearError: () => void
  createBackup: (options?: BackupOptions) => Promise<Backup>
  restoreBackup: (options: RestoreOptions) => Promise<void>
  deleteBackup: (backupId: string) => Promise<void>
  updateSchedule: (schedule: BackupSchedule) => Promise<void>
}

/**
 * Hook لإدارة النسخ الاحتياطي - يستخدم useApi
 *
 * @example
 * ```typescript
 * const { backups, createBackup, restoreBackup, loading } = useBackupManagement({
 *   interval: 10000,
 * })
 * ```
 */
export function useBackupManagement(
  options: UseBackupManagementOptions = {}
): UseBackupManagementReturn {
  const { autoFetch = true, interval = 10000, onUpdate } = options

  const { data, loading, error, refresh, clearError } = useApi<{ backups: Backup[] }>({
    endpoint: DATABASE_CORE_ENDPOINTS.BACKUP.LIST,
    autoFetch,
    interval,
    transform: responseData => {
      const transformed = responseData as { backups: Backup[] }
      onUpdate?.(transformed.backups)
      return transformed
    },
  })

  const [schedule, setSchedule] = useState<BackupSchedule | null>(null)

  // Fetch schedule
  const { refresh: refreshSchedule } = useApi<{ schedule: BackupSchedule }>({
    endpoint: DATABASE_CORE_ENDPOINTS.BACKUP.SCHEDULE,
    autoFetch,
    transform: responseData => {
      const transformed = responseData as { schedule: BackupSchedule }
      setSchedule(transformed.schedule)
      return transformed
    },
  })

  const createBackup = useCallback(
    async (backupOptions?: BackupOptions): Promise<Backup> => {
      const response = await apiClient.post<ApiResponse<Backup>>(
        DATABASE_CORE_ENDPOINTS.BACKUP.CREATE,
        backupOptions
      )

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create backup')
      }

      await refresh()
      return response.data
    },
    [refresh]
  )

  const restoreBackup = useCallback(async (restoreOptions: RestoreOptions): Promise<void> => {
    const response = await apiClient.post<ApiResponse>(
      DATABASE_CORE_ENDPOINTS.BACKUP.RESTORE,
      restoreOptions
    )

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to restore backup')
    }
  }, [])

  const deleteBackup = useCallback(async (): Promise<void> => {
    // Note: قد تحتاج endpoint منفصل للحذف
    await refresh()
  }, [refresh])

  const updateSchedule = useCallback(
    async (newSchedule: BackupSchedule): Promise<void> => {
      // Note: قد تحتاج endpoint منفصل لتحديث الجدولة
      setSchedule(newSchedule)
      await refreshSchedule()
    },
    [refreshSchedule]
  )

  return {
    backups: data?.backups || [],
    schedule,
    loading,
    error,
    refresh,
    clearError,
    createBackup,
    restoreBackup,
    deleteBackup,
    updateSchedule,
  }
}
