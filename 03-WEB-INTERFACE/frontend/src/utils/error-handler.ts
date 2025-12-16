/**
 * Error Handler - نظام معالجة الأخطاء المتقدم
 * يتعامل مع الأخطاء بشكل شامل ويرسلها لخدمة المراقبة
 */

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorContext {
  module: string;
  action: string;
  severity: ErrorSeverity;
  userInfo?: Record<string, any>;
  stack?: string;
  url?: string;
  userAgent?: string;
}

export interface ErrorReport {
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  context: ErrorContext;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private sentryEnabled: boolean = false;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize: number = 50;

  private constructor() {
    this.initializeErrorHandling();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * تهيئة معالجة الأخطاء
   */
  private initializeErrorHandling(): void {
    // معالجة أخطاء JavaScript غير المعالجة
    window.addEventListener('error', (event) => {
      this.handleError(
        event.error || new Error(event.message),
        {
          module: 'global',
          action: 'unhandled-error',
          severity: 'high',
        }
      );
    });

    // معالجة وعود مرفوضة غير معالجة
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason)),
        {
          module: 'global',
          action: 'unhandled-promise-rejection',
          severity: 'high',
        }
      );
    });
  }

  /**
   * معالجة خطأ
   */
  handleError(
    error: unknown,
    context: {
      module: string;
      action: string;
      severity: ErrorSeverity;
      userInfo?: Record<string, any>;
    }
  ): void {
    const normalizedError = this.normalizeError(error);
    const errorReport = this.createErrorReport(normalizedError, context);

    // تسجيل في Console للتطوير
    if (import.meta.env.DEV) {
      console.error('🚨 خطأ تم التقاطه:', {
        error: normalizedError,
        context,
      });
    }

    // إضافة للقائمة
    this.addToQueue(errorReport);

    // تسجيل في Sentry (إذا كان مفعلاً)
    if (this.sentryEnabled) {
      this.captureSentryError(normalizedError, context);
    }

    // عرض للمستخدم بناءً على الشدة
    this.showUserFriendlyError(normalizedError, context.severity);

    // إرسال تنبيه للفريق إذا كان حرجاً
    if (context.severity === 'critical') {
      this.notifyTeam(errorReport);
    }

    // إرسال فوري للأخطاء الحرجة
    if (context.severity === 'critical' || context.severity === 'high') {
      this.sendErrorReport(errorReport, true);
    }
  }

  /**
   * تحويل الخطأ إلى Error object
   */
  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    if (error && typeof error === 'object') {
      const message = (error as any).message || String(error);
      const err = new Error(message);
      if ((error as any).stack) {
        err.stack = (error as any).stack;
      }
      return err;
    }

    return new Error('خطأ غير معروف');
  }

  /**
   * إنشاء تقرير خطأ
   */
  private createErrorReport(
    error: Error,
    context: {
      module: string;
      action: string;
      severity: ErrorSeverity;
      userInfo?: Record<string, any>;
    }
  ): ErrorReport {
    return {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        stack: error.stack,
      },
      timestamp: new Date().toISOString(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
    };
  }

  /**
   * إضافة للقائمة
   */
  private addToQueue(report: ErrorReport): void {
    this.errorQueue.push(report);

    // الاحتفاظ بآخر N تقرير فقط
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // إرسال دوري للقائمة
    if (this.errorQueue.length >= 10) {
      this.sendErrorQueue();
    }
  }

  /**
   * عرض رسالة خطأ للمستخدم
   */
  private showUserFriendlyError(
    error: Error,
    severity: ErrorSeverity
  ): void {
    const messages = {
      ar: {
        low: 'حدث خطأ بسيط، جاري المعالجة...',
        medium: 'عذراً، حدث خطأ. جاري إصلاحه...',
        high: 'خطأ في النظام، يرجى المحاولة لاحقاً',
        critical:
          'تعذر الوصول للخدمة، فريق الدعم يعمل على الإصلاح. يرجى المحاولة بعد قليل.',
      },
    };

    // استخدام نظام الإشعارات (Toast)
    if (typeof window !== 'undefined' && (window as any).toast) {
      (window as any).toast({
        message: messages.ar[severity],
        type: severity === 'critical' || severity === 'high' ? 'error' : 'warning',
        duration: severity === 'critical' ? 10000 : 5000,
      });
    } else {
      // Fallback: console أو alert
      if (severity === 'critical') {
        console.error('خطأ حرج:', error.message);
      }
    }
  }

  /**
   * تسجيل في Sentry
   */
  private captureSentryError(
    error: Error,
    context: {
      module: string;
      action: string;
      severity: ErrorSeverity;
      userInfo?: Record<string, any>;
    }
  ): void {
    // TODO: تكامل Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     tags: {
    //       module: context.module,
    //       action: context.action,
    //       severity: context.severity,
    //     },
    //     extra: context.userInfo,
    //   });
    // }
  }

  /**
   * إشعار الفريق
   */
  private notifyTeam(report: ErrorReport): void {
    // TODO: إرسال إشعار فوري للفريق (Slack, Email, etc.)
    console.error('🚨 خطأ حرج يحتاج انتباه الفريق:', report);
  }

  /**
   * إرسال تقرير خطأ
   */
  private async sendErrorReport(
    report: ErrorReport,
    immediate: boolean = false
  ): Promise<void> {
    try {
      const response = await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
        keepalive: immediate,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      // حفظ محلياً إذا فشل الإرسال
      this.saveErrorLocally(report);
    }
  }

  /**
   * إرسال قائمة الأخطاء
   */
  private async sendErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const reports = [...this.errorQueue];
    this.errorQueue = [];

    try {
      const response = await fetch('/api/errors/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reports }),
      });

      if (!response.ok) {
        // إعادة إضافة للقائمة إذا فشل الإرسال
        this.errorQueue.unshift(...reports);
      }
    } catch (error) {
      // حفظ محلياً
      this.saveErrorsLocally(reports);
      // إعادة إضافة للقائمة
      this.errorQueue.unshift(...reports);
    }
  }

  /**
   * حفظ محلياً
   */
  private saveErrorLocally(report: ErrorReport): void {
    try {
      const stored = localStorage.getItem('error_reports') || '[]';
      const reports = JSON.parse(stored);
      reports.push(report);

      // الاحتفاظ بآخر 20 تقرير فقط
      const trimmed = reports.slice(-20);
      localStorage.setItem('error_reports', JSON.stringify(trimmed));
    } catch (error) {
      console.error('فشل حفظ تقرير الخطأ محلياً:', error);
    }
  }

  /**
   * حفظ قائمة أخطاء محلياً
   */
  private saveErrorsLocally(reports: ErrorReport[]): void {
    reports.forEach((report) => this.saveErrorLocally(report));
  }

  /**
   * الحصول على معرف المستخدم
   */
  private getUserId(): string | undefined {
    try {
      // TODO: من store المصادقة
      return (window as any).__USER_ID__;
    } catch {
      return undefined;
    }
  }

  /**
   * الحصول على معرف الجلسة
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * تفعيل Sentry
   */
  enableSentry(): void {
    this.sentryEnabled = true;
  }

  /**
   * تعطيل Sentry
   */
  disableSentry(): void {
    this.sentryEnabled = false;
  }

  /**
   * الحصول على قائمة الأخطاء المحفوظة محلياً
   */
  getLocalErrors(): ErrorReport[] {
    try {
      const stored = localStorage.getItem('error_reports');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * مسح الأخطاء المحفوظة محلياً
   */
  clearLocalErrors(): void {
    localStorage.removeItem('error_reports');
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();
export default errorHandler;

