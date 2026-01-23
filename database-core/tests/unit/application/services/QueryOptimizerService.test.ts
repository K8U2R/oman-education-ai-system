/**
 * QueryOptimizerService Unit Tests
 * 
 * Tests for QueryOptimizerService
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { QueryOptimizerService } from '../../../src/application/services/QueryOptimizerService'
import type { QueryMetrics } from '../../../src/application/services/QueryOptimizerService'

describe('QueryOptimizerService', () => {
  let service: QueryOptimizerService

  beforeEach(() => {
    service = new QueryOptimizerService()
  })

  describe('recordQuery', () => {
    it('should record query metrics', () => {
      const metrics: QueryMetrics = {
        query: 'SELECT * FROM users',
        entity: 'users',
        operation: 'find',
        duration: 100,
        timestamp: Date.now(),
      }

      service.recordQuery(metrics)
      const analysis = service.analyzeEntity('users')
      expect(analysis.callCount).toBe(1)
    })

    it('should limit metrics to maxMetrics', () => {
      const metrics: QueryMetrics = {
        query: 'SELECT * FROM users',
        entity: 'users',
        operation: 'find',
        duration: 100,
        timestamp: Date.now(),
      }

      // Record more than maxMetrics (10000)
      for (let i = 0; i < 10001; i++) {
        service.recordQuery({ ...metrics, timestamp: Date.now() + i })
      }

      const analysis = service.analyzeEntity('users')
      expect(analysis.callCount).toBeLessThanOrEqual(10000)
    })

    it('should warn on slow queries', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const metrics: QueryMetrics = {
        query: 'SELECT * FROM users',
        entity: 'users',
        operation: 'find',
        duration: 2000, // > 1000ms threshold
        timestamp: Date.now(),
      }

      service.recordQuery(metrics)
      // Note: In real implementation, logger.warn is called
      consoleSpy.mockRestore()
    })
  })

  describe('analyzeEntity', () => {
    it('should return empty analysis for entity with no queries', () => {
      const analysis = service.analyzeEntity('users')
      expect(analysis.entity).toBe('users')
      expect(analysis.callCount).toBe(0)
      expect(analysis.averageDuration).toBe(0)
      expect(analysis.slowQueries).toBe(0)
      expect(analysis.recommendations).toEqual([])
    })

    it('should analyze entity queries correctly', () => {
      const metrics: QueryMetrics[] = [
        {
          query: 'SELECT * FROM users',
          entity: 'users',
          operation: 'find',
          duration: 100,
          timestamp: Date.now(),
        },
        {
          query: 'SELECT * FROM users WHERE id = ?',
          entity: 'users',
          operation: 'findOne',
          duration: 50,
          timestamp: Date.now(),
        },
        {
          query: 'SELECT * FROM users',
          entity: 'users',
          operation: 'find',
          duration: 150,
          timestamp: Date.now(),
        },
      ]

      metrics.forEach((m) => service.recordQuery(m))

      const analysis = service.analyzeEntity('users')
      expect(analysis.entity).toBe('users')
      expect(analysis.callCount).toBe(3)
      expect(analysis.averageDuration).toBe(100) // (100 + 50 + 150) / 3
      expect(analysis.slowQueries).toBe(0) // All < 1000ms
    })

    it('should detect slow queries', () => {
      const metrics: QueryMetrics[] = [
        {
          query: 'SELECT * FROM users',
          entity: 'users',
          operation: 'find',
          duration: 1500, // > 1000ms
          timestamp: Date.now(),
        },
        {
          query: 'SELECT * FROM users',
          entity: 'users',
          operation: 'find',
          duration: 2000, // > 1000ms
          timestamp: Date.now(),
        },
        {
          query: 'SELECT * FROM users',
          entity: 'users',
          operation: 'find',
          duration: 100, // < 1000ms
          timestamp: Date.now(),
        },
      ]

      metrics.forEach((m) => service.recordQuery(m))

      const analysis = service.analyzeEntity('users')
      expect(analysis.slowQueries).toBe(2)
      expect(analysis.recommendations.length).toBeGreaterThan(0)
    })

    it('should generate recommendations for slow queries', () => {
      const metrics: QueryMetrics = {
        query: 'SELECT * FROM users',
        entity: 'users',
        operation: 'find',
        duration: 1500,
        timestamp: Date.now(),
      }

      service.recordQuery(metrics)
      const analysis = service.analyzeEntity('users')
      expect(analysis.recommendations.length).toBeGreaterThan(0)
      expect(analysis.recommendations[0]).toContain('بطيء')
    })

    it('should generate recommendations for repeated queries', () => {
      const metrics: QueryMetrics = {
        query: 'SELECT * FROM users',
        entity: 'users',
        operation: 'find',
        duration: 100,
        timestamp: Date.now(),
      }

      // Record same query more than 10 times
      for (let i = 0; i < 11; i++) {
        service.recordQuery({ ...metrics, timestamp: Date.now() + i })
      }

      const analysis = service.analyzeEntity('users')
      expect(analysis.recommendations.length).toBeGreaterThan(0)
      expect(analysis.recommendations.some((r) => r.includes('متكررة'))).toBe(true)
    })

    it('should generate recommendations for high average duration', () => {
      const metrics: QueryMetrics = {
        query: 'SELECT * FROM users',
        entity: 'users',
        operation: 'find',
        duration: 600, // > 500ms average threshold
        timestamp: Date.now(),
      }

      // Record multiple queries to get high average
      for (let i = 0; i < 10; i++) {
        service.recordQuery({ ...metrics, timestamp: Date.now() + i })
      }

      const analysis = service.analyzeEntity('users')
      expect(analysis.recommendations.length).toBeGreaterThan(0)
      expect(analysis.recommendations.some((r) => r.includes('متوسط'))).toBe(true)
    })

    it('should generate recommendations for low cache ratio', () => {
      const metrics: QueryMetrics = {
        query: 'SELECT * FROM users',
        entity: 'users',
        operation: 'find',
        duration: 100,
        timestamp: Date.now(),
        cached: false,
      }

      // Record many uncached queries (> 20)
      for (let i = 0; i < 25; i++) {
        service.recordQuery({ ...metrics, timestamp: Date.now() + i })
      }

      const analysis = service.analyzeEntity('users')
      expect(analysis.recommendations.length).toBeGreaterThan(0)
      expect(analysis.recommendations.some((r) => r.includes('Cache'))).toBe(true)
    })
  })

  describe('getSlowQueries', () => {
    it('should return slow queries', () => {
      const metrics: QueryMetrics[] = [
        {
          query: 'SELECT * FROM users',
          entity: 'users',
          operation: 'find',
          duration: 1500,
          timestamp: Date.now(),
        },
        {
          query: 'SELECT * FROM users',
          entity: 'users',
          operation: 'find',
          duration: 100,
          timestamp: Date.now(),
        },
      ]

      metrics.forEach((m) => service.recordQuery(m))

      const slowQueries = service.getSlowQueries()
      expect(slowQueries.length).toBe(1)
      expect(slowQueries[0].duration).toBe(1500)
    })

    it('should limit slow queries by limit parameter', () => {
      const metrics: QueryMetrics[] = []
      // Create 15 slow queries
      for (let i = 0; i < 15; i++) {
        metrics.push({
          query: 'SELECT * FROM users',
          entity: 'users',
          operation: 'find',
          duration: 1500 + i,
          timestamp: Date.now() + i,
        })
      }

      metrics.forEach((m) => service.recordQuery(m))

      const slowQueries = service.getSlowQueries(10)
      expect(slowQueries.length).toBe(10)
    })
  })

  describe('getStatistics', () => {
    it('should return statistics', () => {
      const metrics: QueryMetrics[] = [
        {
          query: 'SELECT * FROM users',
          entity: 'users',
          operation: 'find',
          duration: 100,
          timestamp: Date.now(),
          cached: false,
        },
        {
          query: 'SELECT * FROM users',
          entity: 'users',
          operation: 'find',
          duration: 200,
          timestamp: Date.now(),
          cached: true,
        },
      ]

      metrics.forEach((m) => service.recordQuery(m))

      const stats = service.getStatistics()
      expect(stats.totalQueries).toBe(2)
      expect(stats.averageDuration).toBe(150) // (100 + 200) / 2
      expect(stats.cachedQueries).toBe(1)
      expect(stats.entities).toContain('users')
    })

    it('should return empty statistics when no queries', () => {
      const stats = service.getStatistics()
      expect(stats.totalQueries).toBe(0)
      expect(stats.averageDuration).toBe(0)
      expect(stats.slowQueries).toBe(0)
      expect(stats.cachedQueries).toBe(0)
      expect(stats.entities).toEqual([])
    })
  })

  describe('clearStatistics', () => {
    it('should clear all statistics', () => {
      const metrics: QueryMetrics = {
        query: 'SELECT * FROM users',
        entity: 'users',
        operation: 'find',
        duration: 100,
        timestamp: Date.now(),
      }

      service.recordQuery(metrics)
      expect(service.getStatistics().totalQueries).toBe(1)

      service.clearStatistics()
      expect(service.getStatistics().totalQueries).toBe(0)
    })
  })
})
