import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Notification } from '@/utils/types';
import Badge from '@/components/ui/Badge';
import { formatRelativeTime } from '@/utils/helpers';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const typeColors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  } as const;

  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        notification.read
          ? 'bg-ide-surface border-ide-border'
          : 'bg-ide-accent/5 border-ide-accent/20'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium">{notification.title}</h3>
            <Badge variant={typeColors[notification.type]} size="sm">
              {notification.type === 'success' && 'نجاح'}
              {notification.type === 'error' && 'خطأ'}
              {notification.type === 'warning' && 'تحذير'}
              {notification.type === 'info' && 'معلومات'}
            </Badge>
            {!notification.read && (
              <span className="w-2 h-2 bg-ide-accent rounded-full" />
            )}
          </div>
          {notification.message && (
            <p className="text-sm text-ide-text-secondary mb-2">
              {notification.message}
            </p>
          )}
          <p className="text-xs text-ide-text-secondary">
            {formatRelativeTime(notification.timestamp)}
          </p>
        </div>
        <div className="flex gap-2">
          {!notification.read && onMarkAsRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-2 rounded hover:bg-ide-border transition-colors"
              aria-label="تحديد كمقروء"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(notification.id)}
              className="p-2 rounded hover:bg-red-900/20 text-red-400 transition-colors"
              aria-label="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

