/**
 * Developer Utils Tests - اختبارات دوال مساعدة المطور
 */

import { describe, it, expect } from 'vitest'
import {
  formatBuildStatus,
  getBuildStatusColor,
  formatServiceStatus,
  getServiceStatusColor,
  formatLogLevel,
  getLogLevelColor,
  formatResponseTime,
  formatUptime,
  formatMemoryUsage,
  formatCPUUsage,
  formatErrorRate,
  formatTestCoverage,
  formatRequestCount,
  formatLastBuildTime,
  formatLastCalled,
  sortEndpointsByRequestCount,
  sortEndpointsByResponseTime,
  sortServicesByStatus,
  filterServicesByStatus,
  formatDeveloperError,
} from './developer.utils'
import type { APIEndpointInfo, ServiceInfo } from '../types'

describe('developer.utils', () => {
  describe('formatBuildStatus', () => {
    it('should format status correctly', () => {
      expect(formatBuildStatus('success')).toBe('نجح')
      expect(formatBuildStatus('failed')).toBe('فشل')
      expect(formatBuildStatus('pending')).toBe('قيد الانتظار')
    })
  })

  describe('getBuildStatusColor', () => {
    it('should return color for status', () => {
      expect(getBuildStatusColor('success')).toBe('#22c55e')
      expect(getBuildStatusColor('failed')).toBe('#ef4444')
      expect(getBuildStatusColor('pending')).toBe('#f59e0b')
    })
  })

  describe('formatServiceStatus', () => {
    it('should format status correctly', () => {
      expect(formatServiceStatus('healthy')).toBe('صحي')
      expect(formatServiceStatus('unhealthy')).toBe('غير صحي')
      expect(formatServiceStatus('unknown')).toBe('غير معروف')
    })
  })

  describe('getServiceStatusColor', () => {
    it('should return color for status', () => {
      expect(getServiceStatusColor('healthy')).toBe('#22c55e')
      expect(getServiceStatusColor('unhealthy')).toBe('#ef4444')
      expect(getServiceStatusColor('unknown')).toBe('#6b7280')
    })
  })

  describe('formatLogLevel', () => {
    it('should format level correctly', () => {
      expect(formatLogLevel('info')).toBe('معلومات')
      expect(formatLogLevel('warn')).toBe('تحذير')
      expect(formatLogLevel('error')).toBe('خطأ')
      expect(formatLogLevel('debug')).toBe('تصحيح')
    })
  })

  describe('getLogLevelColor', () => {
    it('should return color for level', () => {
      expect(getLogLevelColor('info')).toBe('#3b82f6')
      expect(getLogLevelColor('warn')).toBe('#f59e0b')
      expect(getLogLevelColor('error')).toBe('#ef4444')
      expect(getLogLevelColor('debug')).toBe('#6b7280')
    })
  })

  describe('formatResponseTime', () => {
    it('should format response time correctly', () => {
      expect(formatResponseTime(150)).toBe('150ms')
      expect(formatResponseTime(1500)).toBe('1.50s')
    })
  })

  describe('formatUptime', () => {
    it('should format uptime correctly', () => {
      expect(formatUptime(3600)).toContain('ساعة')
      expect(formatUptime(86400)).toContain('يوم')
      expect(formatUptime(60)).toContain('دقيقة')
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

  describe('formatErrorRate', () => {
    it('should format error rate correctly', () => {
      expect(formatErrorRate(0.05)).toBe('5.00%')
      expect(formatErrorRate(0.1)).toBe('10.00%')
    })
  })

  describe('formatTestCoverage', () => {
    it('should format test coverage correctly', () => {
      expect(formatTestCoverage(85.5)).toBe('85.5%')
      expect(formatTestCoverage(100)).toBe('100.0%')
    })
  })

  describe('formatRequestCount', () => {
    it('should format request count correctly', () => {
      expect(formatRequestCount(500)).toBe('500')
      expect(formatRequestCount(1500)).toBe('1.5K')
      expect(formatRequestCount(1500000)).toBe('1.5M')
    })
  })

  describe('formatLastBuildTime', () => {
    it('should format recent build time', () => {
      const recent = new Date()
      recent.setMinutes(recent.getMinutes() - 5)
      const result = formatLastBuildTime(recent.toISOString())
      expect(result).toContain('دقائق')
    })

    it('should return message for no build time', () => {
      expect(formatLastBuildTime(undefined)).toBe('غير متوفر')
    })
  })

  describe('formatLastCalled', () => {
    it('should format last called time', () => {
      const recent = new Date()
      recent.setMinutes(recent.getMinutes() - 5)
      const result = formatLastCalled(recent.toISOString())
      expect(result).toContain('دقائق')
    })

    it('should return message for no call', () => {
      expect(formatLastCalled(undefined)).toBe('لم يتم الاستدعاء')
    })
  })

  describe('sortEndpointsByRequestCount', () => {
    it('should sort endpoints by request count', () => {
      const endpoints: APIEndpointInfo[] = [
        {
          method: 'GET',
          path: '/api/v1/users',
          request_count: 100,
          average_response_time: 150,
          error_count: 5,
        },
        {
          method: 'POST',
          path: '/api/v1/users',
          request_count: 200,
          average_response_time: 200,
          error_count: 10,
        },
      ]

      const sorted = sortEndpointsByRequestCount(endpoints)
      expect(sorted[0]!.request_count).toBe(200)
      expect(sorted[1]!.request_count).toBe(100)
    })
  })

  describe('sortEndpointsByResponseTime', () => {
    it('should sort endpoints by response time', () => {
      const endpoints: APIEndpointInfo[] = [
        {
          method: 'GET',
          path: '/api/v1/users',
          request_count: 100,
          average_response_time: 150,
          error_count: 5,
        },
        {
          method: 'POST',
          path: '/api/v1/users',
          request_count: 200,
          average_response_time: 200,
          error_count: 10,
        },
      ]

      const sorted = sortEndpointsByResponseTime(endpoints)
      expect(sorted[0]!.average_response_time).toBe(200)
      expect(sorted[1]!.average_response_time).toBe(150)
    })
  })

  describe('sortServicesByStatus', () => {
    it('should sort services by status', () => {
      const services: ServiceInfo[] = [
        {
          name: 'unhealthy-service',
          status: 'unhealthy',
          uptime: 1000,
          memory_usage: 1024,
          last_check: new Date().toISOString(),
        },
        {
          name: 'healthy-service',
          status: 'healthy',
          uptime: 2000,
          memory_usage: 2048,
          last_check: new Date().toISOString(),
        },
      ]

      const sorted = sortServicesByStatus(services)
      expect(sorted[0]!.status).toBe('healthy')
      expect(sorted[1]!.status).toBe('unhealthy')
    })
  })

  describe('filterServicesByStatus', () => {
    it('should filter services by status', () => {
      const services: ServiceInfo[] = [
        {
          name: 'healthy-service',
          status: 'healthy',
          uptime: 2000,
          memory_usage: 2048,
          last_check: new Date().toISOString(),
        },
        {
          name: 'unhealthy-service',
          status: 'unhealthy',
          uptime: 1000,
          memory_usage: 1024,
          last_check: new Date().toISOString(),
        },
      ]

      const filtered = filterServicesByStatus(services, 'healthy')
      expect(filtered.length).toBe(1)
      expect(filtered[0]?.status).toBe('healthy')
    })
  })

  describe('formatDeveloperError', () => {
    it('should format Error object', () => {
      const error = new Error('Test error')
      expect(formatDeveloperError(error)).toBe('Test error')
    })

    it('should format string error', () => {
      expect(formatDeveloperError('String error')).toBe('String error')
    })
  })
})
