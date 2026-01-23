/**
 * DatabaseServiceWithTransactions Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DatabaseServiceWithTransactions } from '../../../../src/application/services/DatabaseServiceWithTransactions'
import { TransactionManager } from '../../../../src/infrastructure/transactions/TransactionManager'
import { PolicyEngine } from '../../../../src/infrastructure/policies/PolicyEngine'
import { AuditLogger } from '../../../../src/infrastructure/audit/AuditLogger'
import type { IDatabaseAdapter } from '../../../../src/domain/interfaces/IDatabaseAdapter'
import { OperationType } from '../../../../src/domain/value-objects/OperationType'
import { TransactionStatus } from '../../../../src/domain/interfaces/ITransactionManager'

describe('DatabaseServiceWithTransactions', () => {
  let service: DatabaseServiceWithTransactions
  let mockAdapter: IDatabaseAdapter
  let transactionManager: TransactionManager
  let policyEngine: PolicyEngine
  let auditLogger: AuditLogger

  beforeEach(() => {
    mockAdapter = {
      find: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue(null),
      insert: vi.fn().mockResolvedValue({ id: '1', name: 'Test' }),
      insertMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({ id: '1', name: 'Updated' }),
      delete: vi.fn().mockResolvedValue(true),
      executeRaw: vi.fn().mockResolvedValue({}),
    } as unknown as IDatabaseAdapter

    transactionManager = new TransactionManager(mockAdapter)
    policyEngine = new PolicyEngine()
    auditLogger = new AuditLogger()

    service = new DatabaseServiceWithTransactions(
      mockAdapter,
      policyEngine,
      auditLogger,
      transactionManager
    )
  })

  describe('executeWithTransaction', () => {
    it('should execute operation in transaction', async () => {
      const result = await service.executeWithTransaction({
        operation: OperationType.INSERT,
        entity: 'users',
        payload: { name: 'Test User' },
        actor: 'user-123',
        autoCommit: true,
      })

      expect(result.success).toBe(true)
    })

    it('should rollback on error', async () => {
      ;(mockAdapter.insert as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        service.executeWithTransaction({
          operation: OperationType.INSERT,
          entity: 'users',
          payload: { name: 'Test User' },
          actor: 'user-123',
        })
      ).rejects.toThrow()

      // Transaction should be rolled back
      const stats = transactionManager.getStatistics()
      expect(stats.rolledBack).toBeGreaterThan(0)
    })

    it('should use existing transaction if provided', async () => {
      const transactionId = await service.beginTransaction()

      const result = await service.executeWithTransaction({
        operation: OperationType.INSERT,
        entity: 'users',
        payload: { name: 'Test User' },
        actor: 'user-123',
        transactionId,
        autoCommit: false, // Don't auto-commit when using existing transaction
      })

      expect(result.success).toBe(true)

      // Transaction should still be pending
      const status = await transactionManager.getTransactionStatus(transactionId)
      expect(status).toBe(TransactionStatus.PENDING)
    })
  })

  describe('executeBatchWithTransaction', () => {
    it('should execute multiple operations in one transaction', async () => {
      const results = await service.executeBatchWithTransaction([
        {
          operation: OperationType.INSERT,
          entity: 'users',
          payload: { name: 'User 1' },
          actor: 'user-123',
        },
        {
          operation: OperationType.INSERT,
          entity: 'users',
          payload: { name: 'User 2' },
          actor: 'user-123',
        },
      ])

      expect(results).toHaveLength(2)
      expect(results[0].success).toBe(true)
      expect(results[1].success).toBe(true)
    })

    it('should rollback all on error', async () => {
      ;(mockAdapter.insert as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({ id: '1' })
        .mockRejectedValueOnce(new Error('Database error'))

      await expect(
        service.executeBatchWithTransaction([
          {
            operation: OperationType.INSERT,
            entity: 'users',
            payload: { name: 'User 1' },
            actor: 'user-123',
          },
          {
            operation: OperationType.INSERT,
            entity: 'users',
            payload: { name: 'User 2' },
            actor: 'user-123',
          },
        ])
      ).rejects.toThrow()

      const stats = transactionManager.getStatistics()
      expect(stats.rolledBack).toBeGreaterThan(0)
    })
  })

  describe('transaction management', () => {
    it('should begin transaction', async () => {
      const transactionId = await service.beginTransaction()
      expect(transactionId).toBeDefined()
    })

    it('should commit transaction', async () => {
      const transactionId = await service.beginTransaction()
      await service.commitTransaction(transactionId)

      const status = await transactionManager.getTransactionStatus(transactionId)
      expect(status).toBe(TransactionStatus.COMMITTED)
    })

    it('should rollback transaction', async () => {
      const transactionId = await service.beginTransaction()
      await service.rollbackTransaction(transactionId)

      const status = await transactionManager.getTransactionStatus(transactionId)
      expect(status).toBe(TransactionStatus.ROLLED_BACK)
    })

    it('should get transaction info', async () => {
      const transactionId = await service.beginTransaction()
      const info = await service.getTransactionInfo(transactionId)

      expect(info).toBeDefined()
      expect(info?.id).toBe(transactionId)
      expect(info?.status).toBe(TransactionStatus.PENDING)
    })
  })
})
