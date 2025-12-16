/**
 * Constants
 * ثوابت التخصيص الشخصي
 */

// Validation Constants
export const VALIDATION_LIMITS = {
  DISPLAY_NAME_MAX_LENGTH: 255,
  BIO_MAX_LENGTH: 1000,
  SKILLS_MAX_COUNT: 50,
  INTERESTS_MAX_COUNT: 50,
  AI_TEMPERATURE_MIN: 0,
  AI_TEMPERATURE_MAX: 1,
  AI_MAX_TOKENS_MIN: 100,
  AI_MAX_TOKENS_MAX: 4000,
  FONT_SIZE_MIN: 10,
  FONT_SIZE_MAX: 24,
  TAB_SIZE_MIN: 1,
  TAB_SIZE_MAX: 8,
  AUTO_SAVE_INTERVAL_MIN: 10,
  AUTO_SAVE_INTERVAL_MAX: 300,
} as const;

// Default Values
export const DEFAULT_PREFERENCES = {
  theme: 'auto' as const,
  layout: 'comfortable' as const,
  language: 'ar' as const,
  timezone: 'Asia/Muscat',
  date_format: 'DD/MM/YYYY',
  time_format: '24h' as const,
  notifications_enabled: true,
  email_notifications: true,
  push_notifications: false,
  sound_enabled: true,
  animations_enabled: true,
  sidebar_collapsed: false,
  custom_colors: {},
} as const;

export const DEFAULT_SETTINGS = {
  ai_model_preference: 'gemini-pro' as const,
  ai_temperature: 0.7,
  ai_max_tokens: 2048,
  code_editor_theme: 'vs-dark' as const,
  code_editor_font_size: 14,
  font_family: 'Consolas, monospace',
  tab_size: 2,
  auto_save_enabled: true,
  auto_save_interval: 30,
  word_wrap: true,
  line_numbers: true,
  minimap_enabled: true,
} as const;

export const DEFAULT_PROFILE = {
  display_name: '',
  bio: '',
  avatar_url: '',
  website: '',
  location: '',
  skills: [] as string[],
  interests: [] as string[],
  social_links: {} as Record<string, string>,
} as const;

// Toast Duration
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;

// Auto-save Delay
export const AUTO_SAVE_DELAY = 2000; // milliseconds

// Debounce Delay
export const DEBOUNCE_DELAY = 500; // milliseconds

// Export/Import
export const EXPORT_VERSION = '1.0.0';
export const EXPORT_FILE_PREFIX = 'personalization-';

