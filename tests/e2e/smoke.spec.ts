import { test, expect } from '@playwright/test'

/**
 * Live smoke test — runs against the deployed URL.
 * Not part of the PR gate; run manually or on a schedule.
 *
 * Usage: SMOKE_URL=https://your-app.vercel.app pnpm test:e2e:smoke
 */

const baseURL = process.env.SMOKE_URL

test.skip(!baseURL, 'SMOKE_URL not set — skipping live smoke test')

test('production app loads real rates', async ({ page }) => {
  await page.goto(baseURL!)

  // Wait for at least one currency row to appear (real data)
  await expect(
    page.getByRole('button', { name: /Euro/ }),
  ).toBeVisible({ timeout: 10000 })

  // Verify the rates list has multiple entries
  const buttons = page.getByRole('listbox').getByRole('button')
  await expect(buttons.first()).toBeVisible()
  expect(await buttons.count()).toBeGreaterThan(5)
})
