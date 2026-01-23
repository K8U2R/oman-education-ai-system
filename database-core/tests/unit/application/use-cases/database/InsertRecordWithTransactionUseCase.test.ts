/**
 * InsertRecordWithTransactionUseCase Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InsertRecordWithTransactionUseCase } from '../../../../../src/application/use-cases/database/InsertRecordWithTransactionUseCase'
import type { IDatabaseAdapter } from '../../../../../src/domain/interfaces/IDatabaseAdapter'
import type { IPolicyEngine } from '../../../../../src/domain/interfaces/IPolicyEngine'
import type { IAuditLogger } from '../../../../../src/domain/interfaces/IAuditLogger'
import type { ITransactionManager } from '../../../../../src/domain/interfaces/ITransactionManager'
import { OperationType } from '../../../../../src/domain/value-objects/OperationType'
import { PermissionDeniedException, ValidationException } from '../../../../../src/domain/exceptions'

describe('InsertRecordWithTransactionUseCase', () => {
  let useCase: InsertRecordWithTransactionUseCase
  let mockAdapter: IDatabaseAdapter
  let mockPolicyEngine: IPolicyEngine
  let mockAuditLogger: IAuditLogger
  let mockTransactionManager: ITransactionManager

  beforeEach(() => {
    mockAdapter = {
      find: vi.fn(),
      findOne: vi.fn(),
      insert: vi.fn(),
      insertMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      executeRaw: vi.fn(),
    } as unknown as IDatabaseAdapter

    mockPolicyEngine = {
      checkPermission: vi.fn(),
      evaluatePolicy: vi.fn(),
    } as unknown as IPolicyEngine

    mockAuditLogger = {
      log: vi.fn(),
      getLogs: vi.fn(),
    } as unknown as IAuditLogger

    mockTransactionManager = {
      beginTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      rollbackTransaction: vi.fn(),
      getTransactionInfo: vi.fn(),
      getAllTransactions: vi.fn(),
      executeInTransaction: vi.fn(),
    } as unknown as ITransactionManager

    useCase = new InsertRecordWithTransactionUseCase(
      mockAdapter,
      mockPolicyEngine,
      mockAuditLogger,
      mockTransactionManager
    )
  })

  describe('execute', () => {
    it('should insert record successfully with transaction', async () => {
      const mockData = { id: '1', name: 'Test User' }
      const transactionId = 'txn-123'

      ;(mockPolicyEngine.checkPermission as ReturnType<typeof vi.fn>).mockResolvedValue(true)
      ;(mockAdapter.insert as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)
      ;(mockTransactionManager.beginTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(
        transactionId
      )
      ;(mockTransactionManager.commitTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(
        undefined
      )

      const result = await useCase.execute({
        entity: 'users',
        data: { name: 'Test User' },
        actor: 'user-123',
        autoCommit: true,
      })

      expect(result.getDataAsSingle()).toEqual(mockData)
      expect(mockTransactionManager.beginTransaction).toHaveBeenCalled()
      expect(mockTransactionManager.commitTransaction).toHaveBeenCalledWith(transactionId)
      expect(mockAdapter.insert).toHaveBeenCalledWith('users', { name: 'Test User' })
    })

    it('should use existing transaction if provided', async () => {
      const mockData = { id: '1', name: 'Test User' }
      const existingTransactionId = 'txn-existing'

      ;(mockPolicyEngine.checkPermission as ReturnType<typeof vi.fn>).mockResolvedValue(true)
      ;(mockAdapter.insert as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)
      ;(mockTransactionManager.commitTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(
        undefined
      )

      const result = await useCase.execute({
        entity: 'users',
        data: { name: 'Test User' },
        actor: 'user-123',
        transactionId: existingTransactionId,
        autoCommit: true,
      })

      expect(result.getDataAsSingle()).toEqual(mockData)
      expect(mockTransactionManager.beginTransaction).not.toHaveBeenCalled()
      expect(mockTransactionManager.commitTransaction).toHaveBeenCalledWith(existingTransactionId)
    })

    it('should rollback transaction on error', async () => {
      const transactionId = 'txn-123'
      const error = new Error('Insert failed')

      ;(mockPolicyEngine.checkPermission as ReturnType<typeof vi.fn>).mockResolvedValue(true)
      ;(mockAdapter.insert as ReturnType<typeof vi.fn>).mockRejectedValue(error)
      ;(mockTransactionManager.beginTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(
        transactionId
      )
      ;(mockTransactionManager.rollbackTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(
        undefined
      )

      await expect(
        useCase.execute({
          entity: 'users',
          data: { name: 'Test User' },
          actor: 'user-123',
        })
      ).rejects.toThrow('Insert failed')

      expect(mockTransactionManager.rollbackTransaction).toHaveBeenCalledWith(transactionId)
    })

    it('should throw ValidationException if data is empty', async () => {
      await expect(
        useCase.execute({
          entity: 'users',
          data: {},
          actor: 'user-123',
        })
      ).rejects.toThrow(ValidationException)
    })

    it('should throw PermissionDeniedException if no permission', async () => {
      const transactionId = 'txn-123'

      ;(mockPolicyEngine.checkPermission as ReturnType<typeof vi.fn>).mockResolvedValue(false)
      ;(mockTransactionManager.beginTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(
        transactionId
      )
      ;(mockTransactionManager.rollbackTransaction as ReturnType<typeof vi.fn>).mockResolvedValue(
        undefined
      )

      await expect(
        useCase.execute({
          entity: 'users',
          data: { name: 'Test User' },
          actor: 'user-123',
        })
      ).rejects.toThrow(PermissionDeniedException)

      expect(mockTransactionManager.rollbackTransaction).toHaveBeenCalledWith(transactionId)
    })

    it('should work without TransactionManager', async () => {
      const useCaseWithoutTxn = new InsertRecordWithTransactionUseCase(
        mockAdapter,
        mockPolicyEngine,
        mockAuditLogger,
        null // No TransactionManager
      )

      const mockData = { id: '1', name: 'Test User' }

      ;(mockPolicyEngine.checkPermission as ReturnType<typeof vi.fn>).mockResolvedValue(true)
      ;(mockAdapter.insert as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)

      const result = await useCaseWithoutTxn.execute({
        entity: 'users',
        data: { name: 'Test User' },
        actor: 'user-123',
      })

      expect(result.getDataAsSingle()).toEqual(mockData)
    })
  })
})
