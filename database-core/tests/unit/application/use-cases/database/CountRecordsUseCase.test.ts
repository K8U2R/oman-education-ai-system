/**
 * CountRecordsUseCase Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CountRecordsUseCase } from '../../../../../src/application/use-cases/database/CountRecordsUseCase'
import type { IDatabaseAdapter } from '../../../../../src/domain/interfaces/IDatabaseAdapter'
import type { IPolicyEngine } from '../../../../../src/domain/interfaces/IPolicyEngine'
import type { IAuditLogger } from '../../../../../src/domain/interfaces/IAuditLogger'
import { OperationType } from '../../../../../src/domain/value-objects/OperationType'
import { Actor } from '../../../../../src/domain/value-objects/Actor'
import { PermissionDeniedException, QueryException } from '../../../../../src/domain/exceptions'

describe('CountRecordsUseCase', () => {
  let useCase: CountRecordsUseCase
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
      count: vi.fn(),
      executeRaw: vi.fn(),
      healthCheck: vi.fn(),
      close: vi.fn(),
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

    useCase = new CountRecordsUseCase(mockAdapter, mockPolicyEngine, mockAuditLogger)
  })

  describe('execute', () => {
    it('should count records successfully', async () => {
      ;(mockAdapter.count as ReturnType<typeof vi.fn>).mockResolvedValue(3)

      const result = await useCase.execute({
        entity: 'users',
        conditions: { role: 'student' },
        actor: new Actor('user-123', 'user', 'student'),
      })

      expect(result.getDataAsSingle()).toBe(3)
      expect(mockAdapter.count).toHaveBeenCalledWith('users', { role: 'student' })
    })

    it('should return 0 if no records found', async () => {
      ;(mockAdapter.count as ReturnType<typeof vi.fn>).mockResolvedValue(0)

      const result = await useCase.execute({
        entity: 'users',
        conditions: { role: 'admin' },
        actor: new Actor('user-123', 'user', 'student'),
      })

      expect(result.getDataAsSingle()).toBe(0)
      expect(mockAdapter.count).toHaveBeenCalledWith('users', { role: 'admin' })
    })

    it('should throw PermissionDeniedException if permission denied', async () => {
      ;(mockPolicyEngine.checkPermission as ReturnType<typeof vi.fn>).mockResolvedValue(false)

      await expect(
        useCase.execute({
          entity: 'users',
          conditions: { role: 'student' },
          actor: new Actor('user-123', 'user', 'student'),
        })
      ).rejects.toThrow(PermissionDeniedException)
    })

    it('should throw QueryException on database error', async () => {
      ;(mockAdapter.count as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        useCase.execute({
          entity: 'users',
          conditions: { role: 'student' },
          actor: new Actor('user-123', 'user', 'student'),
        })
      ).rejects.toThrow(QueryException)
    })

    it('should log audit entry', async () => {
      ;(mockAdapter.count as ReturnType<typeof vi.fn>).mockResolvedValue(2)

      await useCase.execute({
        entity: 'users',
        conditions: { role: 'student' },
        actor: new Actor('user-123', 'user', 'student'),
      })

      expect(mockAdapter.count).toHaveBeenCalledWith('users', { role: 'student' })
      expect(mockAuditLogger.log).toHaveBeenCalled()
      const logCall = (mockAuditLogger.log as ReturnType<typeof vi.fn>).mock.calls[0][0]
      expect(logCall.actor).toBe('user-123')
      expect(logCall.action).toBe(OperationType.COUNT)
      expect(logCall.entity).toBe('users')
      expect(logCall.success).toBe(true)
    })
  })
})
