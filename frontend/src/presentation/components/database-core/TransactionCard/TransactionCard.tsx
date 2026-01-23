/**
 * Transaction Card Component - مكون بطاقة المعاملة
 *
 * مكون متخصص لعرض معلومات المعاملة
 */

import React from 'react'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { BaseCard } from '../BaseCard'
import { formatDuration, formatDateTime } from '@/application/features/database-core/utils'
import type { Transaction } from '@/application/features/database-core/types'

export interface TransactionCardProps {
  transaction: Transaction
  onViewDetails?: (id: string) => void
  className?: string
}

/**
 * Transaction Card - بطاقة المعاملة
 *
 * @example
 * ```tsx
 * <TransactionCard transaction={transaction} onViewDetails={handleViewDetails} />
 * ```
 */
export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onViewDetails,
  className = '',
}) => {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'committed':
        return <CheckCircle size={20} className="transaction-card__icon--success" />
      case 'failed':
        return <XCircle size={20} className="transaction-card__icon--danger" />
      case 'active':
        return <Clock size={20} className="transaction-card__icon--warning" />
      case 'rolled_back':
        return <XCircle size={20} className="transaction-card__icon--danger" />
      default:
        return <AlertCircle size={20} className="transaction-card__icon--info" />
    }
  }

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'committed':
        return 'success'
      case 'failed':
        return 'danger'
      case 'active':
        return 'warning'
      case 'rolled_back':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <BaseCard
      className={`transaction-card transaction-card--${getStatusColor()} ${className}`}
      actions={
        onViewDetails && (
          <button
            className="transaction-card__view-button"
            onClick={() => onViewDetails(transaction.id)}
          >
            عرض التفاصيل
          </button>
        )
      }
    >
      <div className="transaction-card__header">
        <div className="transaction-card__status">
          {getStatusIcon()}
          <span
            className={`transaction-card__status-text transaction-card__status-text--${getStatusColor()}`}
          >
            {transaction.status === 'committed'
              ? 'مكتملة'
              : transaction.status === 'failed'
                ? 'فشلت'
                : transaction.status === 'active'
                  ? 'نشطة'
                  : transaction.status === 'rolled_back'
                    ? 'ملغاة'
                    : transaction.status}
          </span>
        </div>
        <div className="transaction-card__id">ID: {transaction.id.substring(0, 8)}...</div>
      </div>

      <div className="transaction-card__content">
        <div className="transaction-card__info-row">
          <span className="transaction-card__label">الوقت:</span>
          <span className="transaction-card__value">{formatDateTime(transaction.startTime)}</span>
        </div>

        {transaction.duration && (
          <div className="transaction-card__info-row">
            <span className="transaction-card__label">المدة:</span>
            <span className="transaction-card__value">{formatDuration(transaction.duration)}</span>
          </div>
        )}

        {transaction.operations > 0 && (
          <div className="transaction-card__info-row">
            <span className="transaction-card__label">عدد العمليات:</span>
            <span className="transaction-card__value">{transaction.operations}</span>
          </div>
        )}

        {transaction.entity && (
          <div className="transaction-card__info-row">
            <span className="transaction-card__label">الكيان:</span>
            <span className="transaction-card__value">{transaction.entity}</span>
          </div>
        )}

        {transaction.error && (
          <div className="transaction-card__error">
            <span className="transaction-card__error-label">خطأ:</span>
            <span className="transaction-card__error-message">{transaction.error}</span>
          </div>
        )}
      </div>
    </BaseCard>
  )
}
