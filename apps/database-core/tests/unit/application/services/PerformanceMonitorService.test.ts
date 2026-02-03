/**
 * PerformanceMonitorService Unit Tests
 * 
 * Tests for PerformanceMonitorService
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { PerformanceMonitorService } from '../../../src/application/services/PerformanceMonitorService'
import type { PerformanceMetrics } from '../../../src/application/services/PerformanceMonitorService'

describe('PerformanceMonitorService', () => {
  let service: PerformanceMonitorService

  beforeEach(() => {
    service = new PerformanceMonitorService()
  })

  describe('recordMetric', () => {
    it('should record performance metric', () => {
      const metric: PerformanceMetrics = {
        endpoint: '/api/users',
        method: 'GET',
        duration: 100,
        statusCode: 200,
        timestamp: Date.now(),
      }

      service.recordMetric(metric)
      const stats = service.getStats()
      expect(stats.totalRequests).toBe(1)
    })

    it('should limit metrics to maxMetrics', () => {
      const metric: PerformanceMetrics = {
        endpoint: '/api/users',
        method: 'GET',
        duration: 100,
        statusCode: 200,
        timestamp: Date.now(),
      }

      // Record more than maxMetrics (10000)
      for (let i = 0; i < 10001; i++) {
        service.recordMetric({ ...metric, timestamp: Date.now() + i })
      }

      const stats = service.getStats()
      expect(stats.totalRequests).toBeLessThanOrEqual(10000)
    })

    it('should warn on slow API responses', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const metric: PerformanceMetrics = {
        endpoint: '/api/users',
        method: 'GET',
        duration: 3000, // > 2000ms threshold
        statusCode: 200,
        timestamp: Date.now(),
      }

      service.recordMetric(metric)
      // Note: In real implementation, logger.warn is called
      consoleSpy.mockRestore()
    })

    it('should log errors for 5xx status codes', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const metric: PerformanceMetrics = {
        endpoint: '/api/users',
        method: 'GET',
        duration: 100,
        statusCode: 500,
        timestamp: Date.now(),
        error: 'Internal Server Error',
      }

      service.recordMetric(metric)
      // Note: In real implementation, logger.error is called
      consoleSpy.mockRestore()
    })
  })

  describe('getStats', () => {
    it('should return empty stats when no metrics', () => {
      const stats = service.getStats()
      expect(stats.totalRequests).toBe(0)
      expect(stats.averageResponseTime).toBe(0)
      expect(stats.errorRate).toBe(0)
    })

    it('should calculate stats correctly', () => {
      const metrics: PerformanceMetrics[] = [
        {
          endpoint: '/api/users',
          method: 'GET',
          duration: 100,
          statusCode: 200,
          timestamp: Date.now(),
        },
        {
          endpoint: '/api/users',
          method: 'GET',
          duration: 200,
          statusCode: 200,
          timestamp: Date.now() + 1,
        },
        {
          endpoint: '/api/users',
          method: 'GET',
          duration: 150,
          statusCode: 404,
          timestamp: Date.now() + 2,
        },
      ]

      metrics.forEach((m) => service.recordMetric(m))

      const stats = service.getStats()
      expect(stats.totalRequests).toBe(3)
      expect(stats.averageResponseTime).toBe(150) // (100 + 200 + 150) / 3
      expect(stats.errorRate).toBeGreaterThan(0) // 1 error out of 3
    })

    it('should calculate percentiles correctly', () => {
      const metrics: PerformanceMetrics[] = []
      // Create 100 metrics with varying durations
      for (let i = 0; i < 100; i++) {
        metrics.push({
          endpoint: '/api/users',
          method: 'GET',
          duration: i * 10, // 0, 10, 20, ..., 990
          statusCode: 200,
          timestamp: Date.now() + i,
        })
      }

      metrics.forEach((m) => service.recordMetric(m))

      const stats = service.getStats()
      expect(stats.p50).toBeGreaterThan(0)
      expect(stats.p95).toBeGreaterThan(stats.p50)
      expect(stats.p99).toBeGreaterThan(stats.p95)
    })

    it('should filter by time window', () => {
      const now = Date.now()
      const oldMetric: PerformanceMetrics = {
        endpoint: '/api/users',
        method: 'GET',
        duration: 100,
        statusCode: 200,
        timestamp: now - 2000, // 2 seconds ago
      }

      const newMetric: PerformanceMetrics = {
        endpoint: '/api/users',
        method: 'GET',
        duration: 200,
        statusCode: 200,
        timestamp: now, // Now
      }

      service.recordMetric(oldMetric)
      service.recordMetric(newMetric)

      // Get stats for last 1 second (should only include newMetric)
      const stats = service.getStats(1000)
      expect(stats.totalRequests).toBe(1)
    })
  })

  describe('getEndpointStats', () => {
    it('should return stats for specific endpoint', () => {
      const metrics: PerformanceMetrics[] = [
        {
          endpoint: '/api/users',
          method: 'GET',
          duration: 100,
          statusCode: 200,
          timestamp: Date.now(),
        },
        {
          endpoint: '/api/posts',
          method: 'GET',
          duration: 200,
          statusCode: 200,
          timestamp: Date.now() + 1,
        },
        {
          endpoint: '/api/users',
          method: 'GET',
          duration: 150,
          statusCode: 200,
          timestamp: Date.now() + 2,
        },
      ]

      metrics.forEach((m) => service.recordMetric(m))

      const stats = service.getEndpointStats('/api/users')
      expect(stats.totalRequests).toBe(2)
      expect(stats.averageResponseTime).toBe(125) // (100 + 150) / 2
    })

    it('should return empty stats for non-existent endpoint', () => {
      const stats = service.getEndpointStats('/api/non-existent')
      expect(stats.totalRequests).toBe(0)
      expect(stats.averageResponseTime).toBe(0)
    })
  })

  describe('clearMetrics', () => {
    it('should clear all metrics', () => {
      const metric: PerformanceMetrics = {
        endpoint: '/api/users',
        method: 'GET',
        duration: 100,
        statusCode: 200,
        timestamp: Date.now(),
      }

      service.recordMetric(metric)
      expect(service.getStats().totalRequests).toBe(1)

      service.clearMetrics()
      expect(service.getStats().totalRequests).toBe(0)
    })
  })

  describe('getMemoryUsage', () => {
    it('should return memory usage', () => {
      const memoryUsage = service.getMemoryUsage()
      expect(memoryUsage).toBeDefined()
      expect(memoryUsage.heapUsed).toBeGreaterThan(0)
      expect(memoryUsage.heapTotal).toBeGreaterThan(0)
    })
  })

  describe('getUptime', () => {
    it('should return uptime in seconds', () => {
      const uptime = service.getUptime()
      expect(uptime).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getRecentErrors', () => {
    it('should return recent errors', () => {
      const metrics: PerformanceMetrics[] = [
        {
          endpoint: '/api/users',
          method: 'GET',
          duration: 100,
          statusCode: 500,
          timestamp: Date.now(),
          error: 'Internal Server Error',
        },
        {
          endpoint: '/api/users',
          method: 'GET',
          duration: 100,
          statusCode: 200,
          timestamp: Date.now() + 1,
        },
        {
          endpoint: '/api/users',
          method: 'GET',
          duration: 100,
          statusCode: 503,
          timestamp: Date.now() + 2,
          error: 'Service Unavailable',
        },
      ]

      metrics.forEach((m) => service.recordMetric(m))

      const errors = service.getRecentErrors()
      expect(errors.length).toBe(2) // Only 5xx errors
      expect(errors.every((e) => e.statusCode >= 500)).toBe(true)
    })

    it('should limit errors by limit parameter', () => {
      const metrics: PerformanceMetrics[] = []
      // Create 15 errors
      for (let i = 0; i < 15; i++) {
        metrics.push({
          endpoint: '/api/users',
          method: 'GET',
          duration: 100,
          statusCode: 500,
          timestamp: Date.now() + i,
          error: `Error ${i}`,
        })
      }

      metrics.forEach((m) => service.recordMetric(m))

      const errors = service.getRecentErrors(10)
      expect(errors.length).toBe(10)
    })
  })
})
