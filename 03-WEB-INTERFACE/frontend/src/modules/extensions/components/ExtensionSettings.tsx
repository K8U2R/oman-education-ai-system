import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { apiClient } from '@/services/api/api-client';

interface ExtensionSettingsProps {
  extensionId: string;
  settings: Record<string, unknown>;
  onSave?: (settings: Record<string, unknown>) => void;
}

const ExtensionSettings: React.FC<ExtensionSettingsProps> = ({
  extensionId,
  settings,
  onSave,
}) => {
  const { showSuccess } = useErrorHandler();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = await apiClient.put<Record<string, unknown>>(
        `/extensions/${extensionId}/settings`,
        localSettings
      );
      
      if (onSave) {
        onSave(updatedSettings);
      }
      showSuccess('تم الحفظ', 'تم حفظ إعدادات الإضافة بنجاح');
    } catch (error) {
      // Error handling is done by useErrorHandler in the component
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-ide-accent" />
        <h2 className="text-lg font-semibold">إعدادات الإضافة</h2>
      </div>
      <div className="space-y-4">
        {Object.entries(localSettings).map(([key, value]) => (
          <div key={key}>
            {typeof value === 'boolean' ? (
              <Checkbox
                label={key}
                checked={value as boolean}
                onChange={(checked) =>
                  setLocalSettings({ ...localSettings, [key]: checked })
                }
              />
            ) : typeof value === 'string' ? (
              <Input
                label={key}
                value={value as string}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, [key]: e.target.value })
                }
              />
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">{key}</label>
                <pre className="text-xs bg-ide-bg p-2 rounded border border-ide-border">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-end">
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save className="w-4 h-4" />
            حفظ
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ExtensionSettings;

