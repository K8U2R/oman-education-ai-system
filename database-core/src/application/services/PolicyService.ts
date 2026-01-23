/**
 * PolicyService - خدمة السياسات
 *
 * خدمة متقدمة لإدارة وتقييم السياسات مع Integration مع Authentication Service
 */

import { IPolicyEngine, PolicyCheckParams } from '../../domain/interfaces/IPolicyEngine'
import { IAuthenticationClient } from '../../domain/interfaces/IAuthenticationClient'
import { PolicyEvaluationResult } from '../../domain/types/policy.types'
import { OperationType } from '../../domain/value-objects/OperationType'
import { logger } from '../../shared/utils/logger'

/**
 * إعدادات Policy Service
 */
export interface PolicyServiceConfig {
  defaultAllow?: boolean // السماح افتراضياً إذا لم توجد سياسة
  strictMode?: boolean // وضع صارم (يرفض إذا لم توجد سياسة)
  cacheEnabled?: boolean // تفعيل Cache
}

/**
 * خدمة السياسات
 */
export class PolicyService {
  private readonly policyEngine: IPolicyEngine
  private readonly authClient: IAuthenticationClient | null
  private readonly config: Required<PolicyServiceConfig>
  private readonly permissionCache: Map<string, { allowed: boolean; expiresAt: number }> = new Map()

  constructor(
    policyEngine: IPolicyEngine,
    authClient: IAuthenticationClient | null = null,
    config: PolicyServiceConfig = {}
  ) {
    this.policyEngine = policyEngine
    this.authClient = authClient
    this.config = {
      defaultAllow: config.defaultAllow ?? true,
      strictMode: config.strictMode ?? false,
      cacheEnabled: config.cacheEnabled ?? true,
    }
  }

  /**
   * التحقق من  مع Integration مع Authentication Service
   */
  async checkPermission(params: PolicyCheckParams): Promise<boolean> {
    const actorId = typeof params.actor === 'string' ? params.actor : params.actor.getId()
    const cacheKey = this.generateCacheKey(actorId, params.operation, params.entity)

    // التحقق من Cache
    if (this.config.cacheEnabled) {
      const cached = this.permissionCache.get(cacheKey)
      if (cached && cached.expiresAt > Date.now()) {
        logger.debug('Permission check retrieved from cache', {
          actorId,
          operation: params.operation,
        })
        return cached.allowed
      }
    }

    // 1. التحقق من Policies المحلية
    const policyResult = await this.policyEngine.evaluatePolicy(params)

    if (policyResult.policy) {
      // إذا كانت هناك سياسة محلية، استخدمها
      const allowed = policyResult.allowed

      // حفظ في Cache
      if (this.config.cacheEnabled) {
        this.permissionCache.set(cacheKey, {
          allowed,
          expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        })
      }

      return allowed
    }

    // 2. إذا لم توجد سياسة محلية، تحقق من Authentication Service
    if (this.authClient) {
      try {
        const userInfo = await this.authClient.getUserInfo(actorId)

        if (!userInfo) {
          logger.warn('User not found in authentication service', { actorId })
          return this.config.defaultAllow && !this.config.strictMode
        }

        // التحقق من حالة المستخدم
        if (!userInfo.isActive) {
          logger.warn('User is not active', { actorId })
          return false
        }

        // التحقق من  حسب Operation
        const permission = this.mapOperationToPermission(params.operation, params.entity)
        const hasPermission = await this.authClient.hasPermission(actorId, permission)

        // حفظ في Cache
        if (this.config.cacheEnabled) {
          this.permissionCache.set(cacheKey, {
            allowed: hasPermission,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
          })
        }

        return hasPermission
      } catch (error) {
        logger.error('Failed to check permission with auth service', {
          actorId,
          error: error instanceof Error ? error.message : String(error),
        })

        // في حالة الفشل، استخدم الإعداد الافتراضي
        return this.config.defaultAllow && !this.config.strictMode
      }
    }

    // 3. إذا لم يكن هناك Authentication Client، استخدم الإعداد الافتراضي
    const allowed = this.config.defaultAllow && !this.config.strictMode

    // حفظ في Cache
    if (this.config.cacheEnabled) {
      this.permissionCache.set(cacheKey, {
        allowed,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      })
    }

    return allowed
  }

  /**
   * تقييم السياسات بشكل متقدم
   */
  async evaluatePolicy(params: PolicyCheckParams): Promise<PolicyEvaluationResult> {
    // 1. تقييم Policies المحلية
    const policyResult = await this.policyEngine.evaluatePolicy(params)

    if (policyResult.policy) {
      return policyResult
    }

    // 2. إذا لم توجد سياسة محلية، تحقق من Authentication Service
    if (this.authClient) {
      const actorId = typeof params.actor === 'string' ? params.actor : params.actor.getId()

      try {
        const userInfo = await this.authClient.getUserInfo(actorId)

        if (!userInfo) {
          return {
            allowed: this.config.defaultAllow && !this.config.strictMode,
            reason: 'User not found in authentication service',
          }
        }

        if (!userInfo.isActive) {
          return {
            allowed: false,
            reason: 'User is not active',
          }
        }

        const permission = this.mapOperationToPermission(params.operation, params.entity)
        const hasPermission = await this.authClient.hasPermission(actorId, permission)

        return {
          allowed: hasPermission,
          reason: hasPermission
            ? `User has permission: ${permission}`
            : `User does not have permission: ${permission}`,
        }
      } catch (error) {
        logger.error('Failed to evaluate policy with auth service', {
          actorId,
          error: error instanceof Error ? error.message : String(error),
        })

        return {
          allowed: this.config.defaultAllow && !this.config.strictMode,
          reason: 'Failed to evaluate policy with authentication service',
        }
      }
    }

    // 3. الإعداد الافتراضي
    return {
      allowed: this.config.defaultAllow && !this.config.strictMode,
      reason: 'No policy found and no authentication client available',
    }
  }

  /**
   * تحويل Operation إلى Permission
   */
  private mapOperationToPermission(operation: OperationType | string, entity: string): string {
    const operationStr = typeof operation === 'string' ? operation : String(operation)

    // نمط: entity:operation
    // مثال: users:read, users:write, users:delete
    const permissionMap: Record<string, string> = {
      [OperationType.FIND]: 'read',
      [OperationType.INSERT]: 'write',
      [OperationType.UPDATE]: 'write',
      [OperationType.DELETE]: 'delete',
    }

    // COUNT يعامل كـ read
    if (operationStr === 'COUNT') {
      return `${entity}:read`
    }

    const action = permissionMap[operationStr] || operationStr.toLowerCase()
    return `${entity}:${action}`
  }

  /**
   * إنشاء Cache Key
   */
  private generateCacheKey(
    actorId: string,
    operation: OperationType | string,
    entity: string
  ): string {
    const operationStr = typeof operation === 'string' ? operation : String(operation)
    return `permission:${actorId}:${operationStr}:${entity}`
  }

  /**
   * مسح Cache
   */
  clearCache(): void {
    this.permissionCache.clear()
    logger.debug('Policy service cache cleared')
  }

  /**
   * مسح Cache لمستخدم معين
   */
  clearUserCache(actorId: string): void {
    for (const key of this.permissionCache.keys()) {
      if (key.includes(`:${actorId}:`)) {
        this.permissionCache.delete(key)
      }
    }
    logger.debug('User policy cache cleared', { actorId })
  }
}
