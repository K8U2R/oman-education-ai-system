/**
 * Auth Store - مخزن المصادقة
 *
 * Zustand Store لإدارة حالة المصادقة
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/domain/entities/User'
import type { AuthTokens } from '@/domain/types/auth.types'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: user => set({ user }),
      setTokens: tokens => set({ tokens }),
      setAuthenticated: isAuthenticated => set({ isAuthenticated }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      login: (user, tokens) =>
        set({
          user,
          tokens,
          isAuthenticated: true,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
