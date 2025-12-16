import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Error Boundary لمكونات المحادثة
 * 
 * يعالج الأخطاء في المكونات ويمنع تعطيل الصفحة بالكامل
 */
export class ChatErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // إنشاء معرف فريد للخطأ
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chat Error Boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // إرسال الخطأ إلى خدمة logging (إن وجدت)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // حفظ معلومات الخطأ في localStorage للتحليل لاحقاً
    try {
      const errorLog = {
        id: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };
      
      const existingLogs = JSON.parse(
        localStorage.getItem('chat-error-logs') || '[]'
      );
      existingLogs.push(errorLog);
      
      // الاحتفاظ بآخر 10 أخطاء فقط
      const limitedLogs = existingLogs.slice(-10);
      localStorage.setItem('chat-error-logs', JSON.stringify(limitedLogs));
    } catch (storageError) {
      console.error('فشل حفظ سجل الخطأ:', storageError);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // استخدام fallback مخصص إن وجد
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onReset={this.handleReset}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

// useErrorBoundary hook moved to hooks/useErrorBoundary.ts
export { useErrorBoundary } from '../hooks/useErrorBoundary';

