/**
 * Login Page Object Model - نموذج صفحة تسجيل الدخول
 *
 * Page Object Model pattern لصفحة تسجيل الدخول
 */

import { Page, Locator, expect } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly rememberMeCheckbox: Locator
  readonly forgotPasswordLink: Locator
  readonly errorMessage: Locator
  readonly successMessage: Locator
  readonly oauthButtons: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('input[type="email"]')
    this.passwordInput = page.locator('input[type="password"]')
    this.submitButton = page.locator('button[type="submit"]:has-text("تسجيل الدخول")')
    this.rememberMeCheckbox = page.locator('input[type="checkbox"]').first()
    this.forgotPasswordLink = page.locator('a:has-text("نسيت كلمة المرور")')
    this.errorMessage = page.locator('.error, [role="alert"]').first()
    this.successMessage = page.locator('.success, [data-testid="success"]').first()
    this.oauthButtons = page.locator('button:has-text("Google"), button:has-text("Microsoft")')
  }

  /**
   * الانتقال إلى صفحة تسجيل الدخول
   */
  async goto(): Promise<void> {
    await this.page.goto('/login')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * تسجيل الدخول
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  /**
   * التحقق من وجود صفحة تسجيل الدخول
   */
  async expectLoginPage(): Promise<void> {
    await expect(this.emailInput).toBeVisible()
    await expect(this.passwordInput).toBeVisible()
    await expect(this.submitButton).toBeVisible()
  }

  /**
   * التحقق من رسالة الخطأ
   */
  async expectErrorMessage(message?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible()
    if (message) {
      await expect(this.errorMessage).toContainText(message)
    }
  }

  /**
   * التحقق من رسالة النجاح
   */
  async expectSuccessMessage(message?: string): Promise<void> {
    await expect(this.successMessage).toBeVisible()
    if (message) {
      await expect(this.successMessage).toContainText(message)
    }
  }

  /**
   * تفعيل "تذكرني"
   */
  async checkRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.check()
  }

  /**
   * النقر على رابط "نسيت كلمة المرور"
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click()
  }
}
