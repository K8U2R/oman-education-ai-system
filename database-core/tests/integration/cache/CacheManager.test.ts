/**
 * Integration Tests for CacheManager
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { CacheManager } from '../../../src/infrastructure/cache/CacheManager'

describe('CacheManager Integration Tests', () => {
  let cacheManager: CacheManager

  beforeEach(() => {
    cacheManager = new CacheManager({
      ttl: 1000, // 1 second
      maxSize: 10,
    })
  })

  describe('get and set', () => {
    it('should store and retrieve values', () => {
      cacheManager.set('key1', 'value1')
      const value = cacheManager.get('key1')
      expect(value).toBe('value1')
    })

    it('should return null for non-existent key', () => {
      const value = cacheManager.get('non-existent')
      expect(value).toBeNull()
    })

    it('should expire values after TTL', async () => {
      cacheManager.set('key1', 'value1', 100) // 100ms TTL
      expect(cacheManager.get('key1')).toBe('value1')

      await new Promise((resolve) => setTimeout(resolve, 150))

      expect(cacheManager.get('key1')).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete values', () => {
      cacheManager.set('key1', 'value1')
      expect(cacheManager.get('key1')).toBe('value1')

      cacheManager.delete('key1')
      expect(cacheManager.get('key1')).toBeNull()
    })
  })

  describe('clear', () => {
    it('should clear all values', () => {
      cacheManager.set('key1', 'value1')
      cacheManager.set('key2', 'value2')

      cacheManager.clear()

      expect(cacheManager.get('key1')).toBeNull()
      expect(cacheManager.get('key2')).toBeNull()
    })
  })

  describe('generateKey', () => {
    it('should generate consistent keys', () => {
      const key1 = cacheManager.generateKey('prefix', { a: 1, b: 2 })
      const key2 = cacheManager.generateKey('prefix', { b: 2, a: 1 })
      expect(key1).toBe(key2)
    })

    it('should generate different keys for different params', () => {
      const key1 = cacheManager.generateKey('prefix', { a: 1 })
      const key2 = cacheManager.generateKey('prefix', { a: 2 })
      expect(key1).not.toBe(key2)
    })
  })

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cacheManager.set('key1', 'value1')
      cacheManager.get('key1') // hit
      cacheManager.get('key2') // miss

      const stats = cacheManager.getStats()

      expect(stats.hitCount).toBe(1)
      expect(stats.missCount).toBe(1)
      expect(stats.hitRate).toBe(0.5)
      expect(stats.size).toBeGreaterThan(0)
    })
  })

  describe('maxSize', () => {
    it('should evict oldest when maxSize is reached', () => {
      const smallCache = new CacheManager({ maxSize: 2 })

      smallCache.set('key1', 'value1')
      smallCache.set('key2', 'value2')
      smallCache.set('key3', 'value3') // should evict key1

      expect(smallCache.get('key1')).toBeNull()
      expect(smallCache.get('key2')).toBe('value2')
      expect(smallCache.get('key3')).toBe('value3')
    })
  })
})
