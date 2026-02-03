/**
 * useAuth Hook - Hook للمصادقة
 *
 * Custom Hook لإدارة حالة المصادقة والمستخدم
 * يستخدم authStore كـ source of truth
 */

import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../api/auth.service'
import { useAuthStore } from '../store/authStore'
import { tokenManager } from '@/infrastructure/services/auth/token-manager.service'
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
    isLoading: storeIsLoading,
    isInitialized,
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
    if (storeIsLoading || hasLoadedUser.current) {
      return
    }

    if (!authService.isAuthenticated()) {
      setLoading(false)
      hasLoadedUser.current = true
      return
    }

    try {
      hasLoadedUser.current = true
      setLoading(true)
      setError(null)
      const userData = await authService.getCurrentUser()

      // Get tokens from multiple sources using TokenManager
      const tokenInfo = tokenManager.getTokens()

      if (!tokenInfo.accessToken || !tokenInfo.refreshToken) {
        throw new Error('No tokens found')
      }

      const tokens = {
        access_token: tokenInfo.accessToken,
        refresh_token: tokenInfo.refreshToken,
        token_type: 'Bearer' as const,
        expires_in: 3600,
      }
      loginStore(userData, tokens)
      loginStore(userData, tokens)
    } catch (err: unknown) {
      console.error('Failed to load user:', err)
      setError('فشل تحميل بيانات المستخدم')

      // Check for auth errors (401/403)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (err as any)?.response?.status || (err as any)?.status
      if (status === 401 || status === 403) {
        // useAuthStore.getState().reset() // DISABLED FOR DEBUGGING: Stop auto-reset to see the error
        hasLoadedUser.current = true // Stop retrying on auth failure
        // navigate('/login') // DISABLED FOR DEBUGGING: Stop auto-redirect
        setError(`Failed to load user profile (Status: ${status}). Token might be invalid.`)
      } else {
        hasLoadedUser.current = false // Allow retry on transient errors
        setError(`Failed to load user profile (Network/Server Error). Details: ${String(err)}`)
      }
    } finally {
      setLoading(false)
    }
  }, [storeIsLoading, setLoading, setError, loginStore]) // removed navigate due to debug disabled

  /**
   * تحميل المستخدم عند التحميل الأولي
   */
  useEffect(() => {
    // 1. الانتظار حتى تهيئة المتجر من localStorage
    if (!isInitialized) {
      return
    }

    // 2. التحقق مما إذا كان قد تم التحميل بالفعل
    if (hasLoadedUser.current) {
      return
    }

    const hasToken = authService.isAuthenticated()
    const tokens = useAuthStore.getState().tokens

    // Sync tokens from authStore to storageAdapter if needed
    if (tokens && (tokens.access_token || tokens.refresh_token)) {
      try {
        tokenManager.syncTokensFromStore()
      } catch {
        // Ignore sync errors
      }
    }

    if (hasToken && !user && !storeIsLoading) {
      // No user in store, load from API
      loadUser()
    } else if (!hasToken) {
      setLoading(false)
      hasLoadedUser.current = true
    } else if (user) {
      // User exists, ensure it's a User instance
      if (user && typeof user === 'object' && 'id' in user && !(user instanceof User)) {
        try {
          const userEntity = User.fromData(user as UserData)
          setUser(userEntity)
        } catch (error) {
          console.error('Failed to convert stored user to User entity:', error)
          loadUser()
          return
        }
      }
      hasLoadedUser.current = true
      setLoading(false)
    }
  }, [isInitialized, user, storeIsLoading, loadUser, setUser, setLoading])

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
   * يجلب البيانات المحدثة من API حتى لو كان المستخدم موجوداً في Store
   */
  const refreshUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      // إجبار تحديث بيانات المستخدم من API
      const userData = await authService.getCurrentUser()
      const tokens = {
        access_token: authService.getAccessToken()!,
        refresh_token: authService.getRefreshToken()!,
        token_type: 'Bearer' as const,
        expires_in: 3600,
      }
      // تحديث Store بالبيانات المحدثة
      loginStore(userData, tokens)
      // إعادة تعيين flag للسماح بإعادة التحميل في المستقبل
      hasLoadedUser.current = false
    } catch (err) {
      console.error('Failed to refresh user:', err)
      setError('فشل تحديث بيانات المستخدم')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, loginStore])

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
    isLoading: storeIsLoading,
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
