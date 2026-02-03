/**
 * MySQLAdapter Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { MySQLAdapter } from '../../../../src/infrastructure/adapters/MySQLAdapter'
import { OperationType } from '../../../../src/domain/value-objects/OperationType'

// Mock mysql2/promise
vi.mock('mysql2/promise', () => {
  const mockConnection = {
    execute: vi.fn(),
    commit: vi.fn(),
    rollback: vi.fn(),
    release: vi.fn(),
  }

  const mockPool = {
    getConnection: vi.fn().mockResolvedValue(mockConnection),
    end: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
  }

  return {
    createPool: vi.fn(() => mockPool),
  }
})

describe('MySQLAdapter', () => {
  let adapter: MySQLAdapter
  let mockPool: any
  let mockConnection: any

  beforeEach(() => {
    mockConnection = {
      execute: vi.fn(),
      commit: vi.fn(),
      rollback: vi.fn(),
      release: vi.fn(),
    }

    // Mock pool
    const mysql2 = require('mysql2/promise')
    const createPoolMock = mysql2.createPool as ReturnType<typeof vi.fn>
    mockPool = createPoolMock?.mock?.results?.[0]?.value || {
      getConnection: vi.fn().mockResolvedValue(mockConnection),
      end: vi.fn().mockResolvedValue(undefined),
      on: vi.fn(),
    }
    mockPool.getConnection.mockResolvedValue(mockConnection)

    adapter = new MySQLAdapter({
      host: 'localhost',
      port: 3306,
      database: 'testdb',
      username: 'testuser',
      password: 'testpass',
      useEnhancedPooling: false, // Disable for testing
    })
  })

  afterEach(async () => {
    vi.clearAllMocks()
  })

  describe('find', () => {
    it('should find records with conditions', async () => {
      const mockRows = [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' },
      ]
      mockConnection.execute.mockResolvedValueOnce([mockRows])

      const result = await adapter.find('users', { role: 'admin' })

      expect(result).toEqual(mockRows)
      expect(mockConnection.execute).toHaveBeenCalled()
      expect(mockConnection.release).toHaveBeenCalled()
    })

    it('should apply limit and offset', async () => {
      const mockRows = [{ id: 1, name: 'Test' }]
      mockConnection.execute.mockResolvedValueOnce([mockRows])

      await adapter.find('users', {}, { limit: 10, offset: 5 })

      const query = mockConnection.execute.mock.calls[0][0]
      expect(query).toContain('LIMIT')
      expect(query).toContain('OFFSET')
    })

    it('should apply orderBy', async () => {
      const mockRows = [{ id: 1, name: 'Test' }]
      mockConnection.execute.mockResolvedValueOnce([mockRows])

      await adapter.find('users', {}, { orderBy: { column: 'name', direction: 'asc' } })

      const query = mockConnection.execute.mock.calls[0][0]
      expect(query).toContain('ORDER BY')
    })
  })

  describe('findOne', () => {
    it('should find a single record', async () => {
      const mockRow = { id: 1, name: 'Test' }
      mockConnection.execute.mockResolvedValueOnce([[mockRow]])

      const result = await adapter.findOne('users', { id: 1 })

      expect(result).toEqual(mockRow)
    })

    it('should return null if no record found', async () => {
      mockConnection.execute.mockResolvedValueOnce([[]])

      const result = await adapter.findOne('users', { id: 999 })

      expect(result).toBeNull()
    })
  })

  describe('insert', () => {
    it('should insert a new record', async () => {
      const mockInsertResult = { insertId: 1, affectedRows: 1 }
      const mockRow = { id: 1, name: 'New User', email: 'test@example.com' }

      mockConnection.execute
        .mockResolvedValueOnce([mockInsertResult])
        .mockResolvedValueOnce([[mockRow]])

      const result = await adapter.insert('users', {
        name: 'New User',
        email: 'test@example.com',
      })

      expect(result).toBeDefined()
      expect(mockConnection.execute).toHaveBeenCalledTimes(2)
    })
  })

  describe('insertMany', () => {
    it('should insert multiple records', async () => {
      const mockInsertResult = { insertId: 1, affectedRows: 2 }
      mockConnection.execute
        .mockResolvedValueOnce([mockInsertResult])
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([[{ id: 2 }]])

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
    it('should update existing record', async () => {
      const mockUpdateResult = { affectedRows: 1 }
      const mockRow = { id: 1, name: 'Updated User' }

      mockConnection.execute
        .mockResolvedValueOnce([mockUpdateResult])
        .mockResolvedValueOnce([[mockRow]])

      const result = await adapter.update('users', { id: 1 }, { name: 'Updated User' })

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
    it('should count all records', async () => {
      mockConnection.execute.mockResolvedValueOnce([[{ count: 10 }]])

      const result = await adapter.count('users')

      expect(result).toBe(10)
    })

    it('should count records with conditions', async () => {
      mockConnection.execute.mockResolvedValueOnce([[{ count: 5 }]])

      const result = await adapter.count('users', { role: 'admin' })

      expect(result).toBe(5)
    })
  })

  describe('delete', () => {
    it('should perform soft delete by default', async () => {
      const mockUpdateResult = { affectedRows: 1 }
      const mockRow = { id: 1, deleted_at: new Date().toISOString() }

      mockConnection.execute
        .mockResolvedValueOnce([mockUpdateResult])
        .mockResolvedValueOnce([[mockRow]])

      const result = await adapter.delete('users', { id: 1 })

      expect(result).toBe(true)
    })

    it('should perform hard delete when soft is false', async () => {
      mockConnection.execute.mockResolvedValueOnce([{ affectedRows: 1 }])

      const result = await adapter.delete('users', { id: 1 }, false)

      expect(result).toBe(true)
      const query = mockConnection.execute.mock.calls[0][0]
      expect(query).toContain('DELETE FROM')
    })
  })

  describe('executeRaw', () => {
    it('should execute raw SQL query', async () => {
      const mockRows = [{ id: 1, name: 'Test' }]
      mockConnection.execute.mockResolvedValueOnce([mockRows])

      const result = await adapter.executeRaw('SELECT * FROM users WHERE id = :id', {
        id: 1,
      })

      expect(result).toEqual(mockRows)
      expect(mockConnection.execute).toHaveBeenCalled()
    })
  })

  describe('healthCheck', () => {
    it('should return true when connection is healthy', async () => {
      mockConnection.execute.mockResolvedValueOnce([[]])

      const result = await adapter.healthCheck()

      expect(result).toBe(true)
    })

    it('should return false when connection fails', async () => {
      mockPool.getConnection.mockRejectedValueOnce(new Error('Connection failed'))

      const result = await adapter.healthCheck()

      expect(result).toBe(false)
    })
  })

  describe('Transactions', () => {
    it('should support transactions', () => {
      const supports = adapter.supportsTransactions()
      expect(supports).toBe(true)
    })

    it('should begin transaction', async () => {
      mockConnection.execute.mockResolvedValueOnce([{}])

      const transactionId = await adapter.beginTransaction()

      expect(transactionId).toBeDefined()
      expect(mockConnection.execute).toHaveBeenCalledWith(
        expect.stringContaining('START TRANSACTION')
      )
    })

    it('should commit transaction', async () => {
      mockConnection.execute.mockResolvedValueOnce([{}])
      const transactionId = await adapter.beginTransaction()

      await adapter.commitTransaction(transactionId)

      expect(mockConnection.commit).toHaveBeenCalled()
      expect(mockConnection.release).toHaveBeenCalled()
    })

    it('should rollback transaction', async () => {
      mockConnection.execute.mockResolvedValueOnce([{}])
      const transactionId = await adapter.beginTransaction()

      await adapter.rollbackTransaction(transactionId)

      expect(mockConnection.rollback).toHaveBeenCalled()
      expect(mockConnection.release).toHaveBeenCalled()
    })

    it('should support nested transactions (savepoints)', () => {
      const supports = adapter.supportsNestedTransactions()
      expect(supports).toBe(true)
    })

    it('should create savepoint', async () => {
      mockConnection.execute
        .mockResolvedValueOnce([{}]) // beginTransaction
        .mockResolvedValueOnce([{}]) // createSavepoint

      const transactionId = await adapter.beginTransaction()
      const savepointName = await adapter.createSavepoint(transactionId, 'test')

      expect(savepointName).toBeDefined()
      expect(mockConnection.execute).toHaveBeenCalledWith(
        expect.stringContaining('SAVEPOINT')
      )
    })

    it('should rollback to savepoint', async () => {
      mockConnection.execute
        .mockResolvedValueOnce([{}]) // beginTransaction
        .mockResolvedValueOnce([{}]) // createSavepoint

      const transactionId = await adapter.beginTransaction()
      const savepointName = await adapter.createSavepoint(transactionId, 'test')

      await adapter.rollbackToSavepoint(transactionId, savepointName)

      expect(mockConnection.execute).toHaveBeenCalledWith(
        expect.stringContaining('ROLLBACK TO SAVEPOINT')
      )
    })
  })

  describe('Pool Statistics', () => {
    it('should get pool statistics', () => {
      const stats = adapter.getPoolStatistics()

      expect(stats).toHaveProperty('totalConnections')
      expect(stats).toHaveProperty('idleConnections')
      expect(stats).toHaveProperty('activeConnections')
      expect(stats).toHaveProperty('poolSize')
    })

    it('should get pool health status', () => {
      const health = adapter.getPoolHealthStatus()

      expect(health).toHaveProperty('healthy')
      expect(health).toHaveProperty('lastHealthCheck')
    })
  })

  describe('close', () => {
    it('should close pool and release connections', async () => {
      await adapter.close()

      expect(mockPool.end).toHaveBeenCalled()
    })
  })
})
