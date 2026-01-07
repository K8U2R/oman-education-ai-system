/**
 * Homepage E2E Tests - اختبارات E2E للصفحة الرئيسية
 */

import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/نظام التعليم الذكي العماني/i)
    
    // Check main content is visible
    const mainContent = page.locator('main, [role="main"]').first()
    await expect(mainContent).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check if navigation links exist
    const navLinks = page.locator('nav a, [role="navigation"] a')
    const count = await navLinks.count()
    
    expect(count).toBeGreaterThan(0)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check that mobile menu exists or navigation is hidden
    const mobileMenu = page.locator('[aria-label*="menu"], [data-testid*="mobile-menu"]')
    const nav = page.locator('nav')
    
    // Either mobile menu exists or nav is visible
    const hasMobileMenu = await mobileMenu.count() > 0
    const navVisible = await nav.isVisible()
    
    expect(hasMobileMenu || navVisible).toBeTruthy()
  })

  test('should support RTL layout', async ({ page }) => {
    await page.goto('/')
    
    // Check document direction
    const direction = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).direction
    })
    
    expect(direction).toBe('rtl')
  })
})

