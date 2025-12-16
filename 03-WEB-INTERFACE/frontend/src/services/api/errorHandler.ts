import { errorService } from '@/core/error/ErrorService';
import { formatErrorForDisplay } from '@/utils/errorHelpers';

/**
 * API Error interface
 */
interface ApiError extends Error {
  response?: {
    status?: number;
    data?: {
      message?: string;
      [key: string]: unknown;
    };
  };
}

/**
 * Check if error is an API error
 */
function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof Error &&
    'response' in error &&
    typeof (error as ApiError).response === 'object' &&
    (error as ApiError).response !== null
  );
}

/**
 * Handle API errors and display them to the user
 */
export function handleApiError(error: unknown): void {
  if (isApiError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    let title = 'خطأ في API';
    let message = 'حدث خطأ أثناء معالجة طلبك.';
    let details: string | undefined;

    switch (status) {
      case 400: {
        title = 'طلب غير صحيح';
        message = data?.message || 'الطلب غير صالح.';
        details = JSON.stringify(data, null, 2);
        break;
      }
      case 401: {
        title = 'غير مصرح';
        message = 'غير مصرح لك بتنفيذ هذا الإجراء.';
        break;
      }
      case 403: {
        title = 'ممنوع';
        message = 'ليس لديك صلاحية للوصول إلى هذا المورد.';
        break;
      }
      case 404: {
        title = 'غير موجود';
        message = 'المورد المطلوب غير موجود.';
        break;
      }
      case 500: {
        title = 'خطأ في الخادم';
        message = 'حدث خطأ داخلي في الخادم.';
        details = data?.message || error.message;
        break;
      }
      case 503: {
        title = 'الخدمة غير متاحة';
        message = 'الخدمة غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى لاحقاً.';
        break;
      }
      default: {
        const formatted = formatErrorForDisplay(error);
        title = formatted.title;
        message = formatted.message;
        details = formatted.details;
        break;
      }
    }

    errorService.logError(error, undefined, {
      title,
      message,
      details,
      level: 'error',
    });
  } else {
    const formatted = formatErrorForDisplay(error);
    errorService.logError(
      error instanceof Error ? error : new Error(String(error)),
      undefined,
      {
        title: formatted.title,
        message: formatted.message,
        details: formatted.details,
        level: 'error',
      }
    );
  }
}

/**
 * Create an error handler for async functions
 * 
 * Generic wrapper function that handles errors for any async function.
 * Uses generics to preserve the original function signature.
 */
export function withErrorHandling<
  TArgs extends unknown[],
  TReturn
>(
  fn: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
}

