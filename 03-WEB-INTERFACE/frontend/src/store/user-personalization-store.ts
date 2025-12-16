/**
 * User Personalization Store
 * Store لإدارة حالة التخصيص الشخصي
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userPersonalizationService, UserPreferences, UserSettings, UserProfile } from '@/services/user/user-personalization-service';

interface UserPersonalizationState {
  preferences: UserPreferences | null;
  settings: UserSettings | null;
  profile: UserProfile | null;
  isLoading: boolean;
  loadPreferences: () => Promise<void>;
  loadSettings: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  updateSettings: (sett: Partial<UserSettings>) => Promise<void>;
  updateProfile: (prof: Partial<UserProfile>) => Promise<void>;
  loadAll: () => Promise<void>;
}

export const useUserPersonalizationStore = create<UserPersonalizationState>()(
  persist(
    (set, get) => ({
      preferences: null,
      settings: null,
      profile: null,
      isLoading: false,

      loadPreferences: async () => {
        try {
          set({ isLoading: true });
          const prefs = await userPersonalizationService.getPreferences();
          set({ preferences: prefs, isLoading: false });
        } catch (error) {
          // في حالة عدم توفر API، نستخدم القيم الافتراضية من localStorage
          console.warn('Failed to load preferences from API, using defaults:', error);
          const stored = localStorage.getItem('user-personalization-storage');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed.state?.preferences) {
                set({ preferences: parsed.state.preferences, isLoading: false });
                return;
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
          set({ isLoading: false });
        }
      },

      loadSettings: async () => {
        try {
          set({ isLoading: true });
          const sett = await userPersonalizationService.getSettings();
          set({ settings: sett, isLoading: false });
        } catch (error) {
          // في حالة عدم توفر API، نستخدم القيم الافتراضية من localStorage
          console.warn('Failed to load settings from API, using defaults:', error);
          const stored = localStorage.getItem('user-personalization-storage');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed.state?.settings) {
                set({ settings: parsed.state.settings, isLoading: false });
                return;
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
          set({ isLoading: false });
        }
      },

      loadProfile: async () => {
        try {
          set({ isLoading: true });
          const prof = await userPersonalizationService.getProfile();
          set({ profile: prof, isLoading: false });
        } catch (error) {
          // في حالة عدم توفر API، نستخدم القيم الافتراضية من localStorage
          console.warn('Failed to load profile from API, using defaults:', error);
          const stored = localStorage.getItem('user-personalization-storage');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed.state?.profile) {
                set({ profile: parsed.state.profile, isLoading: false });
                return;
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
          set({ isLoading: false });
        }
      },

      updatePreferences: async (prefs: Partial<UserPreferences>) => {
        try {
          set({ isLoading: true });
          const updated = await userPersonalizationService.updatePreferences(prefs);
          set({ preferences: updated, isLoading: false });
        } catch (error) {
          console.error('Failed to update preferences:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      updateSettings: async (sett: Partial<UserSettings>) => {
        try {
          set({ isLoading: true });
          const updated = await userPersonalizationService.updateSettings(sett);
          set({ settings: updated, isLoading: false });
        } catch (error) {
          console.error('Failed to update settings:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: async (prof: Partial<UserProfile>) => {
        try {
          set({ isLoading: true });
          const updated = await userPersonalizationService.updateProfile(prof);
          set({ profile: updated, isLoading: false });
        } catch (error) {
          console.error('Failed to update profile:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      loadAll: async () => {
        const { loadPreferences, loadSettings, loadProfile } = get();
        await Promise.all([
          loadPreferences(),
          loadSettings(),
          loadProfile(),
        ]);
      },
    }),
    {
      name: 'user-personalization-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        settings: state.settings,
        profile: state.profile,
      }),
    }
  )
);

