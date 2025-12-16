/**
 * usePerformance Hook - Hook لمراقبة الأداء بسهولة
 */

import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from '@/utils/performance-monitor';

export interface UsePerformanceOptions {
  componentName?: string;
  trackRenders?: boolean;
  trackAPI?: boolean;
}

/**
 * Hook لمراقبة أداء المكون
 */
export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    componentName = 'UnknownComponent',
    trackRenders = true,
    trackAPI = true,
  } = options;

  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  // تتبع وقت التحميل الأولي
  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current = 0;

    return () => {
      // تسجيل وقت التحميل الكلي عند إلغاء التثبيت
      const totalTime = performance.now() - renderStartTime.current;
      if (totalTime > 0) {
        performanceMonitor.trackCustomEvent(`${componentName}-total-time`, totalTime, {
          renderCount: renderCount.current,
        });
      }
    };
  }, [componentName]);

  // تتبع كل render
  useEffect(() => {
    if (trackRenders) {
      const renderTime = performance.now() - renderStartTime.current;
      renderCount.current += 1;

      if (renderTime > 0) {
        performanceMonitor.trackComponentRender(
          `${componentName}-render-${renderCount.current}`,
          renderTime
        );
      }
    }
  });

  // دالة لتتبع طلبات API
  const trackAPIRequest = useCallback(
    (endpoint: string, duration: number, success: boolean, statusCode?: number) => {
      if (trackAPI) {
        performanceMonitor.trackAPIRequest(endpoint, duration, success, statusCode);
      }
    },
    [trackAPI]
  );

  // دالة لتتبع أحداث مخصصة
  const trackEvent = useCallback(
    (eventName: string, duration: number, metadata?: Record<string, any>) => {
      performanceMonitor.trackCustomEvent(eventName, duration, metadata);
    },
    []
  );

  // الحصول على Web Vitals
  const getWebVitals = useCallback(() => {
    return performanceMonitor.getWebVitals();
  }, []);

  return {
    trackAPIRequest,
    trackEvent,
    getWebVitals,
    renderCount: renderCount.current,
  };
}

