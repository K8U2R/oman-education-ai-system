/**
 * TransactionManager Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'
import { TransactionManager } from '../../../../src/infrastructure/transactions/TransactionManager'
import { TransactionStatus } from '../../../../src/domain/interfaces/ITransactionManager'
import type { IDatabaseAdapter } from '../../../../src/domain/interfaces/IDatabaseAdapter'

describe('TransactionManager', () => {
  let transactionManager: TransactionManager
  let mockAdapter: IDatabaseAdapter

  beforeEach(() => {
    mockAdapter = {
      find: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue(null),
      insert: vi.fn().mockResolvedValue({}),
      insertMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue(true),
      executeRaw: vi.fn().mockResolvedValue({}),
    } as unknown as IDatabaseAdapter

    transactionManager = new TransactionManager(mockAdapter)
  })

  describe('beginTransaction', () => {
    it('should create a new transaction', async () => {
      const transactionId = await transactionManager.beginTransaction()

      expect(transactionId).toBeDefined()
      expect(typeof transactionId).toBe('string')
    })

    it('should create transaction with custom options', async () => {
      const transactionId = await transactionManager.beginTransaction({
        isolationLevel: 'SERIALIZABLE',
        timeout: 60000,
      })

      const info = await transactionManager.getTransactionInfo(transactionId)
      expect(info).toBeDefined()
    })
  })

  describe('commitTransaction', () => {
    it('should commit a pending transaction', async () => {
      const transactionId = await transactionManager.beginTransaction()

      await transactionManager.commitTransaction(transactionId)

      const status = await transactionManager.getTransactionStatus(transactionId)
      expect(status).toBe(TransactionStatus.COMMITTED)
    })

    it('should throw error if transaction not found', async () => {
      await expect(
        transactionManager.commitTransaction('non-existent-id')
      ).rejects.toThrow('Transaction not found')
    })

    it('should throw error if transaction not in pending state', async () => {
      const transactionId = await transactionManager.beginTransaction()
      await transactionManager.commitTransaction(transactionId)

      await expect(
        transactionManager.commitTransaction(transactionId)
      ).rejects.toThrow('Transaction is not in PENDING state')
    })
  })

  describe('rollbackTransaction', () => {
    it('should rollback a pending transaction', async () => {
      const transactionId = await transactionManager.beginTransaction()

      await transactionManager.rollbackTransaction(transactionId)

      const status = await transactionManager.getTransactionStatus(transactionId)
      expect(status).toBe(TransactionStatus.ROLLED_BACK)
    })

    it('should throw error if transaction not found', async () => {
      await expect(
        transactionManager.rollbackTransaction('non-existent-id')
      ).rejects.toThrow('Transaction not found')
    })

    it('should throw error if transaction already committed', async () => {
      const transactionId = await transactionManager.beginTransaction()
      await transactionManager.commitTransaction(transactionId)

      await expect(
        transactionManager.rollbackTransaction(transactionId)
      ).rejects.toThrow('Cannot rollback a committed transaction')
    })
  })

  describe('executeInTransaction', () => {
    it('should execute operation in transaction', async () => {
      const transactionId = await transactionManager.beginTransaction()

      const result = await transactionManager.executeInTransaction(
        transactionId,
        async () => {
          return 'test-result'
        }
      )

      expect(result).toBe('test-result')

      const info = await transactionManager.getTransactionInfo(transactionId)
      expect(info?.operations).toBe(1)
    })

    it('should increment operations count', async () => {
      const transactionId = await transactionManager.beginTransaction()

      await transactionManager.executeInTransaction(transactionId, async () => 'result1')
      await transactionManager.executeInTransaction(transactionId, async () => 'result2')

      const info = await transactionManager.getTransactionInfo(transactionId)
      expect(info?.operations).toBe(2)
    })

    it('should rollback on error', async () => {
      const transactionId = await transactionManager.beginTransaction()

      await expect(
        transactionManager.executeInTransaction(transactionId, async () => {
          throw new Error('Test error')
        })
      ).rejects.toThrow('Test error')

      const status = await transactionManager.getTransactionStatus(transactionId)
      expect(status).toBe(TransactionStatus.ROLLED_BACK)
    })
  })

  describe('executeBatchInTransaction', () => {
    it('should execute multiple operations', async () => {
      const transactionId = await transactionManager.beginTransaction()

      const results = await transactionManager.executeBatchInTransaction(
        transactionId,
        [
          async () => 'result1',
          async () => 'result2',
          async () => 'result3',
        ]
      )

      expect(results).toEqual(['result1', 'result2', 'result3'])

      const info = await transactionManager.getTransactionInfo(transactionId)
      expect(info?.operations).toBe(3)
    })

    it('should rollback all on error', async () => {
      const transactionId = await transactionManager.beginTransaction()

      await expect(
        transactionManager.executeBatchInTransaction(transactionId, [
          async () => 'result1',
          async () => {
            throw new Error('Test error')
          },
          async () => 'result3',
        ])
      ).rejects.toThrow('Test error')

      const status = await transactionManager.getTransactionStatus(transactionId)
      expect(status).toBe(TransactionStatus.ROLLED_BACK)
    })
  })

  describe('getStatistics', () => {
    it('should return transaction statistics', async () => {
      const id1 = await transactionManager.beginTransaction()
      const id2 = await transactionManager.beginTransaction()

      await transactionManager.commitTransaction(id1)
      await transactionManager.rollbackTransaction(id2)

      const stats = transactionManager.getStatistics()

      expect(stats.total).toBe(2)
      expect(stats.committed).toBe(1)
      expect(stats.rolledBack).toBe(1)
      expect(stats.pending).toBe(0)
    })
  })
})
