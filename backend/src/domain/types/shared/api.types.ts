/**
 * API Types - أنواع API
 *
 * أنواع موحدة لـ API Requests و Responses
 * توفر بنية موحدة لجميع endpoints
 */

/**
 * API Error Code - رمز خطأ API
 *
 * رموز الأخطاء الموحدة في النظام
 */
export type APIErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "RATE_LIMIT_EXCEEDED"
  | "STORAGE_ERROR"
  | "AUTH_ERROR"
  | "DATABASE_ERROR"
  | "DATABASE_ERROR"
  | "EXTERNAL_SERVICE_ERROR"
  | "AUTHENTICATION_FAILED"
  | "INVALID_TOKEN";

/**
 * API Error - خطأ API
 *
 * بنية موحدة لأخطاء API
 */
export interface APIError {
  message: string;
  code: APIErrorCode;
  details?: unknown;
  field?: string; // للـ validation errors
}

/**
 * API Success Response - استجابة نجاح API
 *
 * بنية موحدة لاستجابات النجاح
 *
 * @template T - نوع البيانات المرجعة
 *
 * @example
 * ```typescript
 * const response: APIResponse<UserData> = {
 *   success: true,
 *   data: userData,
 *   message: 'تم الحصول على المستخدم بنجاح'
 * }
 * ```
 */
export interface APISuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    total_pages?: number;
    [key: string]: unknown;
  };
}

/**
 * API Error Response - استجابة خطأ API
 *
 * بنية موحدة لاستجابات الأخطاء
 *
 * @example
 * ```typescript
 * const response: APIErrorResponse = {
 *   success: false,
 *   error: {
 *     message: 'المستخدم غير موجود',
 *     code: 'NOT_FOUND'
 *   }
 * }
 * ```
 */
export interface APIErrorResponse {
  success: false;
  error: APIError;
}

/**
 * API Response - استجابة API
 *
 * نوع موحد لجميع استجابات API
 *
 * @template T - نوع البيانات في حالة النجاح
 *
 * @example
 * ```typescript
 * function getUser(id: string): Promise<APIResponse<UserData>> {
 *   // ...
 * }
 * ```
 */
export type APIResponse<T = unknown> = APISuccessResponse<T> | APIErrorResponse;

/**
 * API Paginated Response - استجابة API مع تصفح
 *
 * استجابة موحدة للـ paginated results
 *
 * @template T - نوع العناصر في القائمة
 *
 * @example
 * ```typescript
 * const response: APIPaginatedResponse<UserData> = {
 *   success: true,
 *   data: {
 *     items: users,
 *     pagination: {
 *       page: 1,
 *       per_page: 20,
 *       total: 100,
 *       total_pages: 5
 *     }
 *   }
 * }
 * ```
 */
export type APIPaginatedResponse<T> = APISuccessResponse<{
  items: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}>;

/**
 * API Request - طلب API
 *
 * نوع أساسي لطلبات API
 */
export interface APIRequest {
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, unknown>;
}

/**
 * API Handler Function - دالة معالج API
 *
 * نوع موحد لدوال معالجات API
 *
 * @template TRequest - نوع Request
 * @template TResponse - نوع Response
 *
 * @example
 * ```typescript
 * const handler: APIHandlerFunction<Request, Response> = async (req, res) => {
 *   // ...
 * }
 * ```
 */
export type APIHandlerFunction<TRequest, TResponse> = (
  req: TRequest,
  res: TResponse,
) => Promise<TResponse>;

/**
 * API Validation Error - خطأ التحقق في API
 *
 * بنية موحدة لأخطاء التحقق من البيانات في استجابات API
 * (يختلف عن ValidationError class في exceptions)
 */
export interface APIValidationError {
  field: string;
  message: string;
  value?: unknown;
  code?: string;
}

/**
 * Validation Errors - أخطاء التحقق
 *
 * قائمة بأخطاء التحقق
 */
export interface ValidationErrors {
  errors: APIValidationError[];
  message?: string;
}

/**
 * API Validation Error Response - استجابة خطأ التحقق
 *
 * استجابة خاصة بأخطاء التحقق
 */
export interface APIValidationErrorResponse extends APIErrorResponse {
  error: APIError & {
    code: "VALIDATION_ERROR";
    validation_errors?: APIValidationError[];
  };
}

/**
 * Health Check Response - استجابة فحص الصحة
 *
 * بنية موحدة لـ health check endpoints
 */
export interface HealthCheckResponse {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  version?: string;
  services?: {
    [serviceName: string]: {
      status: "healthy" | "unhealthy";
      response_time?: number;
      error?: string;
    };
  };
}

/**
 * API Status Code - رمز حالة HTTP
 *
 * رموز HTTP الموحدة المستخدمة في النظام
 */
export type APIStatusCode =
  | 200 // OK
  | 201 // Created
  | 204 // No Content
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 422 // Unprocessable Entity
  | 429 // Too Many Requests
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503; // Service Unavailable

/**
 * API Response Helper - مساعد استجابة API
 *
 * Utility functions لإنشاء استجابات API
 */
export const APIResponseHelper = {
  /**
   * إنشاء استجابة نجاح
   */
  success<T>(data: T, message?: string): APISuccessResponse<T> {
    return {
      success: true,
      data,
      ...(message && { message }),
    };
  },

  /**
   * إنشاء استجابة خطأ
   */
  error(error: APIError): APIErrorResponse {
    return {
      success: false,
      error,
    };
  },

  /**
   * إنشاء استجابة paginated
   */
  paginated<T>(
    items: T[],
    page: number,
    perPage: number,
    total: number,
  ): APIPaginatedResponse<T> {
    return {
      success: true,
      data: {
        items,
        pagination: {
          page,
          per_page: perPage,
          total,
          total_pages: Math.ceil(total / perPage),
        },
      },
    };
  },

  /**
   * إنشاء استجابة validation error
   */
  validationError(
    message: string,
    errors: APIValidationError[],
  ): APIValidationErrorResponse {
    return {
      success: false,
      error: {
        message,
        code: "VALIDATION_ERROR",
        validation_errors: errors,
      },
    };
  },
} as const;
