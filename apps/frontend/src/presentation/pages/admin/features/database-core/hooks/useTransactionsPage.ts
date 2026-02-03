/**
 * useTransactionsPage Hook - Hook لصفحة Transactions
 */

import { useDatabaseCorePage } from './useDatabaseCorePage'
import { useTransactionMonitoring } from '@/application/features/database-core'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'

export interface UseTransactionsPageReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  activeTransactions: ReturnType<typeof useTransactionMonitoring>['activeTransactions']
  transactions: ReturnType<typeof useTransactionMonitoring>['history']
  stats: ReturnType<typeof useTransactionMonitoring>['statistics']
  refresh: () => Promise<void>
}

export function useTransactionsPage(): UseTransactionsPageReturn {
  const { canAccess, loading: authLoading } = useDatabaseCorePage('database-core.transactions.view')
  const {
    history,
    statistics,
    activeTransactions,
    loading: transactionsLoading,
    error: transactionsError,
    refresh,
  } = useTransactionMonitoring({
    interval: ADMIN_REFRESH_INTERVALS.DATABASE_CORE,
  })

  return {
    canAccess,
    loading: authLoading || transactionsLoading,
    error: transactionsError?.message || null,
    activeTransactions,
    transactions: history,
    stats: statistics,
    refresh,
  }
}
