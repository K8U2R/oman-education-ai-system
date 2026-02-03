/**
 * SupabaseAdapter Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SupabaseAdapter } from '../../../../src/infrastructure/adapters/SupabaseAdapter'
import type { SupabaseClient } from '@supabase/supabase-js'

// Mock @supabase/supabase-js
vi.mock('@supabase/supabase-js', () => {
  const mockClient = {
    from: vi.fn(),
  }

  return {
    createClient: vi.fn(() => mockClient),
  }
})

describe('SupabaseAdapter', () => {
  let adapter: SupabaseAdapter
  let mockSupabaseClient: {
    from: ReturnType<typeof vi.fn>
  }

  beforeEach(async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const createClientMock = createClient as ReturnType<typeof vi.fn>
    mockSupabaseClient = createClientMock?.mock?.results?.[0]?.value || {
      from: vi.fn(),
    }

    adapter = new SupabaseAdapter('https://test.supabase.co', 'test-key')
  })

  describe('count', () => {
    it('should count records with conditions', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({
          count: 5,
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await adapter.count('users', { role: 'student' })

      expect(result).toBe(5)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users')
      expect(mockQuery.select).toHaveBeenCalledWith('*', { count: 'exact', head: true })
      expect(mockQuery.eq).toHaveBeenCalledWith('role', 'student')
    })

    it('should count all records when no conditions', async () => {
      const mockQuery = {
        select: vi.fn().mockResolvedValue({
          count: 10,
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await adapter.count('users')

      expect(result).toBe(10)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users')
      expect(mockQuery.select).toHaveBeenCalledWith('*', { count: 'exact', head: true })
    })

    it('should handle errors', async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({
          count: null,
          error: { message: 'Database error' },
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      await expect(adapter.count('users', { role: 'student' })).rejects.toThrow(
        'Supabase count error'
      )
    })

    it('should return 0 if count is null', async () => {
      const mockQuery = {
        select: vi.fn().mockResolvedValue({
          count: null,
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await adapter.count('users')

      expect(result).toBe(0)
    })
  })

  describe('find', () => {
    it('should find records successfully', async () => {
      const mockData = [{ id: '1', name: 'User 1' }]
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({
          data: mockData,
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await adapter.find('users', { role: 'student' })

      expect(result).toEqual(mockData)
    })
  })

  describe('insert', () => {
    it('should insert record successfully', async () => {
      const mockData = { id: '1', name: 'New User' }
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockData,
          error: null,
        }),
      }

      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await adapter.insert('users', { name: 'New User' })

      expect(result).toEqual(mockData)
    })
  })
})
