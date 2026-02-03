/**
 * Integration Tests for Database Routes
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { SupabaseAdapter } from '../../../src/infrastructure/adapters/SupabaseAdapter'
import { PolicyEngine } from '../../../src/infrastructure/policies/PolicyEngine'
import { AuditLogger } from '../../../src/infrastructure/audit/AuditLogger'
import { DatabaseCoreService } from '../../../src/application/services/DatabaseCoreService'
import { createDatabaseRoutes } from '../../../src/presentation/api/routes/database.routes'
import { errorMiddleware } from '../../../src/presentation/api/middleware/error.middleware'
import { OperationType } from '../../../src/domain/value-objects/OperationType'

describe('Database Routes Integration Tests', () => {
  let app: express.Application
  let databaseService: DatabaseCoreService

  beforeAll(() => {
    // Initialize services
    const adapter = new SupabaseAdapter()
    const policyEngine = new PolicyEngine()
    const auditLogger = new AuditLogger()
    databaseService = new DatabaseCoreService(
      adapter,
      policyEngine,
      auditLogger
    )

    // Create Express app
    app = express()
    app.use(express.json())
    app.use('/api/database', createDatabaseRoutes(databaseService, adapter))
    app.use(errorMiddleware)
  })

  describe('POST /api/database/execute', () => {
    it('should execute FIND operation successfully', async () => {
      const response = await request(app)
        .post('/api/database/execute')
        .send({
          operation: OperationType.FIND,
          entity: 'users',
          conditions: {},
          actor: 'test-user',
          options: {
            limit: 10,
          },
        })
        .expect(200)

      expect(response.body).toHaveProperty('success')
      expect(response.body).toHaveProperty('data')
    })

    it('should return 400 for invalid request', async () => {
      const response = await request(app)
        .post('/api/database/execute')
        .send({
          operation: 'INVALID',
          entity: '',
          actor: 'test-user',
        })
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body).toHaveProperty('error')
    })

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/database/execute')
        .send({
          operation: OperationType.FIND,
          // missing entity
          actor: 'test-user',
        })
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  describe('GET /api/database/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/database/health')
        .expect(200)

      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('service', 'database-core')
      expect(response.body).toHaveProperty('timestamp')
    })
  })
})
