/**
 * UpdateRecordUseCase Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UpdateRecordUseCase } from '../../../../../src/application/use-cases/database/UpdateRecordUseCase'
import type { IDatabaseAdapter } from '../../../../../src/domain/interfaces/IDatabaseAdapter'
import type { IPolicyEngine } from '../../../../../src/domain/interfaces/IPolicyEngine'
import type { IAuditLogger } from '../../../../../src/domain/interfaces/IAuditLogger'
import { OperationType } from '../../../../../src/domain/value-objects/OperationType'
import { Actor } from '../../../../../src/domain/value-objects/Actor'
import { PermissionDeniedException, QueryException, ValidationException } from '../../../../../src/domain/exceptions'

describe('UpdateRecordUseCase', () => {
  let useCase: UpdateRecordUseCase
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

    useCase = new UpdateRecordUseCase(mockAdapter, mockPolicyEngine, mockAuditLogger)
  })

  describe('execute', () => {
    it('should update record successfully', async () => {
      const updatedRecord = { id: '123', name: 'Updated Name' }
      ;(mockAdapter.update as ReturnType<typeof vi.fn>).mockResolvedValue(updatedRecord)

      const result = await useCase.execute({
        entity: 'users',
        conditions: { id: '123' },
        data: { name: 'Updated Name' },
        actor: new Actor('user-123', 'user', 'student'),
      })

      expect(result.getDataAsSingle()).toEqual(updatedRecord)
      expect(mockAdapter.update).toHaveBeenCalledWith(
        'users',
        { id: '123' },
        { name: 'Updated Name' }
      )
    })

    it('should throw ValidationException if data is empty', async () => {
      await expect(
        useCase.execute({
          entity: 'users',
          conditions: { id: '123' },
          data: {},
          actor: new Actor('user-123', 'user', 'student'),
        })
      ).rejects.toThrow(ValidationException)
    })

    it('should throw ValidationException if conditions are empty', async () => {
      await expect(
        useCase.execute({
          entity: 'users',
          conditions: {},
          data: { name: 'Updated Name' },
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
          data: { name: 'Updated Name' },
          actor: new Actor('user-123', 'user', 'student'),
        })
      ).rejects.toThrow(PermissionDeniedException)
    })

    it('should throw QueryException on database error', async () => {
      ;(mockAdapter.update as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        useCase.execute({
          entity: 'users',
          conditions: { id: '123' },
          data: { name: 'Updated Name' },
          actor: new Actor('user-123', 'user', 'student'),
        })
      ).rejects.toThrow(QueryException)
    })

    it('should log audit entry', async () => {
      const updatedRecord = { id: '123', name: 'Updated Name' }
      ;(mockAdapter.update as ReturnType<typeof vi.fn>).mockResolvedValue(updatedRecord)

      await useCase.execute({
        entity: 'users',
        conditions: { id: '123' },
        data: { name: 'Updated Name' },
        actor: new Actor('user-123', 'user', 'student'),
      })

      expect(mockAuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          actor: expect.any(String),
          action: OperationType.UPDATE,
          entity: 'users',
          success: true,
        })
      )
    })
  })
})
