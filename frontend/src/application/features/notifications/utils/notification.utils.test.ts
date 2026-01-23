/**
 * Notification Utils Tests - اختبارات دوال مساعدة الإشعارات
 */

import { describe, it, expect } from 'vitest'
import {
  validateNotificationTitle,
  validateNotificationMessage,
  formatNotificationTime,
  formatNotificationDate,
  formatNotificationType,
  formatNotificationPriority,
  getNotificationTypeColor,
  isNotificationUnread,
  isNotificationRead,
  isNotificationArchived,
  isNotificationNew,
  groupNotificationsByDate,
  sortNotificationsByPriority,
  sortNotificationsByDate,
  filterNotificationsByStatus,
  filterNotificationsByType,
  countUnreadNotifications,
  formatNotificationError,
  truncateNotificationText,
} from './notification.utils'
import type { NotificationData } from '../types'

describe('notification.utils', () => {
  describe('validateNotificationTitle', () => {
    it('should validate valid title', () => {
      const result = validateNotificationTitle('عنوان صحيح')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject empty title', () => {
      const result = validateNotificationTitle('')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject title that is too long', () => {
      const longTitle = 'أ'.repeat(201)
      const result = validateNotificationTitle(longTitle)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateNotificationMessage', () => {
    it('should validate valid message', () => {
      const result = validateNotificationMessage('رسالة صحيحة')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject empty message', () => {
      const result = validateNotificationMessage('')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject message that is too long', () => {
      const longMessage = 'أ'.repeat(1001)
      const result = validateNotificationMessage(longMessage)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('formatNotificationTime', () => {
    it('should format time correctly', () => {
      const now = new Date()
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
      const result = formatNotificationTime(fiveMinutesAgo)
      expect(result).toContain('دقائق')
    })

    it('should format "now" for very recent time', () => {
      const now = new Date()
      const result = formatNotificationTime(now)
      expect(result).toBe('الآن')
    })
  })

  describe('formatNotificationDate', () => {
    it('should format today correctly', () => {
      const today = new Date()
      const result = formatNotificationDate(today)
      expect(result).toBe('اليوم')
    })

    it('should format yesterday correctly', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const result = formatNotificationDate(yesterday)
      expect(result).toBe('أمس')
    })
  })

  describe('formatNotificationType', () => {
    it('should format type correctly', () => {
      expect(formatNotificationType('message')).toBe('رسالة')
      expect(formatNotificationType('alert')).toBe('تنبيه')
      expect(formatNotificationType('success')).toBe('نجاح')
    })
  })

  describe('formatNotificationPriority', () => {
    it('should format priority correctly', () => {
      expect(formatNotificationPriority('low')).toBe('منخفضة')
      expect(formatNotificationPriority('high')).toBe('عالية')
      expect(formatNotificationPriority('urgent')).toBe('عاجلة')
    })
  })

  describe('getNotificationTypeColor', () => {
    it('should return color for type', () => {
      expect(getNotificationTypeColor('success')).toBe('#22c55e')
      expect(getNotificationTypeColor('error')).toBe('#ef4444')
      expect(getNotificationTypeColor('warning')).toBe('#f59e0b')
    })
  })

  describe('isNotificationUnread', () => {
    it('should return true for unread notification', () => {
      const notification: NotificationData = {
        id: '1',
        user_id: 'user-1',
        type: 'message',
        title: 'Test',
        message: 'Test',
        status: 'unread',
        created_at: new Date().toISOString(),
      }
      expect(isNotificationUnread(notification)).toBe(true)
    })

    it('should return false for read notification', () => {
      const notification: NotificationData = {
        id: '1',
        user_id: 'user-1',
        type: 'message',
        title: 'Test',
        message: 'Test',
        status: 'read',
        created_at: new Date().toISOString(),
      }
      expect(isNotificationUnread(notification)).toBe(false)
    })
  })

  describe('isNotificationRead', () => {
    it('should return true for read notification', () => {
      const notification: NotificationData = {
        id: '1',
        user_id: 'user-1',
        type: 'message',
        title: 'Test',
        message: 'Test',
        status: 'read',
        created_at: new Date().toISOString(),
      }
      expect(isNotificationRead(notification)).toBe(true)
    })
  })

  describe('isNotificationArchived', () => {
    it('should return true for archived notification', () => {
      const notification: NotificationData = {
        id: '1',
        user_id: 'user-1',
        type: 'message',
        title: 'Test',
        message: 'Test',
        status: 'archived',
        created_at: new Date().toISOString(),
      }
      expect(isNotificationArchived(notification)).toBe(true)
    })
  })

  describe('isNotificationNew', () => {
    it('should return true for new notification (within 24 hours)', () => {
      const notification: NotificationData = {
        id: '1',
        user_id: 'user-1',
        type: 'message',
        title: 'Test',
        message: 'Test',
        status: 'unread',
        created_at: new Date().toISOString(),
      }
      expect(isNotificationNew(notification)).toBe(true)
    })

    it('should return false for old notification', () => {
      const oldDate = new Date()
      oldDate.setDate(oldDate.getDate() - 2)
      const notification: NotificationData = {
        id: '1',
        user_id: 'user-1',
        type: 'message',
        title: 'Test',
        message: 'Test',
        status: 'unread',
        created_at: oldDate.toISOString(),
      }
      expect(isNotificationNew(notification)).toBe(false)
    })
  })

  describe('groupNotificationsByDate', () => {
    it('should group notifications by date', () => {
      const notifications: NotificationData[] = [
        {
          id: '1',
          user_id: 'user-1',
          type: 'message',
          title: 'Test 1',
          message: 'Test',
          status: 'unread',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user-1',
          type: 'message',
          title: 'Test 2',
          message: 'Test',
          status: 'unread',
          created_at: new Date().toISOString(),
        },
      ]

      const grouped = groupNotificationsByDate(notifications)
      expect(grouped.length).toBeGreaterThan(0)
      expect(grouped[0]?.notifications.length).toBe(2)
    })
  })

  describe('sortNotificationsByPriority', () => {
    it('should sort notifications by priority', () => {
      const notifications: NotificationData[] = [
        {
          id: '1',
          user_id: 'user-1',
          type: 'message',
          title: 'Low',
          message: 'Test',
          status: 'unread',
          priority: 'low',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user-1',
          type: 'message',
          title: 'High',
          message: 'Test',
          status: 'unread',
          priority: 'high',
          created_at: new Date().toISOString(),
        },
      ]

      const sorted = sortNotificationsByPriority(notifications)
      expect(sorted[0]?.priority).toBe('high')
      expect(sorted[1]?.priority).toBe('low')
    })
  })

  describe('sortNotificationsByDate', () => {
    it('should sort notifications by date (newest first)', () => {
      const oldDate = new Date('2025-01-01')
      const newDate = new Date('2025-01-08')
      const notifications: NotificationData[] = [
        {
          id: '1',
          user_id: 'user-1',
          type: 'message',
          title: 'Old',
          message: 'Test',
          status: 'unread',
          created_at: oldDate.toISOString(),
        },
        {
          id: '2',
          user_id: 'user-1',
          type: 'message',
          title: 'New',
          message: 'Test',
          status: 'unread',
          created_at: newDate.toISOString(),
        },
      ]

      const sorted = sortNotificationsByDate(notifications)
      expect(sorted[0]?.id).toBe('2')
      expect(sorted[1]?.id).toBe('1')
    })
  })

  describe('filterNotificationsByStatus', () => {
    it('should filter notifications by status', () => {
      const notifications: NotificationData[] = [
        {
          id: '1',
          user_id: 'user-1',
          type: 'message',
          title: 'Unread',
          message: 'Test',
          status: 'unread',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user-1',
          type: 'message',
          title: 'Read',
          message: 'Test',
          status: 'read',
          created_at: new Date().toISOString(),
        },
      ]

      const filtered = filterNotificationsByStatus(notifications, 'unread')
      expect(filtered.length).toBe(1)
      expect(filtered[0]?.status).toBe('unread')
    })
  })

  describe('filterNotificationsByType', () => {
    it('should filter notifications by type', () => {
      const notifications: NotificationData[] = [
        {
          id: '1',
          user_id: 'user-1',
          type: 'message',
          title: 'Message',
          message: 'Test',
          status: 'unread',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user-1',
          type: 'alert',
          title: 'Alert',
          message: 'Test',
          status: 'unread',
          created_at: new Date().toISOString(),
        },
      ]

      const filtered = filterNotificationsByType(notifications, 'message')
      expect(filtered.length).toBe(1)
      expect(filtered[0]?.type).toBe('message')
    })
  })

  describe('countUnreadNotifications', () => {
    it('should count unread notifications', () => {
      const notifications: NotificationData[] = [
        {
          id: '1',
          user_id: 'user-1',
          type: 'message',
          title: 'Unread',
          message: 'Test',
          status: 'unread',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user-1',
          type: 'message',
          title: 'Read',
          message: 'Test',
          status: 'read',
          created_at: new Date().toISOString(),
        },
      ]

      const count = countUnreadNotifications(notifications)
      expect(count).toBe(1)
    })
  })

  describe('formatNotificationError', () => {
    it('should format Error object', () => {
      const error = new Error('Test error')
      const result = formatNotificationError(error)
      expect(result).toBe('Test error')
    })

    it('should format string error', () => {
      const result = formatNotificationError('String error')
      expect(result).toBe('String error')
    })

    it('should format unknown error', () => {
      const result = formatNotificationError({ message: 'Object error' })
      expect(result).toBe('Object error')
    })
  })

  describe('truncateNotificationText', () => {
    it('should truncate long text', () => {
      const longText = 'أ'.repeat(150)
      const result = truncateNotificationText(longText, 100)
      expect(result.length).toBeLessThanOrEqual(103) // 100 + '...'
      expect(result).toContain('...')
    })

    it('should not truncate short text', () => {
      const shortText = 'نص قصير'
      const result = truncateNotificationText(shortText, 100)
      expect(result).toBe(shortText)
    })
  })
})
