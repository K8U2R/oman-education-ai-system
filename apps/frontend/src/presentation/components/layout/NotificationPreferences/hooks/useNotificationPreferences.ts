/**
 * useNotificationPreferences Hook - Hook لإدارة تفضيلات الإشعارات
 *
 * Hook مخصص لجلب وتحديث تفضيلات الإشعارات مع optimistic updates
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '@/infrastructure/services/api'
import type {
  NotificationPreferences,
  NotificationPreferencesResponse,
  UpdateNotificationPreferencesRequest,
  NotificationPreference,
} from '../types'
import { DEFAULT_NOTIFICATION_PREFERENCES } from '../constants'

interface UseNotificationPreferencesOptions {
  autoFetch?: boolean
  onSuccess?: (data: NotificationPreferences) => void
  onError?: (error: Error) => void
}

export interface UseNotificationPreferencesReturn {
  /** البيانات الحالية */
  preferences: NotificationPreferences | null
  /** حالة التحميل */
  loading: boolean
  /** حالة الحفظ */
  saving: boolean
  /** الخطأ إن وجد */
  error: Error | null
  /** هل تم التعديل */
  hasChanges: boolean
  /** جلب البيانات */
  fetchPreferences: () => Promise<void>
  /** تحديث تفضيل */
  updatePreference: (
    categoryId: string,
    preferenceType: string,
    updates: Partial<NotificationPreference>
  ) => void
  /** تحديث قناة */
  updateChannel: (
    categoryId: string,
    preferenceType: string,
    channel: 'in-app' | 'email' | 'push',
    enabled: boolean,
    sound?: boolean
  ) => void
  /** حفظ التغييرات */
  savePreferences: () => Promise<boolean>
  /** إعادة تعيين للإعدادات الافتراضية */
  resetToDefaults: () => void
  /** كتم/إلغاء كتم عام */
  toggleGlobalMute: () => void
  /** إعادة تعيين التغييرات */
  resetChanges: () => void
}

/**
 * Hook لإدارة تفضيلات الإشعارات
 */
