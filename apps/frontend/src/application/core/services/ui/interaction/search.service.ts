/**
 * Search Service - خدمة البحث
 *
 * خدمة للتعامل مع API البحث
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { API_ENDPOINTS } from '@/domain/constants/api.constants'
import { SearchResult } from '@/presentation/components/layout/types'

// Search types are imported from layout types
// If these are needed locally, we re-export them or define them here if layout types is not the source of truth
// Checking imports: import { SearchResult } from '@/presentation/components/layout/types'
// It seems SearchResult is imported. We should re-export it or define SearchOptions.

export type { SearchResult } // Re-export imported type

export interface SearchOptions {
  q: string
  type?: string[]
  limit?: number
  offset?: number
}

// SearchParams interface was defined, maybe it should be renamed to SearchOptions matches the interface usage
export interface SearchParams { // Keep for backward compat if needed, or alias
  q: string
  type?: string[]
  limit?: number
  offset?: number
}

export interface SearchResponse {
  results: SearchResult[]
  results_by_type: Record<string, SearchResult[]>
  total: number
  query: string
  limit: number
  offset: number
}

class SearchService {
  /**
   * البحث في جميع الموارد
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    try {
      const response = await apiClient.get<SearchResponse>(API_ENDPOINTS.SEARCH.SEARCH, {
        params: {
          q: params.q,
          type: params.type,
          limit: params.limit || 20,
          offset: params.offset || 0,
        },
      })
      return response
    } catch (error: unknown) {
      console.error('Search error:', error)
      throw error
    }
  }
}

export const searchService = new SearchService()
