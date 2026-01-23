/**
 * DeleteRecordUseCase Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DeleteRecordUseCase } from '../../../../../src/application/use-cases/database/DeleteRecordUseCase'
import type { IDatabaseAdapter } from '../../../../../src/domain/interfaces/IDatabaseAdapter'
import type { IPolicyEngine } from '../../../../../src/domain/interfaces/IPolicyEngine'
import type { IAuditLogger } from '../../../../../src/domain/interfaces/IAuditLogger'
import { OperationType } from '../../../../../src/domain/value-objects/OperationType'
import { Actor } from '../../../../../src/domain/value-objects/Actor'
import { PermissionDeniedException, QueryException, ValidationException } from '../../../../../src/domain/exceptions'

describe('DeleteRecordUseCase', () => {
  let useCase: DeleteRecordUseCase
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
    } as unknown as IDatabaseAdapter

    mockPolicyEngine = {
      checkPermission: vi.fn().mockResolvedValue(true),
      evaluatePolicy: vi.fn(),
      addPolicy: vi.fn(),
      removePolicy: vi.fn(),
      getAllPolicies: vi.fn(),
    } as unknown as IPolicyEngine

    mockAuditLogger = {
      log: vi.fn().mockResolvedValue(undefined),
    } as unknown as IAuditLogger

    useCase = new DeleteRecordUseCase(mockAdapter, mockPolicyEngine, mockAuditLogger)
  })

  describe('execute', () => {
    it('should delete record successfully (soft delete)', async () => {
      ;(mockAdapter.delete as ReturnType<typeof vi.fn>).mockResolvedValue(true)
      ;(mockAdapter.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: '123',
        name: 'Test User',
      })

      const result = await useCase.execute({
        entity: 'users',
        conditions: { id: '123' },
        actor: new Actor('user-123', 'user', 'student'),
        soft: true,
      })

      expect(result.getDataAsSingle()).toBe(true)
      expect(mockAdapter.delete).toHaveBeenCalledWith('users', { id: '123' }, true)
    })

    it('should delete record successfully (hard delete)', async () => {
      ;(mockAdapter.delete as ReturnType<typeof vi.fn>).mockResolvedValue(true)

      const result = await useCase.execute({
        entity: 'users',
        conditions: { id: '123' },
        actor: new Actor('user-123', 'user', 'student'),
        hardDelete: true,
      })

      expect(result.getDataAsSingle()).toBe(true)
      expect(mockAdapter.delete).toHaveBeenCalledWith('users', { id: '123' }, false)
    })

    it('should throw ValidationException if conditions are empty', async () => {
      await expect(
        useCase.execute({
          entity: 'users',
          conditions: {},
          actor: new Actor('user-123', 'user', 'student'),
        })
      ).rejects.toThrow(ValidationException)
    })

    it('should throw PermissionDeniedException if permission denied', async () => {
      ;(mockPolicyEngine.checkPermission as ReturnType<typeof vi.fn>).mockResolvedValue(false)

      await expect(
        useCase.execute({
          entity: 'users',
          conditions: { id: '123' },
          actor: new Actor('user-123', 'user', 'student'),
        })
      ).rejects.toThrow(PermissionDeniedException)
    })

    it('should throw QueryException on database error', async () => {
      ;(mockAdapter.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: '123',
        name: 'Test User',
      })
      ;(mockAdapter.delete as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        useCase.execute({
          entity: 'users',
          conditions: { id: '123' },
          actor: new Actor('user-123', 'user', 'student'),
        })
      ).rejects.toThrow(QueryException)
    })

    it('should log audit entry', async () => {
      const beforeData = { id: '123', name: 'Test User' }
      ;(mockAdapter.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(beforeData)
      ;(mockAdapter.delete as ReturnType<typeof vi.fn>).mockResolvedValue(true)

      await useCase.execute({
        entity: 'users',
        conditions: { id: '123' },
        actor: new Actor('user-123', 'user', 'student'),
      })

      expect(mockAuditLogger.log).toHaveBeenCalled()
      const logCall = (mockAuditLogger.log as ReturnType<typeof vi.fn>).mock.calls[0][0]
      expect(logCall.actor).toBe('user-123')
      expect(logCall.action).toBe(OperationType.DELETE)
      expect(logCall.entity).toBe('users')
      expect(logCall.success).toBe(true)
    })
  })
})
