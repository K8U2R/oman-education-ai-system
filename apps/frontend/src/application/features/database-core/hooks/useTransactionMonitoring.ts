/**
 * useTransactionMonitoring Hook - Hook لمراقبة المعاملات
 *
 * يستخدم useApi كـ Base Hook
 */

import { useApi } from './useApi'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type {
  Transaction,
  TransactionStats,
  TransactionHistoryEntry,
  TransactionMonitoringResponse,
} from '../types'

export interface UseTransactionMonitoringOptions {
  autoFetch?: boolean
  interval?: number
  onUpdate?: (data: TransactionMonitoringResponse) => void
}

export interface UseTransactionMonitoringReturn {
  data: TransactionMonitoringResponse | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  clearError: () => void
  activeTransactions: Transaction[]
  statistics: TransactionStats | null
  history: TransactionHistoryEntry[]
}

/**
 * Hook لمراقبة المعاملات - يستخدم useApi
 *
 * @example
 * ```typescript
 * const { activeTransactions, statistics, loading, refresh } = useTransactionMonitoring({
 *   interval: 3000,
 * })
 * ```
 */
export function useTransactionMonitoring(
  options: UseTransactionMonitoringOptions = {}
): UseTransactionMonitoringReturn {
  const { autoFetch = true, interval = 3000, onUpdate } = options

  const { data, loading, error, refresh, clearError } = useApi<TransactionMonitoringResponse>({
    endpoint: DATABASE_CORE_ENDPOINTS.TRANSACTIONS.MONITORING,
    autoFetch,
    interval,
    transform: responseData => {
      const transformed = responseData as TransactionMonitoringResponse
      onUpdate?.(transformed)
      return transformed
    },
  })

  return {
    data,
    loading,
    error,
    refresh,
    clearError,
    activeTransactions: data?.active || [],
    statistics: data?.statistics || null,
    history: data?.history || [],
  }
}
