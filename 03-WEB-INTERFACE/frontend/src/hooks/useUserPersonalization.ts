/**
 * useUserPersonalization Hook
 * Hook لإدارة التخصيص الشخصي للمستخدم
 */

import { useState, useEffect, useCallback } from 'react';
import { userPersonalizationService, UserPreferences, UserSettings, UserProfile } from '@/services/user/user-personalization-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface UseUserPersonalizationReturn {
  preferences: UserPreferences | null;
  settings: UserSettings | null;
  profile: UserProfile | null;
  loading: boolean;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  updateSettings: (sett: Partial<UserSettings>) => Promise<void>;
  updateProfile: (prof: Partial<UserProfile>) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useUserPersonalization = (): UseUserPersonalizationReturn => {
  const { handleError, showSuccess } = useErrorHandler();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [prefs, sett, prof] = await Promise.all([
        userPersonalizationService.getPreferences().catch(() => null),
        userPersonalizationService.getSettings().catch(() => null),
        userPersonalizationService.getProfile().catch(() => null),
      ]);
      setPreferences(prefs);
      setSettings(sett);
      setProfile(prof);
    } catch (error) {
      handleError(error, 'فشل تحميل بيانات التخصيص الشخصي');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updatePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    try {
      const updated = await userPersonalizationService.updatePreferences(prefs);
      setPreferences(updated);
      showSuccess('تم التحديث', 'تم تحديث التفضيلات بنجاح');
    } catch (error) {
      handleError(error, 'فشل تحديث التفضيلات');
      throw error;
    }
  }, [handleError, showSuccess]);

  const updateSettings = useCallback(async (sett: Partial<UserSettings>) => {
    try {
      const updated = await userPersonalizationService.updateSettings(sett);
      setSettings(updated);
      showSuccess('تم التحديث', 'تم تحديث الإعدادات بنجاح');
    } catch (error) {
      handleError(error, 'فشل تحديث الإعدادات');
      throw error;
    }
  }, [handleError, showSuccess]);

  const updateProfile = useCallback(async (prof: Partial<UserProfile>) => {
    try {
      const updated = await userPersonalizationService.updateProfile(prof);
      setProfile(updated);
      showSuccess('تم التحديث', 'تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      handleError(error, 'فشل تحديث الملف الشخصي');
      throw error;
    }
  }, [handleError, showSuccess]);

  return {
    preferences,
    settings,
    profile,
    loading,
    updatePreferences,
    updateSettings,
    updateProfile,
    refresh: loadData,
  };
};

