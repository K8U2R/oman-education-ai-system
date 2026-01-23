/**
 * Test Helpers - مساعدات الاختبار
 *
 * Utility functions للـ E2E Tests
 */

import { Page, expect } from '@playwright/test'

/**
 * انتظار تحميل الصفحة بالكامل
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
}

/**
 * التحقق من RTL Layout
 */
export async function expectRTL(page: Page): Promise<void> {
  const direction = await page.evaluate(() => {
    return window.getComputedStyle(document.documentElement).direction
  })
  expect(direction).toBe('rtl')
}

/**
 * انتظار API Request
 */
export async function waitForAPIRequest(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 30000
): Promise<void> {
  await page.waitForResponse(
    response => {
      const url = response.url()
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern)
      }
      return urlPattern.test(url)
    },
    { timeout }
  )
}

/**
 * تسجيل الدخول
 */
export async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')

  // انتظار التوجيه إلى Dashboard
  await page.waitForURL(/\/dashboard/, { timeout: 10000 })
}

/**
 * تسجيل الخروج
 */
export async function logout(page: Page): Promise<void> {
  // البحث عن زر تسجيل الخروج في القائمة
  const logoutButton = page
    .locator('button:has-text("تسجيل الخروج"), a:has-text("تسجيل الخروج")')
    .first()

  if (await logoutButton.isVisible({ timeout: 2000 })) {
    await logoutButton.click()
  } else {
    // محاولة الوصول مباشرة إلى route logout
    await page.goto('/logout')
  }

  // انتظار التوجيه إلى الصفحة الرئيسية
  await page.waitForURL(/\/$|\/login/, { timeout: 5000 })
}

/**
 * انتظار Toast Message
 */
export async function waitForToast(page: Page, message?: string, timeout = 5000): Promise<void> {
  const toast = page.locator('[role="alert"], .toast, [data-testid="toast"]').first()
  await toast.waitFor({ state: 'visible', timeout })

  if (message) {
    await expect(toast).toContainText(message)
  }
}

/**
 * التحقق من وجود Error Message
 */
export async function expectErrorMessage(page: Page, message?: string): Promise<void> {
  const errorElement = page
    .locator('.error, [role="alert"], .alert-error, [data-testid="error"]')
    .first()

  await expect(errorElement).toBeVisible()

  if (message) {
    await expect(errorElement).toContainText(message)
  }
}

/**
 * انتظار Loading State
 */
export async function waitForLoading(page: Page): Promise<void> {
  // انتظار اختفاء Loading Indicators
  const loadingSelectors = ['[data-testid="loading"]', '.loading', '.spinner', '[aria-busy="true"]']

  for (const selector of loadingSelectors) {
    const element = page.locator(selector).first()
    if (await element.isVisible({ timeout: 1000 })) {
      await element.waitFor({ state: 'hidden', timeout: 10000 })
    }
  }
}

/**
 * انتظار Navigation
 */
export async function waitForNavigation(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 10000
): Promise<void> {
  await page.waitForURL(urlPattern, { timeout })
}

/**
 * Fill Form Field
 */
export async function fillFormField(page: Page, label: string, value: string): Promise<void> {
  const field = page
    .locator(`label:has-text("${label}")`)
    .locator('..')
    .locator('input, textarea, select')
    .first()
  await field.fill(value)
}

/**
 * Click Button by Text
 */
export async function clickButtonByText(page: Page, text: string): Promise<void> {
  await page.click(`button:has-text("${text}"), a:has-text("${text}")`)
}

/**
 * Take Screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  })
}

/**
 * Mock API Response
 */
export async function mockAPIResponse(
  page: Page,
  url: string | RegExp,
  response: unknown,
  status = 200
): Promise<void> {
  await page.route(url, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    })
  })
}

/**
 * Clear All Storage
 */
export async function clearStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
}

/**
 * Set Storage Item
 */
export async function setStorageItem(page: Page, key: string, value: string): Promise<void> {
  await page.evaluate(
    ({ k, v }) => {
      localStorage.setItem(k, v)
    },
    { k: key, v: value }
  )
}

/**
 * Get Storage Item
 */
export async function getStorageItem(page: Page, key: string): Promise<string | null> {
  return await page.evaluate(k => localStorage.getItem(k), key)
}
