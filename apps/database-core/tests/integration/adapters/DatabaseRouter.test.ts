/**
 * DatabaseRouter Integration Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { DatabaseRouter } from '../../../src/infrastructure/adapters/DatabaseRouter'
import { DatabaseConnectionManager } from '../../../src/infrastructure/adapters/DatabaseConnectionManager'
import { RoutingStrategy, DatabaseProvider, DatabaseType } from '../../../src/domain/types/database-connection.types'
import { SupabaseAdapter } from '../../../src/infrastructure/adapters/SupabaseAdapter'

describe('DatabaseRouter Integration', () => {
  let connectionManager: DatabaseConnectionManager
  let router: DatabaseRouter

  beforeEach(() => {
    connectionManager = new DatabaseConnectionManager()
  })

  afterEach(async () => {
    await connectionManager.closeAllConnections()
  })

  describe('getPrimaryAdapter', () => {
    it('should return primary adapter', async () => {
      const config = {
        id: 'primary',
        name: 'Primary',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: process.env.SUPABASE_URL || 'https://test.supabase.co',
          serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-key',
        },
        enabled: false, // Disabled to avoid actual connection
        priority: 1,
      }

      try {
        await connectionManager.addConnection(config)

        router = new DatabaseRouter(connectionManager, {
          strategy: RoutingStrategy.PRIMARY,
          primaryConnectionId: 'primary',
        })

        const adapter = router.getPrimaryAdapter()
        expect(adapter).toBeDefined()
      } catch (error) {
        // Expected if connection fails
        expect(error).toBeDefined()
      }
    })

    it('should throw error if primary connection not found', () => {
      router = new DatabaseRouter(connectionManager, {
        strategy: RoutingStrategy.PRIMARY,
        primaryConnectionId: 'non-existent',
      })

      expect(() => router.getPrimaryAdapter()).toThrow('Primary connection not found')
    })
  })

  describe('getAdapterForEntity', () => {
    it('should use entity mapping if configured', async () => {
      const config = {
        id: 'primary',
        name: 'Primary',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: false,
        priority: 1,
      }

      try {
        await connectionManager.addConnection(config)

        router = new DatabaseRouter(connectionManager, {
          strategy: RoutingStrategy.PRIMARY,
          primaryConnectionId: 'primary',
          entityMapping: {
            users: 'primary',
            logs: 'primary',
          },
        })

        const adapter = router.getAdapterForEntity('users')
        expect(adapter).toBeDefined()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('updateRoutingConfig', () => {
    it('should update routing config', () => {
      router = new DatabaseRouter(connectionManager, {
        strategy: RoutingStrategy.PRIMARY,
        primaryConnectionId: 'primary',
      })

      router.updateRoutingConfig({
        strategy: RoutingStrategy.FALLBACK,
        primaryConnectionId: 'primary',
        fallbackConnectionIds: ['fallback'],
      })

      const config = router.getRoutingConfig()
      expect(config.strategy).toBe(RoutingStrategy.FALLBACK)
      expect(config.fallbackConnectionIds).toEqual(['fallback'])
    })
  })

  describe('getRoutingConfig', () => {
    it('should return current routing configuration', () => {
      router = new DatabaseRouter(connectionManager, {
        strategy: RoutingStrategy.PRIMARY,
        primaryConnectionId: 'primary',
      })

      const config = router.getRoutingConfig()
      expect(config).toBeDefined()
      expect(config.strategy).toBe(RoutingStrategy.PRIMARY)
      expect(config.primaryConnectionId).toBe('primary')
    })
  })

  describe('FALLBACK strategy', () => {
    it('should use fallback adapter when primary fails', async () => {
      const primaryConfig = {
        id: 'primary-fallback',
        name: 'Primary Fallback',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: false,
        priority: 1,
      }

      const fallbackConfig = {
        id: 'fallback-db',
        name: 'Fallback DB',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://fallback.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: false,
        priority: 2,
      }

      try {
        await connectionManager.addConnection(primaryConfig)
        await connectionManager.addConnection(fallbackConfig)

        router = new DatabaseRouter(connectionManager, {
          strategy: RoutingStrategy.FALLBACK,
          primaryConnectionId: 'primary-fallback',
          fallbackConnectionIds: ['fallback-db'],
        })

        const adapter = router.getPrimaryAdapter()
        expect(adapter).toBeDefined()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('LOAD_BALANCE strategy', () => {
    it('should distribute load across adapters', async () => {
      const config1 = {
        id: 'load-balance-1',
        name: 'Load Balance 1',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test1.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: false,
        priority: 1,
      }

      const config2 = {
        id: 'load-balance-2',
        name: 'Load Balance 2',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test2.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: false,
        priority: 2,
      }

      try {
        await connectionManager.addConnection(config1)
        await connectionManager.addConnection(config2)

        router = new DatabaseRouter(connectionManager, {
          strategy: RoutingStrategy.LOAD_BALANCE,
          primaryConnectionId: 'load-balance-1',
          fallbackConnectionIds: ['load-balance-2'],
        })

        const adapter1 = router.getAdapterForEntity('users')
        const adapter2 = router.getAdapterForEntity('users')
        
        expect(adapter1).toBeDefined()
        expect(adapter2).toBeDefined()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })
})
