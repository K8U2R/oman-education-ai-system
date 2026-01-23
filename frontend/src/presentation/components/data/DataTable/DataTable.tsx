/**
 * DataTable Component - مكون جدول البيانات
 *
 * مكون جدول بيانات متقدم مع البحث والترتيب والفلترة
 */

import React, { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search, Download, Filter } from 'lucide-react'
import { Input, Button } from '../../common'
import { cn } from '../../common/utils/classNames'

export interface DataTableColumn<T = unknown> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  width?: string
  align?: 'left' | 'right' | 'center'
}

export interface DataTableProps<T = unknown> {
  data: T[]
  columns: DataTableColumn<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  sortable?: boolean
  filterable?: boolean
  pagination?: boolean
  pageSize?: number
  onRowClick?: (row: T) => void
  className?: string
  emptyMessage?: string
  actions?: (row: T) => React.ReactNode
}

export const DataTable = <T,>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'بحث...',
  sortable = true,
  filterable = false,
  pagination = true,
  pageSize = 10,
  onRowClick,
  className = '',
  emptyMessage = 'لا توجد بيانات',
  actions,
}: DataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  // Compute effective columns including actions if provided
  const effectiveColumns = useMemo(() => {
    if (!actions) return columns
    return [
      ...columns,
      {
        key: '__actions',
        label: 'إجراءات',
        render: (_: unknown, row: T) => actions(row),
        sortable: false,
        align: 'left',
      } as DataTableColumn<T>,
    ]
  }, [columns, actions])

  // Filter data
  const filteredData = useMemo(() => {
    // Ensure data is always an array (moved inside useMemo)
    const safeData = Array.isArray(data) ? data : []
    let filtered = [...safeData]

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(row => {
        const rowRecord = row as Record<string, unknown>
        return effectiveColumns.some(col => {
          if (col.key === '__actions') return false
          const value = rowRecord[col.key]
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        })
      })
    }

    // Apply sorting
    if (sortColumn && sortable) {
      filtered.sort((a, b) => {
        const aRecord = a as Record<string, unknown>
        const bRecord = b as Record<string, unknown>
        const aValue = aRecord[sortColumn] as unknown
        const bValue = bRecord[sortColumn] as unknown

        if (aValue === bValue) return 0

        // Handle different types for comparison
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue)
          return sortDirection === 'asc' ? comparison : -comparison
        }

        const comparison = String(aValue) > String(bValue) ? 1 : -1
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return filtered
  }, [data, searchQuery, sortColumn, sortDirection, effectiveColumns, sortable])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, pageSize, pagination])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const handleSort = (columnKey: string) => {
    if (!sortable) return

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const handleExport = () => {
    // Export to CSV
    const exportColumns = effectiveColumns.filter(col => col.key !== '__actions')
    const headers = exportColumns.map(col => col.label).join(',')
    const rows = filteredData.map(row => {
      const rowRecord = row as Record<string, unknown>
      return exportColumns.map(col => String(rowRecord[col.key] || '')).join(',')
    })
    const csv = [headers, ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-${new Date().toISOString()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className={cn('data-table-wrapper', className)}>
      {/* Toolbar */}
      <div className="data-table__toolbar">
        {searchable && (
          <div className="data-table__search">
            <Input
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              leftIcon={<Search className="w-4 h-4" />}
              fullWidth
            />
          </div>
        )}

        <div className="data-table__actions">
          {filterable && (
            <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
              فلترة
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            تصدير
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="data-table__container">
        <table className="data-table">
          <thead>
            <tr>
              {effectiveColumns.map(column => (
                <th
                  key={column.key}
                  className={cn(
                    'data-table__header',
                    sortable && column.sortable !== false && 'data-table__header--sortable',
                    sortColumn === column.key && 'data-table__header--sorted'
                  )}
                  style={{ width: column.width, textAlign: column.align || 'right' }}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="data-table__header-content">
                    <span>{column.label}</span>
                    {sortable && column.sortable !== false && (
                      <div className="data-table__sort-icons">
                        <ChevronUp
                          className={cn(
                            'data-table__sort-icon',
                            sortColumn === column.key &&
                              sortDirection === 'asc' &&
                              'data-table__sort-icon--active'
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            'data-table__sort-icon',
                            sortColumn === column.key &&
                              sortDirection === 'desc' &&
                              'data-table__sort-icon--active'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={effectiveColumns.length} className="data-table__empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn('data-table__row', onRowClick && 'data-table__row--clickable')}
                  onClick={() => onRowClick?.(row)}
                >
                  {effectiveColumns.map(column => (
                    <td
                      key={column.key}
                      className="data-table__cell"
                      style={{ textAlign: column.align || 'right' }}
                    >
                      {column.render
                        ? (column.render(
                            (row as Record<string, unknown>)[column.key],
                            row
                          ) as React.ReactNode) || '-'
                        : String((row as Record<string, unknown>)[column.key] || '') || '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="data-table__pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            السابق
          </Button>

          <div className="data-table__pagination-info">
            صفحة {currentPage} من {totalPages} ({filteredData.length} عنصر)
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  )
}
