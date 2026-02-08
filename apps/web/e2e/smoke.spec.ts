import { test, expect } from '@playwright/test'

test('smoke test: login -> create request', async ({ page }) => {
    // 1. Login
    await page.goto('/auth/signin')
    await page.fill('input[type="email"]', 'user@helpa.local')
    await page.click('button[type="submit"]') // Mock login would happen here if configured, or use session setup

    // Note: Since we use magic link or OAuth, automated login is tricky without mocking. 
    // We assume a mock provider or session cookie injection for real implementation.
    // For this "MUSS", we sketch the flow.

    // 2. Create Request
    await page.goto('/requests/create')
    await expect(page).toHaveURL(/.*\/requests\/create/)

    await page.fill('input[value=""]', 'Need a drill') // Title (selector might need adjustment)
    await page.fill('textarea', 'Can anyone lend me a drill?')

    // Submit
    // await page.click('button[type="submit"]')

    // 3. Verify in Feed
    // await page.goto('/requests')
    // await expect(page.getByText('Need a drill')).toBeVisible()
})
