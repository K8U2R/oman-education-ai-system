import React from 'react';
import { Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const ImportantNotifications: React.FC = () => {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'تم بناء المشروع بنجاح',
      message: 'مشروع React تم بناؤه بدون أخطاء',
      time: 'منذ 5 دقائق',
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'استخدام الذاكرة مرتفع',
      message: 'استخدام الذاكرة وصل إلى 85%',
      time: 'منذ ساعة',
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'تحديث جديد متاح',
      message: 'FlowForge IDE v2.1.0 متاح الآن',
      time: 'منذ يوم',
      read: true,
    },
  ];

  const typeIcons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  };

  const typeColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-ide-accent" />
          <h2 className="text-lg font-semibold">إشعارات مهمة</h2>
          {notifications.filter((n) => !n.read).length > 0 && (
            <Badge variant="error" size="sm">
              {notifications.filter((n) => !n.read).length}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm">
          عرض الكل
        </Button>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = typeIcons[notification.type];
          return (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.read
                  ? 'bg-ide-bg border-ide-border opacity-60'
                  : 'bg-ide-surface border-ide-accent/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${typeColors[notification.type]} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-ide-accent rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-ide-text-secondary mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-ide-text-secondary">{notification.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ImportantNotifications;

