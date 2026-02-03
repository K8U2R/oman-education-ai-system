/**
 * Search Service - خدمة البحث
 *
 * خدمة للتعامل مع API البحث
 */

import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { API_ENDPOINTS } from '@/domain/constants/api.constants'
import { SearchResult } from '@/presentation/components/layout/types'

export interface SearchParams {
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
