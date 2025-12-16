/**
 * Sentry Configuration - تكوين Sentry لمراقبة الأخطاء
 * 
 * للاستخدام:
 * 1. تثبيت: npm install @sentry/react @sentry/browser
 * 2. إضافة DSN في .env: VITE_SENTRY_DSN=your-dsn-here
 * 3. تفعيل في main.tsx
 */

export interface SentryConfig {
  dsn: string;
  environment: string;
  enabled: boolean;
  tracesSampleRate: number;
  replaysSessionSampleRate: number;
  replaysOnErrorSampleRate: number;
}

/**
 * الحصول على تكوين Sentry
 */
export function getSentryConfig(): SentryConfig {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.MODE || 'development';
  
  return {
    dsn: dsn || '',
    environment,
    enabled: !!dsn && environment === 'production',
    tracesSampleRate: 0.1, // 10% من المعاملات
    replaysSessionSampleRate: 0.1, // 10% من الجلسات
    replaysOnErrorSampleRate: 1.0, // 100% من الأخطاء
  };
}

/**
 * تهيئة Sentry (يتم استدعاؤها في main.tsx)
 */
export async function initializeSentry(): Promise<void> {
  const config = getSentryConfig();
  
  if (!config.enabled) {
    if (import.meta.env.DEV) {
      console.log('Sentry is disabled (development mode or no DSN)');
    }
    return;
  }

  try {
    // استخدام المكتبات المثبتة مباشرة
    const Sentry = await import('@sentry/react');
    const { BrowserTracing } = await import('@sentry/browser');
    
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
      integrations: [
        new BrowserTracing({
          // تتبع التنقل
          tracePropagationTargets: [
            'localhost',
            /^https:\/\/oman-education-ai\.om/,
            /^https:\/\/api\.oman-education-ai\.om/,
          ],
        }),
        new Sentry.Replay({
          // تسجيل الجلسات
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: config.tracesSampleRate,
      replaysSessionSampleRate: config.replaysSessionSampleRate,
      replaysOnErrorSampleRate: config.replaysOnErrorSampleRate,
      
      // إعدادات إضافية
      beforeSend(event, hint) {
        // تصفية المعلومات الحساسة
        if (event.request) {
          // إزالة كلمات المرور من URLs
          if (event.request.url) {
            event.request.url = event.request.url.replace(/password=[^&]*/g, 'password=***');
            event.request.url = event.request.url.replace(/token=[^&]*/g, 'token=***');
            event.request.url = event.request.url.replace(/api_key=[^&]*/g, 'api_key=***');
          }
        }
        
        // إزالة البيانات الحساسة من context
        if (event.user) {
          delete event.user.ip_address;
        }
        
        // إزالة البيانات الحساسة من extra
        if (event.extra) {
          delete event.extra.password;
          delete event.extra.token;
          delete event.extra.apiKey;
        }
        
        return event;
      },
      
      // إعدادات إضافية للأداء
      maxBreadcrumbs: 50,
      attachStacktrace: true,
    });

    console.log('✅ Sentry initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Sentry:', error);
  }
}

/**
 * إرسال خطأ مخصص إلى Sentry
 */
export async function captureException(
  error: Error,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    level?: 'error' | 'warning' | 'info';
  }
): Promise<void> {
  const config = getSentryConfig();
  
  if (!config.enabled) {
    if (import.meta.env.DEV) {
      console.error('Error (Sentry disabled):', error, context);
    }
    return;
  }

  try {
    const Sentry = await import('@sentry/react');
    
    Sentry.captureException(error, {
      tags: context?.tags,
      extra: context?.extra,
      level: context?.level || 'error',
    });
  } catch (err) {
    console.error('Failed to capture exception in Sentry:', err);
  }
}

/**
 * إرسال رسالة مخصصة إلى Sentry
 */
export async function captureMessage(
  message: string,
  level: 'error' | 'warning' | 'info' = 'info'
): Promise<void> {
  const config = getSentryConfig();
  
  if (!config.enabled) {
    if (import.meta.env.DEV) {
      console.log(`Message (Sentry disabled): [${level}] ${message}`);
    }
    return;
  }

  try {
    const Sentry = await import('@sentry/react');
    Sentry.captureMessage(message, level);
  } catch (error) {
    console.error('Failed to capture message in Sentry:', error);
  }
}

/**
 * إضافة مستخدم إلى Sentry
 */
export async function setUser(user: {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: any;
}): Promise<void> {
  const config = getSentryConfig();
  
  if (!config.enabled) return;

  try {
    const Sentry = await import('@sentry/react');
    Sentry.setUser(user);
  } catch (error) {
    console.error('Failed to set user in Sentry:', error);
  }
}

/**
 * إضافة context مخصص
 */
export async function setContext(
  name: string,
  context: Record<string, any>
): Promise<void> {
  const config = getSentryConfig();
  
  if (!config.enabled) return;

  try {
    const Sentry = await import('@sentry/react');
    Sentry.setContext(name, context);
  } catch (error) {
    console.error('Failed to set context in Sentry:', error);
  }
}

