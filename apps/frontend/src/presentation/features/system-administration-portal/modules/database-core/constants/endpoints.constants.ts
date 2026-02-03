/**
 * Database Core API Endpoints - نقاط نهاية API
 *
 * جميع نقاط نهاية API لـ database-core service
 */

const DATABASE_CORE_BASE_URL = '/api'

export const DATABASE_CORE_ENDPOINTS = {
  // Health & Status
  HEALTH: `${DATABASE_CORE_BASE_URL}/health`,

  // Metrics & Performance
  METRICS: {
    PERFORMANCE: `${DATABASE_CORE_BASE_URL}/metrics/performance`,
    QUERIES: `${DATABASE_CORE_BASE_URL}/metrics/queries`,
    QUERIES_BY_ENTITY: (entity: string) => `${DATABASE_CORE_BASE_URL}/metrics/queries/${entity}`,
    CACHE: `${DATABASE_CORE_BASE_URL}/metrics/cache`,
    HEALTH: `${DATABASE_CORE_BASE_URL}/metrics/health`,
  },

  // Connections & Pools
  POOL: {
    STATS: `${DATABASE_CORE_BASE_URL}/pool/stats`,
    HEALTH: `${DATABASE_CORE_BASE_URL}/pool/health`,
  },

  // Cache Management
  CACHE: {
    STATS: `${DATABASE_CORE_BASE_URL}/cache/stats`,
    REGISTRY_STATS: `${DATABASE_CORE_BASE_URL}/cache/registry/stats`,
    CLEAR: `${DATABASE_CORE_BASE_URL}/cache/clear`,
    CLEAN: `${DATABASE_CORE_BASE_URL}/cache/clean`,
  },

  // Transactions
  TRANSACTIONS: {
    ACTIVE: `${DATABASE_CORE_BASE_URL}/transactions/active`,
    STATS: `${DATABASE_CORE_BASE_URL}/transactions/stats`,
    HISTORY: `${DATABASE_CORE_BASE_URL}/transactions/history`,
    MONITORING: `${DATABASE_CORE_BASE_URL}/transactions/monitoring`,
  },

  // Audit Logs
  AUDIT: {
    ANALYTICS: {
      STATISTICS: `${DATABASE_CORE_BASE_URL}/audit/analytics/statistics`,
      TRENDS: `${DATABASE_CORE_BASE_URL}/audit/analytics/trends`,
      ALERTS: `${DATABASE_CORE_BASE_URL}/audit/analytics/alerts`,
      REPORT: `${DATABASE_CORE_BASE_URL}/audit/analytics/report`,
    },
  },

  // Backups
  BACKUP: {
    LIST: `${DATABASE_CORE_BASE_URL}/backup/list`,
    CREATE: `${DATABASE_CORE_BASE_URL}/backup/create`,
    RESTORE: `${DATABASE_CORE_BASE_URL}/backup/restore`,
    SCHEDULE: `${DATABASE_CORE_BASE_URL}/backup/schedule`,
  },

  // Migrations
  MIGRATION: {
    LIST: `${DATABASE_CORE_BASE_URL}/migration/list`,
    STATUS: `${DATABASE_CORE_BASE_URL}/migration/status`,
    RUN: `${DATABASE_CORE_BASE_URL}/migration/run`,
    ROLLBACK: `${DATABASE_CORE_BASE_URL}/migration/rollback`,
  },

  // Database Operations (Database Control)
  DATABASE: {
    EXECUTE: `${DATABASE_CORE_BASE_URL}/database/execute`,
    TABLES: `${DATABASE_CORE_BASE_URL}/database/tables`,
    TABLE_SCHEMA: (tableName: string) =>
      `${DATABASE_CORE_BASE_URL}/database/tables/${tableName}/schema`,
    TABLE_DATA: (tableName: string) =>
      `${DATABASE_CORE_BASE_URL}/database/tables/${tableName}/data`,
    QUERY: `${DATABASE_CORE_BASE_URL}/database/query`,
  },
} as const
