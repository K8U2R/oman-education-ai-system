/**
 * Theme Provider Component
 * مكون Theme Provider
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { useUserPersonalizationStore } from '@/store/user-personalization-store';
import { ThemeContext } from './ThemeContext';
import type { Theme, ThemeContextType } from './ThemeContextTypes';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProviderComponent: React.FC<ThemeProviderProps> = ({ children }) => {
  const { preferences, loadPreferences } = useUserPersonalizationStore();
  const [theme, setThemeState] = useState<Theme>(() => {
    // محاولة تحميل من التفضيلات الشخصية
    const saved = localStorage.getItem('user-preferences');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        if (prefs.theme && ['dark', 'light', 'auto'].includes(prefs.theme)) {
          return prefs.theme;
        }
      } catch (e) {
        // Fallback
      }
    }
    // Fallback إلى localStorage القديم
    const oldSaved = localStorage.getItem('ide-theme');
    if (oldSaved === 'light' || oldSaved === 'dark') {
      return oldSaved;
    }
    return 'auto';
  });

  // تحميل التفضيلات عند التحميل (فقط إذا كان المستخدم مسجلاً دخوله)
  useEffect(() => {
    // محاولة تحميل التفضيلات بشكل آمن
    loadPreferences().catch((error) => {
      // في حالة عدم توفر API، نستخدم القيم المحفوظة محلياً
      console.warn('Failed to load preferences from API, using local storage:', error);
    });
  }, [loadPreferences]);

  // تطبيق Theme من التفضيلات إذا كانت موجودة
  useEffect(() => {
    if (preferences?.theme) {
      setThemeState(preferences.theme as Theme);
    }
  }, [preferences?.theme]);

  // تطبيق Theme على document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      // استخدام تفضيل النظام
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemPrefersDark);
      root.classList.remove('light');
    } else {
      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('light', theme === 'light');
    }
    
    // حفظ في localStorage (للتوافق مع الأنظمة القديمة)
    localStorage.setItem('ide-theme', theme === 'auto' ? 'dark' : theme);
  }, [theme]);

  // تحديث التفضيلات عند تغيير Theme
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    // تحديث التفضيلات في Store
    if (preferences) {
      await useUserPersonalizationStore.getState().updatePreferences({ theme: newTheme });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'auto' : 'dark';
    setTheme(newTheme);
  };

  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const isLight = !isDark;

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark,
    isLight,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeProvider = ThemeProviderComponent;

