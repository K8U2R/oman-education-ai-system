/**
 * SecurityAnalyticsService Tests - اختبارات خدمة تحليلات الأمان
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SecurityAnalyticsService } from '@/application/services/security/SecurityAnalyticsService'
import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'

describe('SecurityAnalyticsService', () => {
  let analyticsService: SecurityAnalyticsService
  let mockDatabaseAdapter: DatabaseCoreAdapter

  beforeEach(() => {
    mockDatabaseAdapter = {
      find: vi.fn(),
      findOne: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as DatabaseCoreAdapter

    analyticsService = new SecurityAnalyticsService(mockDatabaseAdapter)
  })

  describe('getAnalyticsReport', () => {
    it('should return analytics report', async () => {
      // Arrange
      const mockEvents = [
        {
          id: '1',
          event_type: 'login_success',
          created_at: new Date().toISOString(),
          severity: 'info',
        },
        {
          id: '2',
          event_type: 'login_failed',
          created_at: new Date().toISOString(),
          severity: 'error',
        },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValue(mockEvents)

      // Act
      const result = await analyticsService.getAnalyticsReport({
        period: '7d',
      })

      // Assert
      expect(result).toHaveProperty('period')
      expect(result).toHaveProperty('loginAttempts')
      expect(result).toHaveProperty('eventSummary')
      expect(result.period).toBe('7d')
    })
  })

  describe('getLoginAttemptsOverTime', () => {
    it('should return login attempts over time', async () => {
      // Arrange
      const mockEvents = [
        {
          id: '1',
          event_type: 'login_success',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          event_type: 'login_failed',
          created_at: new Date().toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockEvents)

      // Act
      const result = await analyticsService.getLoginAttemptsOverTime({
        period: '7d',
      })

      // Assert
      expect(result).toHaveProperty('dates')
      expect(result).toHaveProperty('successCounts')
      expect(result).toHaveProperty('failedCounts')
      expect(result).toHaveProperty('totalAttempts')
      expect(result).toHaveProperty('successRate')
      expect(Array.isArray(result.dates)).toBe(true)
    })
  })

  describe('getUserActivityTrend', () => {
    it('should return user activity trend', async () => {
      // Arrange
      const mockEvents = [
        {
          id: '1',
          user_id: 'user-1',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user-2',
          created_at: new Date().toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockEvents)

      // Act
      const result = await analyticsService.getUserActivityTrend({
        period: '7d',
      })

      // Assert
      expect(result).toHaveProperty('topUsers')
      expect(result).toHaveProperty('totalUsers')
      expect(result).toHaveProperty('averageActivityPerUser')
      expect(Array.isArray(result.topUsers)).toBe(true)
    })
  })

  describe('getGeographicLoginDistribution', () => {
    it('should return geographic login distribution', async () => {
      // Arrange
      const mockEvents = [
        {
          id: '1',
          event_type: 'login_success',
          location: { country: 'Oman' },
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          event_type: 'login_success',
          location: { country: 'UAE' },
          created_at: new Date().toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockEvents)

      // Act
      const result = await analyticsService.getGeographicLoginDistribution({
        period: '7d',
      })

      // Assert
      expect(result).toHaveProperty('countries')
      expect(result).toHaveProperty('totalLogins')
      expect(Array.isArray(result.countries)).toBe(true)
    })
  })

  describe('getTopFailedLogins', () => {
    it('should return top failed logins', async () => {
      // Arrange
      const mockEvents = [
        {
          id: '1',
          event_type: 'login_failed',
          ip_address: '192.168.1.1',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          event_type: 'login_failed',
          ip_address: '192.168.1.1',
          created_at: new Date().toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockEvents)

      // Act
      const result = await analyticsService.getTopFailedLogins({
        period: '7d',
      })

      // Assert
      expect(result).toHaveProperty('topIPs')
      expect(result).toHaveProperty('totalFailedAttempts')
      expect(Array.isArray(result.topIPs)).toBe(true)
    })
  })

  describe('getSecurityEventSummary', () => {
    it('should return security event summary', async () => {
      // Arrange
      const mockEvents = [
        {
          id: '1',
          event_type: 'login_failed',
          severity: 'error',
          resolved: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          event_type: 'login_success',
          severity: 'info',
          resolved: true,
          created_at: new Date().toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockEvents)

      // Act
      const result = await analyticsService.getSecurityEventSummary({
        period: '7d',
      })

      // Assert
      expect(result).toHaveProperty('totalEvents')
      expect(result).toHaveProperty('byType')
      expect(result).toHaveProperty('bySeverity')
      expect(result).toHaveProperty('criticalEvents')
      expect(result).toHaveProperty('resolvedEvents')
    })
  })

  describe('getSessionDistribution', () => {
    it('should return session distribution', async () => {
      // Arrange
      const mockSessions = [
        {
          id: '1',
          is_active: true,
          device_info: { type: 'desktop' },
          created_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3600000).toISOString(),
        },
        {
          id: '2',
          is_active: false,
          device_info: { type: 'mobile' },
          created_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
          expires_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockSessions)

      // Act
      const result = await analyticsService.getSessionDistribution({
        period: '7d',
      })

      // Assert
      expect(result).toHaveProperty('totalSessions')
      expect(result).toHaveProperty('activeSessions')
      expect(result).toHaveProperty('byDeviceType')
      expect(result).toHaveProperty('averageSessionDuration')
    })
  })

  describe('getUserRiskScores', () => {
    it('should return user risk scores', async () => {
      // Arrange
      const mockEvents = [
        {
          id: '1',
          user_id: 'user-1',
          severity: 'critical',
          event_type: 'login_failed',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user-1',
          severity: 'error',
          event_type: 'login_failed',
          created_at: new Date().toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValueOnce(mockEvents)

      // Act
      const result = await analyticsService.getUserRiskScores({
        period: '7d',
      })

      // Assert
      expect(Array.isArray(result)).toBe(true)
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('userId')
        expect(result[0]).toHaveProperty('riskScore')
        expect(result[0]).toHaveProperty('factors')
      }
    })
  })

  describe('getSecurityMetrics', () => {
    it('should return security metrics', async () => {
      // Arrange
      const mockEvents = [
        {
          id: '1',
          event_type: 'login_success',
          created_at: new Date().toISOString(),
        },
      ]

      const mockSessions = [
        {
          id: '1',
          is_active: true,
          created_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 3600000).toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find)
        .mockResolvedValueOnce(mockEvents) // loginAttempts
        .mockResolvedValueOnce(mockEvents) // eventSummary
        .mockResolvedValueOnce(mockSessions) // sessionDistribution

      // Act
      const result = await analyticsService.getSecurityMetrics({
        period: '7d',
      })

      // Assert
      expect(Array.isArray(result)).toBe(true)
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('name')
        expect(result[0]).toHaveProperty('value')
        expect(result[0]).toHaveProperty('unit')
        expect(result[0]).toHaveProperty('trend')
      }
    })
  })
})

