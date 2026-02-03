/**
 * Notifications Component - مكون الإشعارات
 *
 * مكون لعرض الإشعارات مع Badge و Grouped Notifications
 * تم تحسينه مع Mark as Read و Clear All
 */

import React, { useState, useEffect, useRef } from 'react'
import { Bell, Check, X, Settings, Trash2 } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { Notification } from '../types'
import { NotificationPreferences } from '../NotificationPreferences'
import { cn } from '../../common/utils/classNames'

/**
 * Notifications Component
 *
 * @example
 * ```tsx
 * <Notifications />
 * ```
 */
const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬'
      case 'alert':
        return '⚠️'
      case 'task':
        return '📋'
      case 'test':
        return '📝'
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return '🔔'
    }
  }

  // Group notifications by type
  const groupedNotifications = React.useMemo(() => {
    const groups: Record<string, Notification[]> = {}
    notifications.forEach(notification => {
      const key = notification.type || 'other'
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(notification)
    })
    return groups
  }, [notifications])

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleDelete = (id: string) => {
    deleteNotification(id)
  }

  const handleClearAll = () => {
    notifications.forEach(notification => {
      deleteNotification(notification.id)
    })
  }

  return (
    <div className="notifications" ref={menuRef}>
      <button
        className="notifications__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="الإشعارات"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="notifications__icon" />
        {unreadCount > 0 && (
          <span className="notifications__badge" aria-label={`${unreadCount} إشعار غير مقروء`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notifications__dropdown" role="menu">
          <div className="notifications__header">
            <h3 className="notifications__title">الإشعارات</h3>
            <div className="notifications__header-actions">
              {unreadCount > 0 && (
                <button
                  className="notifications__action"
                  onClick={handleMarkAllAsRead}
                  aria-label="تحديد الكل كمقروء"
                  title="تحديد الكل كمقروء"
                >
                  <Check className="notifications__action-icon" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  className="notifications__action"
                  onClick={handleClearAll}
                  aria-label="مسح الكل"
                  title="مسح الكل"
                >
                  <Trash2 className="notifications__action-icon" />
                </button>
              )}
              <button
                className="notifications__action"
                onClick={() => setIsPreferencesOpen(true)}
                aria-label="إعدادات الإشعارات"
                title="إعدادات الإشعارات"
              >
                <Settings className="notifications__action-icon" />
              </button>
            </div>
          </div>

          <div className="notifications__divider" />

          <div className="notifications__content">
            {notifications.length === 0 ? (
              <div className="notifications__empty">
                <Bell className="notifications__empty-icon" />
                <p className="notifications__empty-text">لا توجد إشعارات</p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([type, groupNotifications]) => (
                <div key={type} className="notifications__group">
                  {Object.keys(groupedNotifications).length > 1 && (
                    <div className="notifications__group-label">
                      {type === 'message' && 'الرسائل'}
                      {type === 'alert' && 'التنبيهات'}
                      {type === 'task' && 'المهام'}
                      {type === 'test' && 'الاختبارات'}
                      {type === 'success' && 'نجاح'}
                      {type === 'warning' && 'تحذيرات'}
                      {type === 'error' && 'أخطاء'}
                      {type === 'other' && 'أخرى'}
                    </div>
                  )}
                  <div className="notifications__list">
                    {groupNotifications.map(notification => (
                      <div
                        key={notification.id}
                        className={cn(
                          'notifications__item',
                          !notification.read && 'notifications__item--unread'
                        )}
                        role="menuitem"
                      >
                        <div className="notifications__item-content">
                          <span className="notifications__item-icon">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="notifications__item-text">
                            <h4 className="notifications__item-title">{notification.title}</h4>
                            {notification.message && (
                              <p className="notifications__item-message">{notification.message}</p>
                            )}
                            {notification.time && (
                              <span className="notifications__item-time">{notification.time}</span>
                            )}
                          </div>
                        </div>
                        <div className="notifications__item-actions">
                          {!notification.read && (
                            <button
                              className="notifications__item-action"
                              onClick={() => handleMarkAsRead(notification.id)}
                              aria-label="تحديد كمقروء"
                              title="تحديد كمقروء"
                            >
                              <Check className="notifications__item-action-icon" />
                            </button>
                          )}
                          <button
                            className="notifications__item-action"
                            onClick={() => handleDelete(notification.id)}
                            aria-label="حذف"
                            title="حذف"
                          >
                            <X className="notifications__item-action-icon" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {isPreferencesOpen && (
        <NotificationPreferences
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
        />
      )}
    </div>
  )
}

export default Notifications
