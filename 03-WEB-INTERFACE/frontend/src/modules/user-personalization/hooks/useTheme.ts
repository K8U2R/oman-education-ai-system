/**
 * useTheme Hook
 * Hook لإدارة الثيم من التفضيلات
 */

import { useEffect } from 'react';
import { useUserPersonalizationStore } from '@/store/user-personalization-store';

export const useTheme = () => {
  const { preferences } = useUserPersonalizationStore();

  useEffect(() => {
    if (!preferences) return;

    const theme = preferences.theme;
    const root = document.documentElement;

    if (theme === 'auto') {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemPrefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('light', theme === 'light');
    }
  }, [preferences]);

  return {
    theme: preferences?.theme || 'auto',
    isDark: document.documentElement.classList.contains('dark'),
  };
};

