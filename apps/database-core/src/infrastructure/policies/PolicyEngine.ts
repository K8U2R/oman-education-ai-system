/**
 * PolicyEngine - محرك السياسات
 *
 * يتحقق من  قبل تنفيذ العمليات على قاعدة البيانات
 * يطبق IPolicyEngine من Domain Layer
 */

import { IPolicyEngine, type PolicyCheckParams } from '../../domain/interfaces/IPolicyEngine'
import { OperationType } from '../../domain/value-objects/OperationType'
import { PolicyEvaluationResult, type Policy } from '../../domain/types/policy.types'
import { PolicyService } from '../../application/services/PolicyService'

export interface CheckPermissionParams {
  actor: string
  operation: string
  entity: string
}

export class PolicyEngine implements IPolicyEngine {
  private policies: Map<string, Policy> = new Map()
  private policyService: PolicyService | null = null

  /**
   * تعيين Policy Service (اختياري)
   * إذا تم تعيينه، سيتم استخدامه للتحقق من 
   */
  setPolicyService(policyService: PolicyService): void {
    this.policyService = policyService
  }

  /**
   * التحقق من وجود صلاحية
   */
  async checkPermission(params: PolicyCheckParams): Promise<boolean> {
    // إذا كان هناك Policy Service، استخدمه
    if (this.policyService) {
      return await this.policyService.checkPermission(params)
    }

    // خلاف ذلك، استخدم التقييم المحلي
    const result = await this.evaluatePolicy(params)
    return result.allowed
  }

  /**
   * تقييم السياسات - محسّن مع دعم Wildcards و Conditions
   */
  async evaluatePolicy(params: PolicyCheckParams): Promise<PolicyEvaluationResult> {
    const actorId = typeof params.actor === 'string' ? params.actor : params.actor.getId()
    const operationStr =
      typeof params.operation === 'string' ? params.operation : String(params.operation)

    // 1. البحث عن سياسة مطابقة مباشرة
    const exactKey = `${actorId}:${operationStr}:${params.entity}`
    const exactPolicy = this.policies.get(exactKey)

    if (exactPolicy) {
      // التحقق من Conditions إذا كانت موجودة
      if (exactPolicy.conditions && params.conditions) {
        const conditionsMatch = this.evaluateConditions(exactPolicy.conditions, params.conditions)
        if (!conditionsMatch) {
          return {
            allowed: false,
            policy: exactPolicy,
            reason: 'Policy conditions not met',
          }
        }
      }

      return {
        allowed: exactPolicy.allowed,
        policy: exactPolicy,
        reason: exactPolicy.allowed ? 'Policy allows' : 'Policy denies',
      }
    }

    // 2. البحث عن سياسات Wildcard (بترتيب الأولوية)
    // operationStr تم تعريفه أعلاه في السطر 50
    const matchingPolicies = this.findMatchingPolicies(actorId, operationStr, params.entity)

    if (matchingPolicies.length > 0) {
      // ترتيب حسب الأولوية (الأعلى أولاً)
      matchingPolicies.sort((a, b) => (b.priority || 0) - (a.priority || 0))

      // استخدام أول سياسة مطابقة
      const matchedPolicy = matchingPolicies[0]

      // التحقق من Conditions
      if (matchedPolicy.conditions && params.conditions) {
        const conditionsMatch = this.evaluateConditions(matchedPolicy.conditions, params.conditions)
        if (!conditionsMatch) {
          return {
            allowed: false,
            policy: matchedPolicy,
            reason: 'Policy conditions not met',
          }
        }
      }

      return {
        allowed: matchedPolicy.allowed,
        policy: matchedPolicy,
        reason: matchedPolicy.allowed
          ? 'Policy allows (wildcard match)'
          : 'Policy denies (wildcard match)',
      }
    }

    // 3. افتراضياً: السماح (يمكن تغيير هذا)
    return {
      allowed: true,
      reason: 'No policy found, default allow',
    }
  }

