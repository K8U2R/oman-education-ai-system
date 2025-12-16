import { websocketService } from '@/modules/collaboration/services/websocket-service';
import { Notification } from '@/utils/types';

class WebSocketNotificationsService {
  private listeners: Array<(notification: Notification) => void> = [];

  connect(): void {
    websocketService.on('notification', (data: unknown) => {
      const notification = data as Notification;
      this.listeners.forEach((listener) => listener(notification));
    });
  }

  disconnect(): void {
    websocketService.off('notification', () => {});
  }

  onNotification(callback: (notification: Notification) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
}

export const websocketNotificationsService = new WebSocketNotificationsService();

