/**
 * useRole Hook Tests - اختبارات Hook الأدوار والصلاحيات
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRole } from './useRole'
import { useAuth } from './useAuth'
import { RoleService } from '@/domain/services/role.service'
import { User } from '@/domain/entities/User'
import type { UserRole, Permission } from '@/domain/types/auth.types'

vi.mock('./useAuth')
vi.mock('@/domain/services/role.service')

describe('useRole', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'student' as UserRole,
    permissions: [] as Permission[],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return default role when user is null', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      clearError: vi.fn(),
    })

    const { result } = renderHook(() => useRole())

    expect(result.current.userRole).toBe('student')
    expect(result.current.userPermissions).toEqual([])
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.isTeacher).toBe(false)
    expect(result.current.isStudent).toBe(true)
  })

  it('should return user role when user exists', () => {
    const user = User.fromData(mockUser)
    vi.mocked(useAuth).mockReturnValue({
      user,
      isLoading: false,
      isAuthenticated: true,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      clearError: vi.fn(),
    })

    vi.mocked(RoleService.getRolePermissions).mockReturnValue([])

    const { result } = renderHook(() => useRole())

    expect(result.current.userRole).toBe('student')
  })

  it('should use custom permissions when available', () => {
    const user = User.fromData({
      ...mockUser,
      permissions: ['lessons.view', 'lessons.create'] as Permission[],
    })
    vi.mocked(useAuth).mockReturnValue({
      user,
      isLoading: false,
      isAuthenticated: true,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      clearError: vi.fn(),
    })

    const { result } = renderHook(() => useRole())

    expect(result.current.userPermissions).toEqual(['lessons.view', 'lessons.create'])
    expect(RoleService.getRolePermissions).not.toHaveBeenCalled()
  })

  it('should use role permissions when custom permissions are empty', () => {
    const user = User.fromData(mockUser)
    vi.mocked(useAuth).mockReturnValue({
      user,
      isLoading: false,
      isAuthenticated: true,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      clearError: vi.fn(),
    })

    vi.mocked(RoleService.getRolePermissions).mockReturnValue(['lessons.view'] as Permission[])

    const { result } = renderHook(() => useRole())

    expect(result.current.userPermissions).toEqual(['read:lessons'])
    expect(RoleService.getRolePermissions).toHaveBeenCalledWith('student')
  })

  describe('hasRole', () => {
    it('should return false when user is null', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: vi.fn(),
        updateUser: vi.fn(),
        updatePassword: vi.fn(),
        clearError: vi.fn(),
      })

      const { result } = renderHook(() => useRole())

      expect(result.current.hasRole('admin')).toBe(false)
    })

    it('should check role using RoleService', () => {
      const user = User.fromData({ ...mockUser, role: 'admin' })
      vi.mocked(useAuth).mockReturnValue({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: vi.fn(),
        updateUser: vi.fn(),
        updatePassword: vi.fn(),
        clearError: vi.fn(),
      })

      vi.mocked(RoleService.hasRole).mockReturnValue(true)

      const { result } = renderHook(() => useRole())

      expect(result.current.hasRole('admin')).toBe(true)
      expect(RoleService.hasRole).toHaveBeenCalledWith('admin', 'admin')
    })
  })

  describe('hasPermission', () => {
    it('should return false when user is null', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: vi.fn(),
        updateUser: vi.fn(),
        updatePassword: vi.fn(),
        clearError: vi.fn(),
      })

      const { result } = renderHook(() => useRole())

      expect(result.current.hasPermission('lessons.view')).toBe(false)
    })

    it('should check permission using RoleService', () => {
      const user = User.fromData(mockUser)
      vi.mocked(useAuth).mockReturnValue({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: vi.fn(),
        updateUser: vi.fn(),
        updatePassword: vi.fn(),
        clearError: vi.fn(),
      })

      vi.mocked(RoleService.getRolePermissions).mockReturnValue(['lessons.view'] as Permission[])
      vi.mocked(RoleService.hasPermission).mockReturnValue(true)

      const { result } = renderHook(() => useRole())

      expect(result.current.hasPermission('lessons.view')).toBe(true)
    })
  })

  describe('role checks', () => {
    it('should correctly identify admin', () => {
      const user = User.fromData({ ...mockUser, role: 'admin' })
      vi.mocked(useAuth).mockReturnValue({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: vi.fn(),
        updateUser: vi.fn(),
        updatePassword: vi.fn(),
        clearError: vi.fn(),
      })

      vi.mocked(RoleService.getRolePermissions).mockReturnValue([])

      const { result } = renderHook(() => useRole())

      expect(result.current.isAdmin).toBe(true)
      expect(result.current.isTeacher).toBe(true)
      expect(result.current.isDeveloper).toBe(true)
    })

    it('should correctly identify teacher', () => {
      const user = User.fromData({ ...mockUser, role: 'teacher' })
      vi.mocked(useAuth).mockReturnValue({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: vi.fn(),
        updateUser: vi.fn(),
        updatePassword: vi.fn(),
        clearError: vi.fn(),
      })

      vi.mocked(RoleService.getRolePermissions).mockReturnValue([])

      const { result } = renderHook(() => useRole())

      expect(result.current.isAdmin).toBe(false)
      expect(result.current.isTeacher).toBe(true)
      expect(result.current.isStudent).toBe(false)
    })

    it('should correctly identify student', () => {
      const user = User.fromData(mockUser)
      vi.mocked(useAuth).mockReturnValue({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: vi.fn(),
        updateUser: vi.fn(),
        updatePassword: vi.fn(),
        clearError: vi.fn(),
      })

      vi.mocked(RoleService.getRolePermissions).mockReturnValue([])

      const { result } = renderHook(() => useRole())

      expect(result.current.isAdmin).toBe(false)
      expect(result.current.isTeacher).toBe(false)
      expect(result.current.isStudent).toBe(true)
    })
  })
})
