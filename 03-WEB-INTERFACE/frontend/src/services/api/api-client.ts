import { errorService } from '@/core/error/ErrorService';
import { useAuthStore } from '@/store/auth-store';
import { refreshTokenIfNeeded } from './interceptors';

// بناء API URL بشكل صحيح
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // تنظيف URL: إزالة المسافات والشرطة المائلة في النهاية
    let cleanUrl = envUrl.trim().replace(/\/+$/, '');
    
    // إزالة أي تكرار لـ /api (مثل /api/api أو /api/v1/api)
    cleanUrl = cleanUrl.replace(/\/api\/api(\/|$)/g, '/api$1');
    cleanUrl = cleanUrl.replace(/\/api\/v1\/api$/, '/api/v1');
    
    // إذا كان URL يحتوي على /api/v1، نستخدمه كما هو
    if (cleanUrl.includes('/api/v1')) {
      return cleanUrl;
    }
    
    // إذا كان URL ينتهي بـ /api، نستخدمه كما هو
    if (cleanUrl.endsWith('/api')) {
      return cleanUrl;
    }
    
    // إذا كان URL ينتهي بـ /v1، نضيف /api قبله
    if (cleanUrl.endsWith('/v1')) {
      return cleanUrl.replace(/\/v1$/, '/api/v1');
    }
    
    // إذا لم يكن يحتوي على /api، أضفه
    return `${cleanUrl}/api`;
  }
  // Default fallback
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;

    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (!skipAuth) {
      const token = useAuthStore.getState().token;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

        try {
          let response = await fetch(url, {
            ...fetchOptions,
            headers,
          });

          // Handle 401 Unauthorized - try to refresh token
          if (response.status === 401 && !skipAuth) {
            const newToken = await refreshTokenIfNeeded();
            if (newToken) {
              headers['Authorization'] = `Bearer ${newToken}`;
              // Retry the request with new token
              response = await fetch(url, {
                ...fetchOptions,
                headers,
              });
            }
          }

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                // Handle specific error cases
                if (response.status === 401) {
                  useAuthStore.getState().logout();
                  throw new Error('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.');
                }

                // استخراج رسالة الخطأ من Backend (قد تكون string أو object)
                let errorMessage = `HTTP error! status: ${response.status}`;
                if (errorData) {
                  if (typeof errorData === 'string') {
                    errorMessage = errorData;
                  } else if (errorData.detail) {
                    // FastAPI يعيد detail كـ string أو object
                    if (typeof errorData.detail === 'string') {
                      errorMessage = errorData.detail;
                    } else if (errorData.detail.message) {
                      errorMessage = errorData.detail.message;
                    } else if (errorData.detail.error) {
                      errorMessage = `خطأ: ${errorData.detail.error}`;
                    }
                  } else if (errorData.message) {
                    errorMessage = errorData.message;
                  } else if (errorData.error) {
                    errorMessage = errorData.error;
                  }
                }

                const error = new Error(errorMessage);
                // إضافة معلومات إضافية للخطأ
                (error as any).status = response.status;
                (error as any).errorData = errorData;
                throw error;
              }

          return await response.json();
        } catch (error) {
          // فقط سجل الأخطاء المهمة (ليس أخطاء الاتصال في وضع التطوير)
          const isConnectionError = error instanceof TypeError && error.message.includes('Failed to fetch');
          const isDevMode = import.meta.env.DEV;
          
          if (!isConnectionError || !isDevMode) {
            const err = error instanceof Error ? error : new Error(String(error));
            const statusCode = (err as any).status;
            const errorData = (err as any).errorData;
            
            // تحديد الفئة بناءً على نوع الخطأ
            let category: 'api' | 'network' | 'validation' | 'authentication' | 'authorization' | 'system' | 'unknown' = 'unknown';
            if (isConnectionError) {
              category = 'network';
            } else if (statusCode === 401) {
              category = 'authentication';
            } else if (statusCode === 403) {
              category = 'authorization';
            } else if (statusCode === 400 || statusCode === 422) {
              category = 'validation';
            } else if (statusCode >= 500) {
              category = 'system';
            } else if (statusCode) {
              category = 'api';
            }

            // استخراج معلومات إضافية من errorData
            const helpUrl = errorData?.detail?.activation_url || errorData?.detail?.help_url;
            const errorCode = errorData?.detail?.error || errorData?.error;
            const suggestions: string[] = [];
            
            if (errorData?.detail?.error === 'gemini_api_disabled') {
              suggestions.push('تفعيل Gemini API من Google Cloud Console');
              suggestions.push('التحقق من أن API Key مرتبط بالمشروع الصحيح');
            } else if (errorData?.detail?.error === 'gemini_api_key_missing') {
              suggestions.push('إضافة GEMINI_API_KEY إلى ملف .env');
              suggestions.push('التحقق من متغيرات البيئة');
            }

            errorService.logError(
              err,
              undefined,
              {
                title: 'خطأ في API',
                message: err.message || 'فشل في تنفيذ الطلب',
                level: 'error',
                category,
                source: 'api-client',
                action: `${fetchOptions.method || 'GET'} ${endpoint}`,
                url: url,
                method: fetchOptions.method || 'GET',
                statusCode,
                errorCode,
                details: errorData ? JSON.stringify(errorData, null, 2) : undefined,
                context: errorData?.detail?.context || errorData?.context,
                helpUrl,
                suggestions: suggestions.length > 0 ? suggestions : undefined,
              }
            );
          }
          throw error;
        }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

