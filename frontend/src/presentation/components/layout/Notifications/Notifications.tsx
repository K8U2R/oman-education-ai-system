import React, { useState, useEffect, useRef } from 'react'
import { Bell, Check, X, Settings } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { Notification } from '../types'
import { NotificationPreferences } from '../NotificationPreferences'
import './Notifications.scss'

const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications()
  const menuRef = useRef<HTMLDivElement>(null)

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

  const getNotificationIcon = (type: Notification['type']) => {
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

  return (
    <div className="notifications" ref={menuRef}>
      <button
        className="notifications__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="الإشعارات"
      >
        <Bell className="notifications__icon" />
        {unreadCount > 0 && <span className="notifications__badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notifications__dropdown">
          <div className="notifications__header">
            <h3 className="notifications__title">الإشعارات</h3>
            <div className="notifications__header-actions">
              {unreadCount > 0 && (
                <button className="notifications__mark-all" onClick={markAllAsRead}>
                  تحديد الكل كمقروء
                </button>
              )}
              <button
                className="notifications__preferences"
                onClick={() => {
                  setIsOpen(false)
                  setIsPreferencesOpen(true)
                }}
                aria-label="تفضيلات الإشعارات"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="notifications__list">
            {notifications.length === 0 ? (
              <div className="notifications__empty">
                <Bell className="notifications__empty-icon" />
                <p className="notifications__empty-text">لا توجد إشعارات</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notifications__item ${
                    !notification.read ? 'notifications__item--unread' : ''
                  }`}
                >
                  <div className="notifications__item-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notifications__item-content">
                    <h4 className="notifications__item-title">{notification.title}</h4>
                    <p className="notifications__item-message">{notification.message}</p>
                    <span className="notifications__item-time">{notification.time}</span>
                  </div>
                  <div className="notifications__item-actions">
                    {!notification.read && (
                      <button
                        className="notifications__item-action"
                        onClick={() => markAsRead(notification.id)}
                        aria-label="تحديد كمقروء"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      className="notifications__item-action"
                      onClick={() => deleteNotification(notification.id)}
                      aria-label="حذف"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <NotificationPreferences
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </div>
  )
}

export default Notifications
