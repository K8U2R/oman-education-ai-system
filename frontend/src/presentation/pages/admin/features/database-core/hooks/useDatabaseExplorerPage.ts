/**
 * useDatabaseExplorerPage Hook - Hook لصفحة Database Explorer
 */

import { useDatabaseCorePage } from './useDatabaseCorePage'
import { useDatabaseExplorer } from '@/application/features/database-core'

export interface UseDatabaseExplorerPageReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  tables: ReturnType<typeof useDatabaseExplorer>['tables']
  selectedTable: ReturnType<typeof useDatabaseExplorer>['selectedTable']
  tableData: ReturnType<typeof useDatabaseExplorer>['tableData']
  selectTable: ReturnType<typeof useDatabaseExplorer>['selectTable']
  refresh: () => Promise<void>
}

export function useDatabaseExplorerPage(): UseDatabaseExplorerPageReturn {
  const { canAccess, loading: authLoading } = useDatabaseCorePage('database-core.view')
  const {
    tables,
    selectedTable,
    tableData,
    loading: explorerLoading,
    error: explorerError,
    selectTable,
    refresh,
  } = useDatabaseExplorer({
    autoLoad: true,
  })

  return {
    canAccess,
    loading: authLoading || explorerLoading,
    error: explorerError?.message || null,
    tables,
    selectedTable,
    tableData,
    selectTable,
    refresh,
  }
}
