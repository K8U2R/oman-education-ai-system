import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';

// تهيئة Sentry (في الإنتاج فقط)
import { initializeSentry } from './config/sentry.config';
initializeSentry().catch(console.error);

// تهيئة مراقبة الأداء
import { performanceMonitor } from './utils/performance-monitor';
import { errorHandler } from './utils/error-handler';

// تهيئة Lazy Loading
import { initializeLazyLoading } from './utils/lazy-loading';

// تسجيل بدء التطبيق
performanceMonitor.trackCustomEvent('app-start', 0, {
  timestamp: new Date().toISOString(),
});

// معالجة أخطاء التطبيق
window.addEventListener('error', (event) => {
  errorHandler.handleError(event.error, {
    module: 'app',
    action: 'global-error',
    severity: 'high',
  });
});

window.addEventListener('unhandledrejection', (event) => {
  errorHandler.handleError(
    event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason)),
    {
      module: 'app',
      action: 'unhandled-promise-rejection',
      severity: 'high',
    }
  );
});

// تهيئة Lazy Loading بعد تحميل الصفحة
if (document.readyState === 'complete') {
  initializeLazyLoading();
} else {
  window.addEventListener('load', initializeLazyLoading);
}

// Service Worker يتم تسجيله تلقائياً بواسطة vite-plugin-pwa
// يمكن إضافة معالجة إضافية هنا إذا لزم الأمر
if ('serviceWorker' in navigator) {
  // الاستماع لتحديثات Service Worker
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('New Service Worker activated');
    // يمكن إضافة إشعار للمستخدم هنا
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
