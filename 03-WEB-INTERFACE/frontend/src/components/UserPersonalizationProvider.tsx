/**
 * User Personalization Provider
 * Provider لتطبيق التخصيص الشخصي تلقائياً
 */

import React, { useEffect } from 'react';
import { useUserPersonalizationStore } from '@/store/user-personalization-store';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/modules/user-personalization/hooks/useTheme';
import { useLayout } from '@/modules/user-personalization/hooks/useLayout';
import { applyPreferences } from '@/modules/user-personalization/utils/applyPreferences';

interface UserPersonalizationProviderProps {
  children: React.ReactNode;
}

export const UserPersonalizationProvider: React.FC<UserPersonalizationProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { loadAll } = useUserPersonalizationStore();
  
  const { preferences } = useUserPersonalizationStore();
  
  // تطبيق Theme و Layout
  useTheme();
  useLayout();

  // تحميل التفضيلات عند تسجيل الدخول
  useEffect(() => {
    if (isAuthenticated && user) {
      // تحميل التفضيلات بشكل آمن (لا يمنع التطبيق من العمل إذا فشل)
      loadAll().catch((error) => {
        console.warn('Failed to load user personalization data:', error);
        // التطبيق يستمر في العمل حتى لو فشل تحميل التفضيلات
      });
    }
  }, [isAuthenticated, user, loadAll]);

  // تطبيق التفضيلات تلقائياً عند تغييرها
  useEffect(() => {
    if (preferences) {
      applyPreferences(preferences);
    }
  }, [preferences]);

  return <>{children}</>;
};

