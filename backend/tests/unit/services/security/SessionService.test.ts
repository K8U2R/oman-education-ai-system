/**
 * SessionService Tests - اختبارات خدمة الجلسات
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SessionService } from '@/application/services/security/SessionService'
import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'

describe('SessionService', () => {
  let sessionService: SessionService
  let mockDatabaseAdapter: DatabaseCoreAdapter

  beforeEach(() => {
    mockDatabaseAdapter = {
      find: vi.fn(),
      findOne: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as DatabaseCoreAdapter

    sessionService = new SessionService(mockDatabaseAdapter)
  })

  describe('getUserSessions', () => {
    it('should return user sessions', async () => {
      // Arrange
      const mockSessions = [
        {
          id: '1',
          user_id: 'user-1',
          token_hash: 'hash1',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3600000).toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockSessions)

      // Act
      const result = await sessionService.getUserSessions('user-1')

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('userId')
      expect(result[0].userId).toBe('user-1')
    })
  })

  describe('terminateSession', () => {
    it('should terminate a session', async () => {
      // Arrange
      vi.mocked(mockDatabaseAdapter.update).mockResolvedValueOnce(undefined)

      // Act
      await sessionService.terminateSession('session-1')

      // Assert
      expect(mockDatabaseAdapter.update).toHaveBeenCalledWith(
        'security_sessions',
        { id: 'session-1' },
        { is_active: false }
      )
    })
  })

  describe('createSession', () => {
    it('should create a new session', async () => {
      // Arrange
      const mockSession = {
        id: 'session-1',
        user_id: 'user-1',
        token_hash: 'hash1',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 1800000).toISOString(),
      }

      vi.mocked(mockDatabaseAdapter.insert).mockResolvedValueOnce(mockSession)

      // Act
      const result = await sessionService.createSession(
        'user-1',
        'hash1',
        'refresh-hash1',
        { type: 'desktop' },
        '192.168.1.1',
        'Mozilla/5.0',
        { country: 'Oman' },
        new Date(Date.now() + 1800000)
      )

      // Assert
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('userId')
      expect(result.userId).toBe('user-1')
      expect(mockDatabaseAdapter.insert).toHaveBeenCalled()
    })
  })
})

