import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { useAuthStore } from '@/store/auth-store';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'user' | 'admin';
    createdAt: string;
  };
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials,
      { skipAuth: true }
    );

    useAuthStore.getState().setToken(response.token);
    useAuthStore.getState().updateUser(response.user);

    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      data,
      { skipAuth: true }
    );

    useAuthStore.getState().setToken(response.token);
    useAuthStore.getState().updateUser(response.user);

    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      useAuthStore.getState().logout();
    }
  }

  async refreshToken(): Promise<string> {
    const { refreshToken } = useAuthStore.getState();
    
    if (!refreshToken) {
      throw new Error('لا يوجد refresh token');
    }

    const response = await apiClient.post<{ token: string; refreshToken?: string }>(
      API_ENDPOINTS.auth.refresh,
      { refreshToken },
      { skipAuth: true }
    );

    useAuthStore.getState().setToken(response.token);
    if (response.refreshToken) {
      useAuthStore.getState().setRefreshToken(response.refreshToken);
    }
    
    return response.token;
  }

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.auth.verify,
      { token },
      { skipAuth: true }
    );
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.auth.forgotPassword,
      { email },
      { skipAuth: true }
    );
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.auth.resetPassword,
      { token, password },
      { skipAuth: true }
    );
  }

  /**
   * Initiate Google OAuth login
   * Returns the OAuth URL to redirect to
   */
  async initiateGoogleOAuth(): Promise<{ url: string }> {
    const response = await apiClient.get<{ url: string }>(
      API_ENDPOINTS.auth.oauth.google.initiate,
      { skipAuth: true }
    );
    return response;
  }

  /**
   * Handle Google OAuth callback
   * Called after user authorizes on Google
   */
  async handleGoogleOAuthCallback(code: string, state?: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.oauth.google.callback,
      { code, state },
      { skipAuth: true }
    );

    useAuthStore.getState().setToken(response.token);
    useAuthStore.getState().updateUser(response.user);

    return response;
  }

  /**
   * Initiate GitHub OAuth login
   * Returns the OAuth URL to redirect to
   */
  async initiateGitHubOAuth(): Promise<{ url: string }> {
    const response = await apiClient.get<{ url: string }>(
      API_ENDPOINTS.auth.oauth.github.initiate,
      { skipAuth: true }
    );
    return response;
  }

  /**
   * Handle GitHub OAuth callback
   * Called after user authorizes on GitHub
   */
  async handleGitHubOAuthCallback(code: string, state?: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.oauth.github.callback,
      { code, state },
      { skipAuth: true }
    );

    useAuthStore.getState().setToken(response.token);
    useAuthStore.getState().updateUser(response.user);

    return response;
  }
}

export const authService = new AuthService();

