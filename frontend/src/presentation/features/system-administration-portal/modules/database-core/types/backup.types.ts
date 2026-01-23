/**
 * Backup Types - أنواع النسخ الاحتياطي
 */

/**
 * Backup
 */
export interface Backup {
  id: string
  name: string
  type: 'full' | 'incremental'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  size: number
  sizeFormatted: string
  createdAt: string
  completedAt?: string
  error?: string
  tables?: string[]
}

/**
 * Backup Schedule
 */
export interface BackupSchedule {
  enabled: boolean
  interval: 'hourly' | 'daily' | 'weekly'
  time?: string
  retentionDays: number
}

/**
 * Backup Options
 */
export interface BackupOptions {
  name?: string
  type?: 'full' | 'incremental'
  tables?: string[]
  compression?: boolean
}

/**
 * Restore Options
 */
export interface RestoreOptions {
  backupId: string
  tables?: string[]
  dropExisting?: boolean
}
