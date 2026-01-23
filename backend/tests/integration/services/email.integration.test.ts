/**
 * Email Service Integration Tests - اختبارات التكامل لخدمة البريد الإلكتروني
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { EmailService } from '@/application/services/email/EmailService'
import { IEmailProvider } from '@/domain/interfaces/email/IEmailProvider'

describe('EmailService Integration', () => {
  let emailService: EmailService
  let mockEmailProvider: IEmailProvider
  let sentEmails: Array<{ to: string; subject: string; html: string }> = []

  beforeAll(async () => {
    // Initialize Mock Email Provider
    mockEmailProvider = {
      sendEmail: async (email) => {
        sentEmails.push({
          to: email.to,
          subject: email.subject || '',
          html: email.html || '',
        })
        return { success: true, messageId: `msg-${Date.now()}` }
      },
      validate: async () => true,
    }

    emailService = new EmailService(mockEmailProvider)
  })

  beforeEach(() => {
    // Clear sent emails before each test
    sentEmails = []
  })

  afterAll(async () => {
    // Cleanup if needed
  })

  describe('sendVerificationEmail', () => {
    it('should send verification email successfully', async () => {
      // Arrange
      const email = 'test@example.com'
      const token = 'verification-token-123'

      // Act
      await emailService.sendVerificationEmail(email, token)

      // Assert
      expect(sentEmails.length).toBe(1)
      expect(sentEmails[0].to).toBe(email)
      expect(sentEmails[0].subject).toContain('تحقق')
      expect(sentEmails[0].html).toContain(token)
    })

    it('should include verification link in email', async () => {
      // Arrange
      const email = 'test2@example.com'
      const token = 'verification-token-456'

      // Act
      await emailService.sendVerificationEmail(email, token)

      // Assert
      expect(sentEmails[0].html).toContain('verify')
      expect(sentEmails[0].html).toContain(token)
    })
  })

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email successfully', async () => {
      // Arrange
      const email = 'reset@example.com'
      const token = 'reset-token-123'

      // Act
      await emailService.sendPasswordResetEmail(email, token)

      // Assert
      expect(sentEmails.length).toBe(1)
      expect(sentEmails[0].to).toBe(email)
      expect(sentEmails[0].subject).toContain('إعادة تعيين')
      expect(sentEmails[0].html).toContain(token)
    })

    it('should include reset link in email', async () => {
      // Arrange
      const email = 'reset2@example.com'
      const token = 'reset-token-456'

      // Act
      await emailService.sendPasswordResetEmail(email, token)

      // Assert
      expect(sentEmails[0].html).toContain('reset')
      expect(sentEmails[0].html).toContain(token)
    })

    it('should include user name if provided', async () => {
      // Arrange
      const email = 'reset3@example.com'
      const token = 'reset-token-789'
      const userName = 'أحمد محمد'

      // Act
      await emailService.sendPasswordResetEmail(email, token, userName)

      // Assert
      expect(sentEmails[0].html).toContain(userName)
    })
  })

  describe('validate', () => {
    it('should validate email provider configuration', async () => {
      // Act
      const isValid = await emailService.validate()

      // Assert
      expect(typeof isValid).toBe('boolean')
    })
  })
})
