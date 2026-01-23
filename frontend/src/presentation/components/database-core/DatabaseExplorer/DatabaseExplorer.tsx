/**
 * Database Explorer Component - مكون استكشاف قاعدة البيانات
 *
 * مكون شامل لاستكشاف الجداول والبيانات
 */

import React, { useState } from 'react'
import {
  Database,
  Table as TableIcon,
  Search,
  RefreshCw,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { BaseCard } from '../BaseCard'
import { useDatabaseExplorer } from '@/application/features/database-core'
import { formatNumber } from '@/application/features/database-core/utils'
import { Button } from '@/presentation/components/common'

export interface DatabaseExplorerProps {
  className?: string
}

/**
 * Database Explorer - مكون استكشاف قاعدة البيانات
 *
 * @example
 * ```tsx
 * <DatabaseExplorer />
 * ```
 */
export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({ className = '' }) => {
  const { tables, selectedTable, tableSchema, tableData, loading, error, selectTable, refresh } =
    useDatabaseExplorer({ autoLoad: true })

  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['tables']))

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <div className={`database-explorer ${className}`}>
      <BaseCard
        title="Database Explorer"
        description="استكشف الجداول والبيانات"
        icon={<Database />}
        loading={loading}
        error={error?.message}
        actions={
          <Button variant="ghost" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
            تحديث
          </Button>
        }
      >
        <div className="database-explorer__container">
          {/* Tables List */}
          <div className="database-explorer__sidebar">
            <div className="database-explorer__search">
              <Search size={16} />
              <input
                type="text"
                placeholder="ابحث عن جدول..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="database-explorer__search-input"
              />
            </div>

            <div className="database-explorer__tables-header">
              <button
                className="database-explorer__section-toggle"
                onClick={() => toggleSection('tables')}
              >
                {expandedSections.has('tables') ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <TableIcon size={16} />
                <span>الجداول ({filteredTables.length})</span>
              </button>
            </div>

            {expandedSections.has('tables') && (
              <div className="database-explorer__tables-list">
                {filteredTables.length === 0 ? (
                  <div className="database-explorer__empty">
                    {loading ? 'جاري التحميل...' : 'لا توجد جداول'}
                  </div>
                ) : (
                  filteredTables.map(table => (
                    <button
                      key={table.id || table.name}
                      className={`database-explorer__table-item ${
                        selectedTable?.name === table.name
                          ? 'database-explorer__table-item--active'
                          : ''
                      }`}
                      onClick={() => selectTable(table)}
                    >
                      <TableIcon size={14} />
                      <span className="database-explorer__table-name">{table.name}</span>
                      {table.rowCount !== undefined && (
                        <span className="database-explorer__table-count">
                          {formatNumber(table.rowCount)}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Table Details */}
          <div className="database-explorer__content">
            {!selectedTable ? (
              <div className="database-explorer__empty-state">
                <Database size={48} />
                <p>اختر جدولاً لعرض التفاصيل</p>
              </div>
            ) : (
              <>
                {/* Schema */}
                {tableSchema && (
                  <div className="database-explorer__schema">
                    <h3 className="database-explorer__section-title">Schema</h3>
                    <div className="database-explorer__columns">
                      <table className="database-explorer__schema-table">
                        <thead>
                          <tr>
                            <th>العمود</th>
                            <th>النوع</th>
                            <th>Nullable</th>
                            <th>Primary Key</th>
                            <th>Default</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableSchema.columns.map((column, index) => (
                            <tr key={index}>
                              <td>{column.name}</td>
                              <td>
                                <code>{column.type}</code>
                              </td>
                              <td>{column.nullable ? 'نعم' : 'لا'}</td>
                              <td>{column.primaryKey ? '✓' : ''}</td>
                              <td>{column.defaultValue?.toString() || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Data */}
                {tableData && (
                  <div className="database-explorer__data">
                    <h3 className="database-explorer__section-title">
                      البيانات ({formatNumber(tableData.rowCount)} صف)
                    </h3>
                    <div className="database-explorer__data-container">
                      <table className="database-explorer__data-table">
                        <thead>
                          <tr>
                            {tableData.columns.map((column, index) => (
                              <th key={index}>{column}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.rows.slice(0, 100).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {tableData.columns.map((column, colIndex) => (
                                <td key={colIndex}>{row[column]?.toString() || '-'}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {tableData.rows.length > 100 && (
                        <div className="database-explorer__data-note">
                          عرض أول 100 صف من {formatNumber(tableData.rowCount)} صف
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </BaseCard>
    </div>
  )
}
