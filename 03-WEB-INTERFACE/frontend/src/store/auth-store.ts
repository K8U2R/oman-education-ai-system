import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/auth/auth-service';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email, password });
          
          // Store expiry time (assuming 1 hour expiry)
          const expiryTime = new Date();
          expiryTime.setHours(expiryTime.getHours() + 1);
          localStorage.setItem('token_expiry', expiryTime.toISOString());

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.register({ email, password, name });
          
          // Store expiry time (assuming 1 hour expiry)
          const expiryTime = new Date();
          expiryTime.setHours(expiryTime.getHours() + 1);
          localStorage.setItem('token_expiry', expiryTime.toISOString());

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token_expiry');
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
        // Store expiry time
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 1);
        localStorage.setItem('token_expiry', expiryTime.toISOString());
      },

      setRefreshToken: (token: string) => {
        set({ refreshToken: token });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

