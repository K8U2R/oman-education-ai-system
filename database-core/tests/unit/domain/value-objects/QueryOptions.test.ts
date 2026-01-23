/**
 * Unit Tests for QueryOptions Value Object
 */

import { describe, it, expect } from 'vitest'
import { QueryOptions } from '../../../../src/domain/value-objects/QueryOptions'

describe('QueryOptions', () => {
  describe('constructor', () => {
    it('should create QueryOptions with valid params', () => {
      const options = new QueryOptions({
        limit: 10,
        offset: 0,
        orderBy: { column: 'created_at', direction: 'desc' },
      })

      expect(options.getLimit()).toBe(10)
      expect(options.getOffset()).toBe(0)
      expect(options.getOrderBy()).toEqual({
        column: 'created_at',
        direction: 'desc',
      })
    })

    it('should create QueryOptions with empty params', () => {
      const options = new QueryOptions()
      expect(options.getLimit()).toBeUndefined()
      expect(options.getOffset()).toBeUndefined()
      expect(options.getOrderBy()).toBeUndefined()
    })

    it('should throw error if limit is less than 1', () => {
      expect(() => new QueryOptions({ limit: 0 })).toThrow(
        'Limit must be between 1 and 1000'
      )
    })

    it('should throw error if limit is greater than 1000', () => {
      expect(() => new QueryOptions({ limit: 1001 })).toThrow(
        'Limit must be between 1 and 1000'
      )
    })

    it('should throw error if offset is negative', () => {
      expect(() => new QueryOptions({ offset: -1 })).toThrow(
        'Offset must be >= 0'
      )
    })

    it('should throw error if orderBy column is empty', () => {
      expect(() => new QueryOptions({ orderBy: { column: '', direction: 'asc' } })).toThrow(
        'OrderBy column is required'
      )
    })

    it('should throw error if orderBy direction is invalid', () => {
      expect(() => new QueryOptions({ orderBy: { column: 'name', direction: 'invalid' as 'asc' } })).toThrow(
        'OrderBy direction must be "asc" or "desc"'
      )
    })
  })

  describe('toJSON', () => {
    it('should serialize QueryOptions to JSON', () => {
      const options = new QueryOptions({
        limit: 10,
        offset: 20,
        orderBy: { column: 'name', direction: 'asc' },
      })

      const json = options.toJSON()
      expect(json).toEqual({
        limit: 10,
        offset: 20,
        orderBy: { column: 'name', direction: 'asc' },
      })
    })
  })
})
