/**
 * Basic Usage Examples
 * أمثلة الاستخدام الأساسية
 */

import React from 'react';
import { 
  UserPreferencesWrapper, 
  UserSettingsWrapper, 
  UserProfileWrapper,
  UserDashboardWrapper 
} from '../index';
import { useUserPersonalization } from '../hooks/useUserPersonalization';
import { useToast } from '../hooks/useToastContext';
import { useAccessibility } from '../hooks/useAccessibility';
import { useCache } from '../hooks/useCache';
import { userPersonalizationService } from '@/services/user/user-personalization-service';

/**
 * Example 1: Basic Component Usage
 */
export const BasicComponentExample: React.FC = () => {
  return (
    <div className="space-y-4">
      <UserPreferencesWrapper />
      <UserSettingsWrapper />
      <UserProfileWrapper />
    </div>
  );
};

/**
 * Example 2: Using Personalization Hook
 */
export const HookUsageExample: React.FC = () => {
  const { preferences, updatePreferences } = useUserPersonalization();
  const { showSuccess } = useToast();

  const handleThemeChange = async () => {
    if (preferences) {
      await updatePreferences({
        ...preferences,
        theme: preferences.theme === 'dark' ? 'light' : 'dark',
      });
      showSuccess('تم تغيير الثيم بنجاح');
    }
  };

  return (
    <button onClick={handleThemeChange}>
      تبديل الثيم
    </button>
  );
};

/**
 * Example 3: Using Accessibility Hook
 */
export const AccessibilityExample: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { announce } = useAccessibility({
    enableKeyboardNavigation: true,
    enableScreenReader: true,
    containerRef,
  });

  const handleAction = () => {
    announce('تم تنفيذ الإجراء بنجاح', 'polite');
  };

  return (
    <div ref={containerRef}>
      <button onClick={handleAction}>تنفيذ الإجراء</button>
    </div>
  );
};

/**
 * Example 4: Using Cache Hook
 */
export const CacheExample: React.FC = () => {
  const { data, isLoading, refresh } = useCache({
    key: 'user-preferences',
    fetcher: () => userPersonalizationService.getPreferences(),
    duration: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={refresh}>تحديث</button>
    </div>
  );
};

/**
 * Example 5: Complete Dashboard
 */
export const CompleteDashboardExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-ide-bg">
      <UserDashboardWrapper />
    </div>
  );
};

