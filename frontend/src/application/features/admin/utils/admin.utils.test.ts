/**
 * Admin Utils Tests - اختبارات دوال مساعدة الإدارة
 */

import { describe, it, expect } from 'vitest'
import {
  formatSystemHealthStatus,
  getSystemHealthStatusColor,
  formatDatabaseStatus,
  getDatabaseStatusColor,
  formatServerStatus,
  getServerStatusColor,
  formatMemoryUsage,
  formatCPUUsage,
  calculateActiveUsersPercentage,
  calculateVerifiedUsersPercentage,
  formatRequestCount,
  formatLastLogin,
  formatAdminError,
  validateSearchQuery,
} from './admin.utils'
import type { UserStats } from '../types'

describe('admin.utils', () => {
  describe('formatSystemHealthStatus', () => {
    it('should format status correctly', () => {
      expect(formatSystemHealthStatus('healthy')).toBe('صحي')
      expect(formatSystemHealthStatus('warning')).toBe('تحذير')
      expect(formatSystemHealthStatus('error')).toBe('خطأ')
    })
  })

  describe('getSystemHealthStatusColor', () => {
    it('should return color for status', () => {
      expect(getSystemHealthStatusColor('healthy')).toBe('#22c55e')
      expect(getSystemHealthStatusColor('warning')).toBe('#f59e0b')
      expect(getSystemHealthStatusColor('error')).toBe('#ef4444')
    })
  })

  describe('formatDatabaseStatus', () => {
    it('should format status correctly', () => {
      expect(formatDatabaseStatus('connected')).toBe('متصل')
      expect(formatDatabaseStatus('disconnected')).toBe('منقطع')
    })
  })

  describe('getDatabaseStatusColor', () => {
    it('should return color for status', () => {
      expect(getDatabaseStatusColor('connected')).toBe('#22c55e')
      expect(getDatabaseStatusColor('disconnected')).toBe('#ef4444')
    })
  })

  describe('formatServerStatus', () => {
    it('should format status correctly', () => {
      expect(formatServerStatus('active')).toBe('نشط')
      expect(formatServerStatus('inactive')).toBe('غير نشط')
    })
  })

  describe('getServerStatusColor', () => {
    it('should return color for status', () => {
      expect(getServerStatusColor('active')).toBe('#22c55e')
      expect(getServerStatusColor('inactive')).toBe('#ef4444')
    })
  })

  describe('formatMemoryUsage', () => {
    it('should format memory usage correctly', () => {
      expect(formatMemoryUsage(1024)).toBe('1 KB')
      expect(formatMemoryUsage(1024 * 1024)).toBe('1 MB')
      expect(formatMemoryUsage(1024 * 1024 * 1024)).toBe('1 GB')
    })
  })

  describe('formatCPUUsage', () => {
    it('should format CPU usage correctly', () => {
      expect(formatCPUUsage(75.5)).toBe('75.5%')
      expect(formatCPUUsage(100)).toBe('100.0%')
    })
  })

  describe('calculateActiveUsersPercentage', () => {
    it('should calculate percentage correctly', () => {
      const stats: UserStats = {
        total: 100,
        active: 80,
        inactive: 20,
        verified: 90,
        unverified: 10,
        by_role: {},
        recent_registrations: 5,
      }
      expect(calculateActiveUsersPercentage(stats)).toBe(80)
    })

    it('should return 0 for zero total', () => {
      const stats: UserStats = {
        total: 0,
        active: 0,
        inactive: 0,
        verified: 0,
        unverified: 0,
        by_role: {},
        recent_registrations: 0,
      }
      expect(calculateActiveUsersPercentage(stats)).toBe(0)
    })
  })

  describe('calculateVerifiedUsersPercentage', () => {
    it('should calculate percentage correctly', () => {
      const stats: UserStats = {
        total: 100,
        active: 80,
        inactive: 20,
        verified: 90,
        unverified: 10,
        by_role: {},
        recent_registrations: 5,
      }
      expect(calculateVerifiedUsersPercentage(stats)).toBe(90)
    })
  })

  describe('formatRequestCount', () => {
    it('should format request count correctly', () => {
      expect(formatRequestCount(500)).toBe('500')
      expect(formatRequestCount(1500)).toBe('1.5K')
      expect(formatRequestCount(1500000)).toBe('1.5M')
    })
  })

  describe('formatLastLogin', () => {
    it('should format today correctly', () => {
      const today = new Date()
      expect(formatLastLogin(today.toISOString())).toBe('اليوم')
    })

    it('should format yesterday correctly', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(formatLastLogin(yesterday.toISOString())).toBe('أمس')
    })

    it('should return message for no login', () => {
      expect(formatLastLogin(undefined)).toBe('لم يسجل دخول')
    })
  })

  describe('formatAdminError', () => {
    it('should format Error object', () => {
      const error = new Error('Test error')
      expect(formatAdminError(error)).toBe('Test error')
    })

    it('should format string error', () => {
      expect(formatAdminError('String error')).toBe('String error')
    })
  })

  describe('validateSearchQuery', () => {
    it('should validate correct query', () => {
      const result = validateSearchQuery('search query')
      expect(result.valid).toBe(true)
    })

    it('should reject empty query', () => {
      const result = validateSearchQuery('')
      expect(result.valid).toBe(false)
    })

    it('should reject long query', () => {
      const longQuery = 'أ'.repeat(101)
      const result = validateSearchQuery(longQuery)
      expect(result.valid).toBe(false)
    })
  })
})
