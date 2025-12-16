/**
 * Performance Utilities
 * أدوات الأداء والتحسين
 */

import React from 'react';
import type { AnyFunction } from '../types/common';

type ComponentProps = React.ComponentPropsWithoutRef<'div'>;

/**
 * Lazy Load Component
 * تحميل كسول للمكونات
 */
export const lazyLoad = <T extends React.ComponentType<ComponentProps>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(importFunc);
};

/**
 * Memoize Function
 * حفظ نتائج الدوال
 */
export const memoize = <T extends AnyFunction>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      const cached = cache.get(key);
      if (cached !== undefined) {
        return cached;
      }
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * Debounce Function
 * تأخير تنفيذ الدالة
 */
export const debounce = <T extends AnyFunction>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle Function
 * تحديد معدل تنفيذ الدالة
 */
export const throttle = <T extends AnyFunction>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Request Animation Frame Throttle
 * استخدام requestAnimationFrame للتحسين
 */
export const rafThrottle = <T extends AnyFunction>(
  func: T
): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null;

  return (...args: Parameters<T>) => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
};

/**
 * Batch Updates
 * تجميع التحديثات
 */
export const batchUpdates = (updates: Array<() => void>): void => {
  // Use React.startTransition if available (React 18+)
  // Note: startTransition is available in React 18+, but TypeScript types may not include it
  // We use type assertion to access it safely with runtime check
  interface ReactWithStartTransition {
    startTransition?: (callback: () => void) => void;
  }
  const ReactWithTransition = React as unknown as ReactWithStartTransition;
  if (typeof ReactWithTransition.startTransition === 'function') {
    ReactWithTransition.startTransition(() => {
      updates.forEach(update => update());
    });
  } else {
    // Fallback for older React versions
    updates.forEach(update => update());
  }
};

/**
 * Measure Performance
 * قياس الأداء
 */
export const measurePerformance = <T>(
  name: string,
  fn: () => T
): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
};

/**
 * Async Measure Performance
 * قياس الأداء للدوال غير المتزامنة
 */
export const measureAsyncPerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
};
