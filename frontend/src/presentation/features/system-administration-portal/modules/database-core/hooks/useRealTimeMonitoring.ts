/**
 * useRealTimeMonitoring Hook - Hook للـ Real-time monitoring
 *
 * Hook متقدم لمراقبة عدة endpoints في نفس الوقت
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import type { ApiResponse } from '../types'

export interface UseRealTimeMonitoringOptions {
  endpoints: string[]
  interval?: number
  enabled?: boolean
  onUpdate?: (data: Record<string, unknown>) => void
  onError?: (errors: Record<string, Error>) => void
}

export interface UseRealTimeMonitoringReturn {
  data: Record<string, unknown>
  errors: Record<string, Error>
  loading: boolean
  refresh: () => Promise<void>
}

/**
 * Hook للـ Real-time monitoring - مراقبة عدة endpoints
 *
 * @example
 * ```typescript
 * const { data, errors, loading } = useRealTimeMonitoring({
 *   endpoints: [
 *     '/api/metrics/performance',
 *     '/api/pool/stats',
 *     '/api/cache/stats',
 *   ],
 *   interval: 2000,
 * })
 * ```
 */
export function useRealTimeMonitoring(
  options: UseRealTimeMonitoringOptions
): UseRealTimeMonitoringReturn {
  const { endpoints, interval = 1000, enabled = true, onUpdate, onError } = options

  const [data, setData] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, Error>>({})
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchAll = useCallback(async () => {
    if (!enabled || endpoints.length === 0) return

    setLoading(true)

    try {
      const results = await Promise.allSettled(
        endpoints.map(async endpoint => {
          const response = await apiClient.get<ApiResponse>(endpoint)
          return { endpoint, data: response.data }
        })
      )

      const newData: Record<string, unknown> = {}
      const newErrors: Record<string, Error> = {}

      results.forEach((result, index) => {
        const endpoint = endpoints[index]
        if (!endpoint) return // Guard against undefined endpoint

        if (result.status === 'fulfilled') {
          newData[endpoint] = result.value.data
          // Remove error if it was previously set
          if (errors[endpoint]) {
            delete newErrors[endpoint]
          }
        } else {
          const error =
            result.reason instanceof Error ? result.reason : new Error(String(result.reason))
          newErrors[endpoint] = error
        }
      })

      setData(prev => ({ ...prev, ...newData }))
      setErrors(prev => {
        const updated = { ...prev, ...newErrors }
        // Remove resolved errors
        Object.keys(newErrors).forEach(key => {
          if (!newErrors[key]) {
            delete updated[key]
          }
        })
        return updated
      })

      if (Object.keys(newData).length > 0) {
        onUpdate?.(newData)
      }
      if (Object.keys(newErrors).length > 0) {
        onError?.(newErrors)
      }
    } catch (error) {
      console.error('Real-time monitoring error:', error)
    } finally {
      setLoading(false)
    }
  }, [endpoints, enabled, errors, onUpdate, onError])

  useEffect(() => {
    if (enabled) {
      fetchAll()

      if (interval > 0) {
        intervalRef.current = setInterval(fetchAll, interval)
        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }
      }
    }
    return undefined
  }, [enabled, fetchAll, interval])

  return {
    data,
    errors,
    loading,
    refresh: fetchAll,
  }
}
