/**
 * Monitoring Service Tests - اختبارات خدمة المراقبة
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { monitoringService } from './monitoring.service'
import { apiClient } from '../api/api-client'
import type { ErrorEntry, ErrorStats, PerformanceStats } from './monitoring.service'

vi.mock('../api/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('MonitoringService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getErrorStats', () => {
    it('should fetch error statistics', async () => {
      const mockStats: ErrorStats = {
        total: 100,
        byCategory: { network: 50, database: 30, validation: 20 },
        bySeverity: { high: 10, medium: 40, low: 50 },
        recent: [],
        critical: [],
        unresolved: 20,
        trend: {
          last24h: 10,
          last7d: 50,
          last30d: 100,
        },
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockStats,
      } as never)

      const stats = await monitoringService.getErrorStats()
      expect(stats).toEqual(mockStats)
      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/monitoring/errors/stats')
    })
  })

  describe('getErrors', () => {
    it('should fetch errors without filters', async () => {
      const mockResponse = {
        errors: [
          {
            id: '1',
            message: 'Test error',
            type: 'Error',
            severity: 'high' as const,
            category: 'network' as const,
            timestamp: Date.now(),
            resolved: false,
            occurrences: 1,
            firstOccurrence: Date.now(),
            lastOccurrence: Date.now(),
          },
        ],
        total: 1,
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockResponse,
      } as never)

      const result = await monitoringService.getErrors()
      expect(result).toEqual(mockResponse)
      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/monitoring/errors?')
    })

    it('should fetch errors with filters', async () => {
      const mockResponse = {
        errors: [],
        total: 0,
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockResponse,
      } as never)

      const filter = {
        category: 'network',
        severity: 'high',
        resolved: false,
        limit: 10,
        offset: 0,
      }

      await monitoringService.getErrors(filter)
      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/v1/monitoring/errors?category=network&severity=high&resolved=false&limit=10&offset=0'
      )
    })
  })

  describe('getError', () => {
    it('should fetch error by ID', async () => {
      const mockError: ErrorEntry = {
        id: '1',
        message: 'Test error',
        type: 'Error',
        severity: 'high',
        category: 'network',
        timestamp: Date.now(),
        resolved: false,
        occurrences: 1,
        firstOccurrence: Date.now(),
        lastOccurrence: Date.now(),
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockError,
      } as never)

      const error = await monitoringService.getError('1')
      expect(error).toEqual(mockError)
      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/monitoring/errors/1')
    })
  })

  describe('resolveError', () => {
    it('should resolve error', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(undefined)

      await monitoringService.resolveError('1')
      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/monitoring/errors/1/resolve')
    })
  })

  describe('getPerformanceStats', () => {
    it('should fetch performance statistics', async () => {
      const mockStats: PerformanceStats = {
        totalRequests: 1000,
        averageResponseTime: 150,
        p50: 100,
        p95: 300,
        p99: 500,
        slowEndpoints: [],
        byStatusCode: { 200: 900, 404: 50, 500: 50 },
        byEndpoint: { '/api/users': 100 },
        trend: {
          last1h: 100,
          last24h: 1000,
          last7d: 7000,
        },
        cacheHitRate: 0.8,
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockStats,
      } as never)

      const stats = await monitoringService.getPerformanceStats()
      expect(stats).toEqual(mockStats)
      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/monitoring/performance/stats')
    })
  })

  describe('getPerformanceMetrics', () => {
    it('should fetch performance metrics without filters', async () => {
      const mockResponse = {
        metrics: [
          {
            id: '1',
            endpoint: '/api/users',
            method: 'GET',
            duration: 150,
            statusCode: 200,
            timestamp: Date.now(),
          },
        ],
        total: 1,
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockResponse,
      } as never)

      const result = await monitoringService.getPerformanceMetrics()
      expect(result).toEqual(mockResponse)
      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/monitoring/performance?')
    })

    it('should fetch performance metrics with filters', async () => {
      const mockResponse = {
        metrics: [],
        total: 0,
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockResponse,
      } as never)

      const filter = {
        endpoint: '/api/users',
        method: 'GET',
        minDuration: 100,
        limit: 10,
      }

      await monitoringService.getPerformanceMetrics(filter)
      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/v1/monitoring/performance?endpoint=%2Fapi%2Fusers&method=GET&minDuration=100&limit=10'
      )
    })
  })

  describe('getEndpointPerformance', () => {
    it('should fetch endpoint performance', async () => {
      const mockResponse = {
        endpoint: '/api/users',
        method: 'GET',
        averageDuration: 150,
        count: 100,
        p50: 100,
        p95: 300,
        p99: 500,
        errors: 5,
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockResponse,
      } as never)

      const result = await monitoringService.getEndpointPerformance('/api/users', 'GET')
      expect(result).toEqual(mockResponse)
      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/v1/monitoring/performance/endpoint/%2Fapi%2Fusers?method=GET'
      )
    })

    it('should fetch endpoint performance without method', async () => {
      const mockResponse = {
        endpoint: '/api/users',
        method: 'GET',
        averageDuration: 150,
        count: 100,
        p50: 100,
        p95: 300,
        p99: 500,
        errors: 5,
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockResponse,
      } as never)

      await monitoringService.getEndpointPerformance('/api/users')
      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/v1/monitoring/performance/endpoint/%2Fapi%2Fusers?'
      )
    })
  })
})
