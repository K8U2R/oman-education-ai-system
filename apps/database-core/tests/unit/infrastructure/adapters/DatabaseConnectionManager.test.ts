/**
 * DatabaseConnectionManager Unit Tests
 * 
 * Tests for DatabaseConnectionManager
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { DatabaseConnectionManager } from '../../../src/infrastructure/adapters/DatabaseConnectionManager'
import { DatabaseProvider, DatabaseType, ConnectionStatus } from '../../../src/domain/types/database-connection.types'
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

describe('DatabaseConnectionManager', () => {
  let manager: DatabaseConnectionManager
  let mockAdapter: IDatabaseAdapter

  beforeEach(() => {
    manager = new DatabaseConnectionManager()
    mockAdapter = new MockAdapter()
    
    // Mock DatabaseAdapterFactory
    vi.mock('../../../src/infrastructure/adapters/DatabaseAdapterFactory', () => ({
      DatabaseAdapterFactory: {
        createAdapter: vi.fn(() => mockAdapter),
      },
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('addConnection', () => {
    it('should add connection successfully', async () => {
      const config = {
        id: 'test-connection',
        name: 'Test Connection',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: true,
        priority: 1,
      }

      // Mock health check
      vi.spyOn(mockAdapter, 'findOne').mockResolvedValue(null)

      await manager.addConnection(config)

      const connection = manager.getConnection('test-connection')
      expect(connection).toBeDefined()
    })

    it('should throw error for invalid config', async () => {
      const config = {
        id: 'test-connection',
        name: 'Test Connection',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          // missing url and serviceRoleKey
        },
        enabled: true,
        priority: 1,
      } as any

      await expect(manager.addConnection(config)).rejects.toThrow()
    })
  })

  describe('removeConnection', () => {
    it('should remove connection successfully', async () => {
      const config = {
        id: 'test-connection',
        name: 'Test Connection',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: true,
        priority: 1,
      }

      vi.spyOn(mockAdapter, 'findOne').mockResolvedValue(null)
      await manager.addConnection(config)

      await manager.removeConnection('test-connection')

      const connection = manager.getConnection('test-connection')
      expect(connection).toBeNull()
    })
  })

  describe('getConnection', () => {
    it('should return connection if exists', async () => {
      const config = {
        id: 'test-connection',
        name: 'Test Connection',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: true,
        priority: 1,
      }

      vi.spyOn(mockAdapter, 'findOne').mockResolvedValue(null)
      await manager.addConnection(config)

      const connection = manager.getConnection('test-connection')
      expect(connection).toBeDefined()
    })

    it('should return null if connection does not exist', () => {
      const connection = manager.getConnection('non-existent')
      expect(connection).toBeNull()
    })
  })

  describe('getAllConnections', () => {
    it('should return all connections', async () => {
      const config1 = {
        id: 'connection-1',
        name: 'Connection 1',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test1.supabase.co',
          serviceRoleKey: 'test-key-1',
        },
        enabled: true,
        priority: 1,
      }

      const config2 = {
        id: 'connection-2',
        name: 'Connection 2',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test2.supabase.co',
          serviceRoleKey: 'test-key-2',
        },
        enabled: true,
        priority: 1,
      }

      vi.spyOn(mockAdapter, 'findOne').mockResolvedValue(null)
      await manager.addConnection(config1)
      await manager.addConnection(config2)

      const connections = manager.getAllConnections()
      expect(connections.size).toBe(2)
      expect(connections.has('connection-1')).toBe(true)
      expect(connections.has('connection-2')).toBe(true)
    })
  })

  describe('getConnectionInfo', () => {
    it('should return connection info if exists', async () => {
      const config = {
        id: 'test-connection',
        name: 'Test Connection',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: true,
        priority: 1,
      }

      vi.spyOn(mockAdapter, 'findOne').mockResolvedValue(null)
      await manager.addConnection(config)

      const info = manager.getConnectionInfo('test-connection')
      expect(info).toBeDefined()
      expect(info?.id).toBe('test-connection')
      expect(info?.name).toBe('Test Connection')
      expect(info?.provider).toBe(DatabaseProvider.SUPABASE)
    })

    it('should return null if connection info does not exist', () => {
      const info = manager.getConnectionInfo('non-existent')
      expect(info).toBeNull()
    })
  })

  describe('getAllConnectionsInfo', () => {
    it('should return all connections info', async () => {
      const config1 = {
        id: 'connection-1',
        name: 'Connection 1',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test1.supabase.co',
          serviceRoleKey: 'test-key-1',
        },
        enabled: true,
        priority: 1,
      }

      const config2 = {
        id: 'connection-2',
        name: 'Connection 2',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test2.supabase.co',
          serviceRoleKey: 'test-key-2',
        },
        enabled: true,
        priority: 1,
      }

      vi.spyOn(mockAdapter, 'findOne').mockResolvedValue(null)
      await manager.addConnection(config1)
      await manager.addConnection(config2)

      const allInfo = manager.getAllConnectionsInfo()
      expect(allInfo.length).toBe(2)
      expect(allInfo.find((info) => info.id === 'connection-1')).toBeDefined()
      expect(allInfo.find((info) => info.id === 'connection-2')).toBeDefined()
    })
  })

  describe('healthCheck', () => {
    it('should return error status for non-existent connection', async () => {
      const result = await manager.healthCheck('non-existent')
      expect(result.status).toBe(ConnectionStatus.ERROR)
      expect(result.error).toBe('Connection not found')
    })

    it('should perform health check successfully', async () => {
      const config = {
        id: 'test-connection',
        name: 'Test Connection',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: true,
        priority: 1,
      }

      vi.spyOn(mockAdapter, 'findOne').mockResolvedValue(null)
      await manager.addConnection(config)

      const result = await manager.healthCheck('test-connection')
      expect(result.status).toBe(ConnectionStatus.CONNECTED)
      expect(result.latency).toBeGreaterThanOrEqual(0)
    })

    it('should handle health check errors', async () => {
      const config = {
        id: 'test-connection',
        name: 'Test Connection',
        provider: DatabaseProvider.SUPABASE,
        type: DatabaseType.EXTERNAL,
        config: {
          url: 'https://test.supabase.co',
          serviceRoleKey: 'test-key',
        },
        enabled: true,
        priority: 1,
      }

      vi.spyOn(mockAdapter, 'findOne').mockRejectedValue(new Error('Connection failed'))
      await manager.addConnection(config).catch(() => {
        // Expected to fail
      })

      // Try health check on failed connection
      const result = await manager.healthCheck('test-connection')
      expect(result.status).toBe(ConnectionStatus.ERROR)
    })
  })
})
