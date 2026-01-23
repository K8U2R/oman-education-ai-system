/**
 * useMigrationsPage Hook - Hook لصفحة Migrations
 */

import { useDatabaseCorePage } from './useDatabaseCorePage'
import { useMigrations } from '@/application/features/database-core'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'

export interface UseMigrationsPageReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  migrations: ReturnType<typeof useMigrations>['migrations']
  refresh: () => Promise<void>
  runMigration: ReturnType<typeof useMigrations>['runMigration']
  rollbackMigration: ReturnType<typeof useMigrations>['rollbackMigration']
}

export function useMigrationsPage(): UseMigrationsPageReturn {
  const { canAccess, loading: authLoading } = useDatabaseCorePage('database-core.migrations.manage')
  const {
    migrations,
    loading: migrationsLoading,
    error: migrationsError,
    refresh,
    runMigration,
    rollbackMigration,
  } = useMigrations({
    interval: ADMIN_REFRESH_INTERVALS.DATABASE_CORE,
  })

  return {
    canAccess,
    loading: authLoading || migrationsLoading,
    error: migrationsError?.message || null,
    migrations,
    refresh,
    runMigration,
    rollbackMigration,
  }
}
