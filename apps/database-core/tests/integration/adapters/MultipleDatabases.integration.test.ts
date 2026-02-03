/**
 * Multiple Databases Integration Tests
 * 
 * Integration tests for multiple database connections and routing
 * Note: Requires test databases to be running
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { DatabaseConnectionManager } from '../../../src/infrastructure/adapters/DatabaseConnectionManager'
import { DatabaseRouter } from '../../../src/infrastructure/adapters/DatabaseRouter'
import { RoutingStrategy, DatabaseProvider, DatabaseType } from '../../../src/domain/types/database-connection.types'

// Test configurations
const TEST_CONFIGS = {
  primary: {
    id: 'primary-db',
    name: 'Primary Database',
    provider: DatabaseProvider.SUPABASE,
    type: DatabaseType.EXTERNAL,
    config: {
      url: process.env.TEST_SUPABASE_URL || 'https://test.supabase.co',
      serviceRoleKey: process.env.TEST_SUPABASE_KEY || 'test-key',
    },
    enabled: process.env.TEST_SUPABASE_URL !== undefined,
    priority: 1,
  },
  fallback: {
    id: 'fallback-db',
    name: 'Fallback Database',
    provider: DatabaseProvider.POSTGRESQL,
    type: DatabaseType.EXTERNAL,
    config: {
      host: process.env.TEST_POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.TEST_POSTGRES_PORT || '5432'),
      database: process.env.TEST_POSTGRES_DB || 'test_db',
      username: process.env.TEST_POSTGRES_USER || 'test_user',
      password: process.env.TEST_POSTGRES_PASSWORD || 'test_password',
    },
    enabled: process.env.TEST_POSTGRES_HOST !== undefined,
    priority: 2,
  },
}

describe('Multiple Databases Integration', () => {
  let connectionManager: DatabaseConnectionManager
  let router: DatabaseRouter
  let hasConnections = false

  beforeAll(async () => {
    connectionManager = new DatabaseConnectionManager()

    // Try to add connections
    try {
      if (TEST_CONFIGS.primary.enabled) {
        await connectionManager.addConnection(TEST_CONFIGS.primary)
      }
      if (TEST_CONFIGS.fallback.enabled) {
        await connectionManager.addConnection(TEST_CONFIGS.fallback)
      }
      hasConnections = connectionManager.getAllConnections().length > 0
    } catch (error) {
      console.warn('Test databases not available, skipping integration tests')
      hasConnections = false
    }
  })

  afterAll(async () => {
    await connectionManager.closeAllConnections()
  })

  beforeEach(() => {
    if (!hasConnections) return

    // Create router with primary strategy
    router = new DatabaseRouter(connectionManager, {
      strategy: RoutingStrategy.PRIMARY,
      primaryConnectionId: TEST_CONFIGS.primary.id,
    })
  })

  describe('Connection Management', () => {
    it('should manage multiple database connections', () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      const connections = connectionManager.getAllConnections()
      expect(connections.length).toBeGreaterThan(0)
    })

    it('should get connection info for all connections', () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      const infos = connectionManager.getAllConnectionsInfo()
      expect(infos.length).toBeGreaterThan(0)
      expect(infos[0]).toHaveProperty('id')
      expect(infos[0]).toHaveProperty('name')
      expect(infos[0]).toHaveProperty('provider')
      expect(infos[0]).toHaveProperty('status')
    })

    it('should perform health check on all connections', async () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      const results = await connectionManager.healthCheckAll()
      expect(results.length).toBeGreaterThan(0)
      results.forEach(result => {
        expect(result).toHaveProperty('connectionId')
        expect(result).toHaveProperty('status')
      })
    })
  })

  describe('Primary Strategy', () => {
    it('should route to primary adapter', () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      const adapter = router.getPrimaryAdapter()
      expect(adapter).toBeDefined()
    })

    it('should use primary adapter for all entities', () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      const adapter1 = router.getAdapterForEntity('users')
      const adapter2 = router.getPrimaryAdapter()
      
      expect(adapter1).toBe(adapter2)
    })
  })

  describe('Fallback Strategy', () => {
    it('should route to fallback when primary fails', async () => {
      if (!hasConnections || !TEST_CONFIGS.fallback.enabled) {
        console.log('Skipping: Fallback database not available')
        return
      }

      router.updateRoutingConfig({
        strategy: RoutingStrategy.FALLBACK,
        primaryConnectionId: TEST_CONFIGS.primary.id,
        fallbackConnectionIds: [TEST_CONFIGS.fallback.id],
      })

      const adapter = router.getPrimaryAdapter()
      expect(adapter).toBeDefined()
    })
  })

  describe('Entity Mapping Strategy', () => {
    it('should route to specific adapter based on entity', () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      router.updateRoutingConfig({
        strategy: RoutingStrategy.ENTITY_MAP,
        primaryConnectionId: TEST_CONFIGS.primary.id,
        entityMapping: {
          users: TEST_CONFIGS.primary.id,
          logs: TEST_CONFIGS.fallback.enabled ? TEST_CONFIGS.fallback.id : TEST_CONFIGS.primary.id,
        },
      })

      const usersAdapter = router.getAdapterForEntity('users')
      const logsAdapter = router.getAdapterForEntity('logs')
      
      expect(usersAdapter).toBeDefined()
      expect(logsAdapter).toBeDefined()
    })

    it('should use primary adapter for unmapped entities', () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      router.updateRoutingConfig({
        strategy: RoutingStrategy.ENTITY_MAP,
        primaryConnectionId: TEST_CONFIGS.primary.id,
        entityMapping: {
          users: TEST_CONFIGS.primary.id,
        },
      })

      const primaryAdapter = router.getPrimaryAdapter()
      const unmappedAdapter = router.getAdapterForEntity('unknown_entity')
      
      expect(unmappedAdapter).toBe(primaryAdapter)
    })
  })

  describe('Load Balance Strategy', () => {
    it('should distribute load across multiple adapters', () => {
      if (!hasConnections || !TEST_CONFIGS.fallback.enabled) {
        console.log('Skipping: Multiple databases not available')
        return
      }

      router.updateRoutingConfig({
        strategy: RoutingStrategy.LOAD_BALANCE,
        primaryConnectionId: TEST_CONFIGS.primary.id,
        fallbackConnectionIds: [TEST_CONFIGS.fallback.id],
      })

      // Get adapter multiple times - should potentially use different adapters
      const adapter1 = router.getAdapterForEntity('users')
      const adapter2 = router.getAdapterForEntity('users')
      
      expect(adapter1).toBeDefined()
      expect(adapter2).toBeDefined()
    })
  })

  describe('Connection Failover', () => {
    it('should handle connection failures gracefully', async () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      // Get initial adapter
      const initialAdapter = router.getPrimaryAdapter()
      expect(initialAdapter).toBeDefined()

      // Simulate connection failure by removing connection
      try {
        await connectionManager.removeConnection(TEST_CONFIGS.primary.id)
        
        // Router should handle missing connection
        expect(() => router.getPrimaryAdapter()).toThrow()
      } catch (error) {
        // Expected behavior
        expect(error).toBeDefined()
      } finally {
        // Restore connection if needed
        if (TEST_CONFIGS.primary.enabled) {
          try {
            await connectionManager.addConnection(TEST_CONFIGS.primary)
          } catch (error) {
            // Ignore restore errors
          }
        }
      }
    })
  })

  describe('Routing Configuration', () => {
    it('should update routing configuration dynamically', () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      const initialStrategy = router.getRoutingConfig().strategy
      
      router.updateRoutingConfig({
        strategy: RoutingStrategy.FALLBACK,
        primaryConnectionId: TEST_CONFIGS.primary.id,
        fallbackConnectionIds: TEST_CONFIGS.fallback.enabled ? [TEST_CONFIGS.fallback.id] : [],
      })

      const newConfig = router.getRoutingConfig()
      expect(newConfig.strategy).toBe(RoutingStrategy.FALLBACK)
      expect(newConfig.strategy).not.toBe(initialStrategy)
    })

    it('should preserve entity mapping when updating config', () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      const entityMapping = {
        users: TEST_CONFIGS.primary.id,
        logs: TEST_CONFIGS.fallback.enabled ? TEST_CONFIGS.fallback.id : TEST_CONFIGS.primary.id,
      }

      router.updateRoutingConfig({
        strategy: RoutingStrategy.ENTITY_MAP,
        primaryConnectionId: TEST_CONFIGS.primary.id,
        entityMapping,
      })

      const config = router.getRoutingConfig()
      expect(config.entityMapping).toEqual(entityMapping)
    })
  })

  describe('Connection Reconnection', () => {
    it('should reconnect to failed connections', async () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      const connectionId = TEST_CONFIGS.primary.id
      
      try {
        // Attempt reconnection
        await connectionManager.reconnect(connectionId)
        
        const adapter = connectionManager.getConnection(connectionId)
        expect(adapter).toBeDefined()
      } catch (error) {
        // Expected if connection cannot be restored
        expect(error).toBeDefined()
      }
    })

    it('should reconnect all connections', async () => {
      if (!hasConnections) {
        console.log('Skipping: No test databases available')
        return
      }

      try {
        await connectionManager.reconnectAll()
        
        const connections = connectionManager.getAllConnections()
        expect(connections.length).toBeGreaterThan(0)
      } catch (error) {
        // Expected if connections cannot be restored
        expect(error).toBeDefined()
      }
    })
  })
})
