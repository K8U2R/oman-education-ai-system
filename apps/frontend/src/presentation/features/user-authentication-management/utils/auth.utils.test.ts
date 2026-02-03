/**
 * Auth Utils Tests - اختبارات دوال مساعدة المصادقة
 */

import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  isTokenExpired,
  formatAuthError,
  hasPermission,
  hasRole,
  canAccessRoute,
} from './auth.utils'

describe('auth.utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('StrongPass123!')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject weak password', () => {
      const result = validatePassword('weak')
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should check minimum length', () => {
      const result = validatePassword('Short1!')
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('8'))).toBe(true)
    })
  })

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      const expiredDate = new Date()
      expiredDate.setHours(expiredDate.getHours() - 1)
      expect(isTokenExpired(String(expiredDate.getTime()))).toBe(true)
    })

    it('should return false for valid token', () => {
      const futureDate = new Date()
      futureDate.setHours(futureDate.getHours() + 1)
      expect(isTokenExpired(String(futureDate.getTime()))).toBe(false)
    })
  })

  describe('formatAuthError', () => {
    it('should format Error object', () => {
      const error = new Error('Test error')
      expect(formatAuthError(error)).toBe('Test error')
    })

    it('should format string error', () => {
      expect(formatAuthError('String error')).toBe('String error')
    })

    it('should format API error with message', () => {
      const error = {
        response: {
          data: {
            message: 'API error message',
          },
        },
      }
      expect(formatAuthError(error)).toBe('API error message')
    })
  })

  describe('hasPermission', () => {
    it('should return true when user has permission', () => {
      const user = {
        permissions: ['lessons.view', 'lessons.create'],
      }
      expect(hasPermission(user, 'lessons.view')).toBe(true)
    })

    it('should return false when user does not have permission', () => {
      const user = {
        permissions: ['lessons.view'],
      }
      expect(hasPermission(user, 'lessons.delete')).toBe(false)
    })
  })

  describe('hasRole', () => {
    it('should return true when user has role', () => {
      const user = {
        role: 'admin',
      }
      expect(hasRole(user, 'admin')).toBe(true)
    })

    it('should return false when user does not have role', () => {
      const user = {
        role: 'student',
      }
      expect(hasRole(user, 'admin')).toBe(false)
    })
  })

  describe('canAccessRoute', () => {
    it('should allow access when no requirements', () => {
      const user = {
        role: 'student',
        permissions: [],
      }
      expect(canAccessRoute(user, {})).toBe(true)
    })

    it('should allow access when user has required role', () => {
      const user = {
        role: 'admin',
        permissions: [],
      }
      expect(canAccessRoute(user, { requiredRole: 'admin' })).toBe(true)
    })

    it('should deny access when user does not have required role', () => {
      const user = {
        role: 'student',
        permissions: [],
      }
      expect(canAccessRoute(user, { requiredRole: 'admin' })).toBe(false)
    })

    it('should allow access when user has required permission', () => {
      const user = {
        role: 'teacher',
        permissions: ['lessons.create'],
      }
      expect(canAccessRoute(user, { requiredPermission: 'lessons.create' })).toBe(true)
    })

    it('should deny access when user does not have required permission', () => {
      const user = {
        role: 'student',
        permissions: ['lessons.view'],
      }
      expect(canAccessRoute(user, { requiredPermission: 'lessons.create' })).toBe(false)
    })
  })
})
