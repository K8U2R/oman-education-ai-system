/**
 * PolicyEngine Enhanced Tests
 * 
 * Tests for enhanced Policy Engine with conditions and wildcards
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { PolicyEngine } from '../../../src/infrastructure/policies/PolicyEngine'
import { OperationType } from '../../../src/domain/value-objects/OperationType'
import { Actor } from '../../../src/domain/value-objects/Actor'

describe('PolicyEngine Enhanced', () => {
  let policyEngine: PolicyEngine

  beforeEach(() => {
    policyEngine = new PolicyEngine()
  })

  describe('Wildcard Support', () => {
    it('should match wildcard actor (*)', async () => {
      policyEngine.addPolicy({
        name: 'all-users-read',
        actor: '*',
        operation: OperationType.FIND,
        entity: 'public_content',
        allowed: true,
      })

      const result = await policyEngine.evaluatePolicy({
        actor: 'any-user-id',
        operation: OperationType.FIND,
        entity: 'public_content',
      })

      expect(result.allowed).toBe(true)
      expect(result.policy).toBeDefined()
      expect(result.policy?.name).toBe('all-users-read')
    })

    it('should match wildcard operation (*)', async () => {
      policyEngine.addPolicy({
        name: 'admin-all-operations',
        actor: 'admin',
        operation: '*',
        entity: 'users',
        allowed: true,
      })

      const result = await policyEngine.evaluatePolicy({
        actor: 'admin',
        operation: OperationType.DELETE,
        entity: 'users',
      })

      expect(result.allowed).toBe(true)
    })

    it('should match wildcard entity (*)', async () => {
      policyEngine.addPolicy({
        name: 'system-all-entities',
        actor: 'system',
        operation: OperationType.FIND,
        entity: '*',
        allowed: true,
      })

      const result = await policyEngine.evaluatePolicy({
        actor: 'system',
        operation: OperationType.FIND,
        entity: 'any-entity',
      })

      expect(result.allowed).toBe(true)
    })
  })

  describe('Priority Support', () => {
    it('should use higher priority policy when multiple match', async () => {
      // سياسة منخفضة الأولوية - تمنع
      policyEngine.addPolicy({
        name: 'low-priority-deny',
        actor: '*',
        operation: OperationType.DELETE,
        entity: '*',
        allowed: false,
        priority: 100,
      })

      // سياسة عالية الأولوية - تسمح
      policyEngine.addPolicy({
        name: 'high-priority-allow',
        actor: 'admin',
        operation: OperationType.DELETE,
        entity: '*',
        allowed: true,
        priority: 900,
      })

      const result = await policyEngine.evaluatePolicy({
        actor: 'admin',
        operation: OperationType.DELETE,
        entity: 'users',
      })

      expect(result.allowed).toBe(true)
      expect(result.policy?.name).toBe('high-priority-allow')
    })
  })

  describe('Conditions Support', () => {
    it('should evaluate simple condition ($eq)', async () => {
      policyEngine.addPolicy({
        name: 'owner-only',
        actor: '*',
        operation: OperationType.UPDATE,
        entity: 'projects',
        allowed: true,
        conditions: {
          owner_id: { $eq: 'user-123' },
        },
      })

      // Condition matches
      const result1 = await policyEngine.evaluatePolicy({
        actor: 'user-123',
        operation: OperationType.UPDATE,
        entity: 'projects',
        conditions: {
          owner_id: 'user-123',
        },
      })
      expect(result1.allowed).toBe(true)

      // Condition doesn't match
      const result2 = await policyEngine.evaluatePolicy({
        actor: 'user-456',
        operation: OperationType.UPDATE,
        entity: 'projects',
        conditions: {
          owner_id: 'user-456',
        },
      })
      expect(result2.allowed).toBe(false)
      expect(result2.reason).toContain('conditions not met')
    })

    it('should evaluate $ne condition', async () => {
      policyEngine.addPolicy({
        name: 'not-deleted',
        actor: '*',
        operation: OperationType.UPDATE,
        entity: 'projects',
        allowed: true,
        conditions: {
          deleted: { $ne: true },
        },
      })

      const result1 = await policyEngine.evaluatePolicy({
        actor: 'user-123',
        operation: OperationType.UPDATE,
        entity: 'projects',
        conditions: {
          deleted: false,
        },
      })
      expect(result1.allowed).toBe(true)

      const result2 = await policyEngine.evaluatePolicy({
        actor: 'user-123',
        operation: OperationType.UPDATE,
        entity: 'projects',
        conditions: {
          deleted: true,
        },
      })
      expect(result2.allowed).toBe(false)
    })

    it('should evaluate $in condition', async () => {
      policyEngine.addPolicy({
        name: 'allowed-roles',
        actor: '*',
        operation: OperationType.UPDATE,
        entity: 'users',
        allowed: true,
        conditions: {
          role: { $in: ['admin', 'teacher'] },
        },
      })

      const result1 = await policyEngine.evaluatePolicy({
        actor: 'user-123',
        operation: OperationType.UPDATE,
        entity: 'users',
        conditions: {
          role: ['admin'],
        },
      })
      expect(result1.allowed).toBe(true)

      const result2 = await policyEngine.evaluatePolicy({
        actor: 'user-123',
        operation: OperationType.UPDATE,
        entity: 'users',
        conditions: {
          role: ['student'],
        },
      })
      expect(result2.allowed).toBe(false)
    })

    it('should evaluate $gt and $lt conditions', async () => {
      policyEngine.addPolicy({
        name: 'age-restriction',
        actor: '*',
        operation: OperationType.INSERT,
        entity: 'content',
        allowed: true,
        conditions: {
          age: { $gt: 13, $lt: 18 },
        },
      })

      const result1 = await policyEngine.evaluatePolicy({
        actor: 'user-123',
        operation: OperationType.INSERT,
        entity: 'content',
        conditions: {
          age: 15,
        },
      })
      expect(result1.allowed).toBe(true)

      const result2 = await policyEngine.evaluatePolicy({
        actor: 'user-123',
        operation: OperationType.INSERT,
        entity: 'content',
        conditions: {
          age: 10,
        },
      })
      expect(result2.allowed).toBe(false)
    })
  })

  describe('Array Support', () => {
    it('should support array of actors', async () => {
      policyEngine.addPolicy({
        name: 'multiple-actors',
        actor: ['admin', 'teacher'],
        operation: OperationType.DELETE,
        entity: 'assessments',
        allowed: true,
      })

      const result1 = await policyEngine.evaluatePolicy({
        actor: 'admin',
        operation: OperationType.DELETE,
        entity: 'assessments',
      })
      expect(result1.allowed).toBe(true)

      const result2 = await policyEngine.evaluatePolicy({
        actor: 'teacher',
        operation: OperationType.DELETE,
        entity: 'assessments',
      })
      expect(result2.allowed).toBe(true)

      const result3 = await policyEngine.evaluatePolicy({
        actor: 'student',
        operation: OperationType.DELETE,
        entity: 'assessments',
      })
      expect(result3.allowed).toBe(false)
    })

    it('should support array of operations', async () => {
      policyEngine.addPolicy({
        name: 'read-write',
        actor: 'student',
        operation: [OperationType.FIND, OperationType.INSERT],
        entity: 'projects',
        allowed: true,
      })

      const result1 = await policyEngine.evaluatePolicy({
        actor: 'student',
        operation: OperationType.FIND,
        entity: 'projects',
      })
      expect(result1.allowed).toBe(true)

      const result2 = await policyEngine.evaluatePolicy({
        actor: 'student',
        operation: OperationType.INSERT,
        entity: 'projects',
      })
      expect(result2.allowed).toBe(true)

      const result3 = await policyEngine.evaluatePolicy({
        actor: 'student',
        operation: OperationType.DELETE,
        entity: 'projects',
      })
      expect(result3.allowed).toBe(false)
    })

    it('should support array of entities', async () => {
      policyEngine.addPolicy({
        name: 'multiple-entities',
        actor: 'teacher',
        operation: OperationType.FIND,
        entity: ['lessons', 'assessments', 'students'],
        allowed: true,
      })

      const result1 = await policyEngine.evaluatePolicy({
        actor: 'teacher',
        operation: OperationType.FIND,
        entity: 'lessons',
      })
      expect(result1.allowed).toBe(true)

      const result2 = await policyEngine.evaluatePolicy({
        actor: 'teacher',
        operation: OperationType.FIND,
        entity: 'assessments',
      })
      expect(result2.allowed).toBe(true)

      const result3 = await policyEngine.evaluatePolicy({
        actor: 'teacher',
        operation: OperationType.FIND,
        entity: 'other',
      })
      expect(result3.allowed).toBe(false)
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle multiple policies with different priorities', async () => {
      // Global deny
      policyEngine.addPolicy({
        name: 'global-deny',
        actor: '*',
        operation: '*',
        entity: '*',
        allowed: false,
        priority: 1,
      })

      // Admin allow
      policyEngine.addPolicy({
        name: 'admin-allow',
        actor: 'admin',
        operation: '*',
        entity: '*',
        allowed: true,
        priority: 900,
      })

      // Student read only
      policyEngine.addPolicy({
        name: 'student-read',
        actor: 'student',
        operation: OperationType.FIND,
        entity: '*',
        allowed: true,
        priority: 500,
      })

      // Admin should be allowed
      const adminResult = await policyEngine.evaluatePolicy({
        actor: 'admin',
        operation: OperationType.DELETE,
        entity: 'users',
      })
      expect(adminResult.allowed).toBe(true)

      // Student should be allowed for read
      const studentReadResult = await policyEngine.evaluatePolicy({
        actor: 'student',
        operation: OperationType.FIND,
        entity: 'lessons',
      })
      expect(studentReadResult.allowed).toBe(true)

      // Student should be denied for write
      const studentWriteResult = await policyEngine.evaluatePolicy({
        actor: 'student',
        operation: OperationType.INSERT,
        entity: 'lessons',
      })
      expect(studentWriteResult.allowed).toBe(false)
    })

    it('should combine conditions with wildcards', async () => {
      policyEngine.addPolicy({
        name: 'owner-update',
        actor: '*',
        operation: OperationType.UPDATE,
        entity: 'projects',
        allowed: true,
        conditions: {
          owner_id: { $eq: 'user-123' },
          status: { $ne: 'archived' },
        },
        priority: 600,
      })

      // Should allow: owner matches and status is not archived
      const result1 = await policyEngine.evaluatePolicy({
        actor: 'user-123',
        operation: OperationType.UPDATE,
        entity: 'projects',
        conditions: {
          owner_id: 'user-123',
          status: 'active',
        },
      })
      expect(result1.allowed).toBe(true)

      // Should deny: owner matches but status is archived
      const result2 = await policyEngine.evaluatePolicy({
        actor: 'user-123',
        operation: OperationType.UPDATE,
        entity: 'projects',
        conditions: {
          owner_id: 'user-123',
          status: 'archived',
        },
      })
      expect(result2.allowed).toBe(false)
    })
  })
})
