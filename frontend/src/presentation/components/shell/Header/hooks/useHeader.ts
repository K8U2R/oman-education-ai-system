/**
 * useHeader Hook - Hook لإدارة Header
 *
 * Hook مخصص لإدارة حالة Header والتفاعلات
 */

import { useState, useCallback } from 'react'
import { useAuth, useRole } from '@/features/user-authentication-management'
import type { UseHeaderOptions, UseHeaderReturn } from '../types'

/**
 * useHeader Hook
 *
 * @param options - خيارات Header
 * @returns حالة Header والوظائف
 */
export const useHeader = (options: UseHeaderOptions = {}): UseHeaderReturn => {
  const { isAuthenticated, user } = useAuth()
  const { isAdmin, isDeveloper } = useRole()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  /**
   * دالة تبديل Sidebar
   */
  const handleSidebarToggle = options.onSidebarToggle ? useCallback(() => {
    options.onSidebarToggle?.()
  }, [options.onSidebarToggle]) : undefined

  /**
   * دالة تبديل Mobile Menu
   */
  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  /**
   * دالة تبديل SearchBar
   */
  const handleSearchToggle = useCallback(() => {
    setIsSearchExpanded(prev => !prev)
  }, [])

  return {
    isAuthenticated: isAuthenticated ?? false,
    user: user ?? null,
    isAdmin: isAdmin ?? false,
    isDeveloper: isDeveloper ?? false,
    isMobileMenuOpen,
    isSearchExpanded,
    handleSidebarToggle,
    handleMobileMenuToggle,
    handleSearchToggle,
  }
}
