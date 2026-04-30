import { test, expect } from '@playwright/test';

test('admin appointments smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('ClinicSay Admin')).toBeVisible();
});
