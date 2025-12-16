/**
 * Analytics Utilities
 * أدوات التحليلات والتتبع
 */

import type { AnyObject } from '../types/common';

interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: AnyObject;
}

/**
 * تتبع حدث تحليلي
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  // In production, integrate with analytics service (Google Analytics, Mixpanel, etc.)
  if (import.meta.env.DEV) {
    console.log('[Analytics]', event);
  }

  // Example: Google Analytics
  interface WindowWithGtag extends Window {
    gtag?: (command: string, action: string, params?: AnyObject) => void;
  }
  const windowWithGtag = window as unknown as WindowWithGtag;
  if (typeof window !== 'undefined' && windowWithGtag.gtag) {
    windowWithGtag.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.properties,
    });
  }

  // Example: Custom analytics endpoint
  if (import.meta.env.PROD) {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }).catch((error) => {
      console.error('Failed to track event:', error);
    });
  }
};

/**
 * تتبع تغيير التفضيلات
 */
export const trackPreferenceChange = (
  preference: string,
  oldValue: unknown,
  newValue: unknown
): void => {
  trackEvent({
    name: 'preference_changed',
    category: 'User Preferences',
    action: 'change',
    label: preference,
    properties: {
      old_value: oldValue,
      new_value: newValue,
    },
  });
};

/**
 * تتبع تغيير الإعدادات
 */
export const trackSettingChange = (
  setting: string,
  oldValue: unknown,
  newValue: unknown
): void => {
  trackEvent({
    name: 'setting_changed',
    category: 'User Settings',
    action: 'change',
    label: setting,
    properties: {
      old_value: oldValue,
      new_value: newValue,
    },
  });
};

/**
 * تتبع تحديث الملف الشخصي
 */
export const trackProfileUpdate = (fields: string[]): void => {
  trackEvent({
    name: 'profile_updated',
    category: 'User Profile',
    action: 'update',
    label: fields.join(', '),
    properties: {
      updated_fields: fields,
    },
  });
};

/**
 * تتبع تصدير التفضيلات
 */
export const trackExport = (): void => {
  trackEvent({
    name: 'preferences_exported',
    category: 'Export/Import',
    action: 'export',
  });
};

/**
 * تتبع استيراد التفضيلات
 */
export const trackImport = (success: boolean): void => {
  trackEvent({
    name: 'preferences_imported',
    category: 'Export/Import',
    action: 'import',
    properties: {
      success,
    },
  });
};

/**
 * تتبع استخدام Keyboard Shortcuts
 */
export const trackKeyboardShortcut = (shortcut: string): void => {
  trackEvent({
    name: 'keyboard_shortcut_used',
    category: 'Keyboard',
    action: 'shortcut',
    label: shortcut,
  });
};

