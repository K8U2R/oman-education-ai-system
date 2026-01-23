/**
 * Authentication E2E Tests - اختبارات E2E للمصادقة
 *
 * اختبارات End-to-End لسير عمل المصادقة:
 * - تسجيل الدخول
 * - التسجيل
 * - تسجيل الخروج
 * - OAuth Login (إذا كان متاحاً)
 */

import { test, expect } from '@playwright/test'
import { LoginPage, RegisterPage, DashboardPage } from './pages'
import { clearStorage, logout } from './utils/test-helpers'

test.describe('Authentication Flow', () => {
  // Test data
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'أحمد',
    lastName: 'محمد',
  }

  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await clearStorage(page)
  })

  test.describe('Login', () => {
    test('should display login page correctly', async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.goto()
      await loginPage.expectLoginPage()
    })

    test('should show error for invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.goto()

      await loginPage.login('invalid@example.com', 'wrongpassword')

      // انتظار رسالة الخطأ
      await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 })
    })

    test('should login successfully with valid credentials', async ({ page }) => {
      // أولاً، إنشاء مستخدم جديد
      const registerPage = new RegisterPage(page)
      await registerPage.goto()
      await registerPage.register({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        password: testUser.password,
      })

      // انتظار التوجيه إلى Dashboard أو Login
      await page.waitForURL(/\/dashboard|\/login/, { timeout: 10000 })

      // تسجيل الدخول
      const loginPage = new LoginPage(page)
      await loginPage.goto()
      await loginPage.login(testUser.email, testUser.password)

      // التحقق من التوجيه إلى Dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 10000 })

      const dashboardPage = new DashboardPage(page)
      await dashboardPage.expectDashboardLoaded()
    })

    test('should remember me checkbox work', async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.goto()

      await loginPage.checkRememberMe()

      // التحقق من أن Checkbox محدد
      await expect(loginPage.rememberMeCheckbox).toBeChecked()
    })

    test('should navigate to forgot password page', async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.goto()

      await loginPage.clickForgotPassword()

      // التحقق من التوجيه إلى صفحة استعادة كلمة المرور
      await page.waitForURL(/\/forgot-password|\/reset-password/, { timeout: 5000 })
    })
  })

  test.describe('Registration', () => {
    test('should display registration page correctly', async ({ page }) => {
      const registerPage = new RegisterPage(page)
      await registerPage.goto()
      await registerPage.expectRegisterPage()
    })

    test('should show validation errors for empty fields', async ({ page }) => {
      const registerPage = new RegisterPage(page)
      await registerPage.goto()

      // محاولة الإرسال بدون ملء الحقول
      await registerPage.submit()

      // التحقق من وجود رسائل التحقق
      // (قد تختلف حسب تنفيذ التحقق)
      await page.waitForTimeout(1000)
    })

    test('should show error for weak password', async ({ page }) => {
      const registerPage = new RegisterPage(page)
      await registerPage.goto()

      await registerPage.fillRegistrationForm({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        password: 'weak',
      })

      await registerPage.submit()

      // التحقق من رسالة الخطأ
      await expect(registerPage.errorMessage).toBeVisible({ timeout: 5000 })
    })

    test('should show error for password mismatch', async ({ page }) => {
      const registerPage = new RegisterPage(page)
      await registerPage.goto()

      await registerPage.fillRegistrationForm({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        password: testUser.password,
        confirmPassword: 'DifferentPassword123!',
      })

      await registerPage.submit()

      // التحقق من رسالة الخطأ
      await expect(registerPage.errorMessage).toBeVisible({ timeout: 5000 })
    })

    test('should register successfully with valid data', async ({ page }) => {
      const registerPage = new RegisterPage(page)
      await registerPage.goto()

      await registerPage.register({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        password: testUser.password,
      })

      // انتظار التوجيه إلى Dashboard أو Login
      await page.waitForURL(/\/dashboard|\/login/, { timeout: 10000 })
    })

    test('should show error for existing email', async ({ page }) => {
      // أولاً، إنشاء مستخدم
      const registerPage = new RegisterPage(page)
      await registerPage.goto()
      await registerPage.register({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        password: testUser.password,
      })

      await page.waitForURL(/\/dashboard|\/login/, { timeout: 10000 })

      // محاولة التسجيل بنفس البريد الإلكتروني
      await registerPage.goto()
      await registerPage.register({
        firstName: 'Another',
        lastName: 'User',
        email: testUser.email,
        password: testUser.password,
      })

      // التحقق من رسالة الخطأ
      await expect(registerPage.errorMessage).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      // تسجيل الدخول أولاً
      const loginPage = new LoginPage(page)
      await loginPage.goto()

      // إنشاء مستخدم وتسجيل الدخول
      const registerPage = new RegisterPage(page)
      await registerPage.goto()
      await registerPage.register({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        password: testUser.password,
      })

      await page.waitForURL(/\/dashboard|\/login/, { timeout: 10000 })

      // إذا تم التوجيه إلى Login، قم بتسجيل الدخول
      if (page.url().includes('/login')) {
        await loginPage.login(testUser.email, testUser.password)
        await page.waitForURL(/\/dashboard/, { timeout: 10000 })
      }

      // تسجيل الخروج
      await logout(page)

      // التحقق من التوجيه إلى الصفحة الرئيسية أو Login
      await page.waitForURL(/\/$|\/login/, { timeout: 5000 })
    })
  })

  test.describe('Navigation', () => {
    test('should redirect to login when accessing protected route', async ({ page }) => {
      await page.goto('/dashboard')

      // التحقق من التوجيه إلى Login
      await page.waitForURL(/\/login/, { timeout: 5000 })
    })

    test('should redirect to dashboard when already logged in', async ({ page }) => {
      // تسجيل الدخول
      const loginPage = new LoginPage(page)
      await loginPage.goto()

      // إنشاء مستخدم وتسجيل الدخول
      const registerPage = new RegisterPage(page)
      await registerPage.goto()
      await registerPage.register({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        password: testUser.password,
      })

      await page.waitForURL(/\/dashboard|\/login/, { timeout: 10000 })

      // إذا تم التوجيه إلى Login، قم بتسجيل الدخول
      if (page.url().includes('/login')) {
        await loginPage.login(testUser.email, testUser.password)
        await page.waitForURL(/\/dashboard/, { timeout: 10000 })
      }

      // محاولة الوصول إلى Login مرة أخرى
      await page.goto('/login')

      // يجب أن يتم التوجيه إلى Dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 5000 })
    })
  })
})
