/**
 * useI18n Hook - Hook للترجمة
 *
 * Custom Hook لإدارة اللغة والترجمة
 */

import { useState, useEffect } from 'react'
import { i18nService, Language, Direction } from '@/application/core/services/ui/i18n.service'

export const useI18n = () => {
  const [language, setLanguage] = useState<Language>(i18nService.getLanguage())
  const [direction, setDirection] = useState<Direction>(i18nService.getDirection())

  useEffect(() => {
    // Subscribe to language changes
    const unsubscribe = i18nService.onLanguageChange((newLanguage: Language) => {
      setLanguage(newLanguage)
      setDirection(i18nService.getDirection())
    })

    return unsubscribe
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    i18nService.setLanguage(newLanguage)
  }

  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    return i18nService.formatDate(date, options)
  }

  const formatTime = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    return i18nService.formatTime(date, options)
  }

  const formatDateTime = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    return i18nService.formatDateTime(date, options)
  }

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    return i18nService.formatNumber(number, options)
  }

  return {
    language,
    direction,
    changeLanguage,
    formatDate,
    formatTime,
    formatDateTime,
    formatNumber,
    isRTL: direction === 'rtl',
    isLTR: direction === 'ltr',
  }
}
