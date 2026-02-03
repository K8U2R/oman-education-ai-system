/**
 * AuditDatabaseRepository Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuditDatabaseRepository } from '../../../../src/infrastructure/audit/AuditDatabaseRepository'
import type { IDatabaseAdapter } from '../../../../src/domain/interfaces/IDatabaseAdapter'

describe('AuditDatabaseRepository', () => {
  let repository: AuditDatabaseRepository
  let mockAdapter: IDatabaseAdapter

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

    repository = new AuditDatabaseRepository(mockAdapter)
  })

  describe('save', () => {
    it('should save audit log to database', async () => {
      const auditLog = {
        id: 'audit-123',
        actor: 'user-123',
        action: 'INSERT',
        entity: 'users',
        conditions: { id: '1' },
        before: null,
        after: { id: '1', name: 'User' },
        success: true,
        error: undefined,
        execution_time: 100,
        timestamp: new Date(),
      }

      const savedLog = {
        ...auditLog,
        created_at: new Date().toISOString(),
      }

      ;(mockAdapter.insert as ReturnType<typeof vi.fn>).mockResolvedValue(savedLog)

      const result = await repository.save(auditLog)

      expect(result).toEqual(savedLog)
      expect(mockAdapter.insert).toHaveBeenCalledWith(
        'audit_logs',
        expect.objectContaining({
          id: auditLog.id,
          actor: auditLog.actor,
          action: auditLog.action,
          entity: auditLog.entity,
        })
      )
    })

    it('should stringify JSON fields', async () => {
      const auditLog = {
        id: 'audit-123',
        actor: 'user-123',
        action: 'UPDATE',
        entity: 'users',
        conditions: { id: '1' },
        before: { name: 'Old Name' },
        after: { name: 'New Name' },
        success: true,
        timestamp: new Date(),
      }

      ;(mockAdapter.insert as ReturnType<typeof vi.fn>).mockResolvedValue(auditLog)

      await repository.save(auditLog)

      expect(mockAdapter.insert).toHaveBeenCalledWith(
        'audit_logs',
        expect.objectContaining({
          conditions: JSON.stringify(auditLog.conditions),
          before: JSON.stringify(auditLog.before),
          after: JSON.stringify(auditLog.after),
        })
      )
    })

    it('should handle errors gracefully', async () => {
      const auditLog = {
        id: 'audit-123',
        actor: 'user-123',
        action: 'INSERT',
        entity: 'users',
        success: true,
        timestamp: new Date(),
      }

      ;(mockAdapter.insert as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Database error')
      )

      await expect(repository.save(auditLog)).rejects.toThrow('Database error')
    })
  })

  describe('find', () => {
    it('should find audit logs with filters', async () => {
      const mockLogs = [
        {
          id: 'audit-1',
          actor: 'user-123',
          action: 'INSERT',
          entity: 'users',
          conditions: JSON.stringify({ id: '1' }),
          before: null,
          after: JSON.stringify({ id: '1' }),
          success: true,
          timestamp: new Date().toISOString(),
        },
      ]

      ;(mockAdapter.find as ReturnType<typeof vi.fn>).mockResolvedValue(mockLogs)

      const result = await repository.find({
        actor: 'user-123',
        entity: 'users',
        limit: 10,
      })

      expect(result).toHaveLength(1)
      expect(result[0].conditions).toEqual({ id: '1' })
      expect(result[0].after).toEqual({ id: '1' })
      expect(mockAdapter.find).toHaveBeenCalledWith(
        'audit_logs',
        { actor: 'user-123', entity: 'users' },
        expect.objectContaining({
          limit: 10,
          orderBy: { column: 'timestamp', direction: 'desc' },
        })
      )
    })

    it('should parse JSON fields correctly', async () => {
      const mockLogs = [
        {
          id: 'audit-1',
          actor: 'user-123',
          action: 'UPDATE',
          entity: 'users',
          conditions: JSON.stringify({ id: '1' }),
          before: JSON.stringify({ name: 'Old' }),
          after: JSON.stringify({ name: 'New' }),
          success: true,
          timestamp: new Date().toISOString(),
        },
      ]

      ;(mockAdapter.find as ReturnType<typeof vi.fn>).mockResolvedValue(mockLogs)

      const result = await repository.find({})

      expect(result[0].conditions).toEqual({ id: '1' })
      expect(result[0].before).toEqual({ name: 'Old' })
      expect(result[0].after).toEqual({ name: 'New' })
    })
  })

  describe('count', () => {
    it('should count audit logs with filters', async () => {
      ;(mockAdapter.count as ReturnType<typeof vi.fn>).mockResolvedValue(5)

      const result = await repository.count({
        actor: 'user-123',
        success: true,
      })

      expect(result).toBe(5)
      expect(mockAdapter.count).toHaveBeenCalledWith('audit_logs', {
        actor: 'user-123',
        success: true,
      })
    })

    it('should handle errors', async () => {
      ;(mockAdapter.count as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        repository.count({
          actor: 'user-123',
        })
      ).rejects.toThrow('Database error')
    })
  })
})
