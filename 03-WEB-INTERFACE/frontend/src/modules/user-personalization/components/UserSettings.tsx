import React, { useState, useEffect } from 'react';
import { Save, Bot, Code, AlertCircle } from 'lucide-react';
import { UserSettings as UserSettingsType } from '@/services/user/user-personalization-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useUserPersonalizationStore } from '@/store/user-personalization-store';
import { validateSettings } from '../utils/validation';
import { useKeyboardShortcuts, createShortcut } from '../hooks/useKeyboardShortcuts';
import { useAccessibility } from '../hooks/useAccessibility';
import { trackSettingChange } from '../utils/analytics';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const UserSettings: React.FC = () => {
  const { handleError, showSuccess } = useErrorHandler();
  const { settings, isLoading, loadSettings, updateSettings } = useUserPersonalizationStore();
  const [localSettings, setLocalSettings] = useState<UserSettingsType | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) {
      loadSettings();
    } else {
      setLocalSettings(settings);
    }
  }, [settings, loadSettings]);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    if (!localSettings) return;

    // التحقق من صحة البيانات
    const validation = validateSettings(localSettings);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      handleError(new Error(validation.errors.join(', ')), 'يرجى تصحيح الأخطاء');
      return;
    }

    setValidationErrors([]);

    try {
      setSaving(true);
      await updateSettings(localSettings);
      showSuccess('تم الحفظ', 'تم حفظ الإعدادات بنجاح');
    } catch (error) {
      handleError(error, 'فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const { announce } = useAccessibility({ enableScreenReader: true });

  const updateSetting = (key: keyof UserSettingsType, value: unknown) => {
    if (!localSettings) return;
    const oldValue = localSettings[key];
    setLocalSettings({ ...localSettings, [key]: value });
    setHasChanges(true);
    
    // Track change
    trackSettingChange(key, oldValue, value);
    
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
    createShortcut('s', handleSave, { ctrl: true, description: 'حفظ الإعدادات (Ctrl+S)' }),
  ]);

  if (isLoading || !localSettings) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-ide-accent border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-ide-text-secondary">جاري التحميل...</span>
      </div>
    );
  }

  if (!localSettings) {
    return (
      <div className="text-center p-8 text-ide-text-secondary">
        لا توجد إعدادات متاحة
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ide-text">الإعدادات الشخصية</h2>
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
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
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

      {/* إعدادات AI */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold text-ide-text">إعدادات الذكاء الاصطناعي</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
              نموذج AI المفضل
            </label>
            <select
              value={localSettings.ai_model_preference}
              onChange={(e) => updateSetting('ai_model_preference', e.target.value)}
              className="w-full px-4 py-2 bg-ide-bg border border-ide-border rounded-md text-ide-text"
            >
              <option value="gemini-pro">Gemini Pro</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3">Claude 3</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
                Temperature (0.0 - 1.0)
              </label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={localSettings.ai_temperature}
                onChange={(e) => updateSetting('ai_temperature', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
                Max Tokens
              </label>
              <Input
                type="number"
                min="100"
                max="4000"
                step="100"
                value={localSettings.ai_max_tokens}
                onChange={(e) => updateSetting('ai_max_tokens', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* إعدادات محرر الكود */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold text-ide-text">إعدادات محرر الكود</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
                ثيم الكود
              </label>
              <select
                value={localSettings.code_theme}
                onChange={(e) => updateSetting('code_theme', e.target.value)}
                className="w-full px-4 py-2 bg-ide-bg border border-ide-border rounded-md text-ide-text"
              >
                <option value="vs-dark">Dark</option>
                <option value="vs-light">Light</option>
                <option value="hc-black">High Contrast Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
                حجم الخط
              </label>
              <Input
                type="number"
                min="10"
                max="24"
                value={localSettings.font_size}
                onChange={(e) => updateSetting('font_size', parseInt(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
              نوع الخط
            </label>
            <Input
              value={localSettings.font_family}
              onChange={(e) => updateSetting('font_family', e.target.value)}
              placeholder="Consolas, monospace"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
                حجم Tab
              </label>
              <Input
                type="number"
                min="1"
                max="8"
                value={localSettings.tab_size}
                onChange={(e) => updateSetting('tab_size', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
                Auto Save Interval (seconds)
              </label>
              <Input
                type="number"
                min="10"
                max="300"
                value={localSettings.auto_save_interval}
                onChange={(e) => updateSetting('auto_save_interval', parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.word_wrap}
                onChange={(e) => updateSetting('word_wrap', e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="text-ide-text">تفعيل Word Wrap</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.line_numbers}
                onChange={(e) => updateSetting('line_numbers', e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="text-ide-text">إظهار أرقام الأسطر</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.minimap_enabled}
                onChange={(e) => updateSetting('minimap_enabled', e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="text-ide-text">تفعيل Minimap</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.auto_save_enabled}
                onChange={(e) => updateSetting('auto_save_enabled', e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="text-ide-text">تفعيل Auto Save</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;

