import React, { useState } from 'react';
import { AlertCircle, X, AlertTriangle, Info, CheckCircle, Copy, ExternalLink, ChevronDown, ChevronUp, Code, Clock, MapPin, Activity } from 'lucide-react';

export type ErrorLevel = 'error' | 'warning' | 'info' | 'success';
export type ErrorCategory = 'api' | 'network' | 'validation' | 'authentication' | 'authorization' | 'system' | 'unknown';

export interface ErrorMessage {
  id: string;
  level: ErrorLevel;
  category?: ErrorCategory;
  title: string;
  message: string;
  details?: string;
  timestamp: Date;
  dismissible?: boolean;
  onDismiss?: () => void;
  // معلومات إضافية
  source?: string; // المصدر (component, service, etc.)
  action?: string; // الإجراء الذي أدى للخطأ
  url?: string; // URL المطلوب (للأخطاء API)
  method?: string; // HTTP method
  statusCode?: number; // HTTP status code
  errorCode?: string; // كود الخطأ المخصص
  stackTrace?: string; // Stack trace محسن
  context?: Record<string, any>; // معلومات سياق إضافية
  helpUrl?: string; // رابط مساعدة
  suggestions?: string[]; // اقتراحات حل
}

interface ErrorDisplayProps {
  error: ErrorMessage;
  onDismiss?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const getIcon = () => {
    switch (error.level) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-ide-text-secondary" />;
    }
  };

  const getBgColor = () => {
    switch (error.level) {
      case 'error':
        return 'bg-red-900/20 border-red-500/50';
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500/50';
      case 'info':
        return 'bg-blue-900/20 border-blue-500/50';
      case 'success':
        return 'bg-green-900/20 border-green-500/50';
      default:
        return 'bg-ide-surface border-ide-border';
    }
  };

  const getCategoryLabel = () => {
    const labels: Record<ErrorCategory, string> = {
      api: 'خطأ API',
      network: 'خطأ شبكة',
      validation: 'خطأ تحقق',
      authentication: 'خطأ مصادقة',
      authorization: 'خطأ صلاحيات',
      system: 'خطأ نظام',
      unknown: 'خطأ غير معروف',
    };
    return error.category ? labels[error.category] : '';
  };

  const copyErrorDetails = async () => {
    const errorText = JSON.stringify({
      title: error.title,
      message: error.message,
      category: error.category,
      source: error.source,
      action: error.action,
      url: error.url,
      method: error.method,
      statusCode: error.statusCode,
      errorCode: error.errorCode,
      details: error.details,
      stackTrace: error.stackTrace,
      timestamp: error.timestamp.toISOString(),
    }, null, 2);

    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `منذ ${seconds} ثانية`;
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return date.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`p-4 rounded-md border ${getBgColor()} mb-2 transition-all`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold">{error.title}</h4>
                {error.category && (
                  <span className="text-xs px-2 py-0.5 rounded bg-ide-bg/50 text-ide-text-secondary">
                    {getCategoryLabel()}
                  </span>
                )}
                {error.statusCode && (
                  <span className="text-xs px-2 py-0.5 rounded bg-ide-bg/50 text-ide-text-secondary font-mono">
                    {error.statusCode}
                  </span>
                )}
                {error.errorCode && (
                  <span className="text-xs px-2 py-0.5 rounded bg-ide-bg/50 text-ide-text-secondary font-mono">
                    {error.errorCode}
                  </span>
                )}
              </div>
              <p className="text-sm text-ide-text-secondary mb-2">{error.message}</p>
              
              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-ide-text-secondary mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(error.timestamp)}</span>
                </div>
                {error.source && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{error.source}</span>
                  </div>
                )}
                {error.action && (
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>{error.action}</span>
                  </div>
                )}
                {error.url && (
                  <div className="flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    <span className="font-mono text-xs truncate max-w-[200px]" title={error.url}>
                      {error.method || 'GET'} {error.url}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={copyErrorDetails}
                className="p-1 rounded hover:bg-ide-border transition-colors"
                aria-label="نسخ التفاصيل"
                title="نسخ تفاصيل الخطأ"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              {(error.details || error.stackTrace || error.suggestions || error.helpUrl) && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 rounded hover:bg-ide-border transition-colors"
                  aria-label={isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
              {(error.dismissible !== false || onDismiss) && (
                <button
                  onClick={onDismiss || error.onDismiss}
                  className="p-1 rounded hover:bg-ide-border transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-ide-border space-y-3">
              {/* Suggestions */}
              {error.suggestions && error.suggestions.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold mb-2 text-ide-text">اقتراحات الحل:</h5>
                  <ul className="list-disc list-inside space-y-1 text-xs text-ide-text-secondary">
                    {error.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Help URL */}
              {error.helpUrl && (
                <div>
                  <a
                    href={error.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    رابط المساعدة
                  </a>
                </div>
              )}

              {/* Details */}
              {error.details && (
                <div>
                  <h5 className="text-xs font-semibold mb-2 text-ide-text">التفاصيل:</h5>
                  <pre className="text-xs text-ide-text-secondary bg-ide-bg p-2 rounded overflow-auto font-mono max-h-40">
                    {error.details}
                  </pre>
                </div>
              )}

              {/* Stack Trace */}
              {error.stackTrace && (
                <div>
                  <h5 className="text-xs font-semibold mb-2 text-ide-text">Stack Trace:</h5>
                  <pre className="text-xs text-ide-text-secondary bg-ide-bg p-2 rounded overflow-auto font-mono max-h-40">
                    {error.stackTrace}
                  </pre>
                </div>
              )}

              {/* Context */}
              {error.context && Object.keys(error.context).length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold mb-2 text-ide-text">السياق:</h5>
                  <pre className="text-xs text-ide-text-secondary bg-ide-bg p-2 rounded overflow-auto font-mono max-h-40">
                    {JSON.stringify(error.context, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;

