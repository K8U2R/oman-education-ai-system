/**
 * Migrations Service - خدمة Migrations
 *
 * Application Service للـ Migrations
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type { Migration, MigrationStatus, ApiResponse } from '../types'

class MigrationsService {
  /**
   * الحصول على قائمة Migrations
   */
  async getMigrations(): Promise<Migration[]> {
    const response = await apiClient.get<ApiResponse<{ migrations: Migration[] }>>(
      DATABASE_CORE_ENDPOINTS.MIGRATION.LIST
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get migrations')
    }

    return (response.data as { migrations: Migration[] }).migrations
  }

  /**
   * الحصول على Migration Status
   */
  async getMigrationStatus(): Promise<MigrationStatus> {
    const response = await apiClient.get<ApiResponse<{ status: MigrationStatus }>>(
      DATABASE_CORE_ENDPOINTS.MIGRATION.STATUS
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get migration status')
    }

    return (response.data as { status: MigrationStatus }).status
  }

  /**
   * Run Migration
   */
  async runMigration(migrationId: string): Promise<void> {
    const response = await apiClient.post<ApiResponse>(DATABASE_CORE_ENDPOINTS.MIGRATION.RUN, {
      migrationId,
    })

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to run migration')
    }
  }

  /**
   * Rollback Migration
   */
  async rollbackMigration(migrationId: string): Promise<void> {
    const response = await apiClient.post<ApiResponse>(DATABASE_CORE_ENDPOINTS.MIGRATION.ROLLBACK, {
      migrationId,
    })

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to rollback migration')
    }
  }
}

export const migrationsService = new MigrationsService()
