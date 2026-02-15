/**
 * Transactions Page - صفحة مراقبة المعاملات
 *
 * صفحة شاملة لمراقبة المعاملات
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { Activity, RefreshCw } from 'lucide-react'
import { useSearchFilter } from '@/application/shared/hooks'
import { Button } from '@/presentation/components/common'
import {
  BaseCard,
  MetricsCard,
  TransactionCard,
  TransactionHistoryTable,
} from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useTransactionsPage } from '@/presentation/pages/admin/features/database-core/hooks'
import type { TransactionHistoryEntry } from '@/application/features/database-core/types'
import { formatNumber, formatPercentage } from '@/application/features/database-core/utils'


const TransactionsPage: React.FC = () => {
  const { canAccess, loading, error, transactions, activeTransactions, stats, refresh } =
    useTransactionsPage()

  const successRate = stats && stats.total > 0 ? stats.committed / stats.total : 0

  const { filteredData } = useSearchFilter(transactions || [], {
    filterOptions: [
      { value: 'all', label: 'الكل' },
      {
        value: 'completed',
        label: 'مكتملة',
        filterFn: (tx: TransactionHistoryEntry) => tx.status === 'committed',
      },
      {
        value: 'failed',
        label: 'فاشلة',
        filterFn: (tx: TransactionHistoryEntry) =>
          tx.status === 'failed' || tx.status === 'rolled_back',
      },
    ],
  })

  if (loading) {
    return <AdminLoadingState message="جاري تحميل بيانات المعاملات..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title="مراقبة المعاملات"
      description="مراقبة وتحليل المعاملات في قاعدة البيانات"
      icon={<Activity size={28} />}
      actions={
        <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
          تحديث
        </Button>
      }
    >
      <div className="transactions-page">
        {/* Statistics */}
        {stats && (
          <div className="transactions-page__metrics-grid">
            <MetricsCard
              title="Active Transactions"
              value={formatNumber(stats.active)}
              icon={<Activity />}
              variant={stats.active > 10 ? 'warning' : 'default'}
              loading={loading}
            />

            <MetricsCard
              title="Total Transactions"
              value={formatNumber(stats.total)}
              icon={<Activity />}
              variant="default"
              loading={loading}
            />

            <MetricsCard
              title="Success Rate"
              value={formatPercentage(successRate)}
              icon={<Activity />}
              variant={successRate > 0.95 ? 'success' : 'warning'}
              loading={loading}
            />

            <MetricsCard
              title="Average Duration"
              value={stats.averageDuration ? `${stats.averageDuration}ms` : 'N/A'}
              icon={<Activity />}
              variant="default"
              loading={loading}
            />
          </div>
        )}

        {/* Active Transactions */}
        {activeTransactions && activeTransactions.length > 0 && (
          <BaseCard title="Active Transactions" icon={<Activity />} loading={loading}>
            <div className="transactions-page__active-transactions">
              {activeTransactions.map(tx => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
            </div>
          </BaseCard>
        )}

        {/* Transaction History */}
        <BaseCard title="Transaction History" icon={<Activity />} loading={loading}>
          <TransactionHistoryTable
            transactions={filteredData as TransactionHistoryEntry[]}
            loading={loading}
          />
        </BaseCard>
      </div>
    </AdminPageLayout>
  )
}

export default TransactionsPage