  /**
   * البحث عن سياسات مطابقة مع دعم Wildcards
   */
  private findMatchingPolicies(actorId: string, operation: string, entity: string): Policy[] {
    const matches: Policy[] = []

    for (const policy of this.policies.values()) {
      // التحقق من Actor (يدعم wildcard *)
      const actorMatch =
        policy.actor === '*' ||
        (Array.isArray(policy.actor) && policy.actor.includes(actorId)) ||
        policy.actor === actorId

      // التحقق من Operation (يدعم wildcard *)
      // تحويل operation إلى string للمقارنة
      const operationStr = String(operation)
      const policyOperationStr = String(policy.operation)
      const operationMatch =
        policyOperationStr === '*' ||
        (Array.isArray(policy.operation) &&
          policy.operation.some(op => String(op) === operationStr)) ||
        policyOperationStr === operationStr

      // التحقق من Entity (يدعم wildcard *)
      const entityMatch =
        policy.entity === '*' ||
        (Array.isArray(policy.entity) && policy.entity.includes(entity)) ||
        policy.entity === entity

      if (actorMatch && operationMatch && entityMatch) {
        matches.push(policy)
      }
    }

    return matches
  }

  /**
   * تقييم Conditions
   */
  private evaluateConditions(
    policyConditions: Record<string, unknown>,
    requestConditions: Record<string, unknown>
  ): boolean {
    for (const [key, value] of Object.entries(policyConditions)) {
      const requestValue = requestConditions[key]

      // دعم operators مختلفة
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const condition = value as Record<string, unknown>

        // $eq: equals
        if ('$eq' in condition) {
          if (requestValue !== condition.$eq) {
            return false
          }
        }

        // $ne: not equals
        if ('$ne' in condition) {
          if (requestValue === condition.$ne) {
            return false
          }
        }

        // $in: in array
        if ('$in' in condition && Array.isArray(condition.$in)) {
          const inArray = condition.$in as unknown[]
          if (!Array.isArray(requestValue) || !requestValue.some(v => inArray.includes(v))) {
            return false
          }
        }

        // $gt: greater than
        if (
          '$gt' in condition &&
          typeof requestValue === 'number' &&
          typeof condition.$gt === 'number'
        ) {
          if (requestValue <= condition.$gt) {
            return false
          }
        }

        // $lt: less than
        if (
          '$lt' in condition &&
          typeof requestValue === 'number' &&
          typeof condition.$lt === 'number'
        ) {
          if (requestValue >= condition.$lt) {
            return false
          }
        }
      } else {
        // مقارنة مباشرة
        if (requestValue !== value) {
          return false
        }
      }
    }

    return true
  }

  /**
   * إضافة سياسة جديدة
   */
  addPolicy(policy: {
    name: string
    actor: string | string[]
    operation: OperationType | OperationType[] | string
    entity: string | string[]
    allowed: boolean
    conditions?: Record<string, unknown>
    priority?: number
  }): void {
    const actors = Array.isArray(policy.actor) ? policy.actor : [policy.actor]
    const operations = Array.isArray(policy.operation) ? policy.operation : [policy.operation]
    const entities = Array.isArray(policy.entity) ? policy.entity : [policy.entity]

    for (const actor of actors) {
      for (const operation of operations) {
        for (const entity of entities) {
          const key = `${actor}:${operation}:${entity}`
          this.policies.set(key, {
            id: key,
            name: policy.name,
            actor,
            operation,
            entity,
            allowed: policy.allowed,
            conditions: policy.conditions,
            priority: policy.priority,
          })
        }
      }
    }
  }

  /**
   * إزالة سياسة
   */
  removePolicy(actor: string, operation: string, entity: string): boolean {
    const key = `${actor}:${operation}:${entity}`
    return this.policies.delete(key)
  }

  /**
   * الحصول على جميع السياسات
   */
  getAllPolicies(): Array<{
    name: string
    actor: string | string[]
    operation: OperationType | OperationType[] | string
    entity: string | string[]
    allowed: boolean
    priority?: number
  }> {
    return Array.from(this.policies.values()).map(policy => ({
      name: policy.name,
      actor: policy.actor,
      operation: policy.operation,
      entity: policy.entity,
      allowed: policy.allowed,
      priority: policy.priority,
    }))
  }

  /**
   * الحصول على سياسة (legacy method)
   */
  getPolicy(actor: string, operation: string, entity: string): Policy | undefined {
    const key = `${actor}:${operation}:${entity}`
    return this.policies.get(key)
  }
}
