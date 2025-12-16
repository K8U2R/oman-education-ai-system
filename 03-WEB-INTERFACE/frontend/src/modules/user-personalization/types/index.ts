/**
 * Type Definitions
 * تعريفات الأنواع للتخصيص الشخصي
 */

import { UserPreferences, UserSettings, UserProfile } from '@/services/user/user-personalization-service';

// Re-export service types
export type { UserPreferences, UserSettings, UserProfile } from '@/services/user/user-personalization-service';

// Extended types
export interface PersonalizationState {
  preferences: UserPreferences | null;
  settings: UserSettings | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface PersonalizationActions {
  loadPreferences: () => Promise<void>;
  loadSettings: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  updateSettings: (sett: Partial<UserSettings>) => Promise<void>;
  updateProfile: (prof: Partial<UserProfile>) => Promise<void>;
  loadAll: () => Promise<void>;
  reset: () => void;
}

export interface PersonalizationContextType extends PersonalizationState, PersonalizationActions {}

// Theme types
export type ThemePreference = 'light' | 'dark' | 'auto';
export type LayoutType = 'compact' | 'comfortable' | 'spacious';
export type LanguagePreference = 'ar' | 'en';
export type TimeFormat = '12h' | '24h';

// Settings types
export type AIModelPreference = 'gemini-pro' | 'openai-gpt4' | 'anthropic-claude';
export type EditorTheme = 'vs-light' | 'vs-dark' | 'monokai' | 'dracula';

// Validation types (re-exported from utils)
export type { ValidationResult } from '../utils/validation';

// Export/Import types (re-exported from utils)
export type { PersonalizationData } from '../utils/exportImport';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Auto-save types
export interface AutoSaveOptions {
  enabled?: boolean;
  delay?: number;
  onSave?: () => void;
  onError?: (error: Error) => void;
}

// Keyboard shortcut types
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description?: string;
}

