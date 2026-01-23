/**
 * Admin Service Integration Tests - اختبارات التكامل لخدمة الإدارة
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { vi } from 'vitest'

// Mock DatabaseCoreAdapter before importing it
const mockDatabaseAdapter = {
  find: vi.fn(),
  findOne: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  execute: vi.fn(),
  count: vi.fn(),
}

vi.mock('@/infrastructure/adapters/db/DatabaseCoreAdapter', () => {
  return {
    DatabaseCoreAdapter: vi.fn().mockImplementation(() => mockDatabaseAdapter)
  }
})

import { AdminService } from '@/application/services/admin/AdminService'
import { DatabaseCoreAdapter } from '@/infrastructure/adapters/db/DatabaseCoreAdapter'

describe('AdminService Integration', () => {
  let adminService: AdminService
  let databaseAdapter: DatabaseCoreAdapter

  beforeAll(async () => {
    // Initialize Database Adapter
    databaseAdapter = new DatabaseCoreAdapter()
    adminService = new AdminService(databaseAdapter)

    // Setup default mock returns
    vi.mocked(databaseAdapter.find).mockResolvedValue([])
    vi.mocked(databaseAdapter.findOne).mockResolvedValue(null)
    vi.mocked((databaseAdapter as any).execute).mockResolvedValue({ total_users: 100, active_users: 50, total_lessons: 200 } as any)
    vi.mocked(databaseAdapter.count).mockResolvedValue(0)
  })

  afterAll(async () => {
    // Cleanup if needed
  })

  describe('getSystemStats', () => {
    it('should return system statistics', async () => {
      // Act
      const stats = await adminService.getSystemStats()

      // Assert
      expect(stats).toHaveProperty('total_users')
      expect(stats).toHaveProperty('active_users')
      expect(stats).toHaveProperty('total_lessons')
      expect(stats).toHaveProperty('system_health')
      expect(stats).toHaveProperty('database_status')
      expect(stats).toHaveProperty('server_status')
    })
  })

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      // Act
      const stats = await adminService.getUserStats()

      // Assert
      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('active')
      expect(stats).toHaveProperty('verified')
      expect(stats).toHaveProperty('by_role')
    })
  })

  describe('getContentStats', () => {
    it('should return content statistics', async () => {
      // Act
      const stats = await adminService.getContentStats()

      // Assert
      expect(stats).toHaveProperty('total_lessons')
      expect(stats).toHaveProperty('published_lessons')
      expect(stats).toHaveProperty('total_learning_paths')
      expect(stats).toHaveProperty('published_paths')
    })
  })

  describe('getUsageStats', () => {
    it('should return usage statistics', async () => {
      // Act
      const stats = await adminService.getUsageStats()

      // Assert
      expect(stats).toHaveProperty('total_sessions')
      expect(stats).toHaveProperty('active_sessions')
      expect(stats).toHaveProperty('total_requests')
    })
  })

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      // Act
      const result = await adminService.searchUsers({
        page: 1,
        per_page: 20,
      })

      // Assert
      expect(result).toHaveProperty('users')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('per_page')
      expect(Array.isArray(result.users)).toBe(true)
    })
  })
})
