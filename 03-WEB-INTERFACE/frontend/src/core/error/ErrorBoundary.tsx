import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log error to error service
    if (window.errorService) {
      window.errorService.logError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-ide-bg text-ide-text flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-ide-surface border border-red-500 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl font-bold">حدث خطأ ما</h1>
            </div>

            <div className="mb-6">
              <p className="text-ide-text-secondary mb-4">
                حدث خطأ غير متوقع. يرجى تجربة أحد الخيارات أدناه.
              </p>

              {this.state.error && (
                <div className="bg-ide-bg border border-ide-border rounded-md p-4 mb-4">
                  <h3 className="text-sm font-semibold mb-2 text-red-400">تفاصيل الخطأ:</h3>
                  <pre className="text-xs text-ide-text-secondary overflow-auto font-mono">
                    {this.state.error.toString()}
                    {this.state.errorInfo && (
                      <>
                        {'\n\n'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="ide-button-primary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                حاول مرة أخرى
              </button>
              <button
                onClick={this.handleReload}
                className="ide-button-secondary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة تحميل الصفحة
              </button>
              <button
                onClick={this.handleGoHome}
                className="ide-button-secondary flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

