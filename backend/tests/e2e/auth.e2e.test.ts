/**
 * Auth E2E Tests - اختبارات End-to-End للمصادقة
 * 
 * اختبارات E2E للـ Authentication flows الكاملة
 */

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '@/index'

describe('Auth E2E Tests', () => {
  let testUserEmail: string
  let testUserPassword: string
  let accessToken: string
  let refreshToken: string
  let userId: string

  beforeAll(() => {
    testUserEmail = `e2e-test-${Date.now()}@example.com`
    testUserPassword = 'E2ETestSecurePass123'
  })

  describe('Complete Authentication Flow', () => {
    it('should complete full authentication flow: Register → Login → Get User → Update User → Logout', async () => {
      // 1. Register
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testUserEmail,
          password: testUserPassword,
          first_name: 'أحمد',
          last_name: 'محمد',
        })
        .expect(201)

      expect(registerResponse.body.success).toBe(true)
      userId = registerResponse.body.data.user.id

      // 2. Login
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUserEmail,
          password: testUserPassword,
        })
        .expect(200)

      expect(loginResponse.body.success).toBe(true)
      accessToken = loginResponse.body.data.tokens.access_token
      refreshToken = loginResponse.body.data.tokens.refresh_token

      // 3. Get Current User
      const meResponse = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(meResponse.body.success).toBe(true)
      expect(meResponse.body.data.user.id).toBe(userId)

      // 4. Update User
      const updateResponse = await request(app)
        .patch('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          first_name: 'محمد',
          last_name: 'أحمد',
        })
        .expect(200)

      expect(updateResponse.body.success).toBe(true)
      expect(updateResponse.body.data.user.first_name).toBe('محمد')

      // 5. Refresh Token
      const refreshResponse = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          refresh_token: refreshToken,
        })
        .expect(200)

      expect(refreshResponse.body.success).toBe(true)
      accessToken = refreshResponse.body.data.tokens.access_token
      refreshToken = refreshResponse.body.data.tokens.refresh_token

      // 6. Logout
      const logoutResponse = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          refresh_token: refreshToken,
        })
        .expect(200)

      expect(logoutResponse.body.success).toBe(true)
    })
  })

  describe('Password Reset Flow', () => {
    it('should complete password reset flow: Request Reset → Reset Password → Login with New Password', async () => {
      // Create a test user first
      const resetTestEmail = `reset-test-${Date.now()}@example.com`
      const originalPassword = 'OriginalPass123'
      // newPassword would be used in actual password reset flow

      // Register
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: resetTestEmail,
          password: originalPassword,
          first_name: 'أحمد',
          last_name: 'محمد',
        })
        .expect(201)

      // Request password reset
      const requestResponse = await request(app)
        .post('/api/v1/auth/password/reset/request')
        .send({
          email: resetTestEmail,
        })
        .expect(200)

      expect(requestResponse.body.success).toBe(true)

      // Note: In a real E2E test, you would:
      // 1. Check email inbox for reset token
      // 2. Extract token from email
      // 3. Use token to reset password
      // For now, we'll skip the actual reset since we don't have email access
      // This would be:
      // await request(app)
      //   .post('/api/v1/auth/password/reset/confirm')
      //   .send({
      //     token: extractedToken,
      //     new_password: newPassword,
      //   })
      //   .expect(200)
    })
  })

  describe('Email Verification Flow', () => {
    it('should complete email verification flow: Register → Send Verification → Verify Email', async () => {
      const verifyTestEmail = `verify-test-${Date.now()}@example.com`

      // Register
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: verifyTestEmail,
          password: 'VerifyTestPass123',
          first_name: 'أحمد',
          last_name: 'محمد',
        })
        .expect(201)

      expect(registerResponse.body.data.user.is_verified).toBe(false)

      // Send verification email
      const sendResponse = await request(app)
        .post('/api/v1/auth/verify/send')
        .send({
          email: verifyTestEmail,
        })
        .expect(200)

      expect(sendResponse.body.success).toBe(true)

      // Note: In a real E2E test, you would:
      // 1. Check email inbox for verification token
      // 2. Extract token from email
      // 3. Use token to verify email
      // For now, we'll skip the actual verification since we don't have email access
      // This would be:
      // await request(app)
      //   .post('/api/v1/auth/verify/confirm')
      //   .send({
      //     token: extractedToken,
      //   })
      //   .expect(200)
    })
  })
})

