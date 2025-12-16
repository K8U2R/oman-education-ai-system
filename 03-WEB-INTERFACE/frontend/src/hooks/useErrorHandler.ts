import { useCallback } from 'react';
import { errorService } from '@/core/error/ErrorService';
import { handleApiError } from '@/services/api/errorHandler';

/**
 * Hook for handling errors in components
 */
export function useErrorHandler() {
  const handleError = useCallback((error: unknown, title?: string) => {
    if (error instanceof Error) {
      errorService.logError(error, undefined, {
        title: title || 'Error',
        message: error.message,
        details: error.stack,
        level: 'error',
      });
    } else {
      errorService.logError(
        new Error(String(error)),
        undefined,
        {
          title: title || 'Error',
          message: String(error),
          level: 'error',
        }
      );
    }
  }, []);

  const handleApiErrorWrapper = useCallback((error: unknown) => {
    handleApiError(error);
  }, []);

  const showWarning = useCallback((title: string, message: string, details?: string) => {
    errorService.logWarning(title, message, details);
  }, []);

  const showInfo = useCallback((title: string, message: string, details?: string) => {
    errorService.logInfo(title, message, details);
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    errorService.logSuccess(title, message);
  }, []);

  return {
    handleError,
    handleApiError: handleApiErrorWrapper,
    showWarning,
    showInfo,
    showSuccess,
  };
}

