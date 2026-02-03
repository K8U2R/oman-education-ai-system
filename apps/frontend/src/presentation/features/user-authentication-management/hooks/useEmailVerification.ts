/**
 * useEmailVerification Hook - Hook للتحقق من البريد الإلكتروني
 *
 * Custom Hook لإدارة عملية التحقق من البريد الإلكتروني
 */

import { useState, useCallback } from 'react'
import { authService } from '../api/auth.service'
import { User } from '@/domain/entities/User'

interface UseEmailVerificationReturn {
  /** حالة التحميل */
  isLoading: boolean
  /** خطأ إن وجد */
  error: string | null
  /** المستخدم المحدث بعد التحقق */
  verifiedUser: User | null
  /** التحقق من البريد الإلكتروني */
  verifyEmail: (token: string) => Promise<User>
  /** مسح الخطأ */
  clearError: () => void
}

/**
 * Hook للتحقق من البريد الإلكتروني
 */
export function useEmailVerification(): UseEmailVerificationReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifiedUser, setVerifiedUser] = useState<User | null>(null)

  const verifyEmail = useCallback(async (token: string): Promise<User> => {
    try {
      setIsLoading(true)
      setError(null)
      const user = await authService.verifyEmail(token)
      setVerifiedUser(user)
      return user
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'فشل التحقق من البريد الإلكتروني. يرجى المحاولة مرة أخرى.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    verifiedUser,
    verifyEmail,
    clearError,
  }
}
