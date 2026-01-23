/**
 * Database Core Store - State Management
 *
 * Zustand Store لإدارة حالة database-core
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  MetricsResponse,
  ConnectionStatsResponse,
  CacheStats,
  TransactionMonitoringResponse,
  AuditStatistics,
  Backup,
  Migration,
} from '../types'

interface DatabaseCoreState {
  // Metrics
  metrics: {
    data: MetricsResponse | null
    loading: boolean
    error: Error | null
    lastUpdated: string | null
  }

  // Connections
  connections: {
    data: ConnectionStatsResponse | null
    loading: boolean
    error: Error | null
    lastUpdated: string | null
  }

  // Cache
  cache: {
    data: CacheStats | null
    loading: boolean
    error: Error | null
    lastUpdated: string | null
  }

  // Transactions
  transactions: {
    data: TransactionMonitoringResponse | null
    loading: boolean
    error: Error | null
    lastUpdated: string | null
  }

  // Audit
  audit: {
    statistics: AuditStatistics | null
    loading: boolean
    error: Error | null
    lastUpdated: string | null
  }

  // Backups
  backups: {
    list: Backup[]
    loading: boolean
    error: Error | null
    lastUpdated: string | null
  }

  // Migrations
  migrations: {
    list: Migration[]
    loading: boolean
    error: Error | null
    lastUpdated: string | null
  }

  // Actions - Metrics
  setMetrics: (data: MetricsResponse | null, loading?: boolean, error?: Error | null) => void

  // Actions - Connections
  setConnections: (
    data: ConnectionStatsResponse | null,
    loading?: boolean,
    error?: Error | null
  ) => void

  // Actions - Cache
  setCache: (data: CacheStats | null, loading?: boolean, error?: Error | null) => void

  // Actions - Transactions
  setTransactions: (
    data: TransactionMonitoringResponse | null,
    loading?: boolean,
    error?: Error | null
  ) => void

  // Actions - Audit
  setAuditStatistics: (
    statistics: AuditStatistics | null,
    loading?: boolean,
    error?: Error | null
  ) => void

  // Actions - Backups
  setBackups: (backups: Backup[], loading?: boolean, error?: Error | null) => void
  addBackup: (backup: Backup) => void
  removeBackup: (backupId: string) => void

  // Actions - Migrations
  setMigrations: (migrations: Migration[], loading?: boolean, error?: Error | null) => void
  updateMigration: (migration: Migration) => void

  // Reset
  reset: () => void
}

const initialState = {
  metrics: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  connections: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  cache: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  transactions: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  audit: {
    statistics: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  backups: {
    list: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  migrations: {
    list: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
}

export const useDatabaseCoreStore = create<DatabaseCoreState>()(
  devtools(
    persist(
      set => ({
        ...initialState,

        // Metrics Actions
        setMetrics: (data, loading = false, error = null) =>
          set(() => ({
            metrics: {
              data,
              loading,
              error,
              lastUpdated: new Date().toISOString(),
            },
          })),

        // Connections Actions
        setConnections: (data, loading = false, error = null) =>
          set(() => ({
            connections: {
              data,
              loading,
              error,
              lastUpdated: new Date().toISOString(),
            },
          })),

        // Cache Actions
        setCache: (data, loading = false, error = null) =>
          set(() => ({
            cache: {
              data,
              loading,
              error,
              lastUpdated: new Date().toISOString(),
            },
          })),

        // Transactions Actions
        setTransactions: (data, loading = false, error = null) =>
          set(() => ({
            transactions: {
              data,
              loading,
              error,
              lastUpdated: new Date().toISOString(),
            },
          })),

        // Audit Actions
        setAuditStatistics: (statistics, loading = false, error = null) =>
          set(() => ({
            audit: {
              statistics,
              loading,
              error,
              lastUpdated: new Date().toISOString(),
            },
          })),

        // Backups Actions
        setBackups: (backups, loading = false, error = null) =>
          set(() => ({
            backups: {
              list: backups,
              loading,
              error,
              lastUpdated: new Date().toISOString(),
            },
          })),

        addBackup: backup =>
          set(state => ({
            backups: {
              ...state.backups,
              list: [backup, ...state.backups.list],
            },
          })),

        removeBackup: backupId =>
          set(state => ({
            backups: {
              ...state.backups,
              list: state.backups.list.filter(b => b.id !== backupId),
            },
          })),

        // Migrations Actions
        setMigrations: (migrations, loading = false, error = null) =>
          set(() => ({
            migrations: {
              list: migrations,
              loading,
              error,
              lastUpdated: new Date().toISOString(),
            },
          })),

        updateMigration: migration =>
          set(state => ({
            migrations: {
              ...state.migrations,
              list: state.migrations.list.map(m => (m.id === migration.id ? migration : m)),
            },
          })),

        // Reset
        reset: () => set(initialState),
      }),
      {
        name: 'database-core-store',
        partialize: () => ({
          // يمكن حفظ بعض البيانات في localStorage إذا لزم الأمر
        }),
      }
    ),
    { name: 'DatabaseCoreStore' }
  )
)
