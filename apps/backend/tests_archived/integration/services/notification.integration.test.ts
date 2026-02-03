/**
 * Notification Service Integration Tests - اختبارات التكامل لخدمة الإشعارات
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { NotificationService } from '@/application/services/notification/NotificationService'
import { INotificationRepository } from '@/domain/interfaces/repositories/INotificationRepository'
import { CacheManager } from '@/infrastructure/cache/CacheManager'
import { Notification } from '@/domain/entities/Notification'

describe('NotificationService Integration', () => {
  let notificationService: NotificationService
  let notificationRepository: INotificationRepository
  let cacheManager: CacheManager
  let createdNotifications: Notification[] = []

  beforeAll(async () => {
    // Initialize Cache Manager
    cacheManager = new CacheManager({
      maxSize: 1000,
    } as any)

    // Initialize Notification Repository (mock for integration tests)
    const notifications: Map<string, Notification> = new Map()

    notificationRepository = {
      create: async (request: any) => {
        const notification = new Notification(
          `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          request.user_id,
          request.type,
          request.title,
          request.message,
          'unread',
          request.action_url,
          request.action_label,
          request.metadata,
          new Date(),
          undefined,
          undefined,
          new Date()
        )
        notifications.set(notification.id, notification)
        return notification
      },
      findById: async (id: string) => {
        return notifications.get(id) || null
      },
      findByUserId: async (userId: string, options?: { page?: number; per_page?: number; status?: string }) => {
        const userNotifications = Array.from(notifications.values())
          .filter(n => n.userId === userId)
          .filter(n => !options?.status || n.status === options.status)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        const page = options?.page || 1
        const perPage = options?.per_page || 20
        const start = (page - 1) * perPage
        const end = start + perPage

        return {
          data: userNotifications.slice(start, end),
          total: userNotifications.length,
          page,
          per_page: perPage,
        }
      },
      update: async (id: string, data: Partial<Notification>) => {
        const notification = notifications.get(id)
        if (!notification) {
          throw new Error('Notification not found')
        }
        const updated = new Notification(
          notification.id,
          notification.userId,
          notification.type,
          data.title || notification.title,
          data.message || notification.message,
          data.status || notification.status,
          data.actionUrl || notification.actionUrl,
          data.actionLabel || notification.actionLabel,
          data.metadata || notification.metadata,
          notification.createdAt,
          notification.readAt,
          notification.archivedAt,
          new Date()
        )
        notifications.set(id, updated)
        return updated
      },
      delete: async (id: string) => {
        notifications.delete(id)
      },
      markAllAsRead: async (userId: string) => {
        Array.from(notifications.values())
          .filter(n => n.userId === userId && n.status === 'unread')
          .forEach(n => {
            const updated = new Notification(
              n.id,
              n.userId,
              n.type,
              n.title,
              n.message,
              'read',
              n.actionUrl,
              n.actionLabel,
              n.metadata,
              new Date(n.createdAt),
              new Date(),
              n.archivedAt,
              new Date()
            )
            notifications.set(n.id, updated)
          })
      },
      getStats: async (userId: string) => {
        const userNotifications = Array.from(notifications.values())
          .filter(n => n.userId === userId)
        return {
          total: userNotifications.length,
          unread: userNotifications.filter(n => n.status === 'unread').length,
          read: userNotifications.filter(n => n.status === 'read').length,
          archived: userNotifications.filter(n => n.status === 'archived').length,
        }
      },
      belongsToUser: async (id: string, userId: string) => {
        const notification = notifications.get(id)
        return notification?.userId === userId
      },
    } as unknown as INotificationRepository

    notificationService = new NotificationService(notificationRepository, cacheManager)
  })

  beforeEach(() => {
    // Clear created notifications before each test
    createdNotifications = []
  })

  afterAll(async () => {
    // Cleanup if needed
  })

  describe('createNotification', () => {
    it('should create notification successfully', async () => {
      // Arrange
      const request = {
        user_id: 'user-123',
        type: 'info' as const,
        title: 'Test Notification',
        message: 'This is a test notification',
      }

      // Act
      const notification = await notificationService.createNotification(request)
      createdNotifications.push(notification)

      // Assert
      expect(notification).toHaveProperty('id')
      expect(notification.title).toBe('Test Notification')
      expect(notification.message).toBe('This is a test notification')
      expect(notification.type).toBe('info')
      expect(notification.status).toBe('unread')
      expect(notification.userId).toBe('user-123')
    })

    it('should create notification with action_url and action_label', async () => {
      // Arrange
      const request = {
        user_id: 'user-123',
        type: 'lesson' as const,
        title: 'New Lesson Available',
        message: 'A new lesson is available for you',
        action_url: 'https://example.com/lesson/123',
        action_label: 'View Lesson',
      }

      // Act
      const notification = await notificationService.createNotification(request)
      createdNotifications.push(notification)

      // Assert
      expect(notification.actionUrl).toBe('https://example.com/lesson/123')
      expect(notification.actionLabel).toBe('View Lesson')
    })

    it('should create notification with metadata', async () => {
      // Arrange
      const request = {
        user_id: 'user-123',
        type: 'achievement' as const,
        title: 'Achievement Unlocked',
        message: 'You have unlocked a new achievement',
        metadata: {
          achievement_id: 'ach-123',
          points: 100,
        },
      }

      // Act
      const notification = await notificationService.createNotification(request)
      createdNotifications.push(notification)

      // Assert
      expect(notification.metadata).toEqual({
        achievement_id: 'ach-123',
        points: 100,
      })
    })

    it('should reject invalid notification data', async () => {
      // Arrange
      const invalidRequest = {
        user_id: '', // Invalid: empty string
        type: 'info' as const,
        title: 'Test',
        message: 'Test message',
      }

      // Act & Assert
      await expect(
        notificationService.createNotification(invalidRequest as any)
      ).rejects.toThrow()
    })
  })

  describe('getNotification', () => {
    it('should return notification if found', async () => {
      // Arrange
      const created = await notificationService.createNotification({
        user_id: 'user-123',
        type: 'info',
        title: 'Test Notification',
        message: 'Test message',
      })
      createdNotifications.push(created)

      // Act
      const notification = await notificationService.getNotification(created.id, 'user-123')

      // Assert
      expect(notification).toBeDefined()
      expect(notification.id).toBe(created.id)
      expect(notification.title).toBe('Test Notification')
    })

    it('should throw error if notification not found', async () => {
      // Arrange
      const nonExistentId = 'notif-non-existent'

      // Act & Assert
      await expect(
        notificationService.getNotification(nonExistentId, 'user-123')
      ).rejects.toThrow()
    })

    it('should throw error if notification does not belong to user', async () => {
      // Arrange
      const created = await notificationService.createNotification({
        user_id: 'user-123',
        type: 'info',
        title: 'Test Notification',
        message: 'Test message',
      })
      createdNotifications.push(created)

      // Act & Assert
      await expect(
        notificationService.getNotification(created.id, 'user-456')
      ).rejects.toThrow()
    })
  })

  describe('getNotifications', () => {
    beforeEach(async () => {
      // Create test notifications
      for (let i = 0; i < 5; i++) {
        const notification = await notificationService.createNotification({
          user_id: 'user-123',
          type: 'info',
          title: `Notification ${i + 1}`,
          message: `Test message ${i + 1}`,
        })
        createdNotifications.push(notification)
      }
    })

    it('should return paginated notifications', async () => {
      // Arrange
      const userId = 'user-123'

      // Act
      const result = await notificationService.getUserNotifications(userId, {
        page: 1,
        perPage: 20,
      })

      // Assert
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('per_page')
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.page).toBe(1)
      expect(result.per_page).toBe(20)
    })

    it('should return correct pagination', async () => {
      // Arrange
      const userId = 'user-123'

      // Act
      const page1 = await notificationService.getUserNotifications(userId, {
        page: 1,
        perPage: 2,
      })
      const page2 = await notificationService.getUserNotifications(userId, {
        page: 2,
        perPage: 2,
      })

      // Assert
      expect(page1.data.length).toBeLessThanOrEqual(2)
      expect(page2.data.length).toBeLessThanOrEqual(2)
      expect(page1.page).toBe(1)
      expect(page2.page).toBe(2)
    })

    it('should filter by status', async () => {
      // Arrange
      const userId = 'user-123'
      const notification = createdNotifications[0]
      await notificationService.markAsRead(notification.id, userId)

      // Act
      const unreadResult = await notificationService.getUserNotifications(userId, {
        page: 1,
        perPage: 20,
        status: 'unread',
      })
      const readResult = await notificationService.getUserNotifications(userId, {
        page: 1,
        perPage: 20,
        status: 'read',
      })

      // Assert
      expect(unreadResult.data.every(n => n.status === 'unread')).toBe(true)
      expect(readResult.data.every(n => n.status === 'read')).toBe(true)
    })
  })

  describe('updateNotification', () => {
    it('should update notification successfully', async () => {
      // Arrange
      const created = await notificationService.createNotification({
        user_id: 'user-123',
        type: 'info',
        title: 'Original Title',
        message: 'Original message',
      })
      createdNotifications.push(created)

      // Act
      const updated = await notificationService.updateNotification(created.id, {
        status: 'read',
      }, 'user-123')

      // Assert
      expect(updated.status).toBe('read')
    })

    it('should throw error if notification not found', async () => {
      // Arrange
      const nonExistentId = 'notif-non-existent'

      // Act & Assert
      await expect(
        notificationService.updateNotification(nonExistentId, {
          status: 'read',
        }, 'user-123')
      ).rejects.toThrow()
    })
  })

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      // Arrange
      const created = await notificationService.createNotification({
        user_id: 'user-123',
        type: 'info',
        title: 'Test Notification',
        message: 'Test message',
      })
      createdNotifications.push(created)
      expect(created.status).toBe('unread')

      // Act
      const updated = await notificationService.markAsRead(created.id, 'user-123')

      // Assert
      expect(updated.status).toBe('read')
    })
  })

  describe('markAllAsRead', () => {
    it('should mark all user notifications as read', async () => {
      // Arrange
      const userId = 'user-123'
      for (let i = 0; i < 3; i++) {
        const notification = await notificationService.createNotification({
          user_id: userId,
          type: 'info',
          title: `Notification ${i + 1}`,
          message: `Test message ${i + 1}`,
        })
        createdNotifications.push(notification)
      }

      // Act
      await notificationService.markAllAsRead(userId)

      // Assert
      const result = await notificationService.getUserNotifications(userId, {
        page: 1,
        perPage: 20,
        status: 'read',
      })
      expect(result.data.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      // Arrange
      const created = await notificationService.createNotification({
        user_id: 'user-123',
        type: 'info',
        title: 'Test Notification',
        message: 'Test message',
      })
      createdNotifications.push(created)

      // Act
      await notificationService.deleteNotification(created.id, 'user-123')

      // Assert
      await expect(
        notificationService.getNotification(created.id, 'user-123')
      ).rejects.toThrow()
    })
  })

  describe('getNotificationStats', () => {
    it('should return correct statistics', async () => {
      // Arrange
      const userId = 'user-123'
      for (let i = 0; i < 5; i++) {
        const notification = await notificationService.createNotification({
          user_id: userId,
          type: 'info',
          title: `Notification ${i + 1}`,
          message: `Test message ${i + 1}`,
        })
        createdNotifications.push(notification)
      }
      // Mark some as read
      await notificationService.markAsRead(createdNotifications[0].id, userId)
      await notificationService.markAsRead(createdNotifications[1].id, userId)

      // Act
      const stats = await notificationService.getStats(userId)

      // Assert
      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('unread')
      expect(stats).toHaveProperty('read')
      expect(stats).toHaveProperty('archived')
      expect(stats.total).toBeGreaterThanOrEqual(5)
      expect(stats.read).toBeGreaterThanOrEqual(2)
    })
  })
})
