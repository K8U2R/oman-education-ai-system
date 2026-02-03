/**
 * MongoDBAdapter Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { MongoDBAdapter } from '../../../../src/infrastructure/adapters/MongoDBAdapter'

// Mock mongodb
vi.mock('mongodb', () => {
  const mockCollection = {
    find: vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue([]),
      limit: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
    }),
    findOne: vi.fn().mockResolvedValue(null),
    insertOne: vi.fn().mockResolvedValue({ insertedId: 'mock-id' }),
    insertMany: vi.fn().mockResolvedValue({ insertedIds: { 0: 'id1', 1: 'id2' } }),
    findOneAndUpdate: vi.fn().mockResolvedValue({ value: null }),
    updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
    deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    countDocuments: vi.fn().mockResolvedValue(0),
    aggregate: vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue([]),
    }),
  }

  const mockDb = {
    collection: vi.fn(() => mockCollection),
    admin: vi.fn(() => ({
      ping: vi.fn().mockResolvedValue({}),
    })),
  }

  const mockClient = {
    connect: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    db: vi.fn(() => mockDb),
  }

  return {
    MongoClient: vi.fn(() => mockClient),
  }
})

describe('MongoDBAdapter', () => {
  let adapter: MongoDBAdapter
  let mockCollection: any
  let mockClient: any

  beforeEach(() => {
    const mongodb = require('mongodb')
    const MongoClientMock = mongodb.MongoClient as ReturnType<typeof vi.fn>
    mockClient = MongoClientMock?.mock?.results?.[0]?.value || {
      connect: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
      db: vi.fn(() => ({
        collection: vi.fn(() => mockCollection),
      })),
    }
    mockCollection = {
      find: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
      }),
      findOne: vi.fn().mockResolvedValue(null),
      insertOne: vi.fn().mockResolvedValue({ insertedId: 'mock-id' }),
      insertMany: vi.fn().mockResolvedValue({ insertedIds: { 0: 'id1', 1: 'id2' } }),
      findOneAndUpdate: vi.fn().mockResolvedValue({ value: { _id: 'mock-id', name: 'Updated' } }),
      updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
      deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
      countDocuments: vi.fn().mockResolvedValue(0),
      aggregate: vi.fn().mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      }),
    }

    if (mockClient) {
      mockClient.db.mockReturnValue({
        collection: vi.fn(() => mockCollection),
        admin: vi.fn(() => ({
          ping: vi.fn().mockResolvedValue({}),
        })),
      })
    }

    adapter = new MongoDBAdapter({
      host: 'localhost',
      port: 27017,
      database: 'testdb',
    })
  })

  afterEach(async () => {
    vi.clearAllMocks()
  })

  describe('find', () => {
    it('should find documents with conditions', async () => {
      const mockDocs = [
        { _id: '1', name: 'Test 1', role: 'admin' },
        { _id: '2', name: 'Test 2', role: 'admin' },
      ]
      mockCollection.find.mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockDocs),
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
      })

      const result = await adapter.find('users', { role: 'admin' })

      expect(result).toEqual(mockDocs)
      expect(mockCollection.find).toHaveBeenCalledWith({ role: 'admin' }, expect.any(Object))
    })

    it('should apply limit and offset', async () => {
      mockCollection.find.mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
      })

      await adapter.find('users', {}, { limit: 10, offset: 5 })

      const findOptions = mockCollection.find.mock.calls[0][1]
      expect(findOptions.limit).toBe(10)
      expect(findOptions.skip).toBe(5)
    })

    it('should apply orderBy', async () => {
      mockCollection.find.mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
      })

      await adapter.find('users', {}, { orderBy: { column: 'name', direction: 'asc' } })

      const findOptions = mockCollection.find.mock.calls[0][1]
      expect(findOptions.sort).toEqual({ name: 1 })
    })
  })

  describe('findOne', () => {
    it('should find a single document', async () => {
      const mockDoc = { _id: '1', name: 'Test' }
      mockCollection.findOne.mockResolvedValue(mockDoc)

      const result = await adapter.findOne('users', { _id: '1' })

      expect(result).toEqual(mockDoc)
    })

    it('should return null if no document found', async () => {
      mockCollection.findOne.mockResolvedValue(null)

      const result = await adapter.findOne('users', { _id: '999' })

      expect(result).toBeNull()
    })
  })

  describe('insert', () => {
    it('should insert a new document', async () => {
      const mockDoc = { _id: 'mock-id', name: 'New User', created_at: expect.any(Date) }
      mockCollection.insertOne.mockResolvedValue({ insertedId: 'mock-id' })
      mockCollection.findOne.mockResolvedValue(mockDoc)

      const result = await adapter.insert('users', {
        name: 'New User',
      })

      expect(result).toBeDefined()
      expect(mockCollection.insertOne).toHaveBeenCalled()
    })
  })

  describe('insertMany', () => {
    it('should insert multiple documents', async () => {
      mockCollection.insertMany.mockResolvedValue({
        insertedIds: { 0: 'id1', 1: 'id2' },
      })
      mockCollection.find.mockReturnValue({
        toArray: vi.fn().mockResolvedValue([
          { _id: 'id1' },
          { _id: 'id2' },
        ]),
      })

      const result = await adapter.insertMany('users', [
        { name: 'User 1' },
        { name: 'User 2' },
      ])

      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return empty array for empty input', async () => {
      const result = await adapter.insertMany('users', [])
      expect(result).toEqual([])
    })
  })

  describe('update', () => {
    it('should update existing document', async () => {
      const mockUpdated = { _id: '1', name: 'Updated User' }
      mockCollection.findOneAndUpdate.mockResolvedValue({ value: mockUpdated })

      const result = await adapter.update('users', { _id: '1' }, { name: 'Updated User' })

      expect(result).toBeDefined()
      expect(result).toHaveProperty('name', 'Updated User')
    })

    it('should throw error if no conditions provided', async () => {
      await expect(
        adapter.update('users', {}, { name: 'Updated' })
      ).rejects.toThrow('Update conditions are required')
    })
  })

  describe('count', () => {
    it('should count all documents', async () => {
      mockCollection.countDocuments.mockResolvedValue(10)

      const result = await adapter.count('users')

      expect(result).toBe(10)
    })

    it('should count documents with conditions', async () => {
      mockCollection.countDocuments.mockResolvedValue(5)

      const result = await adapter.count('users', { role: 'admin' })

      expect(result).toBe(5)
    })
  })

  describe('delete', () => {
    it('should perform soft delete by default', async () => {
      mockCollection.updateOne.mockResolvedValue({ modifiedCount: 1 })

      const result = await adapter.delete('users', { _id: '1' })

      expect(result).toBe(true)
      expect(mockCollection.updateOne).toHaveBeenCalled()
    })

    it('should perform hard delete when soft is false', async () => {
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 })

      const result = await adapter.delete('users', { _id: '1' }, false)

      expect(result).toBe(true)
      expect(mockCollection.deleteOne).toHaveBeenCalled()
    })
  })

  describe('aggregate', () => {
    it('should execute aggregation pipeline', async () => {
      const mockResults = [{ _id: 'admin', count: 5 }]
      mockCollection.aggregate.mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockResults),
      })

      const result = await adapter.aggregate('users', [
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ])

      expect(result).toEqual(mockResults)
      expect(mockCollection.aggregate).toHaveBeenCalled()
    })
  })

  describe('healthCheck', () => {
    it('should return true when connection is healthy', async () => {
      const result = await adapter.healthCheck()

      expect(result).toBe(true)
    })

    it('should return false when connection fails', async () => {
      const mockDb = (adapter as any).db
      mockDb.admin = vi.fn(() => ({
        ping: vi.fn().mockRejectedValue(new Error('Connection failed')),
      }))

      const result = await adapter.healthCheck()

      expect(result).toBe(false)
    })
  })

  describe('close', () => {
    it('should close MongoDB connection', async () => {
      await adapter.close()

      expect(mockClient.close).toHaveBeenCalled()
    })
  })
})
