/**
 * DatabaseAdapterFactory Unit Tests
 * 
 * Tests for DatabaseAdapterFactory
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DatabaseAdapterFactory } from '../../../src/infrastructure/adapters/DatabaseAdapterFactory'
import { DatabaseProvider } from '../../../src/domain/types/database-connection.types'
import { IDatabaseAdapter } from '../../../src/domain/interfaces/IDatabaseAdapter'

describe('DatabaseAdapterFactory', () => {
  describe('createAdapter', () => {
    it('should create Supabase adapter with valid config', () => {
      const config = {
        url: 'https://test.supabase.co',
        serviceRoleKey: 'test-key',
      }

      const adapter = DatabaseAdapterFactory.createAdapter(DatabaseProvider.SUPABASE, config)

      expect(adapter).toBeDefined()
      expect(adapter).toBeInstanceOf(Object)
    })

    it('should throw error for Supabase adapter with missing url', () => {
      const config = {
        serviceRoleKey: 'test-key',
      } as any

      expect(() => {
        DatabaseAdapterFactory.createAdapter(DatabaseProvider.SUPABASE, config)
      }).toThrow('Supabase configuration is missing')
    })

    it('should throw error for Supabase adapter with missing serviceRoleKey', () => {
      const config = {
        url: 'https://test.supabase.co',
      } as any

      expect(() => {
        DatabaseAdapterFactory.createAdapter(DatabaseProvider.SUPABASE, config)
      }).toThrow('Supabase configuration is missing')
    })

    it('should throw error for PostgreSQL adapter with missing config', () => {
      const config = {
        host: 'localhost',
        // missing database, username, password
      } as any

      expect(() => {
        DatabaseAdapterFactory.createAdapter(DatabaseProvider.POSTGRESQL, config)
      }).toThrow('PostgreSQL configuration is missing')
    })

    it('should throw error for unsupported provider', () => {
      const config = {}

      expect(() => {
        DatabaseAdapterFactory.createAdapter('UNSUPPORTED' as DatabaseProvider, config)
      }).toThrow('Unsupported database provider')
    })

    it('should throw error for MySQL provider (not implemented)', () => {
      const config = {}

      expect(() => {
        DatabaseAdapterFactory.createAdapter(DatabaseProvider.MYSQL, config)
      }).toThrow('MySQL adapter not yet implemented')
    })

    it('should throw error for MongoDB provider (not implemented)', () => {
      const config = {}

      expect(() => {
        DatabaseAdapterFactory.createAdapter(DatabaseProvider.MONGODB, config)
      }).toThrow('MongoDB adapter not yet implemented')
    })

    it('should throw error for SQLite provider (not implemented)', () => {
      const config = {}

      expect(() => {
        DatabaseAdapterFactory.createAdapter(DatabaseProvider.SQLITE, config)
      }).toThrow('SQLite adapter not yet implemented')
    })
  })
})
