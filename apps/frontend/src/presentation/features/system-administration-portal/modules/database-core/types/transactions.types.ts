/**
 * Transactions Types - أنواع المعاملات
 */

/**
 * Transaction
 */
export interface Transaction {
  id: string
  status: 'active' | 'committed' | 'rolled_back' | 'failed'
  startTime: string
  endTime?: string
  duration?: number
  operations: number
  entity?: string
  error?: string
}

/**
 * Transaction Statistics
 */
export interface TransactionStats {
  total: number
  active: number
  committed: number
  rolledBack: number
  failed: number
  averageDuration: number
  longestDuration: number
}

/**
 * Transaction History Entry
 */
export interface TransactionHistoryEntry {
  id: string
  status: 'committed' | 'rolled_back' | 'failed'
  startTime: string
  endTime: string
  duration: number
  operations: number
  entity?: string
  error?: string
}

/**
 * Transaction Monitoring Response
 */
export interface TransactionMonitoringResponse {
  active: Transaction[]
  statistics: TransactionStats
  history: TransactionHistoryEntry[]
}
