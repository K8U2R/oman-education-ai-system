/**
 * Auth Store - Simplified Zustand Store
 *
 * @description
 * Minimal auth context store - only user, tokens, and isAuthenticated.
 * Server state (loading, errors) managed by TanStack Query hooks.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/domain/entities/User'
import type { AuthTokens } from '@/domain/types/auth.types'

interface AuthState {
    // State
    user: User | null
    tokens: AuthTokens | null
    isAuthenticated: boolean

    // Actions
    login: (user: User, tokens: AuthTokens) => void
    logout: () => void
    setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial State
            user: null,
            tokens: null,
            isAuthenticated: false,

            // Actions
            login: (user, tokens) =>
                set({
                    user,
                    tokens,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                }),

            setUser: (user) =>
                set({
                    user,
                }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                tokens: state.tokens,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
