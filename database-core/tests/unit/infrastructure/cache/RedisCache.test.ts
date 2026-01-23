/**
 * RedisCache Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { RedisCache } from '../../../../src/infrastructure/cache/RedisCache'

// Mock ioredis
vi.mock('ioredis', () => {
  const mockRedis = {
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    exists: vi.fn(),
    expire: vi.fn(),
    ttl: vi.fn(),
    keys: vi.fn(),
    info: vi.fn(),
    connect: vi.fn().mockResolvedValue(undefined),
    quit: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
  }

  return {
    default: vi.fn(() => mockRedis),
  }
})

describe('RedisCache', () => {
  let redisCache: RedisCache
  let mockRedis: any

  beforeEach(() => {
    const ioredis = require('ioredis')
    const RedisMock = ioredis.default as ReturnType<typeof vi.fn>
    
    mockRedis = {
      get: vi.fn(),
      set: vi.fn(),
      setex: vi.fn(),
      del: vi.fn(),
      exists: vi.fn(),
      expire: vi.fn(),
      ttl: vi.fn(),
      keys: vi.fn(),
      info: vi.fn(),
      connect: vi.fn().mockResolvedValue(undefined),
      quit: vi.fn().mockResolvedValue(undefined),
      on: vi.fn(),
    }
    
    // جعل constructor يرجع mockRedis
    if (RedisMock && typeof RedisMock.mockReturnValue === 'function') {
      RedisMock.mockReturnValue(mockRedis)
    }

    redisCache = new RedisCache({
      host: 'localhost',
      port: 6379,
      lazyConnect: true,
    })
    
    // ربط mockRedis مع redisCache.client
    // @ts-expect-error - الوصول إلى private property للاختبار
    redisCache.client = mockRedis
    // @ts-expect-error - الوصول إلى private property للاختبار
    redisCache.isConnected = true
    
    // Mock ensureConnection للعودة مباشرة إلى true
    // @ts-expect-error - الوصول إلى private method للاختبار
    redisCache.ensureConnection = vi.fn().mockResolvedValue(true)
  })

  afterEach(async () => {
    await redisCache.close()
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should get value from cache', async () => {
      const mockValue = JSON.stringify({
        value: { id: 1, name: 'Test' },
        createdAt: Date.now(),
      })
      mockRedis.get.mockResolvedValue(mockValue)

      const result = await redisCache.get('test-key')

      expect(result).toBeDefined()
      expect(mockRedis.get).toHaveBeenCalled()
    })

    it('should return null if key not found', async () => {
      mockRedis.get.mockResolvedValue(null)

      const result = await redisCache.get('non-existent')

      expect(result).toBeNull()
    })

    it('should return null if expired', async () => {
      const expiredValue = JSON.stringify({
        value: { id: 1 },
        createdAt: Date.now(),
        expiresAt: Date.now() - 1000, // Expired
      })
      mockRedis.get.mockResolvedValue(expiredValue)
      mockRedis.del.mockResolvedValue(1)

      const result = await redisCache.get('expired-key')

      expect(result).toBeNull()
      expect(mockRedis.del).toHaveBeenCalled()
    })
  })

  describe('set', () => {
    it('should set value in cache', async () => {
      mockRedis.setex.mockResolvedValue('OK')

      const result = await redisCache.set('test-key', { id: 1, name: 'Test' }, 60000)

      expect(result).toBe(true)
      expect(mockRedis.setex).toHaveBeenCalled()
    })

    it('should set value without TTL', async () => {
      // إنشاء RedisCache جديد بدون TTL افتراضي
      const redisCacheNoTTL = new RedisCache({
        host: 'localhost',
        port: 6379,
        lazyConnect: true,
      })
      
      // تعيين ttl إلى 0 بعد الإنشاء (لأن constructor يستخدم || operator)
      // @ts-expect-error - الوصول إلى private property للاختبار
      redisCacheNoTTL.config.ttl = 0
      
      // ربط mockRedis مع redisCacheNoTTL.client
      // @ts-expect-error - الوصول إلى private property للاختبار
      redisCacheNoTTL.client = mockRedis
      // @ts-expect-error - الوصول إلى private property للاختبار
      redisCacheNoTTL.isConnected = true
      // @ts-expect-error - الوصول إلى private method للاختبار
      redisCacheNoTTL.ensureConnection = vi.fn().mockResolvedValue(true)
      
      mockRedis.set.mockResolvedValue('OK')

      const result = await redisCacheNoTTL.set('test-key', { id: 1 })

      expect(result).toBe(true)
      expect(mockRedis.set).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should delete key from cache', async () => {
      mockRedis.del.mockResolvedValue(1)

      const result = await redisCache.delete('test-key')

      expect(result).toBe(true)
      expect(mockRedis.del).toHaveBeenCalled()
    })

    it('should return false if key not found', async () => {
      mockRedis.del.mockResolvedValue(0)

      const result = await redisCache.delete('non-existent')

      expect(result).toBe(false)
    })
  })

  describe('deleteMany', () => {
    it('should delete multiple keys', async () => {
      mockRedis.del.mockResolvedValue(2)

      const result = await redisCache.deleteMany(['key1', 'key2'])

      expect(result).toBe(2)
      expect(mockRedis.del).toHaveBeenCalled()
    })
  })

  describe('clear', () => {
    it('should clear all keys matching pattern', async () => {
      mockRedis.keys.mockResolvedValue(['db-core:key1', 'db-core:key2'])
      mockRedis.del.mockResolvedValue(2)

      const result = await redisCache.clear('*')

      expect(result).toBe(2)
    })
  })

  describe('exists', () => {
    it('should check if key exists', async () => {
      mockRedis.exists.mockResolvedValue(1)

      const result = await redisCache.exists('test-key')

      expect(result).toBe(true)
    })
  })

  describe('expire', () => {
    it('should set expiration for key', async () => {
      mockRedis.expire.mockResolvedValue(1)

      const result = await redisCache.expire('test-key', 60000)

      expect(result).toBe(true)
    })
  })

  describe('getTTL', () => {
    it('should get TTL for key', async () => {
      mockRedis.ttl.mockResolvedValue(60) // 60 seconds

      const result = await redisCache.getTTL('test-key')

      expect(result).toBe(60000) // Converted to milliseconds
    })
  })

  describe('keys', () => {
    it('should get all keys matching pattern', async () => {
      mockRedis.keys.mockResolvedValue(['db-core:key1', 'db-core:key2'])

      const result = await redisCache.keys('*')

      expect(result).toEqual(['key1', 'key2'])
    })
  })

  describe('size', () => {
    it('should get cache size', async () => {
      mockRedis.keys.mockResolvedValue(['db-core:key1', 'db-core:key2'])

      const result = await redisCache.size()

      expect(result).toBe(2)
    })
  })

  describe('getStats', () => {
    it('should get cache statistics', async () => {
      mockRedis.keys.mockResolvedValue(['db-core:key1'])
      mockRedis.info.mockResolvedValue('used_memory_human:1.5M\n')

      const result = await redisCache.getStats()

      expect(result).toHaveProperty('connected')
      expect(result).toHaveProperty('keys')
      expect(result.keys).toBe(1)
    })
  })

  describe('close', () => {
    it('should close Redis connection', async () => {
      await redisCache.close()

      expect(mockRedis.quit).toHaveBeenCalled()
    })
  })
})
