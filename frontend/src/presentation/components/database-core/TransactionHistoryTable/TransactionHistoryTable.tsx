/**
 * Transaction History Table Component - جدول تاريخ المعاملات
 *
 * مكون متخصص لعرض تاريخ المعاملات
 */

import React from 'react'
import { BaseCard } from '../BaseCard'
import { formatDuration, formatDateTime } from '@/application/features/database-core/utils'
import type { Transaction } from '@/application/features/database-core/types'

export interface TransactionHistoryTableProps {
  transactions?: Transaction[]
  loading?: boolean
  error?: Error | null
  maxRows?: number
  onRowClick?: (transaction: Transaction) => void
  className?: string
}

/**
 * Transaction History Table - جدول تاريخ المعاملات
 *
 * @example
 * ```tsx
 * <TransactionHistoryTable transactions={transactions} loading={loading} />
 * ```
 */
export const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  transactions = [],
  loading = false,
  error = null,
  maxRows = 50,
  onRowClick,
  className = '',
}) => {
  const displayedTransactions = transactions.slice(0, maxRows)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'committed':
        return 'transaction-history-table__status--success'
      case 'failed':
        return 'transaction-history-table__status--danger'
      case 'active':
        return 'transaction-history-table__status--warning'
      case 'rolled_back':
        return 'transaction-history-table__status--danger'
      default:
        return 'transaction-history-table__status--default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'committed':
        return 'مكتملة'
      case 'failed':
        return 'فشلت'
      case 'active':
        return 'نشطة'
      case 'rolled_back':
        return 'ملغاة'
      default:
        return status
    }
  }

  return (
    <BaseCard
      title="Transaction History"
      description="تاريخ المعاملات"
      loading={loading}
      error={error?.message}
      className={`transaction-history-table ${className}`}
    >
      {displayedTransactions.length === 0 ? (
        <div className="transaction-history-table__empty">
          <p>لا توجد معاملات</p>
        </div>
      ) : (
        <div className="transaction-history-table__container">
          <table className="transaction-history-table__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>الحالة</th>
                <th>العمليات</th>
                <th>الكيان</th>
                <th>المدة</th>
                <th>الوقت</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map(transaction => (
                <tr
                  key={transaction.id}
                  className={onRowClick ? 'transaction-history-table__row--clickable' : ''}
                  onClick={() => onRowClick?.(transaction)}
                >
                  <td className="transaction-history-table__id-cell">
                    <code>{transaction.id.substring(0, 12)}...</code>
                  </td>
                  <td>
                    <span
                      className={`transaction-history-table__status ${getStatusBadgeClass(transaction.status)}`}
                    >
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                  <td>{transaction.operations || '-'}</td>
                  <td>{transaction.entity || '-'}</td>
                  <td>{transaction.duration ? formatDuration(transaction.duration) : '-'}</td>
                  <td>{formatDateTime(transaction.startTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BaseCard>
  )
}
