/**
 * useErrorBoundary Hook - Hook لمعالجة الأخطاء بسهولة
 */

import { useCallback } from 'react';
import { errorHandler, ErrorSeverity } from '@/utils/error-handler';

export interface UseErrorBoundaryOptions {
  module?: string;
  defaultSeverity?: ErrorSeverity;
}

/**
 * Hook لمعالجة الأخطاء في المكونات
 */
export function useErrorBoundary(options: UseErrorBoundaryOptions = {}) {
  const { module = 'component', defaultSeverity = 'medium' } = options;

  // معالجة خطأ
  const handleError = useCallback(
    (
      error: unknown,
      action: string,
      severity?: ErrorSeverity,
      userInfo?: Record<string, any>
    ) => {
      errorHandler.handleError(error, {
        module,
        action,
        severity: severity || defaultSeverity,
        userInfo,
      });
    },
    [module, defaultSeverity]
  );

  // معالجة خطأ مع try-catch wrapper
  const safeExecute = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      action: string,
      severity?: ErrorSeverity
    ): Promise<T | null> => {
      try {
        return await fn();
      } catch (error) {
        handleError(error, action, severity);
        return null;
      }
    },
    [handleError]
  );

  // معالجة خطأ متزامن
  const safeExecuteSync = useCallback(
    <T,>(fn: () => T, action: string, severity?: ErrorSeverity): T | null => {
      try {
        return fn();
      } catch (error) {
        handleError(error, action, severity);
        return null;
      }
    },
    [handleError]
  );

  return {
    handleError,
    safeExecute,
    safeExecuteSync,
  };
}

