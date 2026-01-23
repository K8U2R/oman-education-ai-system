/**
 * useQueryBuilder Hook - Hook لبناء وتنفيذ الاستعلامات
 *
 * Hook لإدارة Query Builder وتنفيذ الاستعلامات
 */

import { useState, useCallback } from 'react'
import { databaseControlService } from '../services'
import type { QueryResult } from '../types'

export interface UseQueryBuilderOptions {
  initialQuery?: string
}

export interface UseQueryBuilderReturn {
  // State
  query: string
  result: QueryResult | null
  loading: boolean
  error: Error | null
  executionTime: number | null

  // Actions
  setQuery: (query: string) => void
  executeQuery: (query?: string) => Promise<void>
  clearResult: () => void
  clearQuery: () => void
  formatQuery: () => void
}

/**
 * useQueryBuilder - Hook لبناء وتنفيذ الاستعلامات
 *
 * @example
 * ```tsx
 * const { query, setQuery, executeQuery, queryResult } = useQueryBuilder()
 * ```
 */
export function useQueryBuilder(options: UseQueryBuilderOptions = {}): UseQueryBuilderReturn {
  const { initialQuery = '' } = options

  const [query, setQuery] = useState<string>(initialQuery)
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [executionTime, setExecutionTime] = useState<number | null>(null)

  /**
   * تنفيذ الاستعلام
   */
  const executeQuery = useCallback(
    async (queryToExecute?: string) => {
      const queryText = queryToExecute || query

      if (!queryText.trim()) {
        setError(new Error('الاستعلام فارغ'))
        return
      }

      try {
        setLoading(true)
        setError(null)
        setQueryResult(null)
        setExecutionTime(null)

        const startTime = Date.now()
        const result = await databaseControlService.executeQuery(queryText)
        const endTime = Date.now()

        setQueryResult(result)
        setExecutionTime(endTime - startTime)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to execute query')
        setError(error)
        setQueryResult(null)
        setExecutionTime(null)
      } finally {
        setLoading(false)
      }
    },
    [query]
  )

  /**
   * مسح النتائج
   */
  const clearResult = useCallback(() => {
    setQueryResult(null)
    setError(null)
    setExecutionTime(null)
  }, [])

  /**
   * تنسيق الاستعلام
   */
  const formatQuery = useCallback(() => {
    // Basic SQL formatting (يمكن تحسينه لاحقاً)
    let formatted = query
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*\(\s*/g, ' (')
      .replace(/\s*\)\s*/g, ') ')

    // Add line breaks for major keywords
    const keywords = [
      'SELECT',
      'FROM',
      'WHERE',
      'JOIN',
      'INNER JOIN',
      'LEFT JOIN',
      'RIGHT JOIN',
      'GROUP BY',
      'ORDER BY',
      'HAVING',
      'LIMIT',
    ]
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\s+${keyword}\\s+`, 'gi')
      formatted = formatted.replace(regex, `\n${keyword} `)
    })

    setQuery(formatted.trim())
  }, [query])

  const clearQuery = useCallback(() => {
    clearResult()
    setQuery('')
  }, [clearResult, setQuery])

  return {
    query,
    result: queryResult,
    loading,
    error,
    executionTime,
    setQuery,
    executeQuery,
    clearResult,
    clearQuery,
    formatQuery,
  }
}
