import React, { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { token, isAuthenticated, setToken } = useAuthStore();

  useEffect(() => {
    // Check if token is valid and refresh if needed
    if (token && isAuthenticated) {
      const checkToken = async () => {
        try {
          // Token validation logic here
          // If token is expired, try to refresh it
        } catch (error) {
          // Token is invalid, logout user
          useAuthStore.getState().logout();
        }
      };

      checkToken();
    }
  }, [token, isAuthenticated, setToken]);

  return <>{children}</>;
};

