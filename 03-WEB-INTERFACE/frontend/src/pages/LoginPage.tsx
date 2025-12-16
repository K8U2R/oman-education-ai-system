import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Copy, Check } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { authService } from '@/services/auth/auth-service';
import { useErrorHandler } from '@/hooks/useErrorHandler';

// بيانات الدخول المؤقتة
const DEMO_CREDENTIALS = {
  email: 'demo@flowforge.com',
  password: 'demo123',
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuthStore();
  const { handleError, showSuccess } = useErrorHandler();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'email' | 'password' | null>(null);

  const handleUseDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    showSuccess('تم التعبئة', 'تم ملء بيانات الدخول التجريبية');
  };

  const handleCopy = async (text: string, type: 'email' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      const label = type === 'email' ? 'البريد الإلكتروني' : 'كلمة المرور';
      showSuccess('تم النسخ', `تم نسخ ${label} بنجاح`);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const { url } = await authService.initiateGoogleOAuth();
      // Redirect to Google OAuth
      window.location.href = url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل تسجيل الدخول مع Google';
      setError(errorMessage);
      handleError(err, 'خطأ في تسجيل الدخول مع Google');
    }
  };

  const handleGitHubLogin = async () => {
    setError('');
    try {
      const { url } = await authService.initiateGitHubOAuth();
      // Redirect to GitHub OAuth
      window.location.href = url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل تسجيل الدخول مع GitHub';
      setError(errorMessage);
      handleError(err, 'خطأ في تسجيل الدخول مع GitHub');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      await authService.login({ email, password });
             showSuccess('تم تسجيل الدخول', 'مرحباً بك في FlowForge IDE');
             navigate('/chat');
    } catch (err) {
      // إذا كان الخطأ بسبب عدم توفر الـ backend، استخدم وضع تجريبي
      if (err instanceof Error && (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED'))) {
        // وضع تجريبي: تسجيل دخول محلي
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
          const mockUser = {
            id: 'demo-user-1',
            email: DEMO_CREDENTIALS.email,
            name: 'مستخدم تجريبي',
            role: 'user' as const,
            createdAt: new Date().toISOString(),
          };
          const mockToken = 'demo-token-' + Date.now();
          
          // استخدام store مباشرة
          useAuthStore.setState({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
          
          showSuccess('تم تسجيل الدخول (وضع تجريبي)', 'مرحباً بك في FlowForge IDE - الوضع التجريبي');
          navigate('/chat');
          return;
        } else {
          setError('الخادم غير متاح حالياً. يرجى استخدام البيانات التجريبية المعروضة أعلاه.');
          return;
        }
      }
      
      const errorMessage = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
      setError(errorMessage);
      handleError(err, 'خطأ في تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen bg-ide-bg flex items-center justify-center p-4 w-full overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-ide-surface border border-ide-border rounded-lg p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl font-bold text-ide-accent">F</span>
              <span className="text-2xl font-semibold">lowForge</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">تسجيل الدخول</h1>
            <p className="text-ide-text-secondary">مرحباً بك مرة أخرى</p>
          </div>

          {/* Demo Credentials Card */}
          <div className="mb-6 p-4 bg-blue-900/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-blue-400">بيانات الدخول التجريبية</h3>
              <button
                type="button"
                onClick={handleUseDemo}
                className="text-xs px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-md transition-colors"
              >
                استخدام
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Mail className="w-3.5 h-3.5 text-ide-text-secondary" />
                  <span className="text-ide-text-secondary">البريد:</span>
                  <code className="text-xs bg-ide-bg px-2 py-1 rounded text-ide-text font-mono flex-1">
                    {DEMO_CREDENTIALS.email}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(DEMO_CREDENTIALS.email, 'email')}
                  className="p-1.5 hover:bg-ide-border rounded transition-colors"
                  title="نسخ البريد الإلكتروني"
                >
                  {copied === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-ide-text-secondary" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Lock className="w-3.5 h-3.5 text-ide-text-secondary" />
                  <span className="text-ide-text-secondary">كلمة المرور:</span>
                  <code className="text-xs bg-ide-bg px-2 py-1 rounded text-ide-text font-mono flex-1">
                    {DEMO_CREDENTIALS.password}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(DEMO_CREDENTIALS.password, 'password')}
                  className="p-1.5 hover:bg-ide-border rounded transition-colors"
                  title="نسخ كلمة المرور"
                >
                  {copied === 'password' ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-ide-text-secondary" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-md flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ide-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent"
                  placeholder="example@email.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ide-text-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md bg-ide-bg border border-ide-border text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-ide-text-secondary">تذكرني</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-ide-accent hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-ide-accent text-white rounded-md hover:bg-ide-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-ide-border" />
            <span className="text-sm text-ide-text-secondary">أو</span>
            <div className="flex-1 h-px bg-ide-border" />
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 bg-ide-surface border border-ide-border text-ide-text rounded-md hover:bg-ide-border transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول بـ Google'}
            </button>
            <button
              type="button"
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full py-2.5 bg-ide-surface border border-ide-border text-ide-text rounded-md hover:bg-ide-border transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول بـ GitHub'}
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-ide-text-secondary">ليس لديك حساب؟ </span>
            <Link to="/register" className="text-ide-accent hover:underline font-medium">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

