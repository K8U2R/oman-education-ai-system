/**
 * Unit Tests for InsertRecordUseCase
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InsertRecordUseCase } from '../../../../src/application/use-cases/database/InsertRecordUseCase'
import { IDatabaseAdapter } from '../../../../src/domain/interfaces/IDatabaseAdapter'
import { IPolicyEngine } from '../../../../src/domain/interfaces/IPolicyEngine'
import { IAuditLogger } from '../../../../src/domain/interfaces/IAuditLogger'
import { OperationType } from '../../../../src/domain/value-objects/OperationType'
import { Actor } from '../../../../src/domain/value-objects/Actor'
import { PermissionDeniedException, ValidationException } from '../../../../src/domain/exceptions'

describe('InsertRecordUseCase', () => {
  let useCase: InsertRecordUseCase
  let mockAdapter: IDatabaseAdapter
  let mockPolicyEngine: IPolicyEngine
  let mockAuditLogger: IAuditLogger

  beforeEach(() => {
    mockAdapter = {
      find: vi.fn(),
      findOne: vi.fn(),
      insert: vi.fn(),
      insertMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      executeRaw: vi.fn(),
    }

    mockPolicyEngine = {
      checkPermission: vi.fn(),
      evaluatePolicy: vi.fn(),
      addPolicy: vi.fn(),
      removePolicy: vi.fn(),
      getAllPolicies: vi.fn(),
    }

    mockAuditLogger = {
      log: vi.fn(),
      getLogs: vi.fn(),
    }

    useCase = new InsertRecordUseCase(
      mockAdapter,
      mockPolicyEngine,
      mockAuditLogger
    )
  })

  describe('execute', () => {
    it('should insert record successfully', async () => {
      const mockData = { id: '1', name: 'Test' }
      const actor = new Actor('user-123')

      vi.mocked(mockPolicyEngine.checkPermission).mockResolvedValue(true)
      vi.mocked(mockAdapter.insert).mockResolvedValue(mockData as never)

      const result = await useCase.execute({
        entity: 'users',
        data: { name: 'Test' },
        actor,
      })

      expect(result.getDataAsSingle()).toEqual(mockData)
      expect(mockPolicyEngine.checkPermission).toHaveBeenCalledWith({
        actor: 'user-123',
        operation: OperationType.INSERT,
        entity: 'users',
      })
      expect(mockAdapter.insert).toHaveBeenCalledWith('users', { name: 'Test' })
      expect(mockAuditLogger.log).toHaveBeenCalled()
    })

    it('should throw ValidationException if data is empty', async () => {
      const actor = new Actor('user-123')

      await expect(
        useCase.execute({
          entity: 'users',
          data: {},
          actor,
        })
      ).rejects.toThrow(ValidationException)

      expect(mockAdapter.insert).not.toHaveBeenCalled()
    })

    it('should throw PermissionDeniedException if no permission', async () => {
      const actor = new Actor('user-123')

      vi.mocked(mockPolicyEngine.checkPermission).mockResolvedValue(false)

      await expect(
        useCase.execute({
          entity: 'users',
          data: { name: 'Test' },
          actor,
        })
      ).rejects.toThrow(PermissionDeniedException)

      expect(mockAdapter.insert).not.toHaveBeenCalled()
    })
  })
})
