/**
 * useSendVerificationEmail Hook - Hook لإرسال بريد التحقق
 *
 * Custom Hook لإدارة عملية إرسال بريد التحقق من البريد الإلكتروني
 */

import { useState, useCallback, useRef } from 'react'
import { authService } from '../api/auth.service'

interface UseSendVerificationEmailReturn {
  /** حالة التحميل */
  isLoading: boolean
  /** خطأ إن وجد */
  error: string | null
  /** نجح الإرسال */
  isSuccess: boolean
  /** إرسال بريد التحقق */
  sendVerificationEmail: (email: string) => Promise<void>
  /** مسح الخطأ */
  clearError: () => void
  /** إعادة تعيين الحالة */
  reset: () => void
  /** الوقت المتبقي قبل إمكانية إعادة الإرسال (بالثواني) */
  cooldownSeconds: number
}

/**
 * Hook لإرسال بريد التحقق من البريد الإلكتروني
 *
 * @param cooldownSeconds - الوقت بالثواني قبل إمكانية إعادة الإرسال (افتراضي: 60 ثانية)
 */
export function useSendVerificationEmail(
  cooldownSeconds: number = 60
): UseSendVerificationEmailReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [remainingCooldown, setRemainingCooldown] = useState(0)
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startCooldown = useCallback(() => {
    // Clear existing interval
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current)
    }

    setRemainingCooldown(cooldownSeconds)

    cooldownIntervalRef.current = setInterval(() => {
      setRemainingCooldown(prev => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current)
            cooldownIntervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [cooldownSeconds])

  const sendVerificationEmail = useCallback(
    async (email: string): Promise<void> => {
      if (remainingCooldown > 0) {
        setError(`يرجى الانتظار ${remainingCooldown} ثانية قبل إعادة الإرسال`)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        setIsSuccess(false)
        await authService.sendVerificationEmail(email)
        setIsSuccess(true)
        startCooldown()
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'فشل إرسال بريد التحقق. يرجى المحاولة مرة أخرى.'
        setError(errorMessage)
        setIsSuccess(false)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [remainingCooldown, startCooldown]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setIsSuccess(false)
    setRemainingCooldown(0)
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current)
      cooldownIntervalRef.current = null
    }
  }, [])

  return {
    isLoading,
    error,
    isSuccess,
    sendVerificationEmail,
    clearError,
    reset,
    cooldownSeconds: remainingCooldown,
  }
}
