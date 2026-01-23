/**
 * Backup Service - خدمة النسخ الاحتياطي
 *
 * Application Service للنسخ الاحتياطي
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { Backup, BackupSchedule, BackupOptions, RestoreOptions, ApiResponse } from '../types'

class BackupService {
  /**
   * الحصول على قائمة Backups
   */
  async getBackups(): Promise<Backup[]> {
    const response = await apiClient.get<ApiResponse<{ backups: Backup[] }>>(
      DATABASE_CORE_ENDPOINTS.BACKUP.LIST
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get backups')
    }

    return (response.data as { backups: Backup[] }).backups
  }

  /**
   * إنشاء Backup
   */
  async createBackup(options?: BackupOptions): Promise<Backup> {
    const response = await apiClient.post<ApiResponse<Backup>>(
      DATABASE_CORE_ENDPOINTS.BACKUP.CREATE,
      options
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to create backup')
    }

    return response.data
  }

  /**
   * Restore Backup
   */
  async restoreBackup(options: RestoreOptions): Promise<void> {
    const response = await apiClient.post<ApiResponse>(
      DATABASE_CORE_ENDPOINTS.BACKUP.RESTORE,
      options
    )

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to restore backup')
    }
  }

  /**
   * الحصول على Backup Schedule
   */
  async getSchedule(): Promise<BackupSchedule> {
    const response = await apiClient.get<ApiResponse<{ schedule: BackupSchedule }>>(
      DATABASE_CORE_ENDPOINTS.BACKUP.SCHEDULE
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get backup schedule')
    }

    return (response.data as { schedule: BackupSchedule }).schedule
  }
}

export const backupService = new BackupService()
