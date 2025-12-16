import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const SecuritySettings: React.FC = () => {
  const { showSuccess } = useErrorHandler();
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const handleSave = async () => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    showSuccess('تم الحفظ', 'تم حفظ إعدادات الأمان بنجاح');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-ide-accent" />
          إعدادات الأمان
        </h2>
        <div className="space-y-4">
          <Checkbox
            label="تفعيل المصادقة الثنائية (2FA)"
            checked={twoFactor}
            onChange={(e) => setTwoFactor(e.target.checked)}
          />
          <Input
            label="انتهاء الجلسة (دقيقة)"
            type="number"
            value={sessionTimeout.toString()}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
            leftIcon={<Lock className="w-4 h-4" />}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>حفظ</Button>
      </div>
    </div>
  );
};

export default SecuritySettings;

