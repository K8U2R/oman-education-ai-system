import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { Notification } from '@/utils/types';

class NotificationService {
  async getNotifications(limit: number = 50): Promise<Notification[]> {
    try {
      return await apiClient.get<Notification[]>(
        `${API_ENDPOINTS.notifications.list}?limit=${limit}`
      );
    } catch (error) {
      // Return mock data if API fails
      return [];
    }
  }

  async markAsRead(id: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.notifications.markRead(id));
  }

  async markAllAsRead(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.notifications.markAllRead);
  }

  async deleteNotification(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.notifications.delete(id));
  }

  async subscribeToPush(): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
        });

        // TODO: Send subscription to backend
        console.log('Push subscription:', subscription);
      } catch (error) {
        console.error('Failed to subscribe to push:', error);
      }
    }
  }
}

export const notificationService = new NotificationService();

