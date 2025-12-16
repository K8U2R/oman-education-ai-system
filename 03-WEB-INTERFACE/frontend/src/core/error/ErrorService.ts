import { ErrorMessage } from './ErrorDisplay';
import { useErrorStore } from './ErrorStore';

class ErrorService {
  private errorStore = useErrorStore.getState();

  constructor() {
    // Listen for unhandled errors
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }

  private handleGlobalError(event: ErrorEvent) {
    this.logError(
      event.error || new Error(event.message),
      {
        componentStack: '',
        errorBoundary: false,
      },
      {
        title: 'خطأ غير معالج',
        message: event.message || 'حدث خطأ غير متوقع',
        level: 'error',
      }
    );
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    this.logError(
      error,
      {
        componentStack: '',
        errorBoundary: false,
      },
      {
        title: 'رفض Promise غير معالج',
        message: error.message || 'تم رفض Promise',
        level: 'error',
      }
    );
  }

  logError(
    error: Error,
    errorInfo?: { componentStack?: string; errorBoundary?: boolean; source?: string; action?: string },
    options?: Partial<ErrorMessage>
  ) {
    // تحسين Stack Trace
    const stackTrace = error.stack 
      ? error.stack
          .split('\n')
          .slice(0, 10) // أول 10 أسطر فقط
          .join('\n')
      : undefined;

    const errorMessage: Omit<ErrorMessage, 'id' | 'timestamp'> = {
      level: 'error',
      title: options?.title || error.name || 'خطأ',
      message: options?.message || error.message || 'حدث خطأ',
      details: errorInfo?.componentStack || undefined,
      stackTrace,
      source: options?.source || errorInfo?.source || 'unknown',
      action: options?.action || errorInfo?.action,
      dismissible: true,
      ...options,
    };

    this.errorStore.addError(errorMessage);

    // Send to error tracking service (if available)
    interface ErrorTracking {
      captureException: (error: Error, options?: { extra?: unknown; tags?: Record<string, string> }) => void;
    }
    if (typeof window !== 'undefined' && 'errorTracking' in window) {
      const errorTracking = (window as Window & { errorTracking?: ErrorTracking }).errorTracking;
      if (errorTracking) {
        errorTracking.captureException(error, {
          extra: errorInfo,
          tags: {
            component: errorInfo?.errorBoundary ? 'ErrorBoundary' : 'Global',
          },
        });
      }
    }
  }

  logWarning(title: string, message: string, details?: string) {
    this.errorStore.addError({
      level: 'warning',
      title,
      message,
      details,
      dismissible: true,
    });
  }

  logInfo(title: string, message: string, details?: string) {
    this.errorStore.addError({
      level: 'info',
      title,
      message,
      details,
      dismissible: true,
    });
  }

  logSuccess(title: string, message: string) {
    this.errorStore.addError({
      level: 'success',
      title,
      message,
      dismissible: true,
    });
  }
}

// Create singleton instance
export const errorService = new ErrorService();

// Make it available globally
interface ErrorTracking {
  captureException: (error: Error, options?: { extra?: unknown; tags?: Record<string, string> }) => void;
}

declare global {
  interface Window {
    errorService: ErrorService;
    errorTracking?: ErrorTracking;
  }
}

if (typeof window !== 'undefined') {
  (window as Window & { errorService: ErrorService }).errorService = errorService;
}

