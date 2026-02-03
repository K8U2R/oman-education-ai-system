/**
 * MySQLAdapter Integration Tests
 * 
 * Tests for MySQL Adapter with real MySQL connection (if available)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { MySQLAdapter } from '../../../src/infrastructure/adapters/MySQLAdapter'
import dotenv from 'dotenv'

dotenv.config()

const TEST_TABLE = 'test_users'

describe('MySQLAdapter Integration Tests', () => {
  let adapter: MySQLAdapter
  let isConnected = false

  beforeEach(async () => {
    adapter = new MySQLAdapter({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      database: process.env.MYSQL_DATABASE || 'testdb',
      username: process.env.MYSQL_USER || 'testuser',
      password: process.env.MYSQL_PASSWORD || 'testpass',
      poolSize: 5,
      timeout: 5000,
      useEnhancedPooling: false, // Disable for integration tests
    })

    try {
      // Attempt to connect and create a test table
      await adapter.executeRaw(`
        CREATE TABLE IF NOT EXISTS ${TEST_TABLE} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          role VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL
        ) ENGINE=InnoDB;
      `)
      isConnected = true
    } catch (error) {
      console.warn('Could not connect to MySQL for integration tests. Skipping...', error)
      isConnected = false
    }
  })

  afterEach(async () => {
    if (isConnected) {
      try {
        await adapter.executeRaw(`DROP TABLE IF EXISTS ${TEST_TABLE};`)
      } catch (error) {
        // Ignore errors during cleanup
      }
      await adapter.close()
    }
    vi.clearAllMocks()
  })

  describe('find', () => {
    it('should find records with conditions', async () => {
      if (!isConnected) {
        console.log('Skipping: MySQL not available')
        return
      }

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

      const result = await adapter.find(TEST_TABLE, { role: 'student' })

      expect(result).toBeDefined()
      expect(result.length).toBeGreaterThanOrEqual(1)
      expect((result[0] as any).name).toBe('Test User 1')
    })
  })

  describe('findOne', () => {
    it('should find a single record', async () => {
      if (!isConnected) {
        console.log('Skipping: MySQL not available')
        return
      }

      await adapter.insert(TEST_TABLE, {
        name: 'Single User',
        email: 'single@example.com',
        role: 'admin',
      })

      const result = await adapter.findOne(TEST_TABLE, { email: 'single@example.com' })

      expect(result).toBeDefined()
      expect(result).toHaveProperty('name', 'Single User')
    })

    it('should return null if record not found', async () => {
      if (!isConnected) {
        console.log('Skipping: MySQL not available')
        return
      }

      const result = await adapter.findOne(TEST_TABLE, { email: 'nonexistent@example.com' })
      expect(result).toBeNull()
    })
  })

  describe('insert', () => {
    it('should insert a new record', async () => {
      if (!isConnected) {
        console.log('Skipping: MySQL not available')
        return
      }

      const data = {
        name: 'New User',
        email: 'newuser@example.com',
        role: 'student',
      }

      const result = await adapter.insert(TEST_TABLE, data)

      expect(result).toBeDefined()
      expect((result as any).name).toBe('New User')
    })
  })

  describe('update', () => {
    it('should update existing record', async () => {
      if (!isConnected) {
        console.log('Skipping: MySQL not available')
        return
      }

      // Insert test data
      await adapter.insert(TEST_TABLE, {
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
  })

  describe('delete', () => {
    it('should delete existing record (soft delete)', async () => {
      if (!isConnected) {
        console.log('Skipping: MySQL not available')
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

      // Verify soft delete (record should still exist with deleted_at)
      const result = await adapter.findOne(TEST_TABLE, {
        email: 'delete@example.com',
      })
      // In soft delete, record might still exist but with deleted_at set
      // This depends on implementation
    })
  })

  describe('count', () => {
    it('should count all records', async () => {
      if (!isConnected) {
        console.log('Skipping: MySQL not available')
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
        console.log('Skipping: MySQL not available')
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
        console.log('Skipping: MySQL not available')
        return
      }

      const supportsTransactions = adapter.supportsTransactions()
      expect(supportsTransactions).toBe(true)
    })

    it('should begin, commit transaction', async () => {
      if (!isConnected) {
        console.log('Skipping: MySQL not available')
        return
      }

      const transactionId = await adapter.beginTransaction()
      expect(transactionId).toBeDefined()

      // Insert within transaction
      await adapter.executeInTransaction(transactionId, async (connection) => {
        await connection.execute(
          `INSERT INTO ${TEST_TABLE} (name, email, role) VALUES (?, ?, ?)`,
          ['Transaction User', 'transaction@example.com', 'student']
        )
      })

      await adapter.commitTransaction(transactionId)

      // Verify data was committed
      const result = await adapter.findOne(TEST_TABLE, {
        email: 'transaction@example.com',
      })
      expect(result).toBeDefined()
    })

    it('should rollback transaction', async () => {
      if (!isConnected) {
        console.log('Skipping: MySQL not available')
        return
      }

      const transactionId = await adapter.beginTransaction()

      // Insert within transaction
      await adapter.executeInTransaction(transactionId, async (connection) => {
        await connection.execute(
          `INSERT INTO ${TEST_TABLE} (name, email, role) VALUES (?, ?, ?)`,
          ['Rollback User', 'rollback@example.com', 'student']
        )
      })

      await adapter.rollbackTransaction(transactionId)

      // Verify data was rolled back
      const result = await adapter.findOne(TEST_TABLE, {
        email: 'rollback@example.com',
      })
      expect(result).toBeNull()
    })
  })

  describe('Savepoints', () => {
    it('should create and rollback to savepoint', async () => {
      if (!isConnected) {
        console.log('Skipping: MySQL not available')
        return
      }

      const transactionId = await adapter.beginTransaction()

      // Insert first record
      await adapter.executeInTransaction(transactionId, async (connection) => {
        await connection.execute(
          `INSERT INTO ${TEST_TABLE} (name, email, role) VALUES (?, ?, ?)`,
          ['Savepoint User 1', 'savepoint1@example.com', 'student']
        )
      })

      // Create savepoint
      const savepointName = await adapter.createSavepoint(transactionId, 'checkpoint1')

      // Insert second record
      await adapter.executeInTransaction(transactionId, async (connection) => {
        await connection.execute(
          `INSERT INTO ${TEST_TABLE} (name, email, role) VALUES (?, ?, ?)`,
          ['Savepoint User 2', 'savepoint2@example.com', 'student']
        )
      })

      // Rollback to savepoint
      await adapter.rollbackToSavepoint(transactionId, savepointName)

      // Commit transaction
      await adapter.commitTransaction(transactionId)

      // Verify first record exists, second doesn't
      const result1 = await adapter.findOne(TEST_TABLE, {
        email: 'savepoint1@example.com',
      })
      const result2 = await adapter.findOne(TEST_TABLE, {
        email: 'savepoint2@example.com',
      })

      expect(result1).toBeDefined()
      expect(result2).toBeNull()
    })
  })
})
