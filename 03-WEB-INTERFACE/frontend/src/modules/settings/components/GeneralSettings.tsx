import React, { useState } from 'react';
import { Globe, Languages } from 'lucide-react';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const GeneralSettings: React.FC = () => {
  const { showSuccess } = useErrorHandler();
  const [language, setLanguage] = useState('ar');
  const [timezone, setTimezone] = useState('Asia/Muscat');
  const [notifications, setNotifications] = useState(true);

  const handleSave = async () => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    showSuccess('تم الحفظ', 'تم حفظ الإعدادات العامة بنجاح');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-ide-accent" />
          الإعدادات العامة
        </h2>
        <div className="space-y-4">
          <Select
            label="اللغة"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={[
              { value: 'ar', label: 'العربية' },
              { value: 'en', label: 'English' },
            ]}
            leftIcon={<Languages className="w-4 h-4" />}
          />
          <Select
            label="المنطقة الزمنية"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            options={[
              { value: 'Asia/Muscat', label: 'مسقط (GMT+4)' },
              { value: 'UTC', label: 'UTC' },
            ]}
          />
          <Checkbox
            label="تفعيل الإشعارات"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>حفظ</Button>
      </div>
    </div>
  );
};

export default GeneralSettings;

