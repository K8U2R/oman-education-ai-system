/**
 * useApi Hook - Hook أساسي للـ API calls
 *
 * Hook قابل لإعادة الاستخدام لجميع API calls
 * يطبق DRY Principle لتجنب تكرار الكود
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import type { ApiResponse } from '../types'

export interface UseApiOptions<T> {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  autoFetch?: boolean
  interval?: number
  transform?: (data: unknown) => T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  clearError: () => void
}

/**
 * Hook أساسي للـ API calls
 *
 * @example
 * ```typescript
 * const { data, loading, error, refresh } = useApi<Metrics>({
 *   endpoint: '/api/metrics/performance',
 *   interval: 5000, // Auto-refresh every 5 seconds
 *   transform: (data) => data as Metrics,
 * })
 * ```
 */
export function useApi<T = unknown>(options: UseApiOptions<T>): UseApiReturn<T> {
  const {
    endpoint,
    method = 'GET',
    body,
    autoFetch = true,
    interval,
    transform,
    onSuccess,
    onError,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let response: ApiResponse<T>

      switch (method) {
        case 'GET':
          response = await apiClient.get<ApiResponse<T>>(endpoint)
          break
        case 'POST':
          response = await apiClient.post<ApiResponse<T>>(endpoint, body)
          break
        case 'PUT':
          response = await apiClient.put<ApiResponse<T>>(endpoint, body)
          break
        case 'DELETE':
          response = await apiClient.delete<ApiResponse<T>>(endpoint)
          break
        case 'PATCH':
          response = await apiClient.patch<ApiResponse<T>>(endpoint, body)
          break
        default:
          throw new Error(`Unsupported HTTP method: ${method}`)
      }

      if (!response.success) {
        throw new Error(response.error?.message || 'API request failed')
      }

      const transformedData = transform ? transform(response.data) : (response.data as T)

      setData(transformedData)
      onSuccess?.(transformedData)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)
      return undefined
    } finally {
      setLoading(false)
    }
  }, [endpoint, method, body, transform, onSuccess, onError])

  useEffect(() => {
    if (autoFetch) {
      fetchData()

      if (interval && interval > 0) {
        intervalRef.current = setInterval(fetchData, interval)
        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }
      }
    }
    return undefined
  }, [autoFetch, fetchData, interval])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    clearError,
  }
}