export function useNotificationPreferences(
  options: UseNotificationPreferencesOptions = {}
): UseNotificationPreferencesReturn {
  const { autoFetch = true, onSuccess, onError } = options

  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [originalPreferences, setOriginalPreferences] = useState<NotificationPreferences | null>(
    null
  )
  const [loading, setLoading] = useState<boolean>(autoFetch)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * جلب التفضيلات من API
   */
  const fetchPreferences = useCallback(async () => {
    // إلغاء الطلب السابق إن وجد
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.get<NotificationPreferencesResponse>(
        '/notifications/preferences',
        {
          signal: abortControllerRef.current.signal,
        }
      )

      if (response.success && response.data) {
        const data = response.data
        setPreferences(data)
        setOriginalPreferences(JSON.parse(JSON.stringify(data))) // Deep copy
        onSuccess?.(data)
      } else {
        // استخدام الإعدادات الافتراضية إذا فشل الطلب
        const defaultData: NotificationPreferences = {
          categories: DEFAULT_NOTIFICATION_PREFERENCES,
          globalMute: false,
        }
        setPreferences(defaultData)
        setOriginalPreferences(JSON.parse(JSON.stringify(defaultData)))
      }
    } catch (err) {
      // في حالة الخطأ، استخدم الإعدادات الافتراضية
      const defaultData: NotificationPreferences = {
        categories: DEFAULT_NOTIFICATION_PREFERENCES,
        globalMute: false,
      }
      setPreferences(defaultData)
      setOriginalPreferences(JSON.parse(JSON.stringify(defaultData)))

      const error = err instanceof Error ? err : new Error('فشل جلب تفضيلات الإشعارات')
      setError(error)
      onError?.(error)
      console.error('Failed to fetch notification preferences:', error)
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [onSuccess, onError])

  /**
   * تحديث تفضيل محدد
   */
  const updatePreference = useCallback(
    (categoryId: string, preferenceType: string, updates: Partial<NotificationPreference>) => {
      setPreferences(prev => {
        if (!prev) return prev

        const updatedCategories = prev.categories.map(category => {
          if (category.id === categoryId) {
            const updatedPreferences = category.preferences.map(pref => {
              if (pref.type === preferenceType) {
                return { ...pref, ...updates }
              }
              return pref
            })
            return { ...category, preferences: updatedPreferences }
          }
          return category
        })

        return { ...prev, categories: updatedCategories }
      })
    },
    []
  )

  /**
   * تحديث قناة محددة
   */
  const updateChannel = useCallback(
    (
      categoryId: string,
      preferenceType: string,
      channel: 'in-app' | 'email' | 'push',
      enabled: boolean,
      sound?: boolean
    ) => {
      setPreferences(prev => {
        if (!prev) return prev

        const updatedCategories = prev.categories.map(category => {
          if (category.id === categoryId) {
            const updatedPreferences = category.preferences.map(pref => {
              if (pref.type === preferenceType) {
                const updatedChannels = {
                  ...pref.channels,
                  [channel]: {
                    ...pref.channels[channel],
                    enabled,
                    ...(sound !== undefined && channel === 'in-app' ? { sound } : {}),
                  },
                }
                return { ...pref, channels: updatedChannels }
              }
              return pref
            })
            return { ...category, preferences: updatedPreferences }
          }
          return category
        })

        return { ...prev, categories: updatedCategories }
      })
    },
    []
  )

  /**
   * حفظ التفضيلات
   */
  const savePreferences = useCallback(async (): Promise<boolean> => {
    if (!preferences) return false

    setSaving(true)
    setError(null)

    try {
      const requestData: UpdateNotificationPreferencesRequest = {
        categories: preferences.categories,
        globalMute: preferences.globalMute,
      }

      const response = await apiClient.patch<NotificationPreferencesResponse>(
        '/notifications/preferences',
        requestData
      )

      if (response.success && response.data) {
        setPreferences(response.data)
        setOriginalPreferences(JSON.parse(JSON.stringify(response.data))) // Deep copy
        onSuccess?.(response.data)
        return true
      } else {
        throw new Error(response.error?.message || 'فشل حفظ التفضيلات')
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('فشل حفظ تفضيلات الإشعارات')
      setError(error)
      onError?.(error)
      console.error('Failed to save notification preferences:', error)
      return false
    } finally {
      setSaving(false)
    }
  }, [preferences, onSuccess, onError])

  /**
   * إعادة تعيين للإعدادات الافتراضية
   */
  const resetToDefaults = useCallback(() => {
    const defaultData: NotificationPreferences = {
      categories: DEFAULT_NOTIFICATION_PREFERENCES,
      globalMute: false,
    }
    setPreferences(defaultData)
  }, [])

  /**
   * كتم/إلغاء كتم عام
   */
  const toggleGlobalMute = useCallback(() => {
    setPreferences(prev => {
      if (!prev) return prev
      return { ...prev, globalMute: !prev.globalMute }
    })
  }, [])

  /**
   * إعادة تعيين التغييرات
   */
  const resetChanges = useCallback(() => {
    if (originalPreferences) {
      setPreferences(JSON.parse(JSON.stringify(originalPreferences))) // Deep copy
      setError(null)
    }
  }, [originalPreferences])

  /**
   * حساب هل هناك تغييرات
   */
  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(originalPreferences)

  // جلب البيانات تلقائياً عند التحميل
  useEffect(() => {
    if (autoFetch) {
      fetchPreferences()
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [autoFetch, fetchPreferences])

  return {
    preferences,
    loading,
    saving,
    error,
    hasChanges,
    fetchPreferences,
    updatePreference,
    updateChannel,
    savePreferences,
    resetToDefaults,
    toggleGlobalMute,
    resetChanges,
  }
}
