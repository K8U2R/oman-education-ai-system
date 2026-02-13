/**
 * AuthenticationClient - عميل المصادقة
 *
 * عميل للاتصال بـ Authentication Service
 */

import {
  IAuthenticationClient,
  UserInfo,
  PermissionInfo,
} from '../../domain/interfaces/IAuthenticationClient'
import { logger } from '../../shared/utils/logger'

/**
 * إعدادات Authentication Client
 */
export interface AuthenticationClientConfig {
  baseUrl?: string // URL لـ Authentication Service
  apiKey?: string // API Key للاتصال
  timeout?: number // Timeout بالمللي ثانية
  cacheEnabled?: boolean // تفعيل Cache
  cacheTTL?: number // Cache TTL بالمللي ثانية
}

/**
 * عميل المصادقة
 */
export class AuthenticationClient implements IAuthenticationClient {
  private readonly config: Required<AuthenticationClientConfig>
  private readonly cache: Map<string, { data: UserInfo | PermissionInfo; expiresAt: number }> =
    new Map()

  constructor(config: AuthenticationClientConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || process.env.AUTH_SERVICE_URL || '',
      apiKey: config.apiKey || process.env.AUTH_SERVICE_API_KEY || '',
      timeout: config.timeout || 5000,
      cacheEnabled: config.cacheEnabled ?? true,
      cacheTTL: config.cacheTTL || 5 * 60 * 1000, // 5 minutes default
    }
  }

  /**
   * الحصول على معلومات المستخدم
   */
  async getUserInfo(userId: string): Promise<UserInfo | null> {
    const cacheKey = `user:${userId}`

    // التحقق من Cache
    if (this.config.cacheEnabled) {
      const cached = this.cache.get(cacheKey)
      if (cached && cached.expiresAt > Date.now()) {
        logger.debug('User info retrieved from cache', { userId })
        return cached.data as UserInfo
      }
    }

    try {
      // محاولة الاتصال بـ Authentication Service
      const userInfo = await this.fetchUserInfo(userId)

      // حفظ في Cache
      if (this.config.cacheEnabled && userInfo) {
        this.cache.set(cacheKey, {
          data: userInfo,
          expiresAt: Date.now() + this.config.cacheTTL,
        })
      }

      return userInfo
    } catch (error) {
      logger.error('Failed to fetch user info', {
        userId,
        error: error instanceof Error ? error.message : String(error),
      })

      // في حالة الفشل، إرجاع null (سيتم التعامل معه في Policy Engine)
      return null
    }
  }

  /**
   * الحصول على صلاحيات المستخدم
   */
  async getUserPermissions(userId: string): Promise<PermissionInfo | null> {
    const cacheKey = `permissions:${userId}`

    // التحقق من Cache
    if (this.config.cacheEnabled) {
      const cached = this.cache.get(cacheKey)
      if (cached && cached.expiresAt > Date.now()) {
        logger.debug('User permissions retrieved from cache', { userId })
        return cached.data as PermissionInfo
      }
    }

    try {
      // محاولة الاتصال بـ Authentication Service
      const permissions = await this.fetchUserPermissions(userId)

      // حفظ في Cache
      if (this.config.cacheEnabled && permissions) {
        this.cache.set(cacheKey, {
          data: permissions,
          expiresAt: Date.now() + this.config.cacheTTL,
        })
      }

      return permissions
    } catch (error) {
      logger.error('Failed to fetch user permissions', {
        userId,
        error: error instanceof Error ? error.message : String(error),
      })

      return null
    }
  }

  /**
   * التحقق من صلاحية معينة
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const permissionInfo = await this.getUserPermissions(userId)
    if (!permissionInfo) {
      return false
    }

    return (
      permissionInfo.permissions.includes(permission) || permissionInfo.permissions.includes('*')
    )
  }

  /**
   * التحقق من دور معين
   */
  async hasRole(userId: string, role: string): Promise<boolean> {
    const userInfo = await this.getUserInfo(userId)
    if (!userInfo) {
      return false
    }

    return userInfo.role === role || userInfo.role === 'admin' || userInfo.role === 'super_admin'
  }

  /**
   * التحقق من صحة Token
   */
  async validateToken(token: string): Promise<UserInfo | null> {
    try {
      // محاولة الاتصال بـ Authentication Service للتحقق من Token
      const response = await fetch(`${this.config.baseUrl}/api/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey }),
        },
        body: JSON.stringify({ token }),
        signal: AbortSignal.timeout(this.config.timeout),
      })

      if (!response.ok) {
        return null
      }

      const data = (await response.json()) as { user?: UserInfo }
      return data.user || null
    } catch (error) {
      logger.error('Failed to validate token', {
        error: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  }

  /**
   * جلب معلومات المستخدم من API
   */
  private async fetchUserInfo(userId: string): Promise<UserInfo | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey }),
        },
        signal: AbortSignal.timeout(this.config.timeout),
      })

      if (!response.ok) {
        return null
      }

      const data = (await response.json()) as { user?: UserInfo }
      return data.user || null
    } catch (error) {
      logger.error('Failed to fetch user info from API', {
        userId,
        error: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  }

  /**
   * جلب صلاحيات المستخدم من API
   */
  private async fetchUserPermissions(userId: string): Promise<PermissionInfo | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/users/${userId}/permissions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey }),
        },
        signal: AbortSignal.timeout(this.config.timeout),
      })

      if (!response.ok) {
        return null
      }

      const data = (await response.json()) as { permissions: PermissionInfo }
      return data.permissions
    } catch (error) {
      logger.error('Failed to fetch user permissions from API', {
        userId,
        error: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  }

  /**
   * مسح Cache
   */
  clearCache(): void {
    this.cache.clear()
    logger.debug('Authentication client cache cleared')
  }

  /**
   * مسح Cache لمستخدم معين
   */
  clearUserCache(userId: string): void {
    this.cache.delete(`user:${userId}`)
    this.cache.delete(`permissions:${userId}`)
    logger.debug('User cache cleared', { userId })
  }
}
