/**
 * Error helper utilities
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'حدث خطأ غير معروف';
}

export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('NetworkError') ||
      error.message.includes('Failed to fetch')
    );
  }
  return false;
}

export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('timeout') ||
      error.message.includes('Timeout') ||
      error.name === 'TimeoutError'
    );
  }
  return false;
}

export function formatErrorForDisplay(error: unknown): {
  title: string;
  message: string;
  details?: string;
} {
  const message = getErrorMessage(error);
  const stack = getErrorStack(error);

  if (isNetworkError(error)) {
    return {
      title: 'خطأ في الشبكة',
      message: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.',
      details: message,
    };
  }

  if (isTimeoutError(error)) {
    return {
      title: 'خطأ انتهاء الوقت',
      message: 'استغرق الطلب وقتاً طويلاً. يرجى المحاولة مرة أخرى.',
      details: message,
    };
  }

  return {
    title: 'خطأ',
    message,
    details: stack,
  };
}

