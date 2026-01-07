/**
 * Dashboard Page Object Model - نموذج صفحة لوحة التحكم
 *
 * Page Object Model pattern لصفحة Dashboard
 */

import { Page, Locator, expect } from '@playwright/test'

export class DashboardPage {
  readonly page: Page
  readonly welcomeMessage: Locator
  readonly quickActions: Locator
  readonly lessonsCard: Locator
  readonly assessmentsCard: Locator
  readonly projectsCard: Locator
  readonly storageCard: Locator
  readonly navigationMenu: Locator

  constructor(page: Page) {
    this.page = page
    this.welcomeMessage = page.locator('h1, h2').filter({ hasText: /مرحباً|أهلاً|Welcome/i })
    this.quickActions = page.locator('[data-testid="quick-actions"], .quick-actions')
    this.lessonsCard = page.locator('a, button').filter({ hasText: /الدروس|Lessons/i })
    this.assessmentsCard = page.locator('a, button').filter({ hasText: /التقييمات|Assessments/i })
    this.projectsCard = page.locator('a, button').filter({ hasText: /المشاريع|Projects/i })
    this.storageCard = page.locator('a, button').filter({ hasText: /التخزين|Storage/i })
    this.navigationMenu = page.locator('nav, [role="navigation"]')
  }

  /**
   * الانتقال إلى صفحة Dashboard
   */
  async goto(): Promise<void> {
    await this.page.goto('/dashboard')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * التحقق من تحميل Dashboard
   */
  async expectDashboardLoaded(): Promise<void> {
    await expect(this.welcomeMessage.or(this.page.locator('main'))).toBeVisible({ timeout: 10000 })
  }

  /**
   * النقر على بطاقة الدروس
   */
  async clickLessonsCard(): Promise<void> {
    await this.lessonsCard.first().click()
    await this.page.waitForURL(/\/lessons/, { timeout: 10000 })
  }

  /**
   * النقر على بطاقة التقييمات
   */
  async clickAssessmentsCard(): Promise<void> {
    await this.assessmentsCard.first().click()
    await this.page.waitForURL(/\/assessments/, { timeout: 10000 })
  }

  /**
   * النقر على بطاقة المشاريع
   */
  async clickProjectsCard(): Promise<void> {
    await this.projectsCard.first().click()
    await this.page.waitForURL(/\/projects/, { timeout: 10000 })
  }

  /**
   * النقر على بطاقة التخزين
   */
  async clickStorageCard(): Promise<void> {
    await this.storageCard.first().click()
    await this.page.waitForURL(/\/storage/, { timeout: 10000 })
  }
}

