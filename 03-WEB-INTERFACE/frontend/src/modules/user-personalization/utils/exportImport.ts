/**
 * Export/Import Utilities
 * أدوات تصدير واستيراد التفضيلات
 */

import { UserPreferences, UserSettings, UserProfile } from '@/services/user/user-personalization-service';
import { autoMigrate } from './migration';

export interface PersonalizationData {
  preferences: UserPreferences;
  settings: UserSettings;
  profile: UserProfile;
  exportedAt: string;
  version: string;
}

const CURRENT_VERSION = '1.0.0';

/**
 * تصدير التفضيلات والإعدادات والملف الشخصي
 */
export const exportPersonalization = (
  preferences: UserPreferences,
  settings: UserSettings,
  profile: UserProfile
): string => {
  const data: PersonalizationData = {
    preferences,
    settings,
    profile,
    exportedAt: new Date().toISOString(),
    version: CURRENT_VERSION,
  };

  return JSON.stringify(data, null, 2);
};

/**
 * استيراد التفضيلات والإعدادات والملف الشخصي
 */
export const importPersonalization = (jsonString: string): PersonalizationData => {
  try {
    const data = JSON.parse(jsonString) as PersonalizationData;

    // التحقق من البنية
    if (!data.preferences || !data.settings || !data.profile) {
      throw new Error('البيانات المستوردة غير صحيحة');
    }

    // ترحيل تلقائي إذا لزم الأمر
    const migrationResult = autoMigrate(data);
    if (!migrationResult.success) {
      throw new Error(`فشل الترحيل: ${migrationResult.errors?.join(', ')}`);
    }

    return migrationResult.data || data;
  } catch (error) {
    throw new Error(`فشل استيراد البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
  }
};

/**
 * تحميل التفضيلات كملف JSON
 */
export const downloadPersonalization = (
  preferences: UserPreferences,
  settings: UserSettings,
  profile: UserProfile
): void => {
  const data = exportPersonalization(preferences, settings, profile);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `personalization-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * قراءة ملف JSON من input file
 */
export const readPersonalizationFile = (file: File): Promise<PersonalizationData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = importPersonalization(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('فشل قراءة الملف'));
    reader.readAsText(file);
  });
};

