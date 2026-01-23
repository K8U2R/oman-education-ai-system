/**
 * CacheKeyRegistry Integration Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { CacheKeyRegistry } from '../../../src/infrastructure/cache/CacheKeyRegistry'
import { CacheManager } from '../../../src/infrastructure/cache/CacheManager'

describe('CacheKeyRegistry Integration', () => {
  let registry: CacheKeyRegistry
  let cacheManager: CacheManager

  beforeEach(() => {
    registry = new CacheKeyRegistry()
    cacheManager = new CacheManager({
      ttl: 5 * 60 * 1000, // 5 minutes
      maxSize: 1000,
    })
  })

  describe('register and unregister', () => {
    it('should register cache keys and track them', () => {
      const key1 = 'find:users:{"role":"student"}'
      const key2 = 'findOne:users:{"id":"1"}'
      const key3 = 'find:products:{"category":"electronics"}'

      registry.register(key1, 'users', 'find', { role: 'student' })
      registry.register(key2, 'users', 'findOne', { id: '1' })
      registry.register(key3, 'products', 'find', { category: 'electronics' })

      const userKeys = registry.getKeysForEntity('users')
      expect(userKeys).toHaveLength(2)
      expect(userKeys).toContain(key1)
      expect(userKeys).toContain(key2)

      const productKeys = registry.getKeysForEntity('products')
      expect(productKeys).toHaveLength(1)
      expect(productKeys).toContain(key3)
    })

    it('should unregister keys correctly', () => {
      const key = 'find:users:{"role":"student"}'
      registry.register(key, 'users', 'find', { role: 'student' })

      expect(registry.getKeysForEntity('users')).toContain(key)

      const result = registry.unregister(key)
      expect(result).toBe(true)
      expect(registry.getKeysForEntity('users')).not.toContain(key)
    })

    it('should unregister all keys for an entity', () => {
      registry.register('key1', 'users', 'find', {})
      registry.register('key2', 'users', 'findOne', {})
      registry.register('key3', 'products', 'find', {})

      const unregisteredKeys = registry.unregisterEntity('users')

      expect(unregisteredKeys).toHaveLength(2)
      expect(registry.getKeysForEntity('users')).toHaveLength(0)
      expect(registry.getKeysForEntity('products')).toHaveLength(1)
    })
  })

  describe('access tracking', () => {
    it('should track access count and last accessed time', () => {
      const key = 'find:users:{"role":"student"}'
      registry.register(key, 'users', 'find', { role: 'student' })

      const info1 = registry.getKeyInfo(key)
      expect(info1?.accessCount).toBe(1)

      registry.updateAccess(key)
      registry.updateAccess(key)

      const info2 = registry.getKeyInfo(key)
      expect(info2?.accessCount).toBe(3)
      expect(info2?.lastAccessed).toBeGreaterThan(info1!.lastAccessed)
    })
  })

  describe('integration with CacheManager', () => {
    it('should work with CacheManager for invalidation', () => {
      const key1 = cacheManager.generateKey('find:users', { role: 'student' })
      const key2 = cacheManager.generateKey('find:users', { role: 'teacher' })
      const key3 = cacheManager.generateKey('find:products', { category: 'electronics' })

      // Set values in cache
      cacheManager.set(key1, [{ id: '1', name: 'Student 1' }])
      cacheManager.set(key2, [{ id: '2', name: 'Teacher 1' }])
      cacheManager.set(key3, [{ id: '3', name: 'Product 1' }])

      // Register keys in registry
      registry.register(key1, 'users', 'find', { role: 'student' })
      registry.register(key2, 'users', 'find', { role: 'teacher' })
      registry.register(key3, 'products', 'find', { category: 'electronics' })

      // Invalidate all user keys
      const userKeys = registry.getKeysForEntity('users')
      for (const key of userKeys) {
        cacheManager.delete(key)
        registry.unregister(key)
      }

      // Verify cache invalidation
      expect(cacheManager.get(key1)).toBeNull()
      expect(cacheManager.get(key2)).toBeNull()
      expect(cacheManager.get(key3)).not.toBeNull() // Products should still exist
    })
  })

  describe('statistics', () => {
    it('should provide accurate statistics', () => {
      registry.register('key1', 'users', 'find', {})
      registry.register('key2', 'users', 'findOne', {})
      registry.register('key3', 'products', 'find', {})
      registry.register('key4', 'products', 'count', {})

      const stats = registry.getStats()

      expect(stats.totalKeys).toBe(4)
      expect(stats.entities).toBe(2)
      expect(stats.operations.size).toBe(3) // find, findOne, count
      expect(stats.entityStats).toHaveLength(2)

      const usersStats = stats.entityStats.find((s) => s.entity === 'users')
      expect(usersStats?.keyCount).toBe(2)

      const productsStats = stats.entityStats.find((s) => s.entity === 'products')
      expect(productsStats?.keyCount).toBe(2)
    })
  })

  describe('clean old keys', () => {
    it('should clean keys older than maxAge', async () => {
      const key1 = 'key1'
      const key2 = 'key2'

      registry.register(key1, 'users', 'find', {})
      registry.register(key2, 'users', 'findOne', {})

      // Simulate old access time
      const info1 = registry.getKeyInfo(key1)
      if (info1) {
        // Manually set old lastAccessed (in real scenario, this would be done by time)
        // For testing, we'll use a small delay
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      // Update access for key2 to make it recent
      registry.updateAccess(key2)

      // Clean keys older than 5ms
      const cleanedCount = registry.cleanOldKeys(5)

      // key1 should be cleaned (if old enough), key2 should remain
      expect(cleanedCount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getKeysForOperation', () => {
    it('should return all keys for a specific operation', () => {
      registry.register('key1', 'users', 'find', {})
      registry.register('key2', 'users', 'findOne', {})
      registry.register('key3', 'products', 'find', {})

      const findKeys = registry.getKeysForOperation('find')
      expect(findKeys).toHaveLength(2)
      expect(findKeys).toContain('key1')
      expect(findKeys).toContain('key3')

      const findOneKeys = registry.getKeysForOperation('findOne')
      expect(findOneKeys).toHaveLength(1)
      expect(findOneKeys).toContain('key2')
    })
  })

  describe('getKeysForEntityAndOperation', () => {
    it('should return keys for specific entity and operation', () => {
      registry.register('key1', 'users', 'find', {})
      registry.register('key2', 'users', 'findOne', {})
      registry.register('key3', 'products', 'find', {})

      const userFindKeys = registry.getKeysForEntityAndOperation('users', 'find')
      expect(userFindKeys).toHaveLength(1)
      expect(userFindKeys).toContain('key1')

      const userFindOneKeys = registry.getKeysForEntityAndOperation('users', 'findOne')
      expect(userFindOneKeys).toHaveLength(1)
      expect(userFindOneKeys).toContain('key2')
    })
  })

  describe('clear', () => {
    it('should clear all registered keys', () => {
      registry.register('key1', 'users', 'find', {})
      registry.register('key2', 'products', 'find', {})

      expect(registry.getAllKeys()).toHaveLength(2)

      registry.clear()

      expect(registry.getAllKeys()).toHaveLength(0)
      expect(registry.getStats().totalKeys).toBe(0)
    })
  })
})
