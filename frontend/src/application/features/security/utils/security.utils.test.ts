/**
 * Security Utils Tests - اختبارات دوال مساعدة الأمان
 */

import { describe, it, expect } from 'vitest'
import {
  isValidIPAddress,
  isValidSessionId,
  isSessionExpired,
  formatSecurityError,
  calculateSystemHealthScore,
} from './security.utils'

describe('security.utils', () => {
  describe('isValidIPAddress', () => {
    it('should validate correct IP address', () => {
      expect(isValidIPAddress('192.168.1.1')).toBe(true)
      expect(isValidIPAddress('10.0.0.1')).toBe(true)
      expect(isValidIPAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true)
    })

    it('should reject invalid IP address', () => {
      expect(isValidIPAddress('invalid-ip')).toBe(false)
      expect(isValidIPAddress('999.999.999.999')).toBe(false)
    })
  })

  describe('isValidSessionId', () => {
    it('should validate correct session ID', () => {
      expect(isValidSessionId('session-123-abc')).toBe(true)
    })

    it('should reject empty session ID', () => {
      expect(isValidSessionId('')).toBe(false)
    })
  })

  describe('isSessionExpired', () => {
    it('should return true for expired session', () => {
      const expiredDate = new Date()
      expiredDate.setHours(expiredDate.getHours() - 1)
      const session = {
        id: '1',
        userId: 'user-1',
        deviceInfo: { type: 'desktop' as const, os: 'Windows', browser: 'Chrome' },
        isActive: true,
        isCurrent: false,
        status: 'expired' as const,
        riskLevel: 'low' as const,
        loginMethod: 'password' as const,
        loginAt: expiredDate.toISOString(),
        createdAt: expiredDate.toISOString(),
        lastActivityAt: expiredDate.toISOString(),
        expiresAt: expiredDate.toISOString(),
      }
      expect(isSessionExpired(session)).toBe(true)
    })

    it('should return false for valid session', () => {
      const futureDate = new Date()
      futureDate.setHours(futureDate.getHours() + 1)
      const session = {
        id: '1',
        userId: 'user-1',
        deviceInfo: { type: 'desktop' as const, os: 'Windows', browser: 'Chrome' },
        isActive: true,
        isCurrent: false,
        status: 'active' as const,
        riskLevel: 'low' as const,
        loginMethod: 'password' as const,
        loginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        expiresAt: futureDate.toISOString(),
      }
      expect(isSessionExpired(session)).toBe(false)
    })
  })

  describe('formatSecurityError', () => {
    it('should format error correctly', () => {
      const error = new Error('Test error')
      expect(formatSecurityError(error)).toBe('Test error')
    })
  })

  describe('calculateSystemHealthScore', () => {
    it('should calculate system health score correctly', () => {
      const stats = {
        failedLoginAttempts24h: 5,
        securityAlerts: 10,
        criticalAlerts: 2,
        blockedIPs: 1,
      }
      const health = calculateSystemHealthScore(stats)
      expect(health).toBeGreaterThanOrEqual(0)
      expect(health).toBeLessThanOrEqual(100)
    })
  })
})
