/**
 * useQueryBuilderPage Hook - Hook لصفحة Query Builder
 */

import { useDatabaseCorePage } from './useDatabaseCorePage'
import { useQueryBuilder } from '@/application/features/database-core'

export interface UseQueryBuilderPageReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  query: ReturnType<typeof useQueryBuilder>['query']
  result: ReturnType<typeof useQueryBuilder>['result']
  executeQuery: ReturnType<typeof useQueryBuilder>['executeQuery']
  setQuery: ReturnType<typeof useQueryBuilder>['setQuery']
  clearQuery: ReturnType<typeof useQueryBuilder>['clearQuery']
}

export function useQueryBuilderPage(): UseQueryBuilderPageReturn {
  const { canAccess, loading: authLoading } = useDatabaseCorePage('database-core.query.execute')
  const {
    query,
    result,
    loading: queryLoading,
    error: queryError,
    executeQuery,
    setQuery,
    clearQuery,
  } = useQueryBuilder()

  return {
    canAccess,
    loading: authLoading || queryLoading,
    error: queryError?.message || null,
    query,
    result,
    executeQuery,
    setQuery,
    clearQuery,
  }
}
