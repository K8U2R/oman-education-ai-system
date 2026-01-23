/**
 * AuthenticationClient Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'
import { AuthenticationClient } from '../../../../src/infrastructure/clients/AuthenticationClient'
import type { UserInfo, PermissionInfo } from '../../../../src/domain/interfaces/IAuthenticationClient'

// Mock fetch
global.fetch = vi.fn()

describe('AuthenticationClient', () => {
  let client: AuthenticationClient

  beforeEach(() => {
    client = new AuthenticationClient({
      baseUrl: 'http://localhost:3000',
      apiKey: 'test-api-key',
      cacheEnabled: true,
      cacheTTL: 1000, // 1 second for testing
    })
    vi.clearAllMocks()
  })

  describe('getUserInfo', () => {
    it('should fetch user info from API', async () => {
      const mockUser: UserInfo = {
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
      })

      const result = await client.getUserInfo('user-123')

      expect(result).toEqual(mockUser)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users/user-123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
          }),
        })
      )
    })

    it('should return null if user not found', async () => {
      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
      })

      const result = await client.getUserInfo('user-123')

      expect(result).toBeNull()
    })

    it('should use cache on second call', async () => {
      const mockUser: UserInfo = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'student',
        permissions: [],
        isActive: true,
        isVerified: true,
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      })

      // First call
      await client.getUserInfo('user-123')
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Second call (should use cache)
      const result = await client.getUserInfo('user-123')
      expect(result).toEqual(mockUser)
      expect(global.fetch).toHaveBeenCalledTimes(1) // Still 1, used cache
    })
  })

  describe('getUserPermissions', () => {
    it('should fetch user permissions from API', async () => {
      const mockPermissions: PermissionInfo = {
        userId: 'user-123',
        role: 'student',
        permissions: ['users:read', 'lessons:read'],
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ permissions: mockPermissions }),
      })

      const result = await client.getUserPermissions('user-123')

      expect(result).toEqual(mockPermissions)
    })
  })

  describe('hasPermission', () => {
    it('should return true if user has permission', async () => {
      const mockPermissions: PermissionInfo = {
        userId: 'user-123',
        role: 'student',
        permissions: ['users:read'],
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ permissions: mockPermissions }),
      })

      const result = await client.hasPermission('user-123', 'users:read')

      expect(result).toBe(true)
    })

    it('should return true if user has wildcard permission', async () => {
      const mockPermissions: PermissionInfo = {
        userId: 'user-123',
        role: 'admin',
        permissions: ['*'],
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ permissions: mockPermissions }),
      })

      const result = await client.hasPermission('user-123', 'users:read')

      expect(result).toBe(true)
    })

    it('should return false if user does not have permission', async () => {
      const mockPermissions: PermissionInfo = {
        userId: 'user-123',
        role: 'student',
        permissions: ['users:read'],
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ permissions: mockPermissions }),
      })

      const result = await client.hasPermission('user-123', 'users:write')

      expect(result).toBe(false)
    })
  })

  describe('hasRole', () => {
    it('should return true if user has role', async () => {
      const mockUser: UserInfo = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'admin',
        permissions: [],
        isActive: true,
        isVerified: true,
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      })

      const result = await client.hasRole('user-123', 'admin')

      expect(result).toBe(true)
    })

    it('should return true if user is admin or super_admin', async () => {
      const mockUser: UserInfo = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'admin',
        permissions: [],
        isActive: true,
        isVerified: true,
      }

      ;(global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      })

      const result = await client.hasRole('user-123', 'student')

      expect(result).toBe(true) // admin has all roles
    })
  })

  describe('clearCache', () => {
    it('should clear all cache', async () => {
      const mockUser: UserInfo = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'student',
        permissions: [],
        isActive: true,
        isVerified: true,
      }

      ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ user: mockUser }),
      })

      // First call
      await client.getUserInfo('user-123')
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Clear cache
      client.clearCache()

      // Second call (should fetch again)
      await client.getUserInfo('user-123')
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })
})
