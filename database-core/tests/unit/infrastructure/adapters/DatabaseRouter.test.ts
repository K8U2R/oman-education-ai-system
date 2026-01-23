/**
 * DatabaseRouter Unit Tests
 * 
 * Tests for DatabaseRouter
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DatabaseRouter } from '../../../src/infrastructure/adapters/DatabaseRouter'
import { RoutingStrategy, DatabaseProvider, DatabaseType, ConnectionStatus } from '../../../src/domain/types/database-connection.types'
import type { IDatabaseConnectionManager } from '../../../src/domain/interfaces/IDatabaseConnectionManager'
import type { IDatabaseAdapter } from '../../../src/domain/interfaces/IDatabaseAdapter'

// Mock Adapter
class MockAdapter implements IDatabaseAdapter {
  async find<T>(_entity: string, _conditions?: Record<string, unknown>): Promise<T[]> {
    return []
  }

  async findOne<T>(_entity: string, _conditions?: Record<string, unknown>): Promise<T | null> {
    return null
  }

  async insert<T>(_entity: string, _data: Record<string, unknown>): Promise<T> {
    return {} as T
  }

  async update<T>(_entity: string, _conditions: Record<string, unknown>, _data: Partial<Record<string, unknown>>): Promise<T | null> {
    return null
  }

  async delete(_entity: string, _conditions: Record<string, unknown>): Promise<boolean> {
    return true
  }

  async count(_entity: string, _conditions?: Record<string, unknown>): Promise<number> {
    return 0
  }
}

describe('DatabaseRouter', () => {
  let router: DatabaseRouter
  let mockConnectionManager: IDatabaseConnectionManager
  let primaryAdapter: IDatabaseAdapter
  let fallbackAdapter: IDatabaseAdapter

  beforeEach(() => {
    primaryAdapter = new MockAdapter()
    fallbackAdapter = new MockAdapter()

    mockConnectionManager = {
      getConnection: vi.fn((id: string) => {
        if (id === 'primary') return primaryAdapter
        if (id === 'fallback') return fallbackAdapter
        return null
      }),
      getConnectionInfo: vi.fn((id: string) => {
        if (id === 'primary') {
          return {
            id: 'primary',
            name: 'Primary',
            provider: DatabaseProvider.SUPABASE,
            type: DatabaseType.EXTERNAL,
            status: ConnectionStatus.CONNECTED,
            stats: {
              totalQueries: 0,
              successfulQueries: 0,
              failedQueries: 0,
              averageLatency: 0,
            },
          }
        }
        if (id === 'fallback') {
          return {
            id: 'fallback',
            name: 'Fallback',
            provider: DatabaseProvider.POSTGRESQL,
            type: DatabaseType.INTERNAL,
            status: ConnectionStatus.CONNECTED,
            stats: {
              totalQueries: 0,
              successfulQueries: 0,
              failedQueries: 0,
              averageLatency: 0,
            },
          }
        }
        return null
      }),
    } as unknown as IDatabaseConnectionManager

    const routingConfig = {
      strategy: RoutingStrategy.PRIMARY,
      primaryConnectionId: 'primary',
    }

    router = new DatabaseRouter(mockConnectionManager, routingConfig)
  })

  describe('getPrimaryAdapter', () => {
    it('should return primary adapter', () => {
      const adapter = router.getPrimaryAdapter()
      expect(adapter).toBe(primaryAdapter)
    })

    it('should throw error if primary connection not found', () => {
      const invalidRouter = new DatabaseRouter(
        {
          getConnection: vi.fn(() => null),
        } as unknown as IDatabaseConnectionManager,
        {
          strategy: RoutingStrategy.PRIMARY,
          primaryConnectionId: 'non-existent',
        }
      )

      expect(() => {
        invalidRouter.getPrimaryAdapter()
      }).toThrow('Primary connection not found')
    })
  })

  describe('getFallbackAdapter', () => {
    it('should return fallback adapter if available', () => {
      const fallbackRouter = new DatabaseRouter(mockConnectionManager, {
        strategy: RoutingStrategy.FALLBACK,
        primaryConnectionId: 'primary',
        fallbackConnectionIds: ['fallback'],
      })

      const adapter = fallbackRouter.getFallbackAdapter()
      expect(adapter).toBe(fallbackAdapter)
    })

    it('should return null if no fallback configured', () => {
      const adapter = router.getFallbackAdapter()
      expect(adapter).toBeNull()
    })

    it('should return null if fallback not connected', () => {
      const disconnectedManager = {
        ...mockConnectionManager,
        getConnectionInfo: vi.fn(() => ({
          id: 'fallback',
          status: ConnectionStatus.ERROR,
        })),
      } as unknown as IDatabaseConnectionManager

      const fallbackRouter = new DatabaseRouter(disconnectedManager, {
        strategy: RoutingStrategy.FALLBACK,
        primaryConnectionId: 'primary',
        fallbackConnectionIds: ['fallback'],
      })

      const adapter = fallbackRouter.getFallbackAdapter()
      expect(adapter).toBeNull()
    })
  })

  describe('getAdapterForEntity', () => {
    it('should return entity-specific adapter if mapped', () => {
      const entityRouter = new DatabaseRouter(mockConnectionManager, {
        strategy: RoutingStrategy.PRIMARY,
        primaryConnectionId: 'primary',
        entityMapping: {
          users: 'fallback',
        },
      })

      const adapter = entityRouter.getAdapterForEntity('users')
      expect(adapter).toBe(fallbackAdapter)
    })

    it('should return strategy-based adapter if entity not mapped', () => {
      const adapter = router.getAdapterForEntity('users')
      expect(adapter).toBe(primaryAdapter)
    })
  })

  describe('updateRoutingConfig', () => {
    it('should update routing config', () => {
      const newConfig = {
        strategy: RoutingStrategy.FALLBACK,
        primaryConnectionId: 'primary',
        fallbackConnectionIds: ['fallback'],
      }

      router.updateRoutingConfig(newConfig)
      const config = router.getRoutingConfig()
      expect(config.strategy).toBe(RoutingStrategy.FALLBACK)
      expect(config.fallbackConnectionIds).toEqual(['fallback'])
    })
  })

  describe('getRoutingConfig', () => {
    it('should return current routing config', () => {
      const config = router.getRoutingConfig()
      expect(config.strategy).toBe(RoutingStrategy.PRIMARY)
      expect(config.primaryConnectionId).toBe('primary')
    })
  })
})
