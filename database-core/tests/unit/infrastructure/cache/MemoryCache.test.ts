/**
 * Unit Tests for MemoryCache
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryCache } from '../../../../src/infrastructure/cache/MemoryCache'

describe('MemoryCache', () => {
  let cache: MemoryCache

  beforeEach(() => {
    cache = new MemoryCache(1000) // 1 second TTL
  })

  describe('get and set', () => {
    it('should store and retrieve values', () => {
      cache.set('key1', 'value1')
      expect(cache.get('key1')).toBe('value1')
    })

    it('should return null for non-existent key', () => {
      expect(cache.get('non-existent')).toBeNull()
    })

    it('should expire values after TTL', async () => {
      cache.set('key1', 'value1', 100) // 100ms TTL
      expect(cache.get('key1')).toBe('value1')

      await new Promise((resolve) => setTimeout(resolve, 150))

      expect(cache.get('key1')).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete values', () => {
      cache.set('key1', 'value1')
      expect(cache.delete('key1')).toBe(true)
      expect(cache.get('key1')).toBeNull()
    })

    it('should return false for non-existent key', () => {
      expect(cache.delete('non-existent')).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear all values', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')

      cache.clear()

      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBeNull()
      expect(cache.size()).toBe(0)
    })
  })

  describe('has', () => {
    it('should return true for existing key', () => {
      cache.set('key1', 'value1')
      expect(cache.has('key1')).toBe(true)
    })

    it('should return false for non-existent key', () => {
      expect(cache.has('non-existent')).toBe(false)
    })

    it('should return false for expired key', async () => {
      cache.set('key1', 'value1', 100)
      await new Promise((resolve) => setTimeout(resolve, 150))
      expect(cache.has('key1')).toBe(false)
    })
  })

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')

      const stats = cache.getStats()

      expect(stats.size).toBe(2)
      expect(stats.entries).toBe(2)
      expect(stats.expired).toBe(0)
    })
  })
})
