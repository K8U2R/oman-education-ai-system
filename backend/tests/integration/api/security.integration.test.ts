/**
 * Security API Integration Tests - اختبارات تكامل API الأمان
 * 
 * Integration tests لجميع Security API endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../../src/index'

describe('Security API Integration Tests', () => {
  let authToken: string
  let adminToken: string
  let developerToken: string

  beforeAll(async () => {

    // Login as regular user
    const userLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test1234!',
      })

    if (userLoginResponse.body.success) {
      authToken = userLoginResponse.body.data.access_token
    }

    // Login as admin (if available)
    const adminLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin1234!',
      })

    if (adminLoginResponse.body.success) {
      adminToken = adminLoginResponse.body.data.access_token
    }

    // Login as developer (if available)
    const developerLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'developer@example.com',
        password: 'Developer1234!',
      })

    if (developerLoginResponse.body.success) {
      developerToken = developerLoginResponse.body.data.access_token
    }
  })

  afterAll(async () => {
    // Cleanup if needed
  })

  describe('GET /api/v1/security/stats', () => {
    it('should return security stats for admin', async () => {
      const response = await request(app)
        .get('/api/v1/security/stats')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('totalSessions')
      expect(response.body.data).toHaveProperty('activeSessions')
      expect(response.body.data).toHaveProperty('totalEvents')
    })

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .get('/api/v1/security/stats')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(403)
    })

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/v1/security/stats')

      expect(response.status).toBe(401)
    })
  })

  describe('GET /api/v1/security/logs', () => {
    it('should return security logs for admin', async () => {
      const response = await request(app)
        .get('/api/v1/security/logs')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ page: 1, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('GET /api/v1/security/settings', () => {
    it('should return security settings for admin', async () => {
      const response = await request(app)
        .get('/api/v1/security/settings')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('maxLoginAttempts')
      expect(response.body.data).toHaveProperty('sessionTimeout')
    })
  })

  describe('PUT /api/v1/security/settings', () => {
    it('should update security settings for admin', async () => {
      const response = await request(app)
        .put('/api/v1/security/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          maxLoginAttempts: 10,
          sessionTimeout: 60,
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.maxLoginAttempts).toBe(10)
      expect(response.body.data.sessionTimeout).toBe(60)
    })
  })

  describe('GET /api/v1/security/sessions', () => {
    it('should return user sessions', async () => {
      const response = await request(app)
        .get('/api/v1/security/sessions')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('GET /api/v1/security/alerts', () => {
    it('should return security alerts', async () => {
      const response = await request(app)
        .get('/api/v1/security/alerts')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('Analytics API - GET /api/v1/security/analytics/report', () => {
    it('should return analytics report for developer', async () => {
      if (!developerToken) {
        // Skip if no developer token
        return
      }

      const response = await request(app)
        .get('/api/v1/security/analytics/report')
        .set('Authorization', `Bearer ${developerToken}`)
        .query({ period: '7d' })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('period')
      expect(response.body.data).toHaveProperty('loginAttempts')
      expect(response.body.data).toHaveProperty('eventSummary')
    })

    it('should return 403 for non-developer user', async () => {
      const response = await request(app)
        .get('/api/v1/security/analytics/report')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ period: '7d' })

      expect(response.status).toBe(403)
    })
  })

  describe('Analytics API - GET /api/v1/security/analytics/metrics', () => {
    it('should return security metrics for developer', async () => {
      if (!developerToken) {
        return
      }

      const response = await request(app)
        .get('/api/v1/security/analytics/metrics')
        .set('Authorization', `Bearer ${developerToken}`)
        .query({ period: '7d' })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('Monitoring API - GET /api/v1/security/monitoring/health', () => {
    it('should return system health for developer', async () => {
      if (!developerToken) {
        return
      }

      const response = await request(app)
        .get('/api/v1/security/monitoring/health')
        .set('Authorization', `Bearer ${developerToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('overall')
      expect(response.body.data).toHaveProperty('score')
      expect(response.body.data).toHaveProperty('components')
    })

    it('should return 403 for non-developer user', async () => {
      const response = await request(app)
        .get('/api/v1/security/monitoring/health')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(403)
    })
  })

  describe('Monitoring API - GET /api/v1/security/monitoring/realtime', () => {
    it('should return realtime metrics for developer', async () => {
      if (!developerToken) {
        return
      }

      const response = await request(app)
        .get('/api/v1/security/monitoring/realtime')
        .set('Authorization', `Bearer ${developerToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('timestamp')
      expect(response.body.data).toHaveProperty('activeSessions')
      expect(response.body.data).toHaveProperty('loginsLastMinute')
    })
  })
})

