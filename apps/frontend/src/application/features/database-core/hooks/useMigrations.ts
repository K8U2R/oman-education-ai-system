/**
 * useMigrations Hook - Hook لإدارة Migrations
 *
 * يستخدم useApi كـ Base Hook
 */

import { useCallback } from 'react'
import { useApi } from './useApi'
import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { Migration, MigrationStatus, ApiResponse } from '../types'

export interface UseMigrationsOptions {
  autoFetch?: boolean
  interval?: number
  onUpdate?: (migrations: Migration[]) => void
}

export interface UseMigrationsReturn {
  migrations: Migration[]
  status: MigrationStatus | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  clearError: () => void
  runMigration: (migrationId: string) => Promise<void>
  rollbackMigration: (migrationId: string) => Promise<void>
}

/**
 * Hook لإدارة Migrations - يستخدم useApi
 *
 * @example
 * ```typescript
 * const { migrations, status, runMigration, rollbackMigration } = useMigrations({
 *   interval: 5000,
 * })
 * ```
 */
export function useMigrations(options: UseMigrationsOptions = {}): UseMigrationsReturn {
  const { autoFetch = true, interval = 5000, onUpdate } = options

  const { data, loading, error, refresh, clearError } = useApi<{ migrations: Migration[] }>({
    endpoint: DATABASE_CORE_ENDPOINTS.MIGRATION.LIST,
    autoFetch,
    interval,
    transform: responseData => {
      const transformed = responseData as { migrations: Migration[] }
      onUpdate?.(transformed.migrations)
      return transformed
    },
  })

  const { data: statusData, refresh: refreshStatus } = useApi<{ status: MigrationStatus }>({
    endpoint: DATABASE_CORE_ENDPOINTS.MIGRATION.STATUS,
    autoFetch,
    interval,
    transform: responseData => responseData as { status: MigrationStatus },
  })

  const runMigration = useCallback(
    async (migrationId: string): Promise<void> => {
      const response = await apiClient.post<ApiResponse>(DATABASE_CORE_ENDPOINTS.MIGRATION.RUN, {
        migrationId,
      })

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to run migration')
      }

      await Promise.all([refresh(), refreshStatus()])
    },
    [refresh, refreshStatus]
  )

  const rollbackMigration = useCallback(
    async (migrationId: string): Promise<void> => {
      const response = await apiClient.post<ApiResponse>(
        DATABASE_CORE_ENDPOINTS.MIGRATION.ROLLBACK,
        { migrationId }
      )

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to rollback migration')
      }

      await Promise.all([refresh(), refreshStatus()])
    },
    [refresh, refreshStatus]
  )

  return {
    migrations: data?.migrations || [],
    status: statusData?.status || null,
    loading,
    error,
    refresh,
    clearError,
    runMigration,
    rollbackMigration,
  }
}
