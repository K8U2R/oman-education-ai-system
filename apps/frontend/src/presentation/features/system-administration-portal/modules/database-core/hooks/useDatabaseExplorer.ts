/**
 * useDatabaseExplorer Hook - Hook لاستكشاف قاعدة البيانات
 *
 * Hook لإدارة استكشاف قاعدة البيانات (Tables, Schema, Data)
 */

import { useState, useCallback } from 'react'
import { databaseControlService } from '../services'
import type { Table, TableSchema, QueryResult } from '../types'

export interface UseDatabaseExplorerOptions {
  autoLoad?: boolean
}

export interface UseDatabaseExplorerReturn {
  // State
  tables: Table[]
  selectedTable: Table | null
  tableSchema: TableSchema | null
  tableData: QueryResult | null
  loading: boolean
  error: Error | null

  // Actions
  loadTables: () => Promise<void>
  selectTable: (table: Table) => Promise<void>
  loadTableSchema: (tableName: string) => Promise<void>
  loadTableData: (
    tableName: string,
    options?: { page?: number; perPage?: number; filters?: Record<string, unknown> }
  ) => Promise<void>
  refresh: () => Promise<void>
}

/**
 * useDatabaseExplorer - Hook لاستكشاف قاعدة البيانات
 *
 * @example
 * ```tsx
 * const { tables, selectedTable, loadTables, selectTable } = useDatabaseExplorer()
 * ```
 */
export function useDatabaseExplorer(
  options: UseDatabaseExplorerOptions = {}
): UseDatabaseExplorerReturn {
  const { autoLoad = false } = options

  const [tables, setTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [tableSchema, setTableSchema] = useState<TableSchema | null>(null)
  const [tableData, setTableData] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * تحميل جميع الجداول
   */
  const loadTables = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await databaseControlService.getTables()
      setTables(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load tables')
      setError(error)
      setTables([])
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * تحديد جدول
   */
  const selectTable = useCallback(async (table: Table) => {
    setSelectedTable(table)
    setTableSchema(null)
    setTableData(null)

    try {
      setLoading(true)
      setError(null)

      // تحميل Schema و Data معاً
      const [schema, data] = await Promise.all([
        databaseControlService.getTableSchema(table.name),
        databaseControlService.getTableData(table.name, { page: 1, perPage: 50 }),
      ])

      setTableSchema(schema)
      setTableData(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load table details')
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * تحميل Table Schema
   */
  const loadTableSchema = useCallback(async (tableName: string) => {
    try {
      setLoading(true)
      setError(null)
      const schema = await databaseControlService.getTableSchema(tableName)
      setTableSchema(schema)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load table schema')
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * تحميل Table Data
   */
  const loadTableData = useCallback(
    async (
      tableName: string,
      options?: { page?: number; perPage?: number; filters?: Record<string, unknown> }
    ) => {
      try {
        setLoading(true)
        setError(null)
        const data = await databaseControlService.getTableData(tableName, options)
        setTableData(data)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load table data')
        setError(error)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  /**
   * تحديث البيانات
   */
  const refresh = useCallback(async () => {
    if (selectedTable) {
      await selectTable(selectedTable)
    } else {
      await loadTables()
    }
  }, [selectedTable, selectTable, loadTables])

  // Auto-load tables if enabled
  if (autoLoad && tables.length === 0 && !loading) {
    loadTables()
  }

  return {
    tables,
    selectedTable,
    tableSchema,
    tableData,
    loading,
    error,
    loadTables,
    selectTable,
    loadTableSchema,
    loadTableData,
    refresh,
  }
}
