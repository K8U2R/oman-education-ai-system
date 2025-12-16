/**
 * Error Fallback Component
 * مكون عرض الخطأ
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo?: React.ErrorInfo | null;
  errorId: string | null;
  onReset: () => void;
  onReload: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  errorId,
  onReset,
  onReload,
}) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = React.useState(false);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-ide-bg min-h-[400px]">
      <div className="max-w-2xl w-full space-y-6">
        {/* أيقونة الخطأ */}
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        {/* رسالة الخطأ */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-ide-text">
            حدث خطأ غير متوقع
          </h2>
          <p className="text-ide-text-secondary">
            عذراً، حدث خطأ في عرض المحادثة. يرجى المحاولة مرة أخرى.
          </p>
          {errorId && (
            <p className="text-xs text-ide-text-secondary/70">
              معرف الخطأ: {errorId}
            </p>
          )}
        </div>

        {/* تفاصيل الخطأ */}
        {error && (
          <div className="mt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-ide-accent hover:text-ide-accent-hover transition-colors"
            >
              {showDetails ? 'إخفاء' : 'عرض'} تفاصيل الخطأ
            </button>

            {showDetails && (
              <div className="mt-4 p-4 bg-ide-surface border border-ide-border rounded-lg text-left">
                <div className="space-y-2">
                  <div>
                    <strong className="text-red-400">الرسالة:</strong>
                    <p className="text-sm text-ide-text-secondary mt-1 break-words">
                      {error.message}
                    </p>
                  </div>
                  {error.stack && (
                    <div>
                      <strong className="text-red-400">Stack Trace:</strong>
                      <pre className="text-xs text-ide-text-secondary mt-1 overflow-auto max-h-40 p-2 bg-ide-bg rounded">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  {errorInfo?.componentStack && (
                    <div>
                      <strong className="text-red-400">Component Stack:</strong>
                      <pre className="text-xs text-ide-text-secondary mt-1 overflow-auto max-h-40 p-2 bg-ide-bg rounded">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="primary"
            onClick={onReset}
            className="bg-gradient-to-r from-ide-accent via-blue-500 to-purple-600 hover:from-ide-accent-hover hover:via-blue-600 hover:to-purple-700"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
          <Button variant="ghost" onClick={onReload}>
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة تحميل الصفحة
          </Button>
          <Button variant="ghost" onClick={handleGoHome}>
            <Home className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </div>

        {/* نص مساعد */}
        <p className="text-xs text-ide-text-secondary/70 pt-4">
          إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني
        </p>
      </div>
    </div>
  );
};

export default ErrorFallback;

