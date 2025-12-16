/**
 * خيارات إعادة المحاولة
 */
export interface RetryOptions {
  maxRetries?: number; // عدد المحاولات الأقصى (افتراضي: 3)
  delay?: number; // التأخير بين المحاولات بالمللي ثانية (افتراضي: 1000)
  backoff?: boolean; // استخدام exponential backoff (افتراضي: true)
  backoffMultiplier?: number; // مضاعف التأخير (افتراضي: 2)
  maxDelay?: number; // الحد الأقصى للتأخير بالمللي ثانية (افتراضي: 10000)
  onRetry?: (attempt: number, error: Error) => void; // callback عند إعادة المحاولة
  shouldRetry?: (error: Error) => boolean; // تحديد ما إذا كان يجب إعادة المحاولة
}

/**
 * نتيجة إعادة المحاولة
 */
export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
}

/**
 * إعادة المحاولة مع exponential backoff
 * 
 * @param fn الدالة المراد تنفيذها
 * @param options خيارات إعادة المحاولة
 * @returns Promise مع النتيجة
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    backoffMultiplier = 2,
    maxDelay = 10000,
    onRetry,
    shouldRetry,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // التحقق من إمكانية إعادة المحاولة
      if (shouldRetry && !shouldRetry(lastError)) {
        throw lastError;
      }

      // إذا كانت هذه آخر محاولة، رمي الخطأ
      if (attempt === maxRetries) {
        throw lastError;
      }

      // استدعاء callback إعادة المحاولة
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // حساب وقت الانتظار
      const waitTime = backoff
        ? Math.min(delay * Math.pow(backoffMultiplier, attempt), maxDelay)
        : delay;

      // الانتظار قبل إعادة المحاولة
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError || new Error('Unknown error');
}

/**
 * إعادة المحاولة مع إرجاع Result object
 */
export async function retryWithResult<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    backoffMultiplier = 2,
    maxDelay = 10000,
    onRetry,
    shouldRetry,
  } = options;

  let lastError: Error | null = null;
  let attempts = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    attempts = attempt + 1;
    try {
      const data = await fn();
      return {
        success: true,
        data,
        attempts,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // التحقق من إمكانية إعادة المحاولة
      if (shouldRetry && !shouldRetry(lastError)) {
        return {
          success: false,
          error: lastError,
          attempts,
        };
      }

      // إذا كانت هذه آخر محاولة
      if (attempt === maxRetries) {
        return {
          success: false,
          error: lastError,
          attempts,
        };
      }

      // استدعاء callback إعادة المحاولة
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // حساب وقت الانتظار
      const waitTime = backoff
        ? Math.min(delay * Math.pow(backoffMultiplier, attempt), maxDelay)
        : delay;

      // الانتظار قبل إعادة المحاولة
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  return {
    success: false,
    error: lastError || new Error('Unknown error'),
    attempts,
  };
}

/**
 * تحديد ما إذا كان الخطأ قابل لإعادة المحاولة
 */
export function isRetryableError(error: Error): boolean {
  // أخطاء الشبكة قابلة لإعادة المحاولة
  if (error.message.includes('Failed to fetch') || 
      error.message.includes('NetworkError') ||
      error.message.includes('timeout')) {
    return true;
  }

  // أخطاء 5xx قابلة لإعادة المحاولة
  if (error.message.includes('500') || 
      error.message.includes('502') ||
      error.message.includes('503') ||
      error.message.includes('504')) {
    return true;
  }

  // أخطاء 429 (Rate Limit) قابلة لإعادة المحاولة
  if (error.message.includes('429')) {
    return true;
  }

  // أخطاء 4xx (عدا 429) غير قابلة لإعادة المحاولة
  if (error.message.match(/40[0-8]/)) {
    return false;
  }

  // باقي الأخطاء قابلة لإعادة المحاولة
  return true;
}

/**
 * Helper لإعادة المحاولة مع إعدادات افتراضية مناسبة لـ API calls
 */
export async function retryApiCall<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  return retry(fn, {
    maxRetries: 3,
    delay: 1000,
    backoff: true,
    backoffMultiplier: 2,
    maxDelay: 10000,
    shouldRetry: isRetryableError,
    ...options,
  });
}

/**
 * Helper لإعادة المحاولة مع إرجاع Result
 */
export async function retryApiCallWithResult<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<RetryResult<T>> {
  return retryWithResult(fn, {
    maxRetries: 3,
    delay: 1000,
    backoff: true,
    backoffMultiplier: 2,
    maxDelay: 10000,
    shouldRetry: isRetryableError,
    ...options,
  });
}

