/**
 * Integration Tests for DatabaseRepository
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DatabaseRepository } from '../../../src/infrastructure/repositories/DatabaseRepository'
import { IDatabaseAdapter } from '../../../src/domain/interfaces/IDatabaseAdapter'
import { CacheManager } from '../../../src/infrastructure/cache/CacheManager'
import { QueryOptions } from '../../../src/domain/value-objects/QueryOptions'

describe('DatabaseRepository Integration Tests', () => {
  let repository: DatabaseRepository
  let mockAdapter: IDatabaseAdapter
  let cacheManager: CacheManager

  beforeEach(() => {
    mockAdapter = {
      find: vi.fn(),
      findOne: vi.fn(),
      insert: vi.fn(),
      insertMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      executeRaw: vi.fn(),
    }

    cacheManager = new CacheManager({ ttl: 1000 })
    repository = new DatabaseRepository(mockAdapter, cacheManager)
  })

  describe('find with cache', () => {
    it('should cache find results', async () => {
      const mockData = [{ id: '1', name: 'Test' }]
      vi.mocked(mockAdapter.find).mockResolvedValue(mockData)

      // First call - should hit database
      const result1 = await repository.find('users', { role: 'student' })
      expect(result1.getDataAsArray()).toEqual(mockData)
      expect(result1.isCached()).toBe(false)
      expect(mockAdapter.find).toHaveBeenCalledTimes(1)

      // Second call - should hit cache
      const result2 = await repository.find('users', { role: 'student' })
      expect(result2.getDataAsArray()).toEqual(mockData)
      expect(result2.isCached()).toBe(true)
      expect(mockAdapter.find).toHaveBeenCalledTimes(1) // Still 1, not 2
    })

    it('should invalidate cache on insert', async () => {
      const mockData = [{ id: '1', name: 'Test' }]
      const newData = { id: '2', name: 'New' }

      vi.mocked(mockAdapter.find).mockResolvedValue(mockData)
      vi.mocked(mockAdapter.insert).mockResolvedValue(newData as never)

      // Cache a find
      await repository.find('users', { role: 'student' })

      // Insert should invalidate cache
      await repository.insert('users', newData)

      // Next find should hit database again
      await repository.find('users', { role: 'student' })
      expect(mockAdapter.find).toHaveBeenCalledTimes(2)
    })
  })

  describe('findOne with cache', () => {
    it('should cache findOne results', async () => {
      const mockData = { id: '1', name: 'Test' }
      vi.mocked(mockAdapter.findOne).mockResolvedValue(mockData)

      // First call
      const result1 = await repository.findOne('users', { id: '1' })
      expect(result1.getDataAsSingle()).toEqual(mockData)
      expect(result1.isCached()).toBe(false)

      // Second call - should hit cache
      const result2 = await repository.findOne('users', { id: '1' })
      expect(result2.getDataAsSingle()).toEqual(mockData)
      expect(result2.isCached()).toBe(true)
      expect(mockAdapter.findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe('insert', () => {
    it('should insert and return result', async () => {
      const newData = { id: '1', name: 'Test' }
      vi.mocked(mockAdapter.insert).mockResolvedValue(newData as never)

      const result = await repository.insert('users', newData)

      expect(result.getDataAsSingle()).toEqual(newData)
      expect(mockAdapter.insert).toHaveBeenCalledWith('users', newData)
    })
  })

  describe('update', () => {
    it('should update and return result', async () => {
      const updatedData = { id: '1', name: 'Updated' }
      vi.mocked(mockAdapter.update).mockResolvedValue(updatedData as never)

      const result = await repository.update(
        'users',
        { id: '1' },
        { name: 'Updated' }
      )

      expect(result.getDataAsSingle()).toEqual(updatedData)
      expect(mockAdapter.update).toHaveBeenCalledWith(
        'users',
        { id: '1' },
        { name: 'Updated' }
      )
    })
  })

  describe('delete', () => {
    it('should delete and return result', async () => {
      vi.mocked(mockAdapter.delete).mockResolvedValue(true)

      const result = await repository.delete('users', { id: '1' })

      expect(result.getDataAsSingle()).toBe(true)
      expect(mockAdapter.delete).toHaveBeenCalledWith('users', { id: '1' }, undefined)
    })
  })
})
