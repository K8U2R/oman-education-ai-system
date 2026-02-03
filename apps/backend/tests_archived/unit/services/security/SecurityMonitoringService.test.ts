/**
 * SecurityMonitoringService Tests - اختبارات خدمة مراقبة الأمان
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SecurityMonitoringService } from '@/application/services/security/SecurityMonitoringService'
import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'

describe('SecurityMonitoringService', () => {
  let monitoringService: SecurityMonitoringService
  let mockDatabaseAdapter: DatabaseCoreAdapter

  beforeEach(() => {
    mockDatabaseAdapter = {
      find: vi.fn(),
      findOne: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as DatabaseCoreAdapter

    monitoringService = new SecurityMonitoringService(mockDatabaseAdapter)
  })

  describe('getSystemHealthStatus', () => {
    it('should return system health status', async () => {
      // Arrange
      const mockEvents = [
        {
          id: '1',
          event_type: 'login_attempt',
          created_at: new Date().toISOString(),
        },
      ]

      const mockSessions = [
        {
          id: '1',
          is_active: true,
          expires_at: new Date(Date.now() + 3600000).toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find)
        .mockResolvedValueOnce(mockEvents) // auth health
        .mockResolvedValueOnce(mockSessions) // sessions health
        .mockResolvedValueOnce([]) // database health check

      vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValueOnce({})

      // Act
      const result = await monitoringService.getSystemHealthStatus()

      // Assert
      expect(result).toHaveProperty('overall')
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('components')
      expect(result).toHaveProperty('lastChecked')
      expect(['healthy', 'warning', 'error', 'critical']).toContain(result.overall)
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
      expect(result.components).toHaveProperty('authentication')
      expect(result.components).toHaveProperty('sessions')
      expect(result.components).toHaveProperty('database')
      expect(result.components).toHaveProperty('cache')
      expect(result.components).toHaveProperty('api')
      expect(result.components).toHaveProperty('websocket')
    })
  })

  describe('getRealtimeMetrics', () => {
    it('should return realtime metrics', async () => {
      // Arrange
      const mockSessions = [
        {
          id: '1',
          is_active: true,
          expires_at: new Date(Date.now() + 3600000).toISOString(),
        },
      ]

      const mockEvents = [
        {
          id: '1',
          event_type: 'login_success',
          severity: 'info',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          event_type: 'login_failed',
          severity: 'error',
          created_at: new Date().toISOString(),
        },
      ]

      vi.mocked(mockDatabaseAdapter.find)
        .mockResolvedValueOnce(mockSessions) // active sessions
        .mockResolvedValueOnce(mockEvents) // recent events

      // Act
      const result = await monitoringService.getRealtimeMetrics()

      // Assert
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('activeSessions')
      expect(result).toHaveProperty('activeSessionsChange')
      expect(result).toHaveProperty('loginsLastMinute')
      expect(result).toHaveProperty('failedLoginsLastMinute')
      expect(result).toHaveProperty('loginSuccessRate')
      expect(result).toHaveProperty('eventsLastMinute')
      expect(result).toHaveProperty('criticalEventsLastMinute')
      expect(result).toHaveProperty('rateLimitHitsLastMinute')
      expect(result).toHaveProperty('rateLimitBlocksLastMinute')
      expect(result).toHaveProperty('requestsLastMinute')
      expect(result).toHaveProperty('averageResponseTime')
      expect(result).toHaveProperty('errorRate')
      expect(result.activeSessions).toBeGreaterThanOrEqual(0)
      expect(result.loginSuccessRate).toBeGreaterThanOrEqual(0)
      expect(result.loginSuccessRate).toBeLessThanOrEqual(100)
    })
  })

  describe('getAlertThresholds', () => {
    it('should return alert thresholds', async () => {
      // Act
      const result = await monitoringService.getAlertThresholds()

      // Assert
      expect(Array.isArray(result)).toBe(true)
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id')
        expect(result[0]).toHaveProperty('name')
        expect(result[0]).toHaveProperty('metric')
        expect(result[0]).toHaveProperty('operator')
        expect(result[0]).toHaveProperty('value')
        expect(result[0]).toHaveProperty('severity')
        expect(result[0]).toHaveProperty('enabled')
        expect(result[0]).toHaveProperty('notifyChannels')
      }
    })
  })

  describe('updateMonitoringConfig', () => {
    it('should update monitoring config', async () => {
      // Arrange
      const config = {
        refreshInterval: 60,
        autoRefresh: false,
      }

      // Act
      const result = await monitoringService.updateMonitoringConfig(config)

      // Assert
      expect(result).toHaveProperty('refreshInterval')
      expect(result).toHaveProperty('metricsToShow')
      expect(result).toHaveProperty('chartsToShow')
      expect(result).toHaveProperty('alertsToShow')
      expect(result).toHaveProperty('autoRefresh')
      expect(result).toHaveProperty('darkMode')
      expect(result.refreshInterval).toBe(60)
      expect(result.autoRefresh).toBe(false)
    })
  })
})

