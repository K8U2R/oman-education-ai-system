import React, { useState, useEffect } from 'react';
import { Save, User, MapPin, Briefcase, Award, Plus, X, AlertCircle } from 'lucide-react';
import { UserProfile as UserProfileType } from '@/services/user/user-personalization-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useUserPersonalizationStore } from '@/store/user-personalization-store';
import { validateProfile } from '../utils/validation';
import { useKeyboardShortcuts, createShortcut } from '../hooks/useKeyboardShortcuts';
import { useAccessibility } from '../hooks/useAccessibility';
import { trackProfileUpdate } from '../utils/analytics';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const UserProfile: React.FC = () => {
  const { handleError, showSuccess } = useErrorHandler();
  const { profile, isLoading, loadProfile, updateProfile } = useUserPersonalizationStore();
  const [localProfile, setLocalProfile] = useState<UserProfileType | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) {
      loadProfile();
    } else {
      setLocalProfile(profile);
    }
  }, [profile, loadProfile]);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    if (!localProfile) return;

    // التحقق من صحة البيانات
    const validation = validateProfile(localProfile);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      handleError(new Error(validation.errors.join(', ')), 'يرجى تصحيح الأخطاء');
      return;
    }

    setValidationErrors([]);

    try {
      setSaving(true);
      await updateProfile(localProfile);
      showSuccess('تم الحفظ', 'تم حفظ الملف الشخصي بنجاح');
    } catch (error) {
      handleError(error, 'فشل حفظ الملف الشخصي');
    } finally {
      setSaving(false);
    }
  };

  const { announce } = useAccessibility({ enableScreenReader: true });

  const updateProfileField = (key: keyof UserProfileType, value: unknown) => {
    if (!localProfile) return;
    setLocalProfile({ ...localProfile, [key]: value });
    setHasChanges(true);
    
    // Track update
    trackProfileUpdate([key]);
    
    // Announce to screen reader
    announce(`تم تحديث ${key}`);
  };

  // Reset hasChanges after save
  useEffect(() => {
    if (!saving && hasChanges) {
      setHasChanges(false);
    }
  }, [saving, hasChanges]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    createShortcut('s', handleSave, { ctrl: true, description: 'حفظ الملف الشخصي (Ctrl+S)' }),
  ]);

  const addSkill = () => {
    if (!localProfile) return;
    const skill = prompt('أدخل المهارة:');
    if (skill && !localProfile.skills.includes(skill)) {
      setLocalProfile({ ...localProfile, skills: [...localProfile.skills, skill] });
    }
  };

  const removeSkill = (index: number) => {
    if (!localProfile) return;
    setLocalProfile({
      ...localProfile,
      skills: localProfile.skills.filter((_, i) => i !== index)
    });
  };

  const addInterest = () => {
    if (!localProfile) return;
    const interest = prompt('أدخل الاهتمام:');
    if (interest && !localProfile.interests.includes(interest)) {
      setLocalProfile({ ...localProfile, interests: [...localProfile.interests, interest] });
    }
  };

  const removeInterest = (index: number) => {
    if (!localProfile) return;
    setLocalProfile({
      ...localProfile,
      interests: localProfile.interests.filter((_, i) => i !== index)
    });
  };

  if (isLoading || !localProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-ide-accent border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-ide-text-secondary">جاري التحميل...</span>
      </div>
    );
  }

  if (!localProfile) {
    return (
      <div className="text-center p-8 text-ide-text-secondary">
        لا يوجد ملف شخصي متاح
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ide-text">الملف الشخصي</h2>
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
            {saving ? 'جاري الحفظ...' : 'حفظ الملف الشخصي'}
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

      {/* المعلومات الأساسية */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold text-ide-text">المعلومات الأساسية</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
              الاسم المعروض
            </label>
            <Input
              value={localProfile.display_name}
              onChange={(e) => updateProfileField('display_name', e.target.value)}
              placeholder="أدخل الاسم المعروض"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
              السيرة الذاتية
            </label>
            <textarea
              value={localProfile.bio}
              onChange={(e) => updateProfileField('bio', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-ide-bg border border-ide-border rounded-md text-ide-text resize-none"
              placeholder="اكتب سيرتك الذاتية..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
                رابط الصورة الشخصية
              </label>
              <Input
                value={localProfile.avatar_url || ''}
                onChange={(e) => updateProfileField('avatar_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
                رابط صورة الغلاف
              </label>
              <Input
                value={localProfile.cover_image_url || ''}
                onChange={(e) => updateProfileField('cover_image_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* الموقع والموقع الإلكتروني */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-ide-accent" />
          <h3 className="text-lg font-semibold text-ide-text">الموقع والروابط</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
                الموقع
              </label>
              <Input
                value={localProfile.location || ''}
                onChange={(e) => updateProfileField('location', e.target.value)}
                placeholder="المدينة، الدولة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-ide-text-secondary">
                الموقع الإلكتروني
              </label>
              <Input
                value={localProfile.website || ''}
                onChange={(e) => updateProfileField('website', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* المهارات */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-ide-accent" />
            <h3 className="text-lg font-semibold text-ide-text">المهارات</h3>
          </div>
          <Button
            onClick={addSkill}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة مهارة
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {localProfile.skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-ide-accent/20 text-ide-accent rounded-full"
            >
              <span>{skill}</span>
              <button
                onClick={() => removeSkill(index)}
                className="hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* الاهتمامات */}
      <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-ide-accent" />
            <h3 className="text-lg font-semibold text-ide-text">الاهتمامات</h3>
          </div>
          <Button
            onClick={addInterest}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة اهتمام
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {localProfile.interests.map((interest, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-ide-accent/20 text-ide-accent rounded-full"
            >
              <span>{interest}</span>
              <button
                onClick={() => removeInterest(index)}
                className="hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

