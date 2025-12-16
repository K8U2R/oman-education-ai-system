/**
 * Export/Import Component
 * مكون تصدير واستيراد التفضيلات
 */

import React, { useRef } from 'react';
import { Download, Upload, FileJson } from 'lucide-react';
import { useUserPersonalizationStore } from '@/store/user-personalization-store';
import { downloadPersonalization, readPersonalizationFile } from '../utils/exportImport';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useToast } from '../hooks/useToastContext';
import { trackExport, trackImport } from '../utils/analytics';
import Button from '@/components/ui/Button';

export const ExportImport: React.FC = () => {
  const { preferences, settings, profile } = useUserPersonalizationStore();
  const { handleError } = useErrorHandler();
  const { showSuccess, showError } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!preferences || !settings || !profile) {
      showError('لا توجد بيانات للتصدير');
      return;
    }

    try {
      downloadPersonalization(preferences, settings, profile);
      trackExport();
      showSuccess('تم تصدير التفضيلات بنجاح');
    } catch (error) {
      trackExport(); // Track failed export
      showError('فشل تصدير التفضيلات');
      handleError(error, 'فشل تصدير التفضيلات');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readPersonalizationFile(file);
      
      // تحديث البيانات
      if (data.preferences) {
        await useUserPersonalizationStore.getState().updatePreferences(data.preferences);
      }
      if (data.settings) {
        await useUserPersonalizationStore.getState().updateSettings(data.settings);
      }
      if (data.profile) {
        await useUserPersonalizationStore.getState().updateProfile(data.profile);
      }

      trackImport(true);
      showSuccess('تم استيراد التفضيلات بنجاح');
    } catch (error) {
      trackImport(false);
      showError('فشل استيراد التفضيلات');
      handleError(error, 'فشل استيراد التفضيلات');
    } finally {
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-ide-surface border border-ide-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileJson className="w-5 h-5 text-ide-accent" />
        <h3 className="text-lg font-semibold text-ide-text">تصدير واستيراد التفضيلات</h3>
      </div>
      <p className="text-sm text-ide-text-secondary mb-4">
        يمكنك تصدير تفضيلاتك وإعداداتك وملفك الشخصي كملف JSON واستيرادها لاحقاً
      </p>
      <div className="flex gap-3">
        <Button
          onClick={handleExport}
          disabled={!preferences || !settings || !profile}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          تصدير
        </Button>
        <Button
          onClick={handleImportClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          استيراد
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>
    </div>
  );
};

