/**
 * useLayout Hook
 * Hook لإدارة التخطيط من التفضيلات
 */

import { useEffect } from 'react';
import { useUserPersonalizationStore } from '@/store/user-personalization-store';

export const useLayout = () => {
  const { preferences } = useUserPersonalizationStore();

  useEffect(() => {
    if (!preferences) return;

    const layout = preferences.layout;
    const root = document.documentElement;

    // تطبيق classes للتخطيط
    root.classList.remove('layout-compact', 'layout-comfortable', 'layout-spacious');
    root.classList.add(`layout-${layout}`);
  }, [preferences]);

  return {
    layout: preferences?.layout || 'comfortable',
  };
};

