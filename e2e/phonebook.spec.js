const { test, expect } = require('@playwright/test')

test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const locator = await page.getByText('Phone book')
  await expect(locator).toBeVisible()
  // await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2023')).toBeVisible()
})