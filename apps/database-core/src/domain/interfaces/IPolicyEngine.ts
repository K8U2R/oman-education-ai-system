/**
 * IPolicyEngine - واجهة محرك السياسات
 *
 * واجهة محرك السياسات للتحقق من 
 */

import { Actor } from '../value-objects/Actor'
import { OperationType } from '../value-objects/OperationType'
import { PolicyEvaluationResult } from '../types/policy.types'

export interface PolicyCheckParams {
  actor: Actor | string
  operation: OperationType | string
  entity: string
  conditions?: Record<string, unknown>
}

export interface IPolicyEngine {
  /**
   * التحقق من 
   */
  checkPermission(params: PolicyCheckParams): Promise<boolean>

  /**
   * تقييم السياسات
   */
  evaluatePolicy(params: PolicyCheckParams): Promise<PolicyEvaluationResult>

  /**
   * إضافة سياسة
   */
  addPolicy(policy: {
    name: string
    actor: string | string[]
    operation: OperationType | OperationType[] | string
    entity: string | string[]
    allowed: boolean
    conditions?: Record<string, unknown>
    priority?: number
  }): void

  /**
   * إزالة سياسة
   */
  removePolicy(actor: string, operation: string, entity: string): boolean

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
  }>
}
