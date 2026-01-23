/**
 * PostgreSQLAdapter Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PostgreSQLAdapter } from '../../../../src/infrastructure/adapters/PostgreSQLAdapter'
import { Pool } from 'pg'

// Mock pg module
vi.mock('pg', () => {
  const mockPool = {
    connect: vi.fn(),
    query: vi.fn(),
    end: vi.fn(),
    on: vi.fn(),
  }

  return {
    Pool: vi.fn(() => mockPool),
  }
})

describe('PostgreSQLAdapter', () => {
  let adapter: PostgreSQLAdapter
  let mockPool: {
    connect: ReturnType<typeof vi.fn>
    query: ReturnType<typeof vi.fn>
    end: ReturnType<typeof vi.fn>
    on: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    const PoolConstructor = Pool as unknown as ReturnType<typeof vi.fn>
    mockPool = {
      connect: vi.fn(),
      query: vi.fn(),
      end: vi.fn(),
      on: vi.fn(),
    }
    
    // تحديث mock constructor ليرجع mockPool
    PoolConstructor.mockReturnValue(mockPool)

    adapter = new PostgreSQLAdapter({
      host: 'localhost',
      port: 5432,
      database: 'testdb',
      username: 'testuser',
      password: 'testpass',
      poolSize: 10,
      timeout: 30000,
      useEnhancedPooling: false, // تعطيل Enhanced Pooling للاختبارات
    })
    
    // التأكد من أن adapter.pool هو mockPool
    // @ts-expect-error - الوصول إلى private property للاختبار
    adapter.pool = mockPool
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('find', () => {
    it('should find records with conditions', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [
            { id: '1', name: 'User 1', role: 'student' },
            { id: '2', name: 'User 2', role: 'student' },
          ],
        }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.find('users', { role: 'student' })

      expect(result).toHaveLength(2)
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM "users"'),
        ['student']
      )
      expect(mockClient.release).toHaveBeenCalled()
    })

    it('should apply limit and offset', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      await adapter.find('users', { role: 'student' }, { limit: 10, offset: 20 })

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT'),
        expect.arrayContaining([10, 20])
      )
    })

    it('should apply orderBy', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      await adapter.find('users', {}, { orderBy: { column: 'created_at', direction: 'desc' } })

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY "created_at" DESC'),
        expect.any(Array)
      )
    })

    it('should handle database errors', async () => {
      const mockClient = {
        query: vi.fn().mockRejectedValue(new Error('Database error')),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      await expect(adapter.find('users', { role: 'student' })).rejects.toThrow('PostgreSQL query error')
    })
  })

  describe('findOne', () => {
    it('should return first record', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [{ id: '1', name: 'User 1' }],
        }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.findOne('users', { id: '1' })

      expect(result).toEqual({ id: '1', name: 'User 1' })
    })

    it('should return null if no records', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.findOne('users', { id: '1' })

      expect(result).toBeNull()
    })
  })

  describe('insert', () => {
    it('should insert record successfully', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [{ id: '1', name: 'New User', email: 'user@example.com' }],
        }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.insert('users', {
        name: 'New User',
        email: 'user@example.com',
      })

      expect(result).toEqual({ id: '1', name: 'New User', email: 'user@example.com' })
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO "users"'),
        expect.arrayContaining(['New User', 'user@example.com'])
      )
    })

    it('should handle insert errors', async () => {
      const mockClient = {
        query: vi.fn().mockRejectedValue(new Error('Insert error')),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      await expect(
        adapter.insert('users', { name: 'New User' })
      ).rejects.toThrow('PostgreSQL insert error')
    })
  })

  describe('insertMany', () => {
    it('should insert multiple records', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [
            { id: '1', name: 'User 1' },
            { id: '2', name: 'User 2' },
          ],
        }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.insertMany('users', [
        { name: 'User 1' },
        { name: 'User 2' },
      ])

      expect(result).toHaveLength(2)
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO "users"'),
        expect.arrayContaining(['User 1', 'User 2'])
      )
    })

    it('should return empty array for empty input', async () => {
      const result = await adapter.insertMany('users', [])
      expect(result).toEqual([])
    })
  })

  describe('update', () => {
    it('should update records successfully', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [{ id: '1', name: 'Updated Name' }],
        }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.update('users', { id: '1' }, { name: 'Updated Name' })

      expect(result).toEqual({ id: '1', name: 'Updated Name' })
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE "users"'),
        expect.arrayContaining(['Updated Name', '1'])
      )
    })

    it('should throw error if no conditions', async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      await expect(adapter.update('users', {}, { name: 'Updated' })).rejects.toThrow(
        'Update conditions are required'
      )
    })

    it('should throw error if no records updated', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      await expect(
        adapter.update('users', { id: '1' }, { name: 'Updated' })
      ).rejects.toThrow('No records updated')
    })
  })

  describe('delete', () => {
    it('should soft delete record', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [{ id: '1', deleted_at: new Date().toISOString() }],
        }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.delete('users', { id: '1' }, true)

      expect(result).toBe(true)
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE "users"'),
        expect.any(Array)
      )
    })

    it('should hard delete record', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rowCount: 1 }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.delete('users', { id: '1' }, false)

      expect(result).toBe(true)
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM "users"'),
        expect.any(Array)
      )
    })

    it('should throw error if no conditions', async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      await expect(adapter.delete('users', {}, false)).rejects.toThrow(
        'Delete conditions are required'
      )
    })
  })

  describe('executeRaw', () => {
    it('should execute raw query', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [{ count: 10 }],
        }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.executeRaw('SELECT COUNT(*) as count FROM users', {
        limit: 10,
      })

      expect(result).toEqual([{ count: 10 }])
      expect(mockClient.query).toHaveBeenCalled()
    })
  })

  describe('count', () => {
    it('should count records with conditions', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [{ count: '5' }],
        }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.count('users', { role: 'student' })

      expect(result).toBe(5)
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*)'),
        ['student']
      )
    })

    it('should count all records when no conditions', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [{ count: '10' }],
        }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.count('users')

      expect(result).toBe(10)
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*)'),
        []
      )
    })

    it('should handle database errors', async () => {
      const mockClient = {
        query: vi.fn().mockRejectedValue(new Error('Database error')),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      await expect(adapter.count('users', { role: 'student' })).rejects.toThrow(
        'PostgreSQL count error'
      )
    })

    it('should return 0 if no records found', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({
          rows: [{ count: '0' }],
        }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const result = await adapter.count('users', { role: 'admin' })

      expect(result).toBe(0)
    })
  })

  describe('healthCheck', () => {
    it('should return true if connection is healthy', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ '?column?': 1 }] })

      const result = await adapter.healthCheck()

      expect(result).toBe(true)
      expect(mockPool.query).toHaveBeenCalledWith('SELECT 1')
    })

    it('should return false if connection fails', async () => {
      mockPool.query.mockRejectedValue(new Error('Connection error'))

      const result = await adapter.healthCheck()

      expect(result).toBe(false)
    })
  })

  describe('close', () => {
    it('should close connection pool', async () => {
      await adapter.close()

      expect(mockPool.end).toHaveBeenCalled()
    })
  })
})
