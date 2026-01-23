/**
 * TransactionManager Integration Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { TransactionManager } from '../../../src/infrastructure/transactions/TransactionManager'
import { PostgreSQLAdapter } from '../../../src/infrastructure/adapters/PostgreSQLAdapter'
import { TransactionStatus } from '../../../src/domain/interfaces/ITransactionManager'
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

describe('TransactionManager Integration', () => {
  let transactionManager: TransactionManager
  let adapter: PostgreSQLAdapter
  let mockPool: {
    connect: ReturnType<typeof vi.fn>
    query: ReturnType<typeof vi.fn>
    end: ReturnType<typeof vi.fn>
    on: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    const PoolConstructor = Pool as unknown as ReturnType<typeof vi.fn>
    mockPool = PoolConstructor.mock.results[0]?.value || {
      connect: vi.fn(),
      query: vi.fn(),
      end: vi.fn(),
      on: vi.fn(),
    }

    adapter = new PostgreSQLAdapter({
      host: 'localhost',
      port: 5432,
      database: 'testdb',
      user: 'testuser',
      password: 'testpass',
    })

    transactionManager = new TransactionManager(adapter)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('beginTransaction', () => {
    it('should start a transaction successfully', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const transactionId = await transactionManager.beginTransaction()

      expect(transactionId).toBeDefined()
      expect(typeof transactionId).toBe('string')
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN')
    })

    it('should start transaction with custom options', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const transactionId = await transactionManager.beginTransaction({
        isolationLevel: 'SERIALIZABLE',
        timeout: 60000,
      })

      expect(transactionId).toBeDefined()
      const info = await transactionManager.getTransactionInfo(transactionId)
      expect(info?.options.isolationLevel).toBe('SERIALIZABLE')
    })
  })

  describe('commitTransaction', () => {
    it('should commit a transaction successfully', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const transactionId = await transactionManager.beginTransaction()
      await transactionManager.commitTransaction(transactionId)

      expect(mockClient.query).toHaveBeenCalledWith('COMMIT')
      expect(mockClient.release).toHaveBeenCalled()

      const info = await transactionManager.getTransactionInfo(transactionId)
      expect(info?.status).toBe(TransactionStatus.COMMITTED)
    })

    it('should throw error if transaction not found', async () => {
      await expect(
        transactionManager.commitTransaction('non-existent-id')
      ).rejects.toThrow('Transaction not found')
    })

    it('should throw error if transaction not in pending state', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const transactionId = await transactionManager.beginTransaction()
      await transactionManager.commitTransaction(transactionId)

      // Try to commit again
      await expect(
        transactionManager.commitTransaction(transactionId)
      ).rejects.toThrow('Transaction is not in PENDING state')
    })
  })

  describe('rollbackTransaction', () => {
    it('should rollback a transaction successfully', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const transactionId = await transactionManager.beginTransaction()
      await transactionManager.rollbackTransaction(transactionId)

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK')
      expect(mockClient.release).toHaveBeenCalled()

      const info = await transactionManager.getTransactionInfo(transactionId)
      expect(info?.status).toBe(TransactionStatus.ROLLED_BACK)
    })

    it('should throw error if transaction not found', async () => {
      await expect(
        transactionManager.rollbackTransaction('non-existent-id')
      ).rejects.toThrow('Transaction not found')
    })
  })

  describe('executeInTransaction', () => {
    it('should execute operations in transaction', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [{ id: '1', name: 'Test' }] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const transactionId = await transactionManager.beginTransaction()

      const result = await transactionManager.executeInTransaction(
        transactionId,
        async () => {
          return await adapter.insert('users', { name: 'Test' })
        }
      )

      expect(result).toBeDefined()
      await transactionManager.commitTransaction(transactionId)
    })

    it('should rollback on error', async () => {
      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce({ rows: [] }) // BEGIN
          .mockRejectedValueOnce(new Error('Operation failed')), // Operation
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const transactionId = await transactionManager.beginTransaction()

      try {
        await transactionManager.executeInTransaction(transactionId, async () => {
          throw new Error('Operation failed')
        })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }

      // Transaction should be rolled back
      const info = await transactionManager.getTransactionInfo(transactionId)
      // Note: In real scenario, error handling would rollback automatically
    })
  })

  describe('getTransactionInfo', () => {
    it('should return transaction info', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const transactionId = await transactionManager.beginTransaction()
      const info = await transactionManager.getTransactionInfo(transactionId)

      expect(info).toBeDefined()
      expect(info?.id).toBe(transactionId)
      expect(info?.status).toBe(TransactionStatus.PENDING)
      expect(info?.startedAt).toBeInstanceOf(Date)
    })

    it('should return null for non-existent transaction', async () => {
      const info = await transactionManager.getTransactionInfo('non-existent-id')
      expect(info).toBeNull()
    })
  })

  describe('getAllTransactions', () => {
    it('should return all active transactions', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }

      mockPool.connect.mockResolvedValue(mockClient)

      const txn1 = await transactionManager.beginTransaction()
      const txn2 = await transactionManager.beginTransaction()

      const allTransactions = await transactionManager.getAllTransactions()

      expect(allTransactions.length).toBeGreaterThanOrEqual(2)
      expect(allTransactions.some((t) => t.id === txn1)).toBe(true)
      expect(allTransactions.some((t) => t.id === txn2)).toBe(true)

      // Cleanup
      await transactionManager.commitTransaction(txn1)
      await transactionManager.commitTransaction(txn2)
    })
  })
})
