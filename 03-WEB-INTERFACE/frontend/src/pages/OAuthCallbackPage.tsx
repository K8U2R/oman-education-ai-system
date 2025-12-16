import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '@/services/auth/auth-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';

const OAuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleError, showSuccess } = useErrorHandler();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const provider = window.location.pathname.includes('google') ? 'google' : 'github';

      if (error) {
        setStatus('error');
        setErrorMessage(error === 'access_denied' ? 'تم رفض الوصول' : 'حدث خطأ أثناء تسجيل الدخول');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('لم يتم استلام رمز المصادقة');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        if (provider === 'google') {
          await authService.handleGoogleOAuthCallback(code, state || undefined);
        } else {
          await authService.handleGitHubOAuthCallback(code, state || undefined);
        }

        setStatus('success');
        showSuccess('تم تسجيل الدخول', `تم تسجيل الدخول بنجاح باستخدام ${provider === 'google' ? 'Google' : 'GitHub'}`);
        
        setTimeout(() => {
          navigate('/chat');
        }, 1500);
      } catch (err) {
        setStatus('error');
        const errorMsg = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
        setErrorMessage(errorMsg);
        handleError(err, 'خطأ في تسجيل الدخول');
        
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, handleError, showSuccess]);

  return (
    <div className="min-h-screen bg-ide-bg flex items-center justify-center p-4">
      <div className="bg-ide-surface border border-ide-border rounded-lg p-8 shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center justify-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-ide-accent animate-spin" />
              <h2 className="text-xl font-semibold text-ide-text">جاري تسجيل الدخول...</h2>
              <p className="text-ide-text-secondary text-sm">يرجى الانتظار</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500" />
              <h2 className="text-xl font-semibold text-ide-text">تم تسجيل الدخول بنجاح!</h2>
              <p className="text-ide-text-secondary text-sm">سيتم توجيهك الآن...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-500" />
              <h2 className="text-xl font-semibold text-ide-text">فشل تسجيل الدخول</h2>
              <p className="text-ide-text-secondary text-sm">{errorMessage}</p>
              <p className="text-ide-text-secondary text-xs">سيتم توجيهك إلى صفحة تسجيل الدخول...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;

