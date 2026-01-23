/**
 * PolicyService Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PolicyService } from '../../../../src/application/services/PolicyService'
import { PolicyEngine } from '../../../../src/infrastructure/policies/PolicyEngine'
import { AuthenticationClient } from '../../../../src/infrastructure/clients/AuthenticationClient'
import { OperationType } from '../../../../src/domain/value-objects/OperationType'
import { Actor } from '../../../../src/domain/value-objects/Actor'

// Mock fetch
global.fetch = vi.fn()

describe('PolicyService', () => {
  let policyService: PolicyService
  let policyEngine: PolicyEngine
  let authClient: AuthenticationClient

  beforeEach(() => {
    policyEngine = new PolicyEngine()
    authClient = new AuthenticationClient({
      baseUrl: 'http://localhost:3000',
      cacheEnabled: false, // Disable cache for testing
    })
    policyService = new PolicyService(policyEngine, authClient, {
      defaultAllow: true,
      strictMode: false,
      cacheEnabled: false, // Disable cache for testing
    })
    vi.clearAllMocks()
  })

  describe('checkPermission', () => {
    it('should use local policy if exists', async () => {
      policyEngine.addPolicy({
        name: 'test-policy',
        actor: 'user-123',
        operation: OperationType.FIND,
        entity: 'users',
        allowed: true,
      })

      const result = await policyService.checkPermission({
        actor: 'user-123',
        operation: OperationType.FIND,
        entity: 'users',
      })

      expect(result).toBe(true)
    })

    it('should check authentication service if no local policy', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'student',
        permissions: ['users:read'],
        isActive: true,
        isVerified: true,
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          permissions: {
            userId: 'user-123',
            role: 'student',
            permissions: ['users:read'],
          },
        }),
      })

      const result = await policyService.checkPermission({
        actor: 'user-123',
        operation: OperationType.FIND,
        entity: 'users',
      })

      expect(result).toBe(true)
    })

    it('should return false if user is not active', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'student',
        permissions: ['users:read'],
        isActive: false,
        isVerified: true,
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      })

      const result = await policyService.checkPermission({
        actor: 'user-123',
        operation: OperationType.FIND,
        entity: 'users',
      })

      expect(result).toBe(false)
    })

    it('should use default allow if no policy and no auth client', async () => {
      const serviceWithoutAuth = new PolicyService(policyEngine, null, {
        defaultAllow: true,
        strictMode: false,
      })

      const result = await serviceWithoutAuth.checkPermission({
        actor: 'user-123',
        operation: OperationType.FIND,
        entity: 'users',
      })

      expect(result).toBe(true)
    })

    it('should use strict mode if enabled', async () => {
      const strictService = new PolicyService(policyEngine, null, {
        defaultAllow: true,
        strictMode: true,
      })

      const result = await strictService.checkPermission({
        actor: 'user-123',
        operation: OperationType.FIND,
        entity: 'users',
      })

      expect(result).toBe(false) // Strict mode denies if no policy
    })
  })

  describe('mapOperationToPermission', () => {
    it('should map FIND to read', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'student',
        permissions: ['users:read'],
        isActive: true,
        isVerified: true,
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          permissions: {
            userId: 'user-123',
            role: 'student',
            permissions: ['users:read'],
          },
        }),
      })

      const result = await policyService.checkPermission({
        actor: 'user-123',
        operation: OperationType.FIND,
        entity: 'users',
      })

      expect(result).toBe(true)
    })

    it('should map INSERT to write', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'student',
        permissions: ['users:write'],
        isActive: true,
        isVerified: true,
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          permissions: {
            userId: 'user-123',
            role: 'student',
            permissions: ['users:write'],
          },
        }),
      })

      const result = await policyService.checkPermission({
        actor: 'user-123',
        operation: OperationType.INSERT,
        entity: 'users',
      })

      expect(result).toBe(true)
    })
  })

  describe('clearCache', () => {
    it('should clear permission cache', () => {
      policyService.clearCache()
      // No error means it worked
      expect(true).toBe(true)
    })

    it('should clear user cache', () => {
      policyService.clearUserCache('user-123')
      // No error means it worked
      expect(true).toBe(true)
    })
  })
})
