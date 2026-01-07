/**
 * useAuth Hook - Hook للمصادقة
 *
 * Custom Hook لإدارة حالة المصادقة والمستخدم
 * يستخدم authStore كـ source of truth
 */

import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services'
import { useAuthStore } from '../store/authStore'
import { User } from '@/domain/entities/User'
import type { LoginRequest, RegisterRequest, LoginResponse } from '@/domain/types/auth.types'
import type { UserData } from '@/domain/types/auth.types'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateUser: (data: Partial<UserData>) => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  clearError: () => void
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate()
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    login: loginStore,
    logout: logoutStore,
    clearError: clearErrorStore,
  } = useAuthStore()
  const hasLoadedUser = useRef(false) // Flag to prevent multiple loads

  /**
   * تحميل المستخدم الحالي من API إذا كان هناك token لكن لا يوجد user
   */
  const loadUser = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoading || hasLoadedUser.current) {
      return
    }

    if (!authService.isAuthenticated()) {
      setLoading(false)
      hasLoadedUser.current = true
      return
    }

    // Check user from store directly (not from dependencies)
    const currentUser = useAuthStore.getState().user
    if (currentUser) {
      setLoading(false)
      hasLoadedUser.current = true
      return
    }

    try {
      hasLoadedUser.current = true // Mark as loading to prevent re-runs
      setLoading(true)
      setError(null)
      const userData = await authService.getCurrentUser()
      const tokens = {
        access_token: authService.getAccessToken()!,
        refresh_token: authService.getRefreshToken()!,
        token_type: 'Bearer' as const,
        expires_in: 3600,
      }
      loginStore(userData, tokens)
    } catch (err) {
      console.error('Failed to load user:', err)
      setError('فشل تحميل بيانات المستخدم')
      logoutStore() // Clear store on error
      hasLoadedUser.current = false // Allow retry on error
    } finally {
      setLoading(false)
    }
  }, [isLoading, setLoading, setError, loginStore, logoutStore])

  /**
   * تحميل المستخدم عند التحميل الأولي (مرة واحدة فقط)
   */
  useEffect(() => {
    // Only load if we haven't loaded yet
    if (hasLoadedUser.current) {
      return
    }

    const hasToken = authService.isAuthenticated()
    const currentUser = useAuthStore.getState().user

    if (hasToken && !currentUser && !isLoading) {
      loadUser()
    } else if (!hasToken) {
      setLoading(false)
      hasLoadedUser.current = true
    } else if (currentUser) {
      // User already exists, mark as loaded
      hasLoadedUser.current = true
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount

  /**
   * تسجيل الدخول
   */
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true)
        setError(null)
        const response: LoginResponse = await authService.login(credentials)
        const userData = User.fromData(response.user)
        loginStore(userData, response.tokens)
        navigate('/dashboard')
      } catch (err: unknown) {
        interface ErrorWithResponse extends Error {
          response?: {
            data?: {
              message?: string
            }
          }
        }
        const error = err as ErrorWithResponse
        const errorMessage = error?.response?.data?.message || error?.message || 'فشل تسجيل الدخول'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [navigate, setLoading, setError, loginStore]
  )

  /**
   * التسجيل
   */
  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        setLoading(true)
        setError(null)
        const newUser = await authService.register(data)
        // بعد التسجيل، يجب تسجيل الدخول أولاً
        // يمكن إضافة login تلقائي هنا إذا كان API يعيد tokens
        setUser(newUser)
        navigate('/dashboard')
      } catch (err: unknown) {
        interface ErrorWithResponse extends Error {
          response?: {
            data?: {
              message?: string
            }
          }
        }
        const error = err as ErrorWithResponse
        const errorMessage = error?.response?.data?.message || error?.message || 'فشل التسجيل'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [navigate, setLoading, setError, setUser]
  )

  /**
   * تسجيل الخروج
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await authService.logout()
      logoutStore()
      navigate('/')
    } catch (err) {
      console.error('Logout error:', err)
      setError('فشل تسجيل الخروج')
      // Clear store even if API call fails
      logoutStore()
    } finally {
      setLoading(false)
    }
  }, [navigate, setLoading, setError, logoutStore])

  /**
   * تحديث بيانات المستخدم
   */
  const refreshUser = useCallback(async () => {
    await loadUser()
  }, [loadUser])

  /**
   * تحديث بيانات المستخدم
   */
  const updateUser = useCallback(
    async (data: Partial<UserData>) => {
      try {
        setLoading(true)
        setError(null)
        const updatedUser = await authService.updateUser(data)
        setUser(updatedUser)
      } catch (err: unknown) {
        interface ErrorWithResponse extends Error {
          response?: {
            data?: {
              message?: string
            }
          }
        }
        const error = err as ErrorWithResponse
        const errorMessage =
          error?.response?.data?.message || error?.message || 'فشل تحديث بيانات المستخدم'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setUser]
  )

  /**
   * تحديث كلمة المرور
   */
  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        setLoading(true)
        setError(null)
        await authService.updatePassword(currentPassword, newPassword)
      } catch (err: unknown) {
        interface ErrorWithResponse extends Error {
          response?: {
            data?: {
              message?: string
            }
          }
        }
        const error = err as ErrorWithResponse
        const errorMessage =
          error?.response?.data?.message || error?.message || 'فشل تحديث كلمة المرور'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError]
  )

  /**
   * مسح الخطأ
   */
  const clearError = useCallback(() => {
    clearErrorStore()
  }, [clearErrorStore])

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    updatePassword,
    clearError,
  }
}
