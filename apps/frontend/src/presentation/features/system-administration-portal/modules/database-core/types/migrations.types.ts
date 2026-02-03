/**
 * Migrations Types - أنواع Migrations
 */

/**
 * Migration
 */
export interface Migration {
  id: string
  version: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back'
  timestamp: string
  duration?: number
  error?: string
}

/**
 * Migration Status
 */
export interface MigrationStatus {
  currentVersion: string
  pendingMigrations: number
  completedMigrations: number
  failedMigrations: number
  lastMigration?: Migration
}
