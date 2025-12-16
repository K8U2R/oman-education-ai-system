import React, { useState } from 'react';
import { Shield, Key } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const TwoFactorAuth: React.FC = () => {
  const { showSuccess } = useErrorHandler();
  const [code, setCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const handleEnable = async () => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setQrCode('data:image/png;base64,...'); // Mock QR code
    setIsEnabled(true);
    showSuccess('تم التفعيل', 'تم تفعيل المصادقة الثنائية');
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;

    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showSuccess('تم التحقق', 'تم التحقق من الكود بنجاح');
    setCode('');
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-ide-accent" />
        <h3 className="text-lg font-semibold">المصادقة الثنائية (2FA)</h3>
      </div>

      {!isEnabled ? (
        <div className="space-y-4">
          <p className="text-sm text-ide-text-secondary">
            قم بتمكين المصادقة الثنائية لحماية حسابك بشكل أفضل
          </p>
          <Button onClick={handleEnable}>
            <Key className="w-4 h-4" />
            تفعيل 2FA
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {qrCode && (
            <div className="text-center">
              <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
              <p className="text-sm text-ide-text-secondary">
                امسح رمز QR باستخدام تطبيق المصادقة
              </p>
            </div>
          )}
          <Input
            label="كود التحقق"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            leftIcon={<Key className="w-4 h-4" />}
          />
          <Button onClick={handleVerify} disabled={code.length !== 6}>
            التحقق
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TwoFactorAuth;

