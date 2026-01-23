/**
 * Policy Types - أنواع السياسات
 *
 * جميع الأنواع المستخدمة في نظام السياسات
 */

import { OperationType } from '../value-objects/OperationType'
import { Actor } from '../value-objects/Actor'

/**
 * Policy Check Parameters
 */
export interface PolicyCheckParams {
  actor: Actor | string
  operation: OperationType | string
  entity: string
  conditions?: Record<string, unknown>
}

/**
 * Policy Definition
 */
export interface Policy {
  id: string
  name: string
  actor: string | string[] // Actor ID or pattern
  operation: OperationType | OperationType[] | string
  entity: string | string[] // Entity name or pattern
  allowed: boolean
  conditions?: Record<string, unknown>
  priority?: number
}

/**
 * Policy Evaluation Result
 */
export interface PolicyEvaluationResult {
  allowed: boolean
  policy?: Policy
  reason?: string
}
