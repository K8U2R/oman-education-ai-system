/**
 * Migration Utilities
 * أدوات الترحيل للبيانات
 */

import { PersonalizationData } from './exportImport';

interface MigrationResult {
  success: boolean;
  data?: PersonalizationData;
  errors?: string[];
}

/**
 * ترحيل البيانات من إصدار قديم إلى إصدار جديد
 */
export const migratePersonalizationData = (
  data: PersonalizationData,
  fromVersion: string,
  toVersion: string
): MigrationResult => {
  const errors: string[] = [];

  try {
    // Migration from 1.0.0 to 1.1.0
    if (fromVersion === '1.0.0' && toVersion === '1.1.0') {
      // Add new fields if missing
      if (!data.preferences.custom_colors) {
        data.preferences.custom_colors = {};
      }
      if (!data.settings.font_family) {
        data.settings.font_family = 'Consolas, monospace';
      }
    }

    // Migration from 1.1.0 to 1.2.0
    if (fromVersion === '1.1.0' && toVersion === '1.2.0') {
      // Add new settings if missing
      if (!data.settings.minimap_enabled) {
        data.settings.minimap_enabled = true;
      }
    }

    // Update version
    data.version = toVersion;

    return {
      success: true,
      data,
    };
  } catch (error) {
    errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      success: false,
      errors,
    };
  }
};

/**
 * التحقق من إصدار البيانات
 */
export const checkDataVersion = (data: PersonalizationData): {
  current: string;
  latest: string;
  needsMigration: boolean;
} => {
  const currentVersion = data.version || '1.0.0';
  const latestVersion = '1.0.0'; // Current latest version

  return {
    current: currentVersion,
    latest: latestVersion,
    needsMigration: currentVersion !== latestVersion,
  };
};

/**
 * ترحيل تلقائي للبيانات
 */
export const autoMigrate = (data: PersonalizationData): MigrationResult => {
  const versionCheck = checkDataVersion(data);

  if (!versionCheck.needsMigration) {
    return {
      success: true,
      data,
    };
  }

  return migratePersonalizationData(
    data,
    versionCheck.current,
    versionCheck.latest
  );
};

