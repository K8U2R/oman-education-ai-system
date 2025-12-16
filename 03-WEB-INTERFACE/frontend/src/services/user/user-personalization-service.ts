/**
 * User Personalization Service
 * خدمة التخصيص الشخصي للمستخدم
 */

import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { EducationEntry, ExperienceEntry, AchievementEntry } from '../../modules/user-personalization/types/profile';

export interface UserPreferences {
  user_id: string;
  theme: 'light' | 'dark' | 'auto';
  layout: 'compact' | 'comfortable' | 'spacious';
  language: string;
  timezone: string;
  date_format: string;
  time_format: '12h' | '24h';
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  sound_enabled: boolean;
  animations_enabled: boolean;
  sidebar_collapsed: boolean;
  custom_colors: Record<string, string>;
}

export interface UserSettings {
  user_id: string;
  ai_model_preference: string;
  ai_temperature: number;
  ai_max_tokens: number;
  auto_save_enabled: boolean;
  auto_save_interval: number;
  code_theme: string;
  font_size: number;
  font_family: string;
  tab_size: number;
  word_wrap: boolean;
  line_numbers: boolean;
  minimap_enabled: boolean;
}

export interface UserProfile {
  user_id: string;
  display_name: string;
  bio: string;
  avatar_url?: string;
  cover_image_url?: string;
  location?: string;
  website?: string;
  social_links: Record<string, string>;
  skills: string[];
  interests: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  achievements: AchievementEntry[];
  stats: Record<string, number>;
}

class UserPersonalizationService {
  /**
   * الحصول على تفضيلات المستخدم
   */
  async getPreferences(): Promise<UserPreferences> {
    return await apiClient.get<UserPreferences>(API_ENDPOINTS.user.personalization.preferences.get);
  }

  /**
   * تحديث تفضيلات المستخدم
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return await apiClient.put<UserPreferences>(
      API_ENDPOINTS.user.personalization.preferences.update,
      preferences
    );
  }

  /**
   * الحصول على إعدادات المستخدم
   */
  async getSettings(): Promise<UserSettings> {
    return await apiClient.get<UserSettings>(API_ENDPOINTS.user.personalization.settings.get);
  }

  /**
   * تحديث إعدادات المستخدم
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    return await apiClient.put<UserSettings>(
      API_ENDPOINTS.user.personalization.settings.update,
      settings
    );
  }

  /**
   * الحصول على الملف الشخصي للمستخدم
   */
  async getProfile(): Promise<UserProfile> {
    return await apiClient.get<UserProfile>(API_ENDPOINTS.user.personalization.profile.get);
  }

  /**
   * تحديث الملف الشخصي للمستخدم
   */
  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return await apiClient.put<UserProfile>(
      API_ENDPOINTS.user.personalization.profile.update,
      profile
    );
  }
}

export const userPersonalizationService = new UserPersonalizationService();

