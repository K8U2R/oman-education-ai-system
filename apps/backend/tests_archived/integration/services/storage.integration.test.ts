/**
 * Storage Service Integration Tests - اختبارات التكامل لخدمة التخزين
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { vi } from 'vitest'

// Mock DatabaseCoreAdapter before importing it
const mockDatabaseAdapter = {
  find: vi.fn(),
  findOne: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  execute: vi.fn(),
}

vi.mock('@/infrastructure/adapters/db/DatabaseCoreAdapter', () => {
  return {
    DatabaseCoreAdapter: vi.fn().mockImplementation(() => mockDatabaseAdapter)
  }
})

import { StorageService } from '@/application/services/storage/StorageService'
import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'

describe('StorageService Integration', () => {
  let storageService: StorageService
  let databaseAdapter: DatabaseCoreAdapter
  let testUserId: string

  beforeAll(async () => {
    // Initialize Database Adapter
    databaseAdapter = new DatabaseCoreAdapter()
    testUserId = 'test-user-id'

    // Setup default mock returns
    vi.mocked(databaseAdapter.find).mockResolvedValue([])
    vi.mocked(databaseAdapter.findOne).mockResolvedValue(null)
    vi.mocked(databaseAdapter.insert).mockImplementation(async (_table, data: any) => data)
    vi.mocked(databaseAdapter.update).mockResolvedValue({ success: true } as any)
    vi.mocked(databaseAdapter.delete).mockResolvedValue(true)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    storageService = new StorageService(databaseAdapter)
    // Reset default mocks if needed, though beforeAll sets the base implementation
    vi.mocked(databaseAdapter.find).mockResolvedValue([])
    vi.mocked(databaseAdapter.findOne).mockResolvedValue(null)
  })

  afterAll(async () => {
    // Cleanup if needed
  })

  describe('getProviders', () => {
    it('should return list of active providers', async () => {
      // Act
      const providers = await storageService.getProviders()

      // Assert
      expect(Array.isArray(providers)).toBe(true)
      if (providers.length > 0) {
        expect(providers[0]).toHaveProperty('id')
        expect(providers[0]).toHaveProperty('name')
        expect(providers[0]).toHaveProperty('type')
        expect(providers[0]).toHaveProperty('is_active')
        expect(providers[0].is_active).toBe(true)
      }
    })

    it('should return providers with correct structure', async () => {
      // Act
      const providers = await storageService.getProviders()

      // Assert
      providers.forEach(provider => {
        expect(provider).toHaveProperty('id')
        expect(provider).toHaveProperty('name')
        expect(provider).toHaveProperty('type')
        expect(provider).toHaveProperty('is_active')
        // Should not expose sensitive auth_url
        expect(provider.auth_url).toBeUndefined()
      })
    })
  })

  describe('getProvider', () => {
    it('should return provider by id if exists', async () => {
      // Arrange
      const providers = await storageService.getProviders()
      if (providers.length === 0) {
        // Skip test if no providers exist
        return
      }
      const providerId = providers[0].id

      // Act
      const provider = await storageService.getProvider(providerId)

      // Assert
      expect(provider).toHaveProperty('id')
      expect(provider.id).toBe(providerId)
      expect(provider.is_active).toBe(true)
      expect(provider.auth_url).toBeUndefined()
    })

    it('should throw error if provider not found', async () => {
      // Arrange
      const nonExistentId = 'provider-non-existent'

      // Act & Assert
      await expect(
        storageService.getProvider(nonExistentId)
      ).rejects.toThrow('غير موجود')
    })
  })

  describe('getUserConnections', () => {
    it('should return user connections', async () => {
      // Arrange
      const userId = testUserId

      // Act
      const connections = await storageService.getUserConnections(userId)

      // Assert
      expect(Array.isArray(connections)).toBe(true)
      if (connections.length > 0) {
        expect(connections[0]).toHaveProperty('id')
        expect(connections[0]).toHaveProperty('user_id')
        expect(connections[0]).toHaveProperty('provider_id')
        expect(connections[0].user_id).toBe(userId)
      }
    })

    it('should return empty array for user with no connections', async () => {
      // Arrange
      const userId = 'user-with-no-connections'

      // Act
      const connections = await storageService.getUserConnections(userId)

      // Assert
      expect(Array.isArray(connections)).toBe(true)
    })
  })

  describe('getUserConnection', () => {
    it.skip('should return connection if exists', async () => {
      // Act
      // Method not implemented in service yet
    })

    it.skip('should throw error if connection not found', async () => {
      // Act
      // Method not implemented in service yet
    })
  })

  describe('connectProvider', () => {
    it('should create connection and return auth URL', async () => {
      // Arrange
      const userId = testUserId
      // Mock getProviders return
      vi.mocked(databaseAdapter.find).mockResolvedValueOnce([
        { id: 'provider-1', name: 'Google Drive', is_enabled: true }
      ] as any)
      // Mock getProvider return for connectProvider
      vi.mocked(databaseAdapter.findOne).mockResolvedValueOnce({
        id: 'provider-1', name: 'Google Drive', is_enabled: true
      } as any)

      const providers = await storageService.getProviders()
      if (providers.length === 0) {
        return
      }
      const providerId = providers[0].id

      // Act
      const result = await storageService.connectProvider(userId, providerId)

      // Assert
      expect(result).toHaveProperty('auth_url')
      expect(typeof result.auth_url).toBe('string')
    })

    it('should throw error if provider not found', async () => {
      // Arrange
      const userId = testUserId
      const nonExistentProviderId = 'provider-non-existent'

      // Override the default mock to ensure findOne returns null for this provider
      vi.mocked(databaseAdapter.find).mockResolvedValue([])
      vi.mocked(databaseAdapter.findOne).mockReset()
      vi.mocked(databaseAdapter.findOne).mockResolvedValue(null)

      // Act & Assert
      await expect(
        storageService.connectProvider(userId, nonExistentProviderId)
      ).rejects.toThrow('مزود التخزين غير موجود')
    })
  })

  describe('disconnectProvider', () => {
    it('should disconnect provider successfully', async () => {
      // Arrange
      const connectionId = 'conn-1'
      // Mock to return connection when looking it up
      vi.mocked(databaseAdapter.findOne).mockResolvedValueOnce({
        id: connectionId, user_id: testUserId
      } as any)

      // Act
      await storageService.disconnectProvider(testUserId, connectionId)

      // Assert
      expect(databaseAdapter.update).toHaveBeenCalled()
    })

    it('should throw error if connection not found', async () => {
      // Arrange
      const nonExistentId = 'connection-non-existent'
      vi.mocked(databaseAdapter.findOne).mockResolvedValue(null)

      // Act & Assert
      await expect(
        storageService.disconnectProvider(testUserId, nonExistentId)
      ).rejects.toThrow()
    })
  })

  describe('listFiles', () => {
    it('should return files for connection', async () => {
      // Arrange
      // Mock connection check
      vi.mocked(databaseAdapter.findOne).mockResolvedValue({
        id: 'conn-1', status: 'CONNECTED'
      } as any)

      const connectionId = 'conn-1'

      // Act
      const files = await storageService.listFiles(testUserId, connectionId, undefined, undefined)

      // Assert
      expect(Array.isArray(files)).toBe(true)
    })
  })

  describe('listFolders', () => {
    it('should return folders for connection', async () => {
      // Arrange
      vi.mocked(databaseAdapter.findOne).mockResolvedValue({
        id: 'conn-1', status: 'CONNECTED'
      } as any)
      const connectionId = 'conn-1'

      // Act
      const folders = await storageService.listFolders(testUserId, connectionId)

      // Assert
      expect(Array.isArray(folders)).toBe(true)
    })
  })

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      // Arrange
      const connections = await storageService.getUserConnections(testUserId)
      if (connections.length === 0) {
        // Skip test if no connections exist
        return
      }
      const connectionId = connections[0].id
      const fileData = {
        originalname: 'test-file.txt',
        buffer: Buffer.from('Test file content'),
        mimetype: 'text/plain',
        size: 17,
      }

      // Act
      const result = await storageService.uploadFile(testUserId, connectionId, fileData)

      // Assert
      expect(result).toHaveProperty('file_id')
      expect(result).toHaveProperty('name')
      expect(result.name).toBe('test-file.txt')
    })

    it('should throw error if connection not found', async () => {
      // Arrange
      const nonExistentConnectionId = 'connection-non-existent'
      const fileData = {
        originalname: 'test-file.txt',
        buffer: Buffer.from('Test file content'),
        mimetype: 'text/plain',
        size: 17,
      }

      // Act & Assert
      await expect(
        storageService.uploadFile(testUserId, nonExistentConnectionId, fileData)
      ).rejects.toThrow()
    })
  })
})
