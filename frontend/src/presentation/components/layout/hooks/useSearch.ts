/**
 * useSearch Hook - Hook للبحث
 *
 * Custom Hook لإدارة البحث
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { SearchResult } from '../types'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/domain/constants/routes.constants'
import { storageAdapter } from '@/infrastructure/services/storage'
import { searchService } from '@/application'

const SEARCH_HISTORY_KEY = 'search_history'
const MAX_HISTORY_ITEMS = 10

export const useSearch = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const navigate = useNavigate()

  // Load search history from storage
  useEffect(() => {
    try {
      const storedHistory = storageAdapter.get(SEARCH_HISTORY_KEY)
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory))
      }
    } catch (error) {
      console.error('Failed to load search history:', error)
    }
  }, [])

  // Save search to history
  const saveToHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return

    setHistory(prev => {
      const newHistory = [searchQuery, ...prev.filter(item => item !== searchQuery)].slice(
        0,
        MAX_HISTORY_ITEMS
      )

      try {
        storageAdapter.set(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
      } catch (error) {
        console.error('Failed to save search history:', error)
      }

      return newHistory
    })
  }, [])

  // Clear search history
  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      storageAdapter.remove(SEARCH_HISTORY_KEY)
    } catch (error) {
      console.error('Failed to clear search history:', error)
    }
  }, [])

  const search = useCallback(
    async (searchQuery: string) => {
      setQuery(searchQuery)
      setIsLoading(true)
      setIsOpen(true)

      try {
        // Call real API
        const response = await searchService.search({
          q: searchQuery,
          limit: 20,
        })

        // Convert API response to SearchResult format
        interface SearchApiResult {
          id: string
          type: string
          title: string
          description?: string
          url?: string
          metadata?: Record<string, unknown>
        }
        const searchResults: SearchResult[] = response.results.map((result: SearchApiResult) => ({
          id: result.id,
          type: result.type as SearchResult['type'],
          title: result.title,
          description: result.description,
          url: result.url || ROUTES.LESSONS,
          metadata: result.metadata,
        }))

        setResults(searchResults)

        // Save to history if there are results
        if (searchResults.length > 0 && searchQuery.trim()) {
          saveToHistory(searchQuery)
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [saveToHistory]
  )

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }, [])

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      navigate(result.url)
      clearSearch()
    },
    [navigate, clearSearch]
  )

  const hasResults = useMemo(() => results.length > 0, [results])

  return {
    query,
    results,
    isLoading,
    isOpen,
    hasResults,
    history,
    search,
    clearSearch,
    clearHistory,
    handleResultClick,
    setIsOpen,
  }
}
