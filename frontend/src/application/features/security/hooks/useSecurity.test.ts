/**
 * useSecurity Hook Tests - اختبارات Hook الأمان
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSecurity } from './useSecurity'
import { securityService } from '../services'
import type { SecuritySettings } from '../types'

// Mock dependencies
vi.mock('../services')

describe('useSecurity', () => {
  const mockSecuritySettings: SecuritySettings = {
    twoFactorEnabled: false,
    sessionTimeout: 3600,
    maxConcurrentSessions: 5,
    requireSessionValidation: true,
    sessionRefreshInterval: 15,
    requireEmailVerification: false,
    requirePasswordComplexity: true,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    oauthEnabled: false,
    oauthProviders: [],
    oauthRequireEmailVerification: false,
    ipWhitelistEnabled: false,
    ipWhitelist: [],
    suspiciousActivityDetection: true,
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 60,
    notifyOnFailedLogin: true,
    notifyOnNewDevice: true,
    notifyOnSuspiciousActivity: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(securityService.getSecuritySettings).mockResolvedValue(mockSecuritySettings)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useSecurity())

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('refreshSettings', () => {
    it('should get security settings successfully', async () => {
      const { result } = renderHook(() => useSecurity())

      await result.current.refreshSettings()

      expect(securityService.getSecuritySettings).toHaveBeenCalled()
    })
  })

  describe('updateSettings', () => {
    it('should update security settings successfully', async () => {
      const { result } = renderHook(() => useSecurity())

      await result.current.updateSettings({
        twoFactorEnabled: true,
      })

      expect(securityService.updateSecuritySettings).toHaveBeenCalledWith({
        twoFactorEnabled: true,
      })
    })
  })
})
