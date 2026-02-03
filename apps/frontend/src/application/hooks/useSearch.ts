/**
 * useSearch Hook - Hook للبحث
 *
 * Hook موحد للبحث في البيانات
 * يقلل التكرار في كود search logic
 */

import { useState, useMemo, useCallback } from 'react'

export interface UseSearchOptions<T> {
  /**
   * الحقول التي سيتم البحث فيها
   */
  searchFields?: (keyof T)[]

  /**
   * دالة بحث مخصصة
   */
  customSearchFn?: (item: T, term: string) => boolean

  /**
   * هل البحث case-sensitive؟
   */
  caseSensitive?: boolean
}

export interface UseSearchReturn<T> {
  /**
   * نص البحث
   */
  searchTerm: string

  /**
   * تحديث نص البحث
   */
  setSearchTerm: (term: string) => void

  /**
   * البيانات المفلترة
   */
  filteredData: T[]

  /**
   * مسح البحث
   */
  clearSearch: () => void

  /**
   * عدد النتائج
   */
  resultCount: number
}

/**
 * Hook للبحث في البيانات
 *
 * @param data - البيانات المراد البحث فيها
 * @param options - خيارات البحث
 * @returns معلومات البحث والبيانات المفلترة
 *
 * @example
 * ```tsx
 * const { searchTerm, setSearchTerm, filteredData } = useSearch(lessons, {
 *   searchFields: ['title', 'content'],
 * })
 * ```
 */
export function useSearch<T = Record<string, unknown>>(
  data: T[] | null | undefined,
  options: UseSearchOptions<T> = {}
): UseSearchReturn<T> {
  const { searchFields, customSearchFn, caseSensitive = false } = options

  const [searchTerm, setSearchTerm] = useState<string>('')

  const filteredData = useMemo(() => {
    // Ensure data is always an array (moved inside useMemo)
    const safeData = Array.isArray(data) ? data : []

    if (!searchTerm) {
      return safeData
    }

    const term = caseSensitive ? searchTerm : searchTerm.toLowerCase()

    return safeData.filter(item => {
      if (customSearchFn) {
        return customSearchFn(item, searchTerm)
      }

      if (searchFields && searchFields.length > 0) {
        return searchFields.some(field => {
          const value = item[field]
          if (value === null || value === undefined) {
            return false
          }
          const stringValue = String(value)
          const searchValue = caseSensitive ? stringValue : stringValue.toLowerCase()
          return searchValue.includes(term)
        })
      }

      // البحث في جميع الحقول النصية
      return Object.values(item as Record<string, unknown>).some(value => {
        if (value === null || value === undefined) {
          return false
        }
        const stringValue = String(value)
        const searchValue = caseSensitive ? stringValue : stringValue.toLowerCase()
        return searchValue.includes(term)
      })
    })
  }, [data, searchTerm, searchFields, customSearchFn, caseSensitive])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
  }, [])

  const resultCount = filteredData.length

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    clearSearch,
    resultCount,
  }
}
