/**
 * Helper Functions
 * دوال مساعدة للتخصيص الشخصي
 */

import { UserPreferences, UserSettings, UserProfile } from '@/services/user/user-personalization-service';
import { DEFAULT_PREFERENCES, DEFAULT_SETTINGS, DEFAULT_PROFILE } from './constants';

/**
 * دمج التفضيلات مع القيم الافتراضية
 */
export const mergePreferences = (preferences: Partial<UserPreferences>): UserPreferences => {
  return {
    ...DEFAULT_PREFERENCES,
    ...preferences,
    custom_colors: {
      ...DEFAULT_PREFERENCES.custom_colors,
      ...(preferences.custom_colors || {}),
    },
  } as UserPreferences;
};

/**
 * دمج الإعدادات مع القيم الافتراضية
 */
export const mergeSettings = (settings: Partial<UserSettings>): UserSettings => {
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
  } as UserSettings;
};

/**
 * دمج الملف الشخصي مع القيم الافتراضية
 */
export const mergeProfile = (profile: Partial<UserProfile>): UserProfile => {
  return {
    ...DEFAULT_PROFILE,
    ...profile,
    skills: profile.skills || [],
    interests: profile.interests || [],
    social_links: profile.social_links || {},
  } as UserProfile;
};

/**
 * التحقق من وجود تغييرات
 */
export const hasChanges = <T extends Record<string, unknown>>(
  original: T,
  modified: T
): boolean => {
  return JSON.stringify(original) !== JSON.stringify(modified);
};

/**
 * تنسيق التاريخ
 */
export const formatDate = (date: Date | string, format: string = 'DD/MM/YYYY'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year);
};

/**
 * تنسيق الوقت
 */
export const formatTime = (date: Date | string, format: '12h' | '24h' = '24h'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');

  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

/**
 * تنسيق حجم الملف
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * تنظيف البيانات قبل الحفظ
 */
export const sanitizeData = <T extends Record<string, unknown>>(data: T): T => {
  const sanitized = { ...data };
  
  // إزالة القيم الفارغة
  Object.keys(sanitized).forEach((key) => {
    if (sanitized[key] === null || sanitized[key] === undefined || sanitized[key] === '') {
      delete sanitized[key];
    }
  });

  return sanitized;
};

