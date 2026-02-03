/**
 * i18n Service - خدمة الترجمة
 *
 * خدمة لإدارة اللغات والترجمة
 */

import { storageAdapter } from '@/infrastructure/services/storage'

export type Language = 'ar' | 'en'
export type Direction = 'rtl' | 'ltr'

const LANGUAGE_STORAGE_KEY = 'app_language'
const DEFAULT_LANGUAGE: Language = 'ar'

class I18nService {
  private currentLanguage: Language = DEFAULT_LANGUAGE
  private listeners: Set<(language: Language) => void> = new Set()

  constructor() {
    // Load saved language
    this.loadLanguage()
  }

  /**
   * تحميل اللغة المحفوظة
   */
  private loadLanguage(): void {
    try {
      const saved = storageAdapter.get(LANGUAGE_STORAGE_KEY)
      if (saved && (saved === 'ar' || saved === 'en')) {
        this.currentLanguage = saved as Language
        this.applyLanguage(this.currentLanguage)
      } else {
        // Detect browser language
        const browserLang = navigator.language.split('-')[0]
        if (browserLang === 'ar' || browserLang === 'en') {
          this.currentLanguage = browserLang as Language
        }
        this.applyLanguage(this.currentLanguage)
      }
    } catch (error) {
      console.error('Failed to load language:', error)
      this.applyLanguage(DEFAULT_LANGUAGE)
    }
  }

  /**
   * الحصول على اللغة الحالية
   */
  getLanguage(): Language {
    return this.currentLanguage
  }

  /**
   * تغيير اللغة
   */
  setLanguage(language: Language): void {
    if (this.currentLanguage === language) {
      return
    }

    this.currentLanguage = language
    this.applyLanguage(language)
    this.saveLanguage(language)
    this.notifyListeners(language)
  }

  /**
   * تطبيق اللغة على الوثيقة
   */
  private applyLanguage(language: Language): void {
    if (typeof document === 'undefined') {
      return
    }

    const direction: Direction = language === 'ar' ? 'rtl' : 'ltr'

    // Update HTML attributes
    document.documentElement.setAttribute('lang', language)
    document.documentElement.setAttribute('dir', direction)

    // Update body class for styling
    document.body.classList.remove('lang-ar', 'lang-en', 'dir-rtl', 'dir-ltr')
    document.body.classList.add(`lang-${language}`, `dir-${direction}`)
  }

  /**
   * حفظ اللغة
   */
  private saveLanguage(language: Language): void {
    try {
      storageAdapter.set(LANGUAGE_STORAGE_KEY, language)
    } catch (error) {
      console.error('Failed to save language:', error)
    }
  }

  /**
   * الحصول على الاتجاه
   */
  getDirection(): Direction {
    return this.currentLanguage === 'ar' ? 'rtl' : 'ltr'
  }

  /**
   * إضافة مستمع لتغيير اللغة
   */
  onLanguageChange(callback: (language: Language) => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * إشعار المستمعين
   */
  private notifyListeners(language: Language): void {
    this.listeners.forEach(callback => {
      try {
        callback(language)
      } catch (error) {
        console.error('Error in language change listener:', error)
      }
    })
  }

  /**
   * تنسيق التاريخ حسب اللغة
   */
  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const locale = this.currentLanguage === 'ar' ? 'ar-OM' : 'en-US'

    return dateObj.toLocaleDateString(locale, options)
  }

  /**
   * تنسيق الوقت حسب اللغة
   */
  formatTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const locale = this.currentLanguage === 'ar' ? 'ar-OM' : 'en-US'

    return dateObj.toLocaleTimeString(locale, options)
  }

  /**
   * تنسيق التاريخ والوقت حسب اللغة
   */
  formatDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const locale = this.currentLanguage === 'ar' ? 'ar-OM' : 'en-US'

    return dateObj.toLocaleString(locale, options)
  }

  /**
   * تنسيق الأرقام حسب اللغة
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.currentLanguage === 'ar' ? 'ar-OM' : 'en-US'
    return number.toLocaleString(locale, options)
  }
}

export const i18nService = new I18nService()
