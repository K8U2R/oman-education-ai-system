import React, { useState, useEffect } from 'react';
import { Save, Palette, Globe, Bell, Volume2, AlertCircle } from 'lucide-react';
import { UserPreferences as UserPreferencesType } from '@/services/user/user-personalization-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useUserPersonalizationStore } from '@/store/user-personalization-store';
import { useTheme } from '@/core/theme/useTheme';
import { validatePreferences } from '../utils/validation';
import { useKeyboardShortcuts, createShortcut } from '../hooks/useKeyboardShortcuts';
import { useAccessibility } from '../hooks/useAccessibility';
import { trackPreferenceChange } from '../utils/analytics';
import { ExportImport } from './ExportImport';
import Button from '@/components/ui/Button';

const UserPreferences: React.FC = () => {
  const { handleError, showSuccess } = useErrorHandler();
  const { preferences, isLoading, loadPreferences, updatePreferences } = useUserPersonalizationStore();
  const { setTheme } = useTheme();
  const [localPreferences, setLocalPreferences] = useState<UserPreferencesType | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!preferences) {
      loadPreferences();
    } else {
      setLocalPreferences(preferences);
    }
  }, [preferences, loadPreferences]);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    if (!localPreferences) return;

    // التحقق من صحة البيانات
    const validation = validatePreferences(localPreferences);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      handleError(new Error(validation.errors.join(', ')), 'يرجى تصحيح الأخطاء');
      return;
    }

    setValidationErrors([]);

    try {
      setSaving(true);
      await updatePreferences(localPreferences);
      // تطبيق Theme فوراً
      if (localPreferences.theme) {
        setTheme(localPreferences.theme as 'dark' | 'light' | 'auto');
      }
      showSuccess('تم الحفظ', 'تم حفظ التفضيلات بنجاح');
    } catch (error) {
      handleError(error, 'فشل حفظ التفضيلات');
    } finally {
      setSaving(false);
    }
  };

  const { announce } = useAccessibility({ enableScreenReader: true });

  const updatePreference = (key: keyof UserPreferencesType, value: unknown) => {
    if (!localPreferences) return;
    const oldValue = localPreferences[key];
    setLocalPreferences({ ...localPreferences, [key]: value });
    setHasChanges(true);
    
    // Track change
    trackPreferenceChange(key, oldValue, value);
    
    // Announce to screen reader
    announce(`تم تغيير ${key} إلى ${value}`);
  };

  // Reset hasChanges after save
  useEffect(() => {
    if (!saving && hasChanges) {
      setHasChanges(false);
    }
  }, [saving, hasChanges]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    createShortcut('s', handleSave, { ctrl: true, description: 'حفظ التفضيلات (Ctrl+S)' }),
  ]);

  if (isLoading || !localPreferences) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-ide-accent border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-ide-text-secondary">جاري التحميل...</span>
      </div>
    );
  }

  if (!localPreferences) {
    return (
      <div className="text-center p-8 text-ide-text-secondary">
        لا توجد تفضيلات متاحة
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ide-text">التفضيلات الشخصية</h2>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-ide-text-secondary">* لديك تغييرات غير محفوظة</span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ التفضيلات'}
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-400 mb-1">أخطاء التحقق:</h3>
              <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* المظهر */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold text-ide-text">المظهر</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
              الثيم
            </label>
            <select
              value={localPreferences.theme}
              onChange={(e) => updatePreference('theme', e.target.value)}
              className="w-full px-4 py-2 bg-ide-bg border border-ide-border rounded-md text-ide-text"
            >
              <option value="light">فاتح</option>
              <option value="dark">داكن</option>
              <option value="auto">تلقائي</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
              التخطيط
            </label>
            <select
              value={localPreferences.layout}
              onChange={(e) => updatePreference('layout', e.target.value)}
              className="w-full px-4 py-2 bg-ide-bg border border-ide-border rounded-md text-ide-text"
            >
              <option value="compact">مضغوط</option>
              <option value="comfortable">مريح</option>
              <option value="spacious">واسع</option>
            </select>
          </div>
        </div>
      </div>

      {/* اللغة والمنطقة */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold text-ide-text">اللغة والمنطقة</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
              اللغة
            </label>
            <select
              value={localPreferences.language}
              onChange={(e) => updatePreference('language', e.target.value)}
              className="w-full px-4 py-2 bg-ide-bg border border-ide-border rounded-md text-ide-text"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
              المنطقة الزمنية
            </label>
            <input
              type="text"
              value={localPreferences.timezone}
              onChange={(e) => updatePreference('timezone', e.target.value)}
              className="w-full px-4 py-2 bg-ide-bg border border-ide-border rounded-md text-ide-text"
            />
          </div>
        </div>
      </div>

      {/* الإشعارات */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold text-ide-text">الإشعارات</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localPreferences.notifications_enabled}
              onChange={(e) => updatePreference('notifications_enabled', e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span className="text-ide-text">تفعيل الإشعارات</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localPreferences.email_notifications}
              onChange={(e) => updatePreference('email_notifications', e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span className="text-ide-text">إشعارات البريد الإلكتروني</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localPreferences.push_notifications}
              onChange={(e) => updatePreference('push_notifications', e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span className="text-ide-text">إشعارات الدفع</span>
          </label>
        </div>
      </div>

      {/* الصوت والحركة */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold text-ide-text">الصوت والحركة</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localPreferences.sound_enabled}
              onChange={(e) => updatePreference('sound_enabled', e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span className="text-ide-text">تفعيل الصوت</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localPreferences.animations_enabled}
              onChange={(e) => updatePreference('animations_enabled', e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span className="text-ide-text">تفعيل الحركات</span>
          </label>
        </div>
      </div>

      {/* Export/Import */}
      <div className="mt-6">
        <ExportImport />
      </div>
    </div>
  );
};

export default UserPreferences;

