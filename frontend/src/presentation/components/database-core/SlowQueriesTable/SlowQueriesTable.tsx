/**
 * Slow Queries Table Component - جدول الاستعلامات البطيئة
 *
 * مكون متخصص لعرض Slow Queries
 */

import React from 'react'
import { BaseCard } from '../BaseCard'
import { formatDuration } from '@/application/features/database-core/utils'
import type { SlowQuery } from '@/application/features/database-core/types'

export interface SlowQueriesTableProps {
  queries?: SlowQuery[]
  loading?: boolean
  error?: Error | null
  maxRows?: number
  className?: string
}

/**
 * Slow Queries Table - جدول الاستعلامات البطيئة
 *
 * @example
 * ```tsx
 * <SlowQueriesTable queries={slowQueries} loading={loading} />
 * ```
 */
export const SlowQueriesTable: React.FC<SlowQueriesTableProps> = ({
  queries = [],
  loading = false,
  error = null,
  maxRows = 10,
  className = '',
}) => {
  const displayedQueries = queries.slice(0, maxRows)

  return (
    <BaseCard
      title="Slow Queries"
      description="الاستعلامات التي تستغرق وقتاً طويلاً"
      loading={loading}
      error={error?.message}
      className={`slow-queries-table ${className}`}
    >
      {displayedQueries.length === 0 ? (
        <div className="slow-queries-table__empty">
          <p>لا توجد استعلامات بطيئة</p>
        </div>
      ) : (
        <div className="slow-queries-table__container">
          <table className="slow-queries-table__table">
            <thead>
              <tr>
                <th>الاستعلام</th>
                <th>المدة</th>
                <th>العدد</th>
                <th>الجدول</th>
                <th>الوقت</th>
              </tr>
            </thead>
            <tbody>
              {displayedQueries.map((query, index) => (
                <tr key={`${query.query}-${index}`}>
                  <td className="slow-queries-table__query-cell">
                    <code className="slow-queries-table__query-code">{query.query}</code>
                  </td>
                  <td className="slow-queries-table__duration-cell">
                    <span className="slow-queries-table__duration-badge">
                      {formatDuration(query.duration)}
                    </span>
                  </td>
                  <td>{query.count}</td>
                  <td>{query.entity}</td>
                  <td>{new Date(query.timestamp).toLocaleString('ar-SA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BaseCard>
  )
}
