/**
 * Unit Tests for FindRecordsUseCase
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FindRecordsUseCase } from '../../../../src/application/use-cases/database/FindRecordsUseCase'
import { IDatabaseAdapter } from '../../../../src/domain/interfaces/IDatabaseAdapter'
import { IPolicyEngine } from '../../../../src/domain/interfaces/IPolicyEngine'
import { IAuditLogger } from '../../../../src/domain/interfaces/IAuditLogger'
import { OperationType } from '../../../../src/domain/value-objects/OperationType'
import { Actor } from '../../../../src/domain/value-objects/Actor'
import { PermissionDeniedException } from '../../../../src/domain/exceptions'

describe('FindRecordsUseCase', () => {
  let useCase: FindRecordsUseCase
  let mockAdapter: IDatabaseAdapter
  let mockPolicyEngine: IPolicyEngine
  let mockAuditLogger: IAuditLogger

  beforeEach(() => {
    // Mock Adapter
    mockAdapter = {
      find: vi.fn(),
      findOne: vi.fn(),
      insert: vi.fn(),
      insertMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      executeRaw: vi.fn(),
    }

    // Mock Policy Engine
    mockPolicyEngine = {
      checkPermission: vi.fn(),
      evaluatePolicy: vi.fn(),
      addPolicy: vi.fn(),
      removePolicy: vi.fn(),
      getAllPolicies: vi.fn(),
    }

    // Mock Audit Logger
    mockAuditLogger = {
      log: vi.fn(),
      getLogs: vi.fn(),
    }

    useCase = new FindRecordsUseCase(
      mockAdapter,
      mockPolicyEngine,
      mockAuditLogger
    )
  })

  describe('execute', () => {
    it('should find records successfully', async () => {
      const mockData = [{ id: '1', name: 'Test' }]
      const actor = new Actor('user-123')

      vi.mocked(mockPolicyEngine.checkPermission).mockResolvedValue(true)
      vi.mocked(mockAdapter.find).mockResolvedValue(mockData)

      const result = await useCase.execute({
        entity: 'users',
        conditions: { role: 'student' },
        actor,
      })

      expect(result.getDataAsArray()).toEqual(mockData)
      expect(result.getCount()).toBe(1)
      expect(mockPolicyEngine.checkPermission).toHaveBeenCalledWith({
        actor: 'user-123',
        operation: OperationType.FIND,
        entity: 'users',
        conditions: { role: 'student' },
      })
      expect(mockAdapter.find).toHaveBeenCalled()
      expect(mockAuditLogger.log).toHaveBeenCalled()
    })

    it('should throw PermissionDeniedException if no permission', async () => {
      const actor = new Actor('user-123')

      vi.mocked(mockPolicyEngine.checkPermission).mockResolvedValue(false)

      await expect(
        useCase.execute({
          entity: 'users',
          conditions: { role: 'student' },
          actor,
        })
      ).rejects.toThrow(PermissionDeniedException)

      expect(mockAdapter.find).not.toHaveBeenCalled()
    })

    it('should handle errors gracefully', async () => {
      const actor = new Actor('user-123')

      vi.mocked(mockPolicyEngine.checkPermission).mockResolvedValue(true)
      vi.mocked(mockAdapter.find).mockRejectedValue(new Error('Database error'))

      await expect(
        useCase.execute({
          entity: 'users',
          actor,
        })
      ).rejects.toThrow()

      expect(mockAuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      )
    })
  })
})
