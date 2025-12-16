import React from 'react';
import NotificationItem from './NotificationItem';
import { Notification } from '@/utils/types';

interface NotificationListProps {
  filter: 'all' | 'unread' | 'read';
}

const NotificationList: React.FC<NotificationListProps> = ({ filter }) => {
  // Mock data - replace with actual data from store/API
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'تم بناء المشروع بنجاح',
      message: 'تم بناء مشروع "My Project" بنجاح',
      read: false,
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'info',
      title: 'تحديث جديد متاح',
      message: 'تحديث FlowForge IDE v2.1.0 متاح الآن',
      read: false,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      type: 'warning',
      title: 'تحذير: استخدام الذاكرة مرتفع',
      message: 'استخدام الذاكرة وصل إلى 85%',
      read: true,
      timestamp: new Date(Date.now() - 7200000),
    },
  ];

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  if (filteredNotifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ide-text-secondary">لا توجد إشعارات</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredNotifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationList;

