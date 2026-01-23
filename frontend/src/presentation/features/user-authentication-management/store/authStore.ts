/**
 * Auth Store - مخزن المصادقة
 *
 * Zustand Store لإدارة حالة المصادقة
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/domain/entities/User'
import type { AuthTokens, UserData } from '@/domain/types/auth.types'
import { tokenManager } from '@/infrastructure/services/auth/token-manager.service'

import { AUTH_STORAGE_KEYS } from '@/domain/constants/auth.constants'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setLoading: (isLoading: boolean) => void
  setInitialized: (isInitialized: boolean) => void
  setError: (error: string | null) => void
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  reset: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      setUser: user => set({ user }),
      setTokens: tokens => set({ tokens }),
      setAuthenticated: isAuthenticated => set({ isAuthenticated }),
      setLoading: isLoading => set({ isLoading }),
      setInitialized: isInitialized => set({ isInitialized }),
      setError: error => set({ error }),

      login: (user, tokens) => {
        // Save tokens using TokenManager (saves to both storageAdapter and keeps store in sync)
        tokenManager.saveTokens(
          {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          },
          { syncToStore: false } // Don't sync to store here, we're already setting it below
        )

        set({
          user,
          tokens,
          isAuthenticated: true,
          error: null,
        })
      },

      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        }),

      reset: () => {
        // 1. Clear tokens from storage manager
        tokenManager.clearTokens()

        // 2. Reset local storage
        localStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_STORE)

        // 3. Reset store state
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
          isInitialized: true, // Keep initialized to avoid freezing
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: AUTH_STORAGE_KEYS.AUTH_STORE,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        // Convert User entity to UserData for storage
        // Check if user is User instance, if not, it's already UserData from localStorage
        user: state.user
          ? state.user instanceof User
            ? state.user.toData()
            : state.user // Already UserData, use as is
          : null,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
      // Convert UserData back to User entity when loading from storage
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('[AuthStore] Failed to rehydrate auth store:', error)
            return
          }

          // Ensure state exists
          if (!state) {
            if (import.meta.env.DEV) {
              console.warn('[AuthStore] No state to rehydrate')
            }
            return
          }

          // Convert user from UserData to User entity if needed
          if (
            state.user &&
            typeof state.user === 'object' &&
            'id' in state.user &&
            !(state.user instanceof User)
          ) {
            try {
              state.user = User.fromData(state.user as UserData)
              // User entity restored from storage (no logging needed in production)
            } catch (err) {
              console.error('[AuthStore] Failed to restore User entity from storage:', err)
              state.user = null
              state.isAuthenticated = false
            }
          }

          // Note: Token sync to storageAdapter is handled in useAuth hook after rehydration
          // to avoid infinite rehydration loop (writing to localStorage triggers rehydration)

          // Step 1: Mark as initialized
          state.isInitialized = true
        }
      },
    }
  )
)
