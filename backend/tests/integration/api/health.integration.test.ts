/**
 * Health API Integration Tests - اختبارات التكامل لـ Health Endpoints
 */

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '@/index'

describe('Health API Integration Tests', () => {
  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200)

      expect(response.body.status).toBe('ok')
      expect(response.body.service).toBe('Oman Education AI Backend')
      expect(response.body.version).toBeDefined()
      expect(response.body.environment).toBeDefined()
      expect(response.body.timestamp).toBeDefined()
    })
  })

  describe('GET /api/v1/health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app)
        .get('/api/v1/health/ready')

      // In test environment, database might not be available
      // So we accept both 200 (ready) and 503 (not ready)
      expect([200, 503]).toContain(response.status)
      expect(response.body.status).toBeDefined()
      expect(response.body.checks).toBeDefined()
      expect(response.body.timestamp).toBeDefined()
    })
  })

  describe('GET /api/v1/health/live', () => {
    it('should return liveness status', async () => {
      const response = await request(app)
        .get('/api/v1/health/live')
        .expect(200)

      expect(response.body.status).toBe('alive')
      expect(response.body.timestamp).toBeDefined()
    })
  })
})

