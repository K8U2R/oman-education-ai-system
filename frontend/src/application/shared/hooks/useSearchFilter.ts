/**
 * useSearchFilter Hook - Hook للبحث والتصفية
 *
 * Hook موحد لإدارة البحث والتصفية في الجداول والقوائم
 * يقلل التكرار في كود search/filter logic
 */

import { useState, useMemo, useCallback } from 'react'

export interface SearchFilterConfig<T> {
  /**
   * دالة البحث (تحدد كيف يتم البحث)
   */
  searchFn?: (item: T, searchTerm: string) => boolean

  /**
   * الحقول التي سيتم البحث فيها (افتراضي: جميع الحقول النصية)
   */
  searchFields?: (keyof T)[]

  /**
   * دالة التصفية (تحدد كيف يتم التصفية)
   */
  filterFn?: (item: T, filter: string) => boolean

  /**
   * خيارات التصفية المتاحة
   */
  filterOptions?: Array<{
    value: string
    label: string
    filterFn?: (item: T) => boolean
  }>
}

export interface UseSearchFilterReturn<T> {
  /**
   * نص البحث
   */
  searchTerm: string

  /**
   * التصفية المحددة
   */
  filter: string

  /**
   * تحديث نص البحث
   */
  setSearchTerm: (term: string) => void

  /**
   * تحديث التصفية
   */
  setFilter: (filter: string) => void

  /**
   * البيانات المفلترة
   */
  filteredData: T[]

  /**
   * إعادة تعيين البحث والتصفية
   */
  reset: () => void
}

/**
 * Hook للبحث والتصفية
 *
 * @param data - البيانات المراد البحث والتصفية فيها
 * @param config - إعدادات البحث والتصفية
 * @returns معلومات البحث والتصفية
 *
 * @example
 * ```tsx
 * const { searchTerm, filter, setSearchTerm, setFilter, filteredData } = useSearchFilter(users, {
 *   searchFields: ['email', 'firstName', 'lastName'],
 *   filterOptions: [
 *     { value: 'all', label: 'الكل' },
 *     { value: 'active', label: 'نشط', filterFn: (user) => user.isActive },
 *     { value: 'inactive', label: 'غير نشط', filterFn: (user) => !user.isActive },
 *   ],
 * })
 * ```
 */
export function useSearchFilter<T>(
  data: T[],
  config: SearchFilterConfig<T> = {}
): UseSearchFilterReturn<T> {
  const { searchFn, searchFields, filterFn, filterOptions = [] } = config

  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState(filterOptions[0]?.value || 'all')

  // دالة البحث الافتراضية
  const defaultSearchFn = useCallback(
    (item: T, term: string): boolean => {
      if (!term) return true

      const termLower = term.toLowerCase()

      if (searchFields && searchFields.length > 0) {
        // البحث في الحقول المحددة
        return searchFields.some(field => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const value = (item as any)[field]
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(termLower)
        })
      }

      // البحث في جميع الحقول النصية
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Object.values(item as any).some(value => {
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(termLower)
      })
    },
    [searchFields]
  )

  // دالة التصفية الافتراضية
  const defaultFilterFn = useCallback(
    (item: T, filterValue: string): boolean => {
      if (filterValue === 'all') return true

      const filterOption = filterOptions.find(opt => opt.value === filterValue)
      if (filterOption?.filterFn) {
        return filterOption.filterFn(item)
      }

      if (filterFn) {
        return filterFn(item, filterValue)
      }

      return true
    },
    [filterOptions, filterFn]
  )

  // البيانات المفلترة
  const filteredData = useMemo(() => {
    let result = data

    // تطبيق البحث
    if (searchTerm) {
      const search = searchFn || defaultSearchFn
      result = result.filter(item => search(item, searchTerm))
    }

    // تطبيق التصفية
    if (filter && filter !== 'all') {
      const filterFunction = defaultFilterFn
      result = result.filter(item => filterFunction(item, filter))
    }

    return result
  }, [data, searchTerm, filter, searchFn, defaultSearchFn, defaultFilterFn])

  // إعادة تعيين
  const reset = useCallback(() => {
    setSearchTerm('')
    setFilter(filterOptions[0]?.value || 'all')
  }, [filterOptions])

  return {
    searchTerm,
    filter,
    setSearchTerm,
    setFilter,
    filteredData,
    reset,
  }
}
