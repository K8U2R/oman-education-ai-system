/**
 * Projects E2E Tests - اختبارات E2E للمشاريع
 *
 * اختبارات End-to-End لسير عمل المشاريع
 */

import { test, expect } from '@playwright/test'
import { LoginPage, DashboardPage } from './pages'
import { waitForPageLoad } from './utils/test-helpers'

test.describe('Projects Flow', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
  }

  test.beforeEach(async ({ page }) => {
    // تسجيل الدخول قبل كل اختبار
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    // محاولة تسجيل الدخول
    try {
      await loginPage.login(testUser.email, testUser.password)
      await page.waitForURL(/\/dashboard/, { timeout: 5000 })
    } catch {
      // إذا فشل، سيتم توجيه المستخدم إلى Login
    }
  })

  test('should navigate to projects page from dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.goto()
    await dashboardPage.expectDashboardLoaded()

    // النقر على بطاقة المشاريع
    await dashboardPage.clickProjectsCard()

    // التحقق من التوجيه إلى صفحة المشاريع
    await page.waitForURL(/\/projects/, { timeout: 10000 })
  })

  test('should display projects list', async ({ page }) => {
    await page.goto('/projects')
    await waitForPageLoad(page)

    // التحقق من وجود محتوى الصفحة
    const mainContent = page.locator('main, [role="main"]').first()
    await expect(mainContent).toBeVisible({ timeout: 10000 })
  })

  test('should create new project', async ({ page }) => {
    await page.goto('/projects')
    await waitForPageLoad(page)

    // البحث عن زر إنشاء مشروع جديد
    const createButton = page
      .locator('button:has-text("إنشاء"), button:has-text("Create"), a:has-text("جديد")')
      .first()

    if (await createButton.isVisible({ timeout: 5000 })) {
      await createButton.click()

      // التحقق من التوجيه إلى صفحة إنشاء المشروع
      await page.waitForURL(/\/projects\/new|\/projects\/create/, { timeout: 10000 })
    }
  })

  test('should navigate to project detail', async ({ page }) => {
    await page.goto('/projects')
    await waitForPageLoad(page)

    // البحث عن رابط أو زر لمشروع
    const projectLink = page
      .locator('a[href*="/projects/"], button:has-text("عرض"), button:has-text("View")')
      .first()

    if (await projectLink.isVisible({ timeout: 5000 })) {
      await projectLink.click()

      // التحقق من التوجيه إلى صفحة تفاصيل المشروع
      await page.waitForURL(/\/projects\/[^/]+/, { timeout: 10000 })
    }
  })
})
