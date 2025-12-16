/**
 * Request/Response Interceptors
 */

// import { apiClient } from './api-client';
import { useAuthStore } from '@/store/auth-store';
import { errorService } from '@/core/error/ErrorService';

// Request Interceptor
export function setupRequestInterceptor(): void {
  // This would typically be set up in the API client
  // For now, we handle it in api-client.ts
}

// Response Interceptor
export function setupResponseInterceptor(): void {
  // This would typically be set up in the API client
  // For now, we handle it in api-client.ts
}

import { authService } from '@/services/auth/auth-service';

// Token Refresh Interceptor
export async function refreshTokenIfNeeded(): Promise<string | null> {
  const { token, refreshToken } = useAuthStore.getState();
  
  if (!token) {
    return null;
  }

  try {
    // Check if token is expired (simple check - in production, decode JWT)
    const tokenExpiry = localStorage.getItem('token_expiry');
    if (tokenExpiry && new Date(tokenExpiry) > new Date()) {
      return token; // Token is still valid
    }

    // Token expired, refresh it
    if (refreshToken) {
      const newToken = await authService.refreshToken();
      useAuthStore.getState().setToken(newToken);
      
      // Store expiry time (assuming 1 hour expiry)
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 1);
      localStorage.setItem('token_expiry', expiryTime.toISOString());
      
      return newToken;
    }

    return token;
  } catch (error) {
    errorService.logError(
      error instanceof Error ? error : new Error(String(error)),
      undefined,
      {
        title: 'خطأ في تحديث الرمز',
        message: 'فشل تحديث رمز المصادقة. سيتم تسجيل الخروج.',
        level: 'error',
      }
    );
    useAuthStore.getState().logout();
    return null;
  }
}

