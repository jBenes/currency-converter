import { test, expect } from '@playwright/test'
import { RATES_FIXTURE } from './fixture'

function mockRatesSuccess(page: import('@playwright/test').Page) {
  return page.route('**/api/rates', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/plain; charset=utf-8',
      body: RATES_FIXTURE,
    }),
  )
}

test.describe('with mocked rates', () => {
  test.beforeEach(async ({ page }) => {
    await mockRatesSuccess(page)
  })

  test('rates list renders with multiple currencies', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('listitem', { name: /Euro/ })).toBeVisible()
    await expect(page.getByRole('listitem', { name: /US Dollar/ })).toBeVisible()
    await expect(page.getByRole('listitem', { name: /British Pound/ })).toBeVisible()
    await expect(page.getByRole('listitem', { name: /Japanese Yen/ })).toBeVisible()
  })

  test('CZK conversion works including per-100 currency (JPY)', async ({
    page,
  }) => {
    await page.goto('/')

    const czkInput = page.getByLabel(/from/i)
    await czkInput.fill('1000')

    // Default selection is EUR: 1000 * 1 / 24.875 = 40.20
    await expect(page.getByText('40.20')).toBeVisible()

    // Click JPY row — per-100 currency
    await page.getByRole('listitem', { name: /Japanese Yen/ }).click()

    // 1000 CZK * 100 / 15.987 = 6,255.08
    await expect(page.getByText('6,255.08')).toBeVisible()
  })

  test('selecting a currency updates the converter region', async ({
    page,
  }) => {
    await page.goto('/')

    const czkInput = page.getByLabel(/from/i)
    await czkInput.fill('100')

    await page.getByRole('listitem', { name: /British Pound/ }).click()

    // 100 * 1 / 28.000 = 3.57
    await expect(page.getByText('3.57')).toBeVisible()
  })

  test('filter narrows the currency list', async ({ page }) => {
    await page.goto('/')

    const filter = page.getByPlaceholder(/search currency/i)
    await filter.fill('eur')

    await expect(page.getByRole('listitem', { name: /Euro/ })).toBeVisible()
    await expect(
      page.getByRole('listitem', { name: /US Dollar/ }),
    ).not.toBeVisible()
    await expect(
      page.getByRole('listitem', { name: /Japanese Yen/ }),
    ).not.toBeVisible()
  })

  test('mobile viewport — no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await expect(page.getByRole('listitem', { name: /Euro/ })).toBeVisible()

    const body = page.locator('body')
    const box = await body.boundingBox()
    expect(box).toBeTruthy()
    expect(box!.width).toBeLessThanOrEqual(375)
  })
})

test('error state shows alert', async ({ page }) => {
  await page.route('**/api/rates', (route) =>
    route.fulfill({ status: 500, body: 'Internal Server Error' }),
  )

  await page.goto('/')

  // React Query retries 3 times with exponential backoff before surfacing the error
  await expect(page.getByRole('alert')).toBeVisible({ timeout: 15000 })
})
