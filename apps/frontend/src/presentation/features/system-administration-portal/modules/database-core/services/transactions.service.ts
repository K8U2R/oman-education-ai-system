/**
 * Transactions Service - خدمة المعاملات
 *
 * Application Service للمعاملات
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { DATABASE_CORE_ENDPOINTS } from '../constants'
import type {
  Transaction,
  TransactionStats,
  TransactionHistoryEntry,
  TransactionMonitoringResponse,
  ApiResponse,
} from '../types'

class TransactionsService {
  /**
   * الحصول على Active Transactions
   */
  async getActiveTransactions(): Promise<Transaction[]> {
    const response = await apiClient.get<ApiResponse<{ active: Transaction[] }>>(
      DATABASE_CORE_ENDPOINTS.TRANSACTIONS.ACTIVE
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get active transactions')
    }

    return (response.data as { active: Transaction[] }).active
  }

  /**
   * الحصول على Transaction Statistics
   */
  async getTransactionStats(): Promise<TransactionStats> {
    const response = await apiClient.get<ApiResponse<{ statistics: TransactionStats }>>(
      DATABASE_CORE_ENDPOINTS.TRANSACTIONS.STATS
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get transaction stats')
    }

    return (response.data as { statistics: TransactionStats }).statistics
  }

  /**
   * الحصول على Transaction History
   */
  async getTransactionHistory(): Promise<TransactionHistoryEntry[]> {
    const response = await apiClient.get<ApiResponse<{ history: TransactionHistoryEntry[] }>>(
      DATABASE_CORE_ENDPOINTS.TRANSACTIONS.HISTORY
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get transaction history')
    }

    return (response.data as { history: TransactionHistoryEntry[] }).history
  }

  /**
   * الحصول على Transaction Monitoring Data
   */
  async getTransactionMonitoring(): Promise<TransactionMonitoringResponse> {
    const response = await apiClient.get<ApiResponse<TransactionMonitoringResponse>>(
      DATABASE_CORE_ENDPOINTS.TRANSACTIONS.MONITORING
    )

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get transaction monitoring')
    }

    return response.data
  }
}

export const transactionsService = new TransactionsService()
