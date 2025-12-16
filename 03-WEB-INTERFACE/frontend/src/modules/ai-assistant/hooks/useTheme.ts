import { useState, useEffect, useCallback } from 'react';
import { StorageManager } from '../utils/storageManager';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'chat-theme-preference';

/**
 * Hook لإدارة الثيم (Light/Dark Mode)
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // محاولة تحميل الثيم المحفوظ
    const saved = StorageManager.safeGetItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    
    // استخدام تفضيل النظام
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    // الافتراضي: dark
    return 'dark';
  });

  // تطبيق الثيم على document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // حفظ في localStorage
    const result = StorageManager.safeSetItem(THEME_STORAGE_KEY, theme);
    if (!result.success) {
      console.warn('فشل حفظ تفضيل الثيم:', result.error);
    }
  }, [theme]);

  // التبديل بين الثيمات
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // تعيين ثيم محدد
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  // الاستماع لتغييرات تفضيل النظام
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // فقط إذا لم يكن هناك ثيم محفوظ
      const saved = StorageManager.safeGetItem(THEME_STORAGE_KEY);
      if (!saved) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    // المتصفحات الحديثة
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // المتصفحات القديمة
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}

