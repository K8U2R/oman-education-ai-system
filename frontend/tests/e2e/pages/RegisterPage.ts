/**
 * Register Page Object Model - نموذج صفحة التسجيل
 *
 * Page Object Model pattern لصفحة التسجيل
 */

import { Page, Locator, expect } from '@playwright/test'

export class RegisterPage {
  readonly page: Page
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly confirmPasswordInput: Locator
  readonly usernameInput: Locator
  readonly acceptTermsCheckbox: Locator
  readonly acceptPrivacyCheckbox: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator
  readonly successMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.firstNameInput = page
      .locator('input[placeholder*="أحمد"], input[label*="الاسم الأول"]')
      .first()
    this.lastNameInput = page
      .locator('input[placeholder*="محمد"], input[label*="اسم العائلة"]')
      .first()
    this.emailInput = page.locator('input[type="email"]')
    this.passwordInput = page.locator('input[type="password"]').first()
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1)
    this.usernameInput = page
      .locator('input[placeholder*="username"], input[label*="اسم المستخدم"]')
      .first()
    this.acceptTermsCheckbox = page.locator('input[type="checkbox"]').first()
    this.acceptPrivacyCheckbox = page.locator('input[type="checkbox"]').nth(1)
    this.submitButton = page.locator(
      'button[type="submit"]:has-text("تسجيل"), button:has-text("إنشاء حساب")'
    )
    this.errorMessage = page.locator('.error, [role="alert"]').first()
    this.successMessage = page.locator('.success, [data-testid="success"]').first()
  }

  /**
   * الانتقال إلى صفحة التسجيل
   */
  async goto(): Promise<void> {
    await this.page.goto('/register')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * ملء نموذج التسجيل
   */
  async fillRegistrationForm(data: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword?: string
    username?: string
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName)
    await this.lastNameInput.fill(data.lastName)
    await this.emailInput.fill(data.email)
    await this.passwordInput.fill(data.password)

    if (data.confirmPassword) {
      await this.confirmPasswordInput.fill(data.confirmPassword)
    } else {
      await this.confirmPasswordInput.fill(data.password)
    }

    if (data.username) {
      await this.usernameInput.fill(data.username)
    }
  }

  /**
   * قبول الشروط والخصوصية
   */
  async acceptTermsAndPrivacy(): Promise<void> {
    await this.acceptTermsCheckbox.check()
    await this.acceptPrivacyCheckbox.check()
  }

  /**
   * إرسال نموذج التسجيل
   */
  async submit(): Promise<void> {
    await this.submitButton.click()
  }

  /**
   * التسجيل الكامل
   */
  async register(data: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword?: string
    username?: string
  }): Promise<void> {
    await this.fillRegistrationForm(data)
    await this.acceptTermsAndPrivacy()
    await this.submit()
  }

  /**
   * التحقق من وجود صفحة التسجيل
   */
  async expectRegisterPage(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible()
    await expect(this.emailInput).toBeVisible()
    await expect(this.passwordInput).toBeVisible()
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
}
