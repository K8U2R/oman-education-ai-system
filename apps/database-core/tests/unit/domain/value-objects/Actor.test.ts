/**
 * Unit Tests for Actor Value Object
 */

import { describe, it, expect } from 'vitest'
import { Actor } from '../../../src/domain/value-objects/Actor'

describe('Actor', () => {
  describe('constructor', () => {
    it('should create an Actor with valid id', () => {
      const actor = new Actor('user-123')
      expect(actor.getId()).toBe('user-123')
      expect(actor.getType()).toBe('user')
    })

    it('should create an Actor with type', () => {
      const actor = new Actor('system', 'system')
      expect(actor.getId()).toBe('system')
      expect(actor.getType()).toBe('system')
    })

    it('should throw error if id is empty', () => {
      expect(() => new Actor('')).toThrow('Actor ID is required')
      expect(() => new Actor('   ')).toThrow('Actor ID is required')
    })
  })

  describe('hasPermission', () => {
    it('should return true for system actors', () => {
      const actor = Actor.system()
      expect(actor.hasPermission('any-permission')).toBe(true)
    })

    it('should return true if actor has permission', () => {
      const actor = new Actor('user-123', 'user', undefined, ['read', 'write'])
      expect(actor.hasPermission('read')).toBe(true)
      expect(actor.hasPermission('write')).toBe(true)
    })

    it('should return false if actor does not have permission', () => {
      const actor = new Actor('user-123', 'user', undefined, ['read'])
      expect(actor.hasPermission('write')).toBe(false)
    })
  })

  describe('static methods', () => {
    it('should create system actor', () => {
      const actor = Actor.system()
      expect(actor.getId()).toBe('system')
      expect(actor.getType()).toBe('system')
    })

    it('should create service actor', () => {
      const actor = Actor.service('email-service')
      expect(actor.getId()).toBe('email-service')
      expect(actor.getType()).toBe('service')
    })
  })

  describe('toJSON', () => {
    it('should serialize actor to JSON', () => {
      const actor = new Actor('user-123', 'user', 'student', ['read'])
      const json = actor.toJSON()

      expect(json).toEqual({
        id: 'user-123',
        type: 'user',
        role: 'student',
        permissions: ['read'],
      })
    })
  })
})
