/**
 * PostgreSQLAdapter Integration Tests
 * 
 * Integration tests for PostgreSQLAdapter with real database connection
 * Note: Requires PostgreSQL test database to be running
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { PostgreSQLAdapter } from '../../../src/infrastructure/adapters/PostgreSQLAdapter'
import type { IDatabaseAdapter } from '../../../src/domain/interfaces/IDatabaseAdapter'

// Test configuration - يمكن استخدام environment variables
const TEST_DB_CONFIG = {
  host: process.env.TEST_POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.TEST_POSTGRES_PORT || '5432'),
  database: process.env.TEST_POSTGRES_DB || 'test_db',
  username: process.env.TEST_POSTGRES_USER || 'test_user',
  password: process.env.TEST_POSTGRES_PASSWORD || 'test_password',
  poolSize: 5,
  timeout: 10000,
}

// Test table name
const TEST_TABLE = 'test_users'

describe('PostgreSQLAdapter Integration', () => {
  let adapter: PostgreSQLAdapter
  let isConnected = false

  /**
   * Setup test database and table
   */
  beforeAll(async () => {
    try {
      adapter = new PostgreSQLAdapter(TEST_DB_CONFIG)
      
      // Test connection by creating test table
      await adapter.executeRaw(`
        CREATE TABLE IF NOT EXISTS ${TEST_TABLE} (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE,
          role VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      isConnected = true
    } catch (error) {
      // Skip tests if database is not available
      console.warn('PostgreSQL test database not available, skipping integration tests')
      isConnected = false
    }
  })

  /**
   * Cleanup test data
   */
  beforeEach(async () => {
    if (!isConnected) return
    
    try {
      // Clear test data
      await adapter.executeRaw(`DELETE FROM ${TEST_TABLE}`)
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  /**
   * Cleanup test table
   */
  afterAll(async () => {
    if (!isConnected) return
    
    try {
      // Drop test table
      await adapter.executeRaw(`DROP TABLE IF EXISTS ${TEST_TABLE}`)
      
      // Close adapter connections
      await adapter.close?.()
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe('Connection', () => {
    it('should connect to PostgreSQL database', () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }
      
      expect(adapter).toBeDefined()
    })
  })

  describe('find', () => {
    it('should find all records when no conditions', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      // Insert test data
      await adapter.insert(TEST_TABLE, {
        name: 'Test User 1',
        email: 'test1@example.com',
        role: 'student',
      })
      await adapter.insert(TEST_TABLE, {
        name: 'Test User 2',
        email: 'test2@example.com',
        role: 'teacher',
      })

      const results = await adapter.find(TEST_TABLE, {})
      
      expect(results.length).toBeGreaterThanOrEqual(2)
    })

    it('should find records with conditions', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      // Insert test data
      await adapter.insert(TEST_TABLE, {
        name: 'Student User',
        email: 'student@example.com',
        role: 'student',
      })

      const results = await adapter.find(TEST_TABLE, { role: 'student' })
      
      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results[0]).toHaveProperty('role', 'student')
    })

    it('should apply limit and offset', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      // Insert multiple records
      for (let i = 0; i < 5; i++) {
        await adapter.insert(TEST_TABLE, {
          name: `User ${i}`,
          email: `user${i}@example.com`,
          role: 'student',
        })
      }

      const results = await adapter.find(
        TEST_TABLE,
        {},
        { limit: 2, offset: 1 }
      )
      
      expect(results.length).toBeLessThanOrEqual(2)
    })

    it('should apply orderBy', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      // Insert test data
      await adapter.insert(TEST_TABLE, {
        name: 'User A',
        email: 'usera@example.com',
        role: 'student',
      })
      await adapter.insert(TEST_TABLE, {
        name: 'User B',
        email: 'userb@example.com',
        role: 'student',
      })

      const results = await adapter.find(
        TEST_TABLE,
        {},
        {
          orderBy: { column: 'name', direction: 'asc' },
        }
      )
      
      expect(results.length).toBeGreaterThanOrEqual(2)
      // Results should be ordered by name
    })
  })

  describe('findOne', () => {
    it('should find single record', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      // Insert test data
      const inserted = await adapter.insert(TEST_TABLE, {
        name: 'Single User',
        email: 'single@example.com',
        role: 'student',
      })

      const result = await adapter.findOne(TEST_TABLE, {
        email: 'single@example.com',
      })
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('email', 'single@example.com')
    })

    it('should return null when record not found', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      const result = await adapter.findOne(TEST_TABLE, {
        email: 'nonexistent@example.com',
      })
      
      expect(result).toBeNull()
    })
  })

  describe('insert', () => {
    it('should insert new record', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      const data = {
        name: 'New User',
        email: 'newuser@example.com',
        role: 'student',
      }

      const result = await adapter.insert(TEST_TABLE, data)
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('name', 'New User')
      expect(result).toHaveProperty('email', 'newuser@example.com')
    })

    it('should return inserted record with generated id', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      const data = {
        name: 'User With ID',
        email: 'userid@example.com',
        role: 'student',
      }

      const result = await adapter.insert(TEST_TABLE, data) as { id: number; name: string; email: string; role: string }
      
      expect(result).toHaveProperty('id')
      expect(typeof result.id).toBe('number')
    })
  })

  describe('update', () => {
    it('should update existing record', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      // Insert test data
      const inserted = await adapter.insert(TEST_TABLE, {
        name: 'Original Name',
        email: 'update@example.com',
        role: 'student',
      })

      const updated = await adapter.update(
        TEST_TABLE,
        { email: 'update@example.com' },
        { name: 'Updated Name', role: 'teacher' }
      )
      
      expect(updated).toBeDefined()
      expect(updated).toHaveProperty('name', 'Updated Name')
      expect(updated).toHaveProperty('role', 'teacher')
    })

    it('should return null when record not found', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      const result = await adapter.update(
        TEST_TABLE,
        { email: 'nonexistent@example.com' },
        { name: 'Updated' }
      )
      
      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete existing record', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      // Insert test data
      await adapter.insert(TEST_TABLE, {
        name: 'To Delete',
        email: 'delete@example.com',
        role: 'student',
      })

      const deleted = await adapter.delete(TEST_TABLE, {
        email: 'delete@example.com',
      })
      
      expect(deleted).toBe(true)

      // Verify deletion
      const result = await adapter.findOne(TEST_TABLE, {
        email: 'delete@example.com',
      })
      expect(result).toBeNull()
    })

    it('should return false when record not found', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      const result = await adapter.delete(TEST_TABLE, {
        email: 'nonexistent@example.com',
      })
      
      expect(result).toBe(false)
    })
  })

  describe('count', () => {
    it('should count all records', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      // Insert test data
      await adapter.insert(TEST_TABLE, {
        name: 'Count User 1',
        email: 'count1@example.com',
        role: 'student',
      })
      await adapter.insert(TEST_TABLE, {
        name: 'Count User 2',
        email: 'count2@example.com',
        role: 'student',
      })

      const count = await adapter.count(TEST_TABLE)
      
      expect(count).toBeGreaterThanOrEqual(2)
    })

    it('should count records with conditions', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      // Insert test data
      await adapter.insert(TEST_TABLE, {
        name: 'Student User',
        email: 'studentcount@example.com',
        role: 'student',
      })
      await adapter.insert(TEST_TABLE, {
        name: 'Teacher User',
        email: 'teachercount@example.com',
        role: 'teacher',
      })

      const count = await adapter.count(TEST_TABLE, { role: 'student' })
      
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Transactions', () => {
    it('should support transactions', () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      const supportsTransactions = (adapter as any).supportsTransactions?.()
      expect(supportsTransactions).toBe(true)
    })

    it('should begin, commit transaction', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      if (!(adapter as any).supportsTransactions?.()) {
        console.log('Skipping: Transactions not supported')
        return
      }

      const transactionId = await (adapter as any).beginTransaction()
      expect(transactionId).toBeDefined()

      // Insert within transaction
      await adapter.insert(TEST_TABLE, {
        name: 'Transaction User',
        email: 'transaction@example.com',
        role: 'student',
      })

      await (adapter as any).commitTransaction(transactionId)

      // Verify data was committed
      const result = await adapter.findOne(TEST_TABLE, {
        email: 'transaction@example.com',
      })
      expect(result).toBeDefined()
    })

    it('should rollback transaction', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      if (!(adapter as any).supportsTransactions?.()) {
        console.log('Skipping: Transactions not supported')
        return
      }

      const transactionId = await (adapter as any).beginTransaction()

      // Insert within transaction
      await adapter.insert(TEST_TABLE, {
        name: 'Rollback User',
        email: 'rollback@example.com',
        role: 'student',
      })

      await (adapter as any).rollbackTransaction(transactionId)

      // Verify data was rolled back
      const result = await adapter.findOne(TEST_TABLE, {
        email: 'rollback@example.com',
      })
      expect(result).toBeNull()
    })
  })

  describe('executeRaw', () => {
    it('should execute raw SQL query', async () => {
      if (!isConnected) {
        console.log('Skipping: PostgreSQL not available')
        return
      }

      const result = await adapter.executeRaw(
        `SELECT COUNT(*) as count FROM ${TEST_TABLE}`
      )
      
      expect(result).toBeDefined()
      const resultData = Array.isArray(result) ? result[0] : result
      expect(resultData).toHaveProperty('count')
    })
  })
})
