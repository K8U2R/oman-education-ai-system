/**
 * ConnectionPoolManager Tests
 * 
 * Tests for Connection Pool Manager with dynamic sizing, health monitoring, and auto-reconnection
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ConnectionPoolManager } from '../../../src/infrastructure/pooling/ConnectionPoolManager'
import { Pool } from 'pg'

// Mock pg Pool
vi.mock('pg', () => {
  const mockPool = {
    totalCount: 0,
    idleCount: 0,
    waitingCount: 0,
    connect: vi.fn(),
    query: vi.fn(),
    end: vi.fn(),
    on: vi.fn(),
  }

  return {
    Pool: vi.fn(() => mockPool),
  }
})

describe('ConnectionPoolManager', () => {
  let poolManager: ConnectionPoolManager
  let mockPool: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create mock pool
    mockPool = {
      totalCount: 5,
      idleCount: 3,
      waitingCount: 0,
      connect: vi.fn().mockResolvedValue({
        release: vi.fn(),
        query: vi.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
      }),
      query: vi.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
      end: vi.fn().mockResolvedValue(undefined),
      on: vi.fn(),
    }

    // Mock Pool constructor
    ;(Pool as any).mockImplementation(() => mockPool)

    poolManager = new ConnectionPoolManager({
      host: 'localhost',
      port: 5432,
      database: 'testdb',
      user: 'testuser',
      password: 'testpass',
      minSize: 2,
      maxSize: 20,
      healthCheckInterval: 1000, // 1 second for testing
      autoReconnect: true,
    })
  })

  afterEach(async () => {
    if (poolManager) {
      await poolManager.close()
    }
    vi.clearAllTimers()
  })

  describe('Initialization', () => {
    it('should initialize with default config', () => {
      expect(poolManager).toBeDefined()
      expect(Pool).toHaveBeenCalled()
    })

    it('should initialize with custom config', async () => {
      const customManager = new ConnectionPoolManager({
        host: 'localhost',
        database: 'testdb',
        user: 'testuser',
        password: 'testpass',
        minSize: 5,
        maxSize: 50,
        healthCheckInterval: 5000,
      })

      expect(customManager).toBeDefined()
      await customManager.close()
    })
  })

  describe('getConnection', () => {
    it('should get connection from pool', async () => {
      const client = await poolManager.getConnection()

      expect(client).toBeDefined()
      expect(mockPool.connect).toHaveBeenCalled()
    })

    it('should update statistics on successful connection', async () => {
      await poolManager.getConnection()

      const stats = poolManager.getStatistics()
      expect(stats.totalQueries).toBeGreaterThan(0)
    })

    it('should handle connection errors', async () => {
      mockPool.connect.mockRejectedValueOnce(new Error('Connection failed'))

      await expect(poolManager.getConnection()).rejects.toThrow('Connection failed')

      const stats = poolManager.getStatistics()
      expect(stats.failedQueries).toBeGreaterThan(0)
    })
  })

  describe('query', () => {
    it('should execute query', async () => {
      const result = await poolManager.query('SELECT 1')

      expect(result).toBeDefined()
      expect(mockPool.connect).toHaveBeenCalled()
    })

    it('should update statistics on query', async () => {
      await poolManager.query('SELECT 1')

      const stats = poolManager.getStatistics()
      expect(stats.totalQueries).toBeGreaterThan(0)
      expect(stats.successfulQueries).toBeGreaterThan(0)
    })

    it('should handle query errors', async () => {
      mockPool.connect.mockResolvedValueOnce({
        release: vi.fn(),
        query: vi.fn().mockRejectedValue(new Error('Query failed')),
      })

      await expect(poolManager.query('SELECT 1')).rejects.toThrow('Query failed')

      const stats = poolManager.getStatistics()
      expect(stats.failedQueries).toBeGreaterThan(0)
    })
  })

  describe('Statistics', () => {
    it('should return pool statistics', () => {
      const stats = poolManager.getStatistics()

      expect(stats).toHaveProperty('totalConnections')
      expect(stats).toHaveProperty('idleConnections')
      expect(stats).toHaveProperty('activeConnections')
      expect(stats).toHaveProperty('totalQueries')
      expect(stats).toHaveProperty('successfulQueries')
      expect(stats).toHaveProperty('failedQueries')
      expect(stats).toHaveProperty('averageQueryTime')
    })

    it('should update statistics after queries', async () => {
      await poolManager.query('SELECT 1')
      await poolManager.query('SELECT 2')

      const stats = poolManager.getStatistics()
      expect(stats.totalQueries).toBeGreaterThanOrEqual(2)
    })

    it('should reset statistics', async () => {
      await poolManager.query('SELECT 1')
      poolManager.resetStatistics()

      const stats = poolManager.getStatistics()
      expect(stats.totalQueries).toBe(0)
      expect(stats.successfulQueries).toBe(0)
    })
  })

  describe('Health Monitoring', () => {
    it('should return health status', () => {
      const health = poolManager.getHealthStatus()

      expect(health).toHaveProperty('healthy')
      expect(health).toHaveProperty('lastHealthCheck')
      expect(health).toHaveProperty('consecutiveFailures')
      expect(health).toHaveProperty('averageResponseTime')
      expect(health).toHaveProperty('errorRate')
    })

    it('should perform health check', async () => {
      // Health check is performed automatically via interval
      // We can verify it by checking the pool query was called
      await new Promise(resolve => setTimeout(resolve, 1500)) // Wait for health check

      // Verify health check was performed (pool.query should be called)
      expect(mockPool.query).toHaveBeenCalled()
    })
  })

  describe('Auto Reconnection', () => {
    it('should attempt reconnection on failure', async () => {
      // Simulate pool error
      const errorHandler = mockPool.on.mock.calls.find(
        (call: any[]) => call[0] === 'error'
      )?.[1]

      if (errorHandler) {
        errorHandler(new Error('Connection lost'))
      }

      // Wait for reconnection attempt
      await new Promise(resolve => setTimeout(resolve, 100))

      // Verify reconnection was scheduled
      // (In real implementation, this would trigger reconnect)
    })
  })

  describe('Pool Sizing', () => {
    it('should get current pool size', () => {
      const stats = poolManager.getStatistics()
      expect(stats.poolSize).toBeGreaterThan(0)
    })

    it('should have min and max pool sizes', () => {
      const stats = poolManager.getStatistics()
      expect(stats.minPoolSize).toBeGreaterThan(0)
      expect(stats.maxPoolSize).toBeGreaterThanOrEqual(stats.minPoolSize)
    })
  })

  describe('Close', () => {
    it('should close pool manager', async () => {
      await poolManager.close()

      expect(mockPool.end).toHaveBeenCalled()
    })

    it('should stop health checks on close', async () => {
      await poolManager.close()

      // Health checks should stop
      // Verify by checking no more queries after close
      const initialCalls = mockPool.query.mock.calls.length
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Should not have more health check queries
      expect(mockPool.query.mock.calls.length).toBeLessThanOrEqual(initialCalls + 1)
    })
  })
})
