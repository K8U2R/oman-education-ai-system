/**
 * SecurityService Tests - اختبارات خدمة الأمان
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SecurityService } from '@/application/services/security/SecurityService'
import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'

describe('SecurityService', () => {
  let securityService: SecurityService
  let mockDatabaseAdapter: DatabaseCoreAdapter

  beforeEach(() => {
    vi.clearAllMocks()
    mockDatabaseAdapter = {
      find: vi.fn(),
      findOne: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      execute: vi.fn(),
      count: vi.fn(),
    } as unknown as DatabaseCoreAdapter

    securityService = new SecurityService(mockDatabaseAdapter)

    // Bypass EnhancedBaseService logic to prevent cache warming calls consuming mocks
    vi.spyOn(securityService as any, 'executeWithEnhancements').mockImplementation(async (fn: any) => fn())

    // Setup default mock returns
    vi.mocked(mockDatabaseAdapter.find).mockResolvedValue([])
    vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(null)
    vi.mocked(mockDatabaseAdapter.count).mockResolvedValue(0)
  })

  describe('getSecurityStats', () => {
    it('should return security stats', async () => {
      // Arrange
      const mockSessions = [
        { id: '1', is_active: true, expires_at: new Date(Date.now() + 3600000).toISOString() },
        { id: '2', is_active: false, expires_at: new Date(Date.now() - 3600000).toISOString() },
      ]
      const mockEvents = [
        { id: '1', severity: 'critical', event_type: 'login_failed' },
        { id: '2', severity: 'info', event_type: 'login_success' },
      ]
      const mockAlerts = [
        { id: '1', is_read: false },
        { id: '2', is_read: true },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockSessions)
      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockEvents)
      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockAlerts)
      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockEvents)

      // Act
      const result = await securityService.getSecurityStats()

      // Assert
      expect(result).toHaveProperty('totalSessions')
      expect(result).toHaveProperty('activeSessions')
      expect(result).toHaveProperty('totalEvents')
      expect(result).toHaveProperty('criticalEvents')
      expect(result).toHaveProperty('totalAlerts')
      expect(result).toHaveProperty('unreadAlerts')
      expect(result.totalSessions).toBe(2)
      expect(result.activeSessions).toBe(1)
      expect(result.totalEvents).toBe(2)
      expect(result.criticalEvents).toBe(1)
    })
  })

  describe('getSecurityLogs', () => {
    it('should return security logs with filter', async () => {
      // Arrange
      const mockEvents = [
        {
          id: '1',
          user_id: 'user-1',
          event_type: 'login_failed',
          severity: 'error',
          title: 'Failed login',
          created_at: new Date().toISOString(),
          resolved: false,
        },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockEvents)

      // Act
      const result = await securityService.getSecurityLogs({
        userId: 'user-1',
        eventType: 'login_failed',
        severity: 'error',
      })

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('eventType')
      expect(result[0].eventType).toBe('login_failed')
    })
  })

  describe('getSecuritySettings', () => {
    it('should return security settings', async () => {
      // Arrange
      const mockSettings = [
        { setting_key: 'max_login_attempts', setting_value: { value: 5 } },
        { setting_key: 'session_timeout', setting_value: { value: 30 } },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockSettings)

      // Act
      const result = await securityService.getSecuritySettings()

      // Assert
      expect(result).toHaveProperty('maxLoginAttempts')
      expect(result).toHaveProperty('sessionTimeout')
      expect(result.maxLoginAttempts).toBe(5)
      expect(result.sessionTimeout).toBe(30)
    })
  })

  describe('updateSecuritySettings', () => {
    it('should update security settings', async () => {
      // Arrange
      const mockSettings = [
        { setting_key: 'max_login_attempts', setting_value: { value: 5 } },
      ]

      vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValueOnce(mockSettings[0])
      vi.mocked(mockDatabaseAdapter.update).mockResolvedValueOnce(undefined)
      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockSettings)

      // Act
      const result = await securityService.updateSecuritySettings({
        maxLoginAttempts: 10,
      })

      // Assert
      expect(result).toHaveProperty('maxLoginAttempts')
      expect(mockDatabaseAdapter.update).toHaveBeenCalled()
    })
  })
})

