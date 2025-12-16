/**
 * Apply User Preferences
 * تطبيق التفضيلات الشخصية على الواجهة
 */

import { UserPreferences } from '@/services/user/user-personalization-service';

export const applyPreferences = (preferences: UserPreferences) => {
  const root = document.documentElement;

  // تطبيق Theme
  if (preferences.theme === 'auto') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', systemPrefersDark);
  } else {
    root.classList.toggle('dark', preferences.theme === 'dark');
    root.classList.toggle('light', preferences.theme === 'light');
  }

  // تطبيق Layout
  root.classList.remove('layout-compact', 'layout-comfortable', 'layout-spacious');
  root.classList.add(`layout-${preferences.layout}`);

  // تطبيق Language
  if (preferences.language) {
    root.setAttribute('lang', preferences.language);
    root.setAttribute('dir', preferences.language === 'ar' ? 'rtl' : 'ltr');
  }

  // تطبيق Custom Colors
  if (preferences.custom_colors && Object.keys(preferences.custom_colors).length > 0) {
    Object.entries(preferences.custom_colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }
};

