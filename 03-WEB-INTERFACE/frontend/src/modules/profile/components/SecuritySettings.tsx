import React, { useState } from 'react';
import { Lock, Key, Shield } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { apiClient } from '@/services/api/api-client';
import { API_ENDPOINTS } from '@/services/api/endpoints';

const SecuritySettings: React.FC = () => {
  const { showSuccess } = useErrorHandler();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return;
    }

    if (newPassword.length < 8) {
      return;
    }

    setIsChanging(true);
    try {
      await apiClient.post(
        API_ENDPOINTS.user.changePassword,
        {
          currentPassword,
          newPassword,
        }
      );
      showSuccess('تم التغيير', 'تم تغيير كلمة المرور بنجاح');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Error handling is done by useErrorHandler in the component
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          تغيير كلمة المرور
        </h3>
        <div className="space-y-4">
          <Input
            label="كلمة المرور الحالية"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="كلمة المرور الجديدة"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="تأكيد كلمة المرور الجديدة"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button onClick={handleChangePassword} isLoading={isChanging}>
            تغيير كلمة المرور
          </Button>
        </div>
      </div>

      <div className="border-t border-ide-border pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          مفاتيح API
        </h3>
        <p className="text-sm text-ide-text-secondary mb-4">
          استخدم مفاتيح API للوصول إلى FlowForge API من التطبيقات الخارجية
        </p>
        <Button variant="outline">
          إنشاء مفتاح API جديد
        </Button>
      </div>

      <div className="border-t border-ide-border pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          المصادقة الثنائية (2FA)
        </h3>
        <p className="text-sm text-ide-text-secondary mb-4">
          قم بتمكين المصادقة الثنائية لزيادة أمان حسابك
        </p>
        <Button variant="outline">
          تفعيل 2FA
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;

