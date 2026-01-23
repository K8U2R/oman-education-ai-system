/**
 * Query Builder Component - مكون بناء الاستعلامات
 *
 * مكون شامل لبناء وتنفيذ الاستعلامات SQL
 */

import React, { useState } from 'react'
import { Code, Play, RefreshCw, Download, Copy, Check } from 'lucide-react'
import { BaseCard } from '../BaseCard'
import { useQueryBuilder } from '@/application/features/database-core'
import { formatDuration, formatNumber } from '@/application/features/database-core/utils'
import { Button } from '@/presentation/components/common'

export interface QueryBuilderProps {
  className?: string
}

/**
 * Query Builder - مكون بناء الاستعلامات
 *
 * @example
 * ```tsx
 * <QueryBuilder />
 * ```
 */
export const QueryBuilder: React.FC<QueryBuilderProps> = ({ className = '' }) => {
  const {
    query,
    result,
    loading,
    error,
    executionTime,
    setQuery,
    executeQuery,
    clearResult,
    formatQuery,
  } = useQueryBuilder()

  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(query)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!result) return

    const csv = [
      result.columns.join(','),
      ...result.rows.map(row => result.columns.map(col => `"${row[col] || ''}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `query-result-${Date.now()}.csv`
    link.click()
  }

  return (
    <div className={`query-builder ${className}`}>
      <BaseCard
        title="Query Builder"
        description="بناء وتنفيذ الاستعلامات SQL"
        icon={<Code />}
        loading={loading}
        error={error?.message}
        actions={
          <div className="query-builder__actions">
            <Button variant="ghost" size="sm" onClick={formatQuery} leftIcon={<Code size={16} />}>
              تنسيق
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
            >
              {copied ? 'تم النسخ' : 'نسخ'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => executeQuery()}
              leftIcon={<Play size={16} />}
              disabled={!query.trim() || loading}
            >
              تنفيذ
            </Button>
          </div>
        }
      >
        <div className="query-builder__container">
          {/* Query Editor */}
          <div className="query-builder__editor">
            <div className="query-builder__editor-header">
              <h3 className="query-builder__editor-title">SQL Query</h3>
              {executionTime !== null && (
                <span className="query-builder__execution-time">
                  {formatDuration(executionTime)}
                </span>
              )}
            </div>
            <textarea
              className="query-builder__textarea"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="اكتب استعلام SQL هنا..."
              spellCheck={false}
            />
          </div>

          {/* Results */}
          {result && (
            <div className="query-builder__results">
              <div className="query-builder__results-header">
                <h3 className="query-builder__results-title">
                  النتائج ({formatNumber(result.rowCount)} صف)
                </h3>
                <div className="query-builder__results-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    leftIcon={<Download size={16} />}
                  >
                    تحميل CSV
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearResult}
                    leftIcon={<RefreshCw size={16} />}
                  >
                    مسح
                  </Button>
                </div>
              </div>
              <div className="query-builder__results-container">
                <table className="query-builder__results-table">
                  <thead>
                    <tr>
                      {result.columns.map((column, index) => (
                        <th key={index}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.slice(0, 500).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {result.columns.map((column, colIndex) => (
                          <td key={colIndex}>{String(row[column] ?? '-')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.rows.length > 500 && (
                  <div className="query-builder__results-note">
                    عرض أول 500 صف من {formatNumber(result.rowCount)} صف
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!result && !loading && !error && (
            <div className="query-builder__empty">
              <Code size={48} />
              <p>اكتب استعلام SQL واضغط "تنفيذ" لعرض النتائج</p>
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  )
}
