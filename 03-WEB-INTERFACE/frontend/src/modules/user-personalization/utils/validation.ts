/**
 * Validation Utilities
 * أدوات التحقق من صحة بيانات التخصيص الشخصي
 */

import { UserPreferences, UserSettings, UserProfile } from '@/services/user/user-personalization-service';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * التحقق من صحة التفضيلات
 */
export const validatePreferences = (preferences: Partial<UserPreferences>): ValidationResult => {
  const errors: string[] = [];

  if (preferences.theme && !['light', 'dark', 'auto'].includes(preferences.theme)) {
    errors.push('الثيم يجب أن يكون: light, dark, أو auto');
  }

  if (preferences.layout && !['compact', 'comfortable', 'spacious'].includes(preferences.layout)) {
    errors.push('التخطيط يجب أن يكون: compact, comfortable, أو spacious');
  }

  if (preferences.language && !['ar', 'en'].includes(preferences.language)) {
    errors.push('اللغة يجب أن تكون: ar أو en');
  }

  if (preferences.timezone && typeof preferences.timezone !== 'string') {
    errors.push('المنطقة الزمنية يجب أن تكون نص');
  }

  if (preferences.date_format && typeof preferences.date_format !== 'string') {
    errors.push('تنسيق التاريخ يجب أن يكون نص');
  }

  if (preferences.time_format && !['12h', '24h'].includes(preferences.time_format)) {
    errors.push('تنسيق الوقت يجب أن يكون: 12h أو 24h');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * التحقق من صحة الإعدادات
 */
export const validateSettings = (settings: Partial<UserSettings>): ValidationResult => {
  const errors: string[] = [];

  if (settings.ai_temperature !== undefined) {
    if (typeof settings.ai_temperature !== 'number' || settings.ai_temperature < 0 || settings.ai_temperature > 1) {
      errors.push('Temperature يجب أن يكون رقم بين 0 و 1');
    }
  }

  if (settings.ai_max_tokens !== undefined) {
    if (typeof settings.ai_max_tokens !== 'number' || settings.ai_max_tokens < 100 || settings.ai_max_tokens > 4000) {
      errors.push('Max Tokens يجب أن يكون رقم بين 100 و 4000');
    }
  }

  if (settings.font_size !== undefined) {
    if (typeof settings.font_size !== 'number' || settings.font_size < 10 || settings.font_size > 24) {
      errors.push('حجم الخط يجب أن يكون رقم بين 10 و 24');
    }
  }

  if (settings.tab_size !== undefined) {
    if (typeof settings.tab_size !== 'number' || settings.tab_size < 1 || settings.tab_size > 8) {
      errors.push('حجم Tab يجب أن يكون رقم بين 1 و 8');
    }
  }

  if (settings.auto_save_interval !== undefined) {
    if (typeof settings.auto_save_interval !== 'number' || settings.auto_save_interval < 10 || settings.auto_save_interval > 300) {
      errors.push('Auto Save Interval يجب أن يكون رقم بين 10 و 300 ثانية');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * التحقق من صحة الملف الشخصي
 */
export const validateProfile = (profile: Partial<UserProfile>): ValidationResult => {
  const errors: string[] = [];

  if (profile.display_name !== undefined && typeof profile.display_name !== 'string') {
    errors.push('الاسم المعروض يجب أن يكون نص');
  }

  if (profile.display_name && profile.display_name.length > 255) {
    errors.push('الاسم المعروض يجب ألا يتجاوز 255 حرف');
  }

  if (profile.bio !== undefined && typeof profile.bio !== 'string') {
    errors.push('السيرة الذاتية يجب أن تكون نص');
  }

  if (profile.bio && profile.bio.length > 1000) {
    errors.push('السيرة الذاتية يجب ألا تتجاوز 1000 حرف');
  }

  if (profile.avatar_url && typeof profile.avatar_url !== 'string') {
    errors.push('رابط الصورة الشخصية يجب أن يكون نص');
  }

  if (profile.website && typeof profile.website !== 'string') {
    errors.push('الموقع الإلكتروني يجب أن يكون نص');
  }

  if (profile.website && !/^https?:\/\/.+/.test(profile.website)) {
    errors.push('الموقع الإلكتروني يجب أن يبدأ بـ http:// أو https://');
  }

  if (profile.skills && !Array.isArray(profile.skills)) {
    errors.push('المهارات يجب أن تكون مصفوفة');
  }

  if (profile.interests && !Array.isArray(profile.interests)) {
    errors.push('الاهتمامات يجب أن تكون مصفوفة');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

