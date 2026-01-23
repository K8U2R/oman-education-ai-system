/**
 * Integration Tests for Health Routes
 */

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { SupabaseAdapter } from '../../../src/infrastructure/adapters/SupabaseAdapter'
import { HealthHandler } from '../../../src/presentation/api/handlers/HealthHandler'
import { Router } from 'express'

describe('Health Routes Integration Tests', () => {
  let app: express.Application

  beforeAll(() => {
    const adapter = new SupabaseAdapter()
    const healthHandler = new HealthHandler(adapter)

    app = express()
    const router = Router()
    router.get('/health', async (req, res) => {
      await healthHandler.checkHealth(req, res)
    })
    app.use('/api/database', router)
  })

  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/database/health')
      .expect(200)

    expect(response.body).toHaveProperty('status')
    expect(response.body).toHaveProperty('service', 'database-core')
    expect(response.body).toHaveProperty('timestamp')
  })
})
