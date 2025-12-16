/**
 * usePerformance Hook
 * Hook لتحسين الأداء
 */

import { useEffect, useRef, useCallback } from 'react';
import type { AnyFunction } from '../types/common';

interface PerformanceOptions {
  debounceMs?: number;
  throttleMs?: number;
  enableLogging?: boolean;
}

/**
 * Hook لتحسين الأداء مع debounce
 */
export const useDebouncedCallback = <T extends AnyFunction>(
  callback: T,
  delay: number = 300
): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  /**
   * استخدام callbackRef pattern لتجنب إعادة إنشاء الدالة
   * عند تغيير callback. callbackRef.current يتم تحديثه في useEffect منفصل.
   * delay هو التبعية الوحيدة المطلوبة للـ useCallback.
   * 
   * المرجع: https://react.dev/reference/react/useCallback#caveats
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook لتحسين الأداء مع throttle
 */
export const useThrottledCallback = <T extends AnyFunction>(
  callback: T,
  delay: number = 300
): T => {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  /**
   * استخدام callbackRef pattern لتجنب إعادة إنشاء الدالة
   * عند تغيير callback. callbackRef.current يتم تحديثه في useEffect منفصل.
   * delay هو التبعية الوحيدة المطلوبة للـ useCallback.
   * 
   * المرجع: https://react.dev/reference/react/useCallback#caveats
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledCallback = useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callbackRef.current(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          callbackRef.current(...args);
        }, delay - (now - lastRunRef.current));
      }
    }) as T,
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

/**
 * Hook لقياس الأداء
 */
export const usePerformanceMonitor = (
  componentName: string,
  options: PerformanceOptions = {}
) => {
  const { enableLogging = false } = options;
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    renderCountRef.current += 1;
    const now = Date.now();
    const renderTime = now - lastRenderTimeRef.current;

    if (enableLogging && renderTime > 16) {
      console.warn(
        `[Performance] ${componentName} render took ${renderTime}ms (render #${renderCountRef.current})`
      );
    }

    lastRenderTimeRef.current = now;
  });

  return {
    renderCount: renderCountRef.current,
  };
};

