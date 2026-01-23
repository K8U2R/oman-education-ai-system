/**
 * SQLiteAdapter Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'

// Mock better-sqlite3 قبل أي imports
// يجب أن يكون mock قبل import SQLiteAdapter
vi.mock('better-sqlite3', () => {
  const mockDb = {
    prepare: vi.fn(),
    exec: vi.fn(),
    close: vi.fn(),
    pragma: vi.fn(),
  }

  const mockConstructor = vi.fn(() => mockDb)
  
  return {
    __esModule: true,
    default: mockConstructor,
  }
})

// Import بعد mock
import { SQLiteAdapter } from '../../../../src/infrastructure/adapters/SQLiteAdapter'

describe('SQLiteAdapter', () => {
  let adapter: SQLiteAdapter
  let mockDb: any
  const testDbPath = join(__dirname, 'test.db')

  beforeEach(() => {
    // الحصول على mockDb من mock constructor
    // استخدام require للحصول على mock بشكل آمن
    try {
      const sqlite3 = require('better-sqlite3')
      const MockConstructor = sqlite3.default as ReturnType<typeof vi.fn>
      
      // إنشاء mockDb جديد لكل test
      mockDb = {
        prepare: vi.fn(),
        exec: vi.fn(),
        close: vi.fn(),
        pragma: vi.fn(),
      }
      
      // جعل constructor يرجع mockDb
      if (MockConstructor && typeof MockConstructor.mockReturnValue === 'function') {
        MockConstructor.mockReturnValue(mockDb)
      }
    } catch {
      // إذا فشل require، إنشاء mockDb مباشرة
      mockDb = {
        prepare: vi.fn(),
        exec: vi.fn(),
        close: vi.fn(),
        pragma: vi.fn(),
      }
    }

    // Mock prepare to return statement with methods
    const mockStmt = {
      all: vi.fn().mockReturnValue([]),
      get: vi.fn().mockReturnValue(null),
      run: vi.fn().mockReturnValue({ lastInsertRowid: 1, changes: 1 }),
    }
    mockDb.prepare.mockReturnValue(mockStmt)

    adapter = new SQLiteAdapter({
      database: testDbPath,
      readOnly: false,
    })
    
    // التأكد من أن adapter.db هو mockDb
    // @ts-expect-error - الوصول إلى private property للاختبار
    adapter.db = mockDb
  })

  afterEach(async () => {
    if (adapter) {
      await adapter.close()
    }
    if (existsSync(testDbPath)) {
      try {
        unlinkSync(testDbPath)
      } catch {
        // Ignore cleanup errors
      }
    }
    vi.clearAllMocks()
  })

  describe('find', () => {
    it('should find records with conditions', async () => {
      const mockRows = [
        { id: 1, name: 'Test 1', role: 'admin' },
        { id: 2, name: 'Test 2', role: 'admin' },
      ]
      const mockStmt = mockDb.prepare()
      mockStmt.all.mockReturnValue(mockRows)

      const result = await adapter.find('users', { role: 'admin' })

      expect(result).toEqual(mockRows)
      expect(mockDb.prepare).toHaveBeenCalled()
    })

    it('should apply limit and offset', async () => {
      const mockStmt = mockDb.prepare()
      mockStmt.all.mockReturnValue([])

      await adapter.find('users', {}, { limit: 10, offset: 5 })

      const query = mockDb.prepare.mock.calls[0][0]
      expect(query).toContain('LIMIT')
      expect(query).toContain('OFFSET')
    })

    it('should apply orderBy', async () => {
      const mockStmt = mockDb.prepare()
      mockStmt.all.mockReturnValue([])

      await adapter.find('users', {}, { orderBy: { column: 'name', direction: 'asc' } })

      const query = mockDb.prepare.mock.calls[0][0]
      expect(query).toContain('ORDER BY')
    })
  })

  describe('findOne', () => {
    it('should find a single record', async () => {
      const mockRow = { id: 1, name: 'Test' }
      const mockStmt = mockDb.prepare()
      mockStmt.all.mockReturnValue([mockRow])

      const result = await adapter.findOne('users', { id: 1 })

      expect(result).toEqual(mockRow)
    })

    it('should return null if no record found', async () => {
      const mockStmt = mockDb.prepare()
      mockStmt.all.mockReturnValue([])

      const result = await adapter.findOne('users', { id: 999 })

      expect(result).toBeNull()
    })
  })

  describe('insert', () => {
    it('should insert a new record', async () => {
      const mockStmt = mockDb.prepare()
      mockStmt.run.mockReturnValue({ lastInsertRowid: 1, changes: 1 })
      mockStmt.all.mockReturnValue([{ id: 1, name: 'New User', email: 'test@example.com' }])

      const result = await adapter.insert('users', {
        name: 'New User',
        email: 'test@example.com',
      })

      expect(result).toBeDefined()
      expect(mockDb.prepare).toHaveBeenCalled()
    })
  })

  describe('insertMany', () => {
    it('should insert multiple records', async () => {
      const mockStmt = mockDb.prepare()
      mockStmt.run.mockReturnValue({ lastInsertRowid: 1, changes: 2 })
      mockStmt.all.mockReturnValue([{ id: 1 }, { id: 2 }])

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
      const mockStmt = mockDb.prepare()
      mockStmt.run.mockReturnValue({ changes: 1 })
      mockStmt.all.mockReturnValue([{ id: 1, name: 'Updated User' }])

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
      const mockStmt = mockDb.prepare()
      mockStmt.get.mockReturnValue({ count: 10 })

      const result = await adapter.count('users')

      expect(result).toBe(10)
    })

    it('should count records with conditions', async () => {
      const mockStmt = mockDb.prepare()
      mockStmt.get.mockReturnValue({ count: 5 })

      const result = await adapter.count('users', { role: 'admin' })

      expect(result).toBe(5)
    })
  })

  describe('delete', () => {
    it('should perform soft delete by default', async () => {
      const mockStmt = mockDb.prepare()
      mockStmt.run.mockReturnValue({ changes: 1 })
      mockStmt.all.mockReturnValue([{ id: 1, deleted_at: new Date().toISOString() }])

      const result = await adapter.delete('users', { id: 1 })

      expect(result).toBe(true)
    })

    it('should perform hard delete when soft is false', async () => {
      const mockStmt = mockDb.prepare()
      mockStmt.run.mockReturnValue({ changes: 1 })

      const result = await adapter.delete('users', { id: 1 }, false)

      expect(result).toBe(true)
      const query = mockDb.prepare.mock.calls[0][0]
      expect(query).toContain('DELETE FROM')
    })
  })

  describe('executeRaw', () => {
    it('should execute raw SQL query', async () => {
      const mockRows = [{ id: 1, name: 'Test' }]
      const mockStmt = mockDb.prepare()
      mockStmt.all.mockReturnValue(mockRows)

      const result = await adapter.executeRaw('SELECT * FROM users WHERE id = :id', {
        id: 1,
      })

      expect(result).toEqual(mockRows)
      expect(mockDb.prepare).toHaveBeenCalled()
    })
  })

  describe('healthCheck', () => {
    it('should return true when connection is healthy', async () => {
      const mockStmt = mockDb.prepare()
      mockStmt.get.mockReturnValue({ '1': 1 })

      const result = await adapter.healthCheck()

      expect(result).toBe(true)
    })

    it('should return false when connection fails', async () => {
      mockDb.prepare.mockImplementation(() => {
        throw new Error('Connection failed')
      })

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
      mockDb.exec.mockResolvedValue(undefined)

      const transactionId = await adapter.beginTransaction()

      expect(transactionId).toBeDefined()
      expect(mockDb.exec).toHaveBeenCalledWith('BEGIN TRANSACTION')
    })

    it('should commit transaction', async () => {
      mockDb.exec.mockResolvedValue(undefined)
      const transactionId = await adapter.beginTransaction()

      await adapter.commitTransaction(transactionId)

      expect(mockDb.exec).toHaveBeenCalledWith('COMMIT')
    })

    it('should rollback transaction', async () => {
      mockDb.exec.mockResolvedValue(undefined)
      const transactionId = await adapter.beginTransaction()

      await adapter.rollbackTransaction(transactionId)

      expect(mockDb.exec).toHaveBeenCalledWith('ROLLBACK')
    })

    it('should support nested transactions (savepoints)', () => {
      const supports = adapter.supportsNestedTransactions()
      expect(supports).toBe(true)
    })

    it('should create savepoint', async () => {
      mockDb.exec.mockResolvedValue(undefined)

      const transactionId = await adapter.beginTransaction()
      const savepointName = await adapter.createSavepoint(transactionId, 'test')

      expect(savepointName).toBeDefined()
      expect(mockDb.exec).toHaveBeenCalledWith(
        expect.stringContaining('SAVEPOINT')
      )
    })

    it('should rollback to savepoint', async () => {
      mockDb.exec.mockResolvedValue(undefined)

      const transactionId = await adapter.beginTransaction()
      const savepointName = await adapter.createSavepoint(transactionId, 'test')

      await adapter.rollbackToSavepoint(transactionId, savepointName)

      expect(mockDb.exec).toHaveBeenCalledWith(
        expect.stringContaining('ROLLBACK TO SAVEPOINT')
      )
    })
  })

  describe('close', () => {
    it('should close database connection', async () => {
      await adapter.close()

      expect(mockDb.close).toHaveBeenCalled()
    })
  })
})
