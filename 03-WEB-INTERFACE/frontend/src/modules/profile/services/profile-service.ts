import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { User } from '@/utils/types';

class ProfileService {
  async getProfile(): Promise<User> {
    return await apiClient.get<User>(API_ENDPOINTS.profile.get);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return await apiClient.put<User>(API_ENDPOINTS.profile.update, data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.profile.changePassword, {
      currentPassword,
      newPassword,
    });
  }

  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return await apiClient.post<{ url: string }>(API_ENDPOINTS.profile.uploadAvatar, formData);
  }
}

export const profileService = new ProfileService();

