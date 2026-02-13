/**
 * useAuth Hook Tests - اختبارات Hook المصادقة
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from './useAuth'
import { useAuthStore } from '../store/authStore'
import { authService } from '../api/auth.service'
import { User } from '@/domain/entities/User'
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  UserData,
} from '@/domain/types/auth.types'

// Mock dependencies
vi.mock('../store/authStore')
vi.mock('../services')
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

describe('useAuth', () => {
  const mockUser = User.fromData({
    id: '1',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    role: 'student',
    planTier: 'FREE',
    permissions: [],
  })

  const mockTokens = {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    token_type: 'Bearer' as const,
    expires_in: 3600,
  }

  const mockLoginResponse: LoginResponse = {
    user: {
      id: '1',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'student',
      planTier: 'FREE',
      permissions: [],
    },
    tokens: mockTokens,
  }

  const mockStoreState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: true,
    error: null,
    setUser: vi.fn(),
    setTokens: vi.fn(),
    setAuthenticated: vi.fn(),
    setLoading: vi.fn(),
    setInitialized: vi.fn(),
    setError: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
    reset: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockReturnValue(mockStoreState)
    vi.mocked(authService.isAuthenticated).mockReturnValue(false)
    vi.mocked(authService.getAccessToken).mockReturnValue(null)
    vi.mocked(authService.getRefreshToken).mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state from store', () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should return user from store when available', () => {
      vi.mocked(useAuthStore).mockReturnValue({
        ...mockStoreState,
        user: mockUser,
        isAuthenticated: true,
      })

      const { result } = renderHook(() => useAuth())

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  describe('login', () => {
    it('should login successfully', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      }

      vi.mocked(authService.login).mockResolvedValueOnce(mockLoginResponse)

      const { result } = renderHook(() => useAuth())

      await result.current.login(credentials)

      expect(authService.login).toHaveBeenCalledWith(credentials)
      expect(mockStoreState.login).toHaveBeenCalledWith(expect.any(User), mockTokens)
      expect(mockStoreState.setLoading).toHaveBeenCalledWith(true)
      expect(mockStoreState.setLoading).toHaveBeenCalledWith(false)
    })

    it('should handle login error', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'wrong-password',
      }

      const error = new Error('Invalid credentials')
      vi.mocked(authService.login).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useAuth())

      await expect(result.current.login(credentials)).rejects.toThrow()

      expect(mockStoreState.setError).toHaveBeenCalledWith('Invalid credentials')
      expect(mockStoreState.setLoading).toHaveBeenCalledWith(false)
    })

    it('should set error message from API response', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'wrong-password',
      }

      const error = {
        response: {
          data: {
            message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
          },
        },
      }
      vi.mocked(authService.login).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useAuth())

      await expect(result.current.login(credentials)).rejects.toEqual(error)

      expect(mockStoreState.setError).toHaveBeenCalledWith(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      )
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      const registerData: RegisterRequest = {
        email: 'new@example.com',
        password: 'password123',
        first_name: 'New',
        last_name: 'User',
      }

      vi.mocked(authService.register).mockResolvedValueOnce(mockUser)

      const { result } = renderHook(() => useAuth())

      await result.current.register(registerData)

      expect(authService.register).toHaveBeenCalledWith(registerData)
      expect(mockStoreState.setUser).toHaveBeenCalledWith(mockUser)
      expect(mockStoreState.setLoading).toHaveBeenCalledWith(true)
      expect(mockStoreState.setLoading).toHaveBeenCalledWith(false)
    })

    it('should handle register error', async () => {
      const registerData: RegisterRequest = {
        email: 'existing@example.com',
        password: 'password123',
        first_name: 'Existing',
        last_name: 'User',
      }

      const error = new Error('Email already exists')
      vi.mocked(authService.register).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useAuth())

      await expect(result.current.register(registerData)).rejects.toThrow()

      expect(mockStoreState.setError).toHaveBeenCalledWith('Email already exists')
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      vi.mocked(authService.logout).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useAuth())

      await result.current.logout()

      expect(authService.logout).toHaveBeenCalled()
      expect(mockStoreState.logout).toHaveBeenCalled()
      expect(mockStoreState.setLoading).toHaveBeenCalledWith(true)
      expect(mockStoreState.setLoading).toHaveBeenCalledWith(false)
    })

    it('should clear store even if logout API fails', async () => {
      const error = new Error('Logout failed')
      vi.mocked(authService.logout).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useAuth())

      await result.current.logout()

      expect(mockStoreState.logout).toHaveBeenCalled()
      expect(mockStoreState.setError).toHaveBeenCalledWith('فشل تسجيل الخروج')
    })
  })

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateData: Partial<UserData> = {
        first_name: 'Updated',
        last_name: 'Name',
      }

      const updatedUser = User.fromData({
        ...mockUser.toData(),
        first_name: 'Updated',
        last_name: 'Name',
      })

      vi.mocked(authService.updateUser).mockResolvedValueOnce(updatedUser)

      const { result } = renderHook(() => useAuth())

      await result.current.updateUser(updateData)

      expect(authService.updateUser).toHaveBeenCalledWith(updateData)
      expect(mockStoreState.setUser).toHaveBeenCalledWith(updatedUser)
    })

    it('should handle update error', async () => {
      const updateData: Partial<UserData> = {
        first_name: 'Updated',
        last_name: 'Name',
      }

      const error = new Error('Update failed')
      vi.mocked(authService.updateUser).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useAuth())

      await expect(result.current.updateUser(updateData)).rejects.toThrow()

      expect(mockStoreState.setError).toHaveBeenCalledWith('Update failed')
    })
  })

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      vi.mocked(authService.updatePassword).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useAuth())

      await result.current.updatePassword('old-password', 'new-password')

      expect(authService.updatePassword).toHaveBeenCalledWith('old-password', 'new-password')
      expect(mockStoreState.setLoading).toHaveBeenCalledWith(true)
      expect(mockStoreState.setLoading).toHaveBeenCalledWith(false)
    })

    it('should handle update password error', async () => {
      const error = new Error('Current password is incorrect')
      vi.mocked(authService.updatePassword).mockRejectedValueOnce(error)

      const { result } = renderHook(() => useAuth())

      await expect(
        result.current.updatePassword('wrong-password', 'new-password')
      ).rejects.toThrow()

      expect(mockStoreState.setError).toHaveBeenCalledWith('Current password is incorrect')
    })
  })

  describe('refreshUser', () => {
    it('should refresh user data', async () => {
      vi.mocked(authService.isAuthenticated).mockReturnValue(true)
      vi.mocked(authService.getAccessToken).mockReturnValue('access-token')
      vi.mocked(authService.getRefreshToken).mockReturnValue('refresh-token')
      vi.mocked(authService.getCurrentUser).mockResolvedValueOnce(mockUser)

      vi.mocked(useAuthStore.getState).mockReturnValue({
        ...mockStoreState,
        user: null,
      })

      const { result } = renderHook(() => useAuth())

      await result.current.refreshUser()

      expect(authService.getCurrentUser).toHaveBeenCalled()
    })
  })

  describe('clearError', () => {
    it('should clear error', () => {
      const { result } = renderHook(() => useAuth())

      result.current.clearError()

      expect(mockStoreState.clearError).toHaveBeenCalled()
    })
  })

  describe('loadUser on mount', () => {
    it('should load user when token exists but user is null', async () => {
      vi.mocked(authService.isAuthenticated).mockReturnValue(true)
      vi.mocked(authService.getAccessToken).mockReturnValue('access-token')
      vi.mocked(authService.getRefreshToken).mockReturnValue('refresh-token')
      vi.mocked(authService.getCurrentUser).mockResolvedValueOnce(mockUser)

      vi.mocked(useAuthStore.getState).mockReturnValue({
        ...mockStoreState,
        user: null,
        isLoading: false,
      })

      renderHook(() => useAuth())

      await waitFor(() => {
        expect(authService.getCurrentUser).toHaveBeenCalled()
      })
    })

    it('should not load user when token does not exist', async () => {
      vi.mocked(authService.isAuthenticated).mockReturnValue(false)

      vi.mocked(useAuthStore.getState).mockReturnValue({
        ...mockStoreState,
        user: null,
        isLoading: false,
      })

      renderHook(() => useAuth())

      await waitFor(() => {
        expect(authService.getCurrentUser).not.toHaveBeenCalled()
        expect(mockStoreState.setLoading).toHaveBeenCalledWith(false)
      })
    })

    it('should not load user when user already exists', async () => {
      vi.mocked(authService.isAuthenticated).mockReturnValue(true)

      vi.mocked(useAuthStore.getState).mockReturnValue({
        ...mockStoreState,
        user: mockUser,
        isLoading: false,
      })

      renderHook(() => useAuth())

      await waitFor(() => {
        expect(authService.getCurrentUser).not.toHaveBeenCalled()
        expect(mockStoreState.setLoading).toHaveBeenCalledWith(false)
      })
    })
  })
})
