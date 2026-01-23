/**
 * useDeveloper Hook Tests - اختبارات Hook المطور
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDeveloper } from './useDeveloper'
import { useDeveloperStore } from '../store'

// Mock dependencies
vi.mock('../store')

describe('useDeveloper', () => {
  const mockStoreState = {
    stats: null,
    endpoints: [],
    services: [],
    performance: [],
    isLoading: false,
    error: null,
    fetchStats: vi.fn(),
    fetchEndpoints: vi.fn(),
    fetchServices: vi.fn(),
    fetchPerformance: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDeveloperStore).mockReturnValue(
      mockStoreState as unknown as ReturnType<typeof useDeveloperStore>
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state from store', () => {
      const { result } = renderHook(() => useDeveloper())

      expect(result.current.stats).toBeNull()
      expect(result.current.endpoints).toEqual([])
      expect(result.current.services).toEqual([])
      expect(result.current.performance).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('auto-fetch', () => {
    it('should auto-fetch all data on mount by default', async () => {
      renderHook(() => useDeveloper())

      await waitFor(() => {
        expect(mockStoreState.fetchStats).toHaveBeenCalled()
        expect(mockStoreState.fetchEndpoints).toHaveBeenCalled()
        expect(mockStoreState.fetchServices).toHaveBeenCalled()
        expect(mockStoreState.fetchPerformance).toHaveBeenCalled()
      })
    })

    it('should not auto-fetch when autoFetch is false', async () => {
      renderHook(() => useDeveloper({ autoFetch: false }))

      await waitFor(() => {
        expect(mockStoreState.fetchStats).not.toHaveBeenCalled()
        expect(mockStoreState.fetchEndpoints).not.toHaveBeenCalled()
        expect(mockStoreState.fetchServices).not.toHaveBeenCalled()
        expect(mockStoreState.fetchPerformance).not.toHaveBeenCalled()
      })
    })
  })

  describe('fetchAll', () => {
    it('should fetch all data', async () => {
      const { result } = renderHook(() => useDeveloper())

      await result.current.fetchAll()

      expect(mockStoreState.fetchStats).toHaveBeenCalled()
      expect(mockStoreState.fetchEndpoints).toHaveBeenCalled()
      expect(mockStoreState.fetchServices).toHaveBeenCalled()
      expect(mockStoreState.fetchPerformance).toHaveBeenCalled()
    })
  })

  describe('refresh', () => {
    it('should refresh all data', async () => {
      const { result } = renderHook(() => useDeveloper())

      await result.current.refresh()

      expect(mockStoreState.fetchStats).toHaveBeenCalled()
      expect(mockStoreState.fetchEndpoints).toHaveBeenCalled()
      expect(mockStoreState.fetchServices).toHaveBeenCalled()
      expect(mockStoreState.fetchPerformance).toHaveBeenCalled()
    })
  })

  describe('refresh interval', () => {
    it('should set up refresh interval when provided', async () => {
      vi.useFakeTimers()

      renderHook(() => useDeveloper({ refreshInterval: 1000 }))

      await waitFor(() => {
        expect(mockStoreState.fetchStats).toHaveBeenCalled()
      })

      vi.advanceTimersByTime(1000)

      await waitFor(() => {
        expect(mockStoreState.fetchStats).toHaveBeenCalledTimes(2)
      })

      vi.useRealTimers()
    })

    it('should clear interval on unmount', async () => {
      vi.useFakeTimers()

      const { unmount } = renderHook(() => useDeveloper({ refreshInterval: 1000 }))

      await waitFor(() => {
        expect(mockStoreState.fetchStats).toHaveBeenCalled()
      })

      unmount()

      vi.advanceTimersByTime(1000)

      await waitFor(() => {
        // Should not be called again after unmount
        expect(mockStoreState.fetchStats).toHaveBeenCalledTimes(1)
      })

      vi.useRealTimers()
    })
  })

  describe('individual fetch methods', () => {
    it('should fetch stats', async () => {
      const { result } = renderHook(() => useDeveloper())

      await result.current.fetchStats()

      expect(mockStoreState.fetchStats).toHaveBeenCalled()
    })

    it('should fetch endpoints', async () => {
      const { result } = renderHook(() => useDeveloper())

      await result.current.fetchEndpoints()

      expect(mockStoreState.fetchEndpoints).toHaveBeenCalled()
    })

    it('should fetch services', async () => {
      const { result } = renderHook(() => useDeveloper())

      await result.current.fetchServices()

      expect(mockStoreState.fetchServices).toHaveBeenCalled()
    })

    it('should fetch performance', async () => {
      const { result } = renderHook(() => useDeveloper())

      await result.current.fetchPerformance()

      expect(mockStoreState.fetchPerformance).toHaveBeenCalled()
    })
  })
})
