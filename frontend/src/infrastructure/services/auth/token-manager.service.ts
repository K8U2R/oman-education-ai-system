/**
 * Token Manager Service - خدمة إدارة Tokens
 *
 * خدمة موحدة لإدارة tokens في جميع أنحاء التطبيق
 * تتعامل مع:
 * - قراءة tokens من storageAdapter
 * - حفظ tokens في storageAdapter
 * - التحقق من وجود tokens
 */

import { storageAdapter } from '../storage'

export interface TokenSource {
  source: 'storageAdapter' | 'none'
  accessToken: string | null
  refreshToken: string | null
}

class TokenManagerService {
  /**
   * قراءة access token من storageAdapter
   *
   * @returns access token أو null
   */
  getAccessToken(): string | null {
    const token = storageAdapter.get('access_token')

    if (import.meta.env.DEV && token) {
      // eslint-disable-next-line no-console
      console.log('[TokenManager] Access token retrieved from storageAdapter')
    }

    return token
  }

  /**
   * قراءة refresh token من storageAdapter
   *
   * @returns refresh token أو null
   */
  getRefreshToken(): string | null {
    return storageAdapter.get('refresh_token')
  }

  /**
   * قراءة جميع tokens من storageAdapter
   *
   * @returns TokenSource object يحتوي على tokens والمصدر
   */
  getTokens(): TokenSource {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()

    return {
      source: accessToken ? 'storageAdapter' : 'none',
      accessToken,
      refreshToken,
    }
  }

  /**
   * حفظ tokens في storageAdapter
   *
   * @param tokens - tokens للحفظ
   * @param _options - خيارات إضافية (legacy compatibility)
   */
  saveTokens(
    tokens: { access_token: string; refresh_token?: string },
    _options: { syncToStore?: boolean } = {}
  ): void {
    // Save to storageAdapter
    storageAdapter.set('access_token', tokens.access_token)
    if (tokens.refresh_token) {
      storageAdapter.set('refresh_token', tokens.refresh_token)
    }

    // Verify token was saved in dev
    if (import.meta.env.DEV) {
      const savedToken = storageAdapter.get('access_token')
      if (savedToken !== tokens.access_token) {
        console.error('[TokenManager] ❌ Token save failed!')
      } else {
        // eslint-disable-next-line no-console
        console.log('[TokenManager] ✅ Tokens saved successfully')
      }
    }
  }

  /**
   * حذف tokens من storageAdapter
   */
  clearTokens(): void {
    storageAdapter.remove('access_token')
    storageAdapter.remove('refresh_token')

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[TokenManager] Tokens cleared from storage')
    }
  }

  /**
   * مزامنة tokens (Legacy compatibility)
   */
  syncTokensFromStore(): void {
    // No longer needed as store rehydration is handled by Zustand persist
  }

  /**
   * مزامنة tokens (Legacy compatibility)
   */
  syncTokensToStore(): void {
    // No longer needed
  }

  /**
   * التحقق من وجود token
   *
   * @returns true إذا كان token موجود
   */
  hasToken(): boolean {
    return !!this.getAccessToken()
  }

  /**
   * الحصول على معلومات token للمساعدة في debugging
   */
  getTokenInfo(): {
    hasTokenInStorage: boolean
    tokenSource: 'storageAdapter' | 'none'
    tokenLength: number
  } {
    const token = this.getAccessToken()

    return {
      hasTokenInStorage: !!token,
      tokenSource: token ? 'storageAdapter' : 'none',
      tokenLength: token?.length || 0,
    }
  }
}

export const tokenManager = new TokenManagerService()
