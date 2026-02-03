/**
 * useAdvancedFilter Hook - Hook للفلترة المتقدمة
 *
 * Hook قابل لإعادة الاستخدام للفلترة والبحث في أي بيانات
 */

import { useState, useMemo, useCallback } from 'react'
import type { FilterConfig, SortingConfig } from '../types'

export interface UseAdvancedFilterOptions<T> {
  data: T[]
  searchFields: (keyof T)[]
  filters: FilterConfig<T>[]
  defaultSorting?: SortingConfig
}

export interface UseAdvancedFilterReturn<T> {
  filteredData: T[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  activeFilters: Record<string, unknown>
  setActiveFilters: (filters: Record<string, unknown>) => void
  setFilter: (key: string, value: unknown) => void
  clearFilter: (key: string) => void
  clearFilters: () => void
  sorting: SortingConfig | null
  setSorting: (sorting: SortingConfig | null) => void
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
  setPagination: (pagination: { page: number; perPage: number }) => void
}

/**
 * Hook للفلترة المتقدمة - قابل لإعادة الاستخدام
 *
 * @example
 * ```typescript
 * const {
 *   filteredData,
 *   searchTerm,
 *   setSearchTerm,
 *   activeFilters,
 *   setFilter,
 *   clearFilters,
 * } = useAdvancedFilter({
 *   data: logs,
 *   searchFields: ['action', 'entity', 'actor'],
 *   filters: [
 *     { key: 'action', predicate: (log, value) => log.action === value },
 *     { key: 'entity', predicate: (log, value) => log.entity === value },
 *   ],
 * })
 * ```
 */
export function useAdvancedFilter<T extends Record<string, unknown>>(
  options: UseAdvancedFilterOptions<T>
): UseAdvancedFilterReturn<T> {
  const { data, searchFields, filters, defaultSorting } = options

  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({})
  const [sorting, setSorting] = useState<SortingConfig | null>(defaultSorting || null)
  const [pagination, setPaginationState] = useState({ page: 1, perPage: 50 })

  // Filter and search
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field]
          return value && String(value).toLowerCase().includes(searchLower)
        })
      )
    }

    // Apply filters
    filters.forEach(filter => {
      const filterValue = activeFilters[filter.key]
      if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
        result = result.filter(item => filter.predicate(item, filterValue))
      }
    })

    // Apply sorting
    if (sorting) {
      result.sort((a, b) => {
        const aValue = a[sorting.column]
        const bValue = b[sorting.column]

        if (aValue === bValue) return 0

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue)
          return sorting.direction === 'asc' ? comparison : -comparison
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue
          return sorting.direction === 'asc' ? comparison : -comparison
        }

        // Safe comparison for other comparable types (dates, etc)
        // Convert to string for comparison as we've already handled primitives
        const aStr = String(aValue)
        const bStr = String(bValue)
        const comparison = aStr < bStr ? -1 : 1
        return sorting.direction === 'asc' ? comparison : -comparison
      })
    }

    return result
  }, [data, searchTerm, activeFilters, filters, searchFields, sorting])

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.perPage
    const end = start + pagination.perPage
    return filteredData.slice(start, end)
  }, [filteredData, pagination.page, pagination.perPage])

  const totalPages = Math.ceil(filteredData.length / pagination.perPage)

  const setFilter = useCallback((key: string, value: unknown) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }))
    setPaginationState(prev => ({ ...prev, page: 1 })) // Reset to first page
  }, [])

  const clearFilter = useCallback((key: string) => {
    setActiveFilters(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
    setPaginationState(prev => ({ ...prev, page: 1 }))
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setActiveFilters({})
    setSorting(defaultSorting || null)
    setPaginationState({ page: 1, perPage: 50 })
  }, [defaultSorting])

  const setPagination = useCallback((newPagination: { page: number; perPage: number }) => {
    setPaginationState(newPagination)
  }, [])

  return {
    filteredData: paginatedData,
    searchTerm,
    setSearchTerm,
    activeFilters,
    setActiveFilters,
    setFilter,
    clearFilter,
    clearFilters,
    sorting,
    setSorting,
    pagination: {
      ...pagination,
      total: filteredData.length,
      totalPages,
    },
    setPagination,
  }
}
