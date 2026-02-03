/**
 * Theme Service - خدمة إدارة الثيمات
 *
 * يدير الثيمات المختلفة (فاتح/داكن) والثيمات المخصصة للأعمار المختلفة
 */

import { storageAdapter } from '@/infrastructure/services/storage'

export type ThemeMode = 'light' | 'dark' | 'system'
export type AgeTheme = 'kids' | 'teens' | 'adults' | 'university'

export interface ThemeConfig {
  mode: ThemeMode
  ageTheme: AgeTheme
}

class ThemeService {
  private readonly STORAGE_KEY = 'theme_config'
  private currentTheme: ThemeConfig = {
    mode: 'system',
    ageTheme: 'university',
  }

  constructor() {
    this.loadTheme()
    this.applyTheme()

    // Listen to system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.currentTheme.mode === 'system') {
          this.applyTheme()
        }
      })
    }
  }

  /**
   * Get current theme configuration
   */
  getTheme(): ThemeConfig {
    return { ...this.currentTheme }
  }

  /**
   * Set theme mode (light/dark/system)
   */
  setMode(mode: ThemeMode): void {
    this.currentTheme.mode = mode
    this.saveTheme()
    this.applyTheme()
  }

  /**
   * Set age theme (kids/teens/adults/university)
   */
  setAgeTheme(ageTheme: AgeTheme): void {
    this.currentTheme.ageTheme = ageTheme
    this.saveTheme()
    this.applyTheme()
  }

  /**
   * Get effective theme mode (resolves 'system' to actual light/dark)
   */
  getEffectiveMode(): 'light' | 'dark' {
    if (this.currentTheme.mode === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return this.currentTheme.mode
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    const effectiveMode = this.getEffectiveMode()
    const ageTheme = this.currentTheme.ageTheme

    // Remove all theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    document.documentElement.classList.remove(
      'theme-kids',
      'theme-teens',
      'theme-adults',
      'theme-university'
    )

    // Add current theme classes
    document.documentElement.classList.add(`theme-${effectiveMode}`)
    // Add age theme class
    if (ageTheme) {
      document.documentElement.classList.add(`theme-${ageTheme}`)
    }

    // Set data attributes for CSS
    document.documentElement.setAttribute('data-theme', effectiveMode)
    document.documentElement.setAttribute('data-age-theme', ageTheme)
  }

  /**
   * Load theme from localStorage
   */
  private loadTheme(): void {
    try {
      const saved = storageAdapter.get(this.STORAGE_KEY)
      if (saved) {
        this.currentTheme = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load theme:', error)
    }
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(): void {
    try {
      storageAdapter.set(this.STORAGE_KEY, JSON.stringify(this.currentTheme))
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }
}

export const themeService = new ThemeService()
