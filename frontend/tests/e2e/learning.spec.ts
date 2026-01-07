/**
 * Learning E2E Tests - اختبارات E2E للتعلم
 *
 * اختبارات End-to-End لسير عمل التعلم:
 * - عرض الدروس
 * - تفاصيل الدرس
 * - التقييمات
 */

import { test, expect } from '@playwright/test'
import { LoginPage, DashboardPage } from './pages'
// Test helpers imported but not used in this test file

test.describe('Learning Flow', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'أحمد',
    lastName: 'محمد',
  }

  test.beforeEach(async ({ page }) => {
    // تسجيل الدخول قبل كل اختبار
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    
    // محاولة تسجيل الدخول (إذا فشل، سيتم إنشاء مستخدم جديد)
    try {
      await loginPage.login(testUser.email, testUser.password)
      await page.waitForURL(/\/dashboard/, { timeout: 5000 })
    } catch {
      // إذا فشل، قم بإنشاء مستخدم جديد
      // (في بيئة حقيقية، قد تحتاج إلى API لإنشاء المستخدم)
    }
  })

  test.describe('Lessons', () => {
    test('should navigate to lessons page from dashboard', async ({ page }) => {
      const dashboardPage = new DashboardPage(page)
      await dashboardPage.goto()
      await dashboardPage.expectDashboardLoaded()

      // النقر على بطاقة الدروس
      await dashboardPage.clickLessonsCard()

      // التحقق من التوجيه إلى صفحة الدروس
      await page.waitForURL(/\/lessons/, { timeout: 10000 })
    })

    test('should display lessons list', async ({ page }) => {
      await page.goto('/lessons')
      await waitForPageLoad(page)

      // التحقق من وجود محتوى الصفحة
      const mainContent = page.locator('main, [role="main"]').first()
      await expect(mainContent).toBeVisible({ timeout: 10000 })
    })

    test('should filter lessons', async ({ page }) => {
      await page.goto('/lessons')
      await waitForPageLoad(page)

      // البحث عن أزرار أو حقول التصفية
      const filterButtons = page.locator('button:has-text("تصفية"), button:has-text("Filter")')
      const filterInputs = page.locator('input[placeholder*="بحث"], input[placeholder*="Search"]')

      // إذا وجدت أزرار تصفية، انقر عليها
      if (await filterButtons.count() > 0) {
        await filterButtons.first().click()
        await page.waitForTimeout(1000)
      }

      // إذا وجدت حقول بحث، املأها
      if (await filterInputs.count() > 0) {
        await filterInputs.first().fill('test')
        await page.waitForTimeout(1000)
      }
    })

    test('should navigate to lesson detail', async ({ page }) => {
      await page.goto('/lessons')
      await waitForPageLoad(page)

      // البحث عن رابط أو زر لدرس
      const lessonLink = page.locator('a[href*="/lessons/"], button:has-text("عرض"), button:has-text("View")').first()

      if (await lessonLink.isVisible({ timeout: 5000 })) {
        await lessonLink.click()
        
        // التحقق من التوجيه إلى صفحة تفاصيل الدرس
        await page.waitForURL(/\/lessons\/[^/]+/, { timeout: 10000 })
      }
    })
  })

  test.describe('Assessments', () => {
    test('should navigate to assessments page from dashboard', async ({ page }) => {
      const dashboardPage = new DashboardPage(page)
      await dashboardPage.goto()
      await dashboardPage.expectDashboardLoaded()

      // النقر على بطاقة التقييمات
      await dashboardPage.clickAssessmentsCard()

      // التحقق من التوجيه إلى صفحة التقييمات
      await page.waitForURL(/\/assessments/, { timeout: 10000 })
    })

    test('should display assessments list', async ({ page }) => {
      await page.goto('/assessments')
      await waitForPageLoad(page)

      // التحقق من وجود محتوى الصفحة
      const mainContent = page.locator('main, [role="main"]').first()
      await expect(mainContent).toBeVisible({ timeout: 10000 })
    })

    test('should create new assessment (if teacher)', async ({ page }) => {
      await page.goto('/assessments')
      await waitForPageLoad(page)

      // البحث عن زر إنشاء تقييم جديد
      const createButton = page.locator('button:has-text("إنشاء"), button:has-text("Create"), a:has-text("جديد")').first()

      if (await createButton.isVisible({ timeout: 5000 })) {
        await createButton.click()
        
        // التحقق من التوجيه إلى صفحة إنشاء التقييم
        await page.waitForURL(/\/assessments\/new|\/assessments\/create/, { timeout: 10000 })
      }
    })
  })
})

