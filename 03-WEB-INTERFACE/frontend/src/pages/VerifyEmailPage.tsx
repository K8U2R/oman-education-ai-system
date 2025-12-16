import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import { authService } from '@/services/auth/auth-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import Button from '@/components/ui/Button';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { handleError, showSuccess } = useErrorHandler();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('رمز التحقق غير موجود');
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        showSuccess('تم التحقق', 'تم التحقق من بريدك الإلكتروني بنجاح');
      } catch (err) {
        setStatus('error');
        const errorMessage = err instanceof Error ? err.message : 'فشل التحقق من البريد';
        setError(errorMessage);
        handleError(err, 'خطأ في التحقق');
      }
    };

    verify();
  }, [token, handleError, showSuccess]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-ide-bg flex items-center justify-center p-4 w-full overflow-y-auto">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ide-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">جاري التحقق من البريد...</h1>
          <p className="text-ide-text-secondary">يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-ide-bg flex items-center justify-center p-4 w-full overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-ide-surface border border-ide-border rounded-lg p-8 shadow-xl text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">تم التحقق بنجاح</h1>
            <p className="text-ide-text-secondary mb-6">
              تم التحقق من بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.
            </p>
            <Link to="/login">
              <Button className="w-full">تسجيل الدخول</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ide-bg flex items-center justify-center p-4 w-full overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="bg-ide-surface border border-ide-border rounded-lg p-8 shadow-xl text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">فشل التحقق</h1>
          <p className="text-ide-text-secondary mb-6">{error}</p>
          <div className="space-y-2">
            <Link to="/login">
              <Button variant="secondary" className="w-full">العودة إلى تسجيل الدخول</Button>
            </Link>
            <Link to="/forgot-password">
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4" />
                إعادة إرسال رابط التحقق
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

